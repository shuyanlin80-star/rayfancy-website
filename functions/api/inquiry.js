const REQUIRED_FIELDS = ["full_name", "email", "message"];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

function clean(value, maxLength = 2000) {
  return String(value || "").trim().slice(0, maxLength);
}

function escapeHtml(value) {
  return clean(value, 5000)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

async function parsePayload(request) {
  const contentType = request.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return await request.json();
  }

  const formData = await request.formData();
  return Object.fromEntries(formData.entries());
}

async function verifyTurnstile(token, request, env) {
  if (!env.TURNSTILE_SECRET_KEY) {
    return { ok: false, error: "Turnstile secret is not configured." };
  }

  const body = new FormData();
  body.append("secret", env.TURNSTILE_SECRET_KEY);
  body.append("response", token);

  const remoteIp = request.headers.get("CF-Connecting-IP");
  if (remoteIp) {
    body.append("remoteip", remoteIp);
  }

  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body,
  });
  const result = await response.json();

  if (!result.success) {
    return { ok: false, error: "Security check failed. Please refresh the page and try again." };
  }

  return { ok: true };
}

async function saveInquiry(inquiry, env) {
  if (!env.DB) {
    throw new Error("D1 database binding DB is not configured.");
  }

  await env.DB.prepare(
    `INSERT INTO inquiries (
      id,
      full_name,
      company,
      email,
      inquiry_type,
      message,
      country,
      quantity,
      product_interest,
      source_page,
      created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  )
    .bind(
      inquiry.id,
      inquiry.full_name,
      inquiry.company,
      inquiry.email,
      inquiry.inquiry_type,
      inquiry.message,
      inquiry.country,
      inquiry.quantity,
      inquiry.product_interest,
      inquiry.source_page,
      inquiry.created_at
    )
    .run();
}

async function sendInquiryEmail(inquiry, env) {
  if (!env.RESEND_API_KEY) {
    return { sent: false, reason: "RESEND_API_KEY is not configured." };
  }

  const to = env.INQUIRY_TO_EMAIL || "rayfancycn@gmail.com";
  const from = env.INQUIRY_FROM_EMAIL || "RayFancy Inquiry <onboarding@resend.dev>";
  const subject = `New RayFancy inquiry from ${inquiry.full_name}`;
  const text = [
    "New RayFancy Professional Inquiry",
    "",
    `Customer name: ${inquiry.full_name}`,
    `Email: ${inquiry.email}`,
    `Company: ${inquiry.company || "-"}`,
    `Inquiry type: ${inquiry.inquiry_type || "-"}`,
    `Country / region: ${inquiry.country || "-"}`,
    `Estimated quantity: ${inquiry.quantity || "-"}`,
    `Product interest: ${inquiry.product_interest || "-"}`,
    `Source page: ${inquiry.source_page || "-"}`,
    `Submitted at: ${inquiry.created_at}`,
    "",
    "Message:",
    inquiry.message,
  ].join("\n");

  const html = `
    <h2>New RayFancy Professional Inquiry</h2>
    <p><strong>Customer name:</strong> ${escapeHtml(inquiry.full_name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(inquiry.email)}</p>
    <p><strong>Company:</strong> ${escapeHtml(inquiry.company || "-")}</p>
    <p><strong>Inquiry type:</strong> ${escapeHtml(inquiry.inquiry_type || "-")}</p>
    <p><strong>Country / region:</strong> ${escapeHtml(inquiry.country || "-")}</p>
    <p><strong>Estimated quantity:</strong> ${escapeHtml(inquiry.quantity || "-")}</p>
    <p><strong>Product interest:</strong> ${escapeHtml(inquiry.product_interest || "-")}</p>
    <p><strong>Source page:</strong> ${escapeHtml(inquiry.source_page || "-")}</p>
    <p><strong>Submitted at:</strong> ${escapeHtml(inquiry.created_at)}</p>
    <hr>
    <p><strong>Message:</strong></p>
    <p>${escapeHtml(inquiry.message).replace(/\n/g, "<br>")}</p>
  `;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      authorization: `Bearer ${env.RESEND_API_KEY}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      from,
      to,
      reply_to: inquiry.email,
      subject,
      text,
      html,
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Email service failed: ${detail}`);
  }

  return { sent: true };
}

export async function onRequestGet({ env }) {
  if (!env.TURNSTILE_SITE_KEY) {
    return json({ error: "Turnstile site key is not configured." }, 503);
  }

  return json({ turnstileSiteKey: env.TURNSTILE_SITE_KEY });
}

export async function onRequestPost({ request, env }) {
  let payload;
  try {
    payload = await parsePayload(request);
  } catch (error) {
    return json({ error: "Invalid form data. Please check the form and try again." }, 400);
  }

  const inquiry = {
    id: crypto.randomUUID(),
    full_name: clean(payload.full_name, 200),
    company: clean(payload.company, 200),
    email: clean(payload.email, 320).toLowerCase(),
    inquiry_type: clean(payload.inquiry_type, 120),
    message: clean(payload.message, 5000),
    country: clean(payload.country, 120),
    quantity: clean(payload.quantity, 120),
    product_interest: clean(payload.product_interest, 500),
    source_page: clean(payload.source_page, 500),
    created_at: new Date().toISOString(),
  };

  for (const field of REQUIRED_FIELDS) {
    if (!inquiry[field]) {
      return json({ error: "Please fill in your name, email, and message." }, 400);
    }
  }

  if (!EMAIL_RE.test(inquiry.email)) {
    return json({ error: "Please enter a valid email address." }, 400);
  }

  const turnstileToken = clean(payload["cf-turnstile-response"], 4000);
  if (!turnstileToken) {
    return json({ error: "Please complete the security check before submitting." }, 400);
  }

  const turnstile = await verifyTurnstile(turnstileToken, request, env);
  if (!turnstile.ok) {
    return json({ error: turnstile.error }, 400);
  }

  try {
    await saveInquiry(inquiry, env);
  } catch (error) {
    console.error(error);
    return json({ error: "We could not submit your inquiry right now. Please email rayfancycn@gmail.com directly." }, 502);
  }

  let emailSent = false;
  try {
    const emailResult = await sendInquiryEmail(inquiry, env);
    emailSent = Boolean(emailResult.sent);
    if (!emailSent) {
      console.warn(emailResult.reason);
    }
  } catch (error) {
    console.error(error);
  }

  return json({ ok: true, id: inquiry.id, emailSent });
}

export async function onRequestOptions() {
  return new Response(null, { status: 204 });
}
