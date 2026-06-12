# RayFancy Contact Form Cloudflare Setup

This site now submits the Contact / Professional Inquiry form to:

```text
POST /api/inquiry
```

The backend lives in:

```text
functions/api/inquiry.js
```

## 1. Create Cloudflare D1 Database

Create a D1 database in Cloudflare, then bind it to the Pages project with this binding name:

```text
DB
```

Run this SQL in the D1 console:

```sql
CREATE TABLE IF NOT EXISTS inquiries (
  id TEXT PRIMARY KEY,
  full_name TEXT NOT NULL,
  company TEXT,
  email TEXT NOT NULL,
  inquiry_type TEXT,
  message TEXT NOT NULL,
  country TEXT,
  quantity TEXT,
  product_interest TEXT,
  source_page TEXT,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON inquiries (created_at);
CREATE INDEX IF NOT EXISTS idx_inquiries_email ON inquiries (email);
```

The same SQL is saved at `migrations/0001_create_inquiries.sql`.

## 2. Create Turnstile Keys

In Cloudflare Turnstile, create a site for `rayfancy-pro.com`.

Add these Pages environment variables:

```text
TURNSTILE_SITE_KEY=your_public_site_key
TURNSTILE_SECRET_KEY=your_secret_key
```

The site key is public, but this project still loads it from the backend so the frontend code does not need to be edited for each environment.

## 3. Configure Email Sending

The function uses Resend for email delivery.

Add these Pages environment variables:

```text
RESEND_API_KEY=your_resend_api_key
INQUIRY_TO_EMAIL=rayfancycn@gmail.com
INQUIRY_FROM_EMAIL=RayFancy Inquiry <inquiry@your-verified-domain.com>
```

Important: `INQUIRY_FROM_EMAIL` should use a sender domain verified in Resend. Otherwise the mail service may reject the email.

## 4. Deploy

After pushing to GitHub, Cloudflare Pages will deploy:

```text
dist/
functions/api/inquiry.js
```

The form should then:

1. Validate name, email, and message.
2. Validate email format.
3. Verify Cloudflare Turnstile.
4. Save the inquiry to D1.
5. Email the inquiry to `rayfancycn@gmail.com`.
6. Show a success or friendly error message on the Contact page.
