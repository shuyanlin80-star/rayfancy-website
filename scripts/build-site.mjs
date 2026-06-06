import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const dist = path.join(root, "dist");
const publicDir = path.join(root, "public");
const stitchRoot = "/Users/lzk/RFC 建站资料/stitch_extracted_text_from_https_www.electricair.io";
const stitchRoot2 = "/Users/lzk/RFC 建站资料/stitch_extracted_text_from_https_www.electricair.io 2";
const stitchRoot3 = "/Users/lzk/RFC 建站资料/stitch_extracted_text_from_https_www.electricair.io 3";
const checkOnly = process.argv.includes("--check");

const contact = {
  email: "rayfancycn@gmail.com",
  phone1: "+86 18357812915",
  phone2: "+86 15988720342",
  whatsapp1: "https://wa.me/8618357812915",
  whatsapp2: "https://wa.me/8615988720342",
  address: "Binhai Industrial Zone, Wenzhou, Zhejiang, China",
  domain: "www.rayfancy-pro.com",
};

const pages = [
  {
    out: "index.html",
    root: stitchRoot3,
    src: "code.html",
    title: "RayFancy | Wall Switches for Global Project Supply",
    active: "home",
    images: [
      "/assets/brand/rayfancy-logo-full.png",
      "/assets/products/a6-switch-socket-combo.jpg",
      "/assets/products/a6-1gang-switch.jpg",
      "/assets/products/a6-2gang-switch.jpg",
      "/assets/products/a6-thailand-socket.jpg",
      "/assets/company/office.png",
      "/assets/products/a6-2gang-switch.jpg",
      "/assets/company/product-assembly.png",
    ],
  },
  {
    out: "products.html",
    src: "our_collections_tradition_hardware/code.html",
    title: "RayFancy Collections | Switches, Sockets, Plugs",
    active: "products",
    images: [
      "/assets/products/a6-1gang-switch.jpg",
      "/assets/products/a6-2gang-switch.jpg",
      "/assets/products/a6-3gang-switch.jpg",
      "/assets/products/a6-thailand-socket.jpg",
      "/assets/products/a6-double-socket.jpg",
      "/assets/products/three-pin-plug.jpg",
    ],
  },
  {
    out: "about.html",
    src: "our_story_tradition_hardware/code.html",
    title: "About RayFancy | Factory-Direct Electrical Hardware",
    active: "about",
    images: [
      "/assets/company/mold-design.png",
      "/assets/company/testing.png",
      "/assets/company/copper-parts.png",
      "/assets/company/injection-workshop.png",
      "/assets/company/packing-workshop.png",
      "/assets/products/a6-1gang-switch.jpg",
    ],
  },
  {
    out: "contact.html",
    src: "contact_us_tradition_hardware/code.html",
    title: "Contact RayFancy | Wall Switch & Electrical Accessory Supplier",
    active: "contact",
    images: [
      "/assets/products/a6-switch-socket-combo.jpg",
      "/assets/company/mold-design.png",
      "/assets/company/office.png",
    ],
  },
  {
    out: "projects.html",
    root: stitchRoot2,
    src: "rayfancy_global_projects_case_studies/code.html",
    title: "RayFancy Global Projects | Case Studies",
    active: "projects",
    images: [
      "/assets/company/office.png",
      "/assets/products/a6-switch-socket-combo.jpg",
      "/assets/company/injection-workshop.png",
      "/assets/products/a6-1gang-switch.jpg",
      "/assets/products/a6-2gang-switch.jpg",
    ],
  },
  {
    out: "quality.html",
    root: stitchRoot2,
    src: "rayfancy_quality_compliance_standards/code.html",
    title: "RayFancy Quality & Documentation",
    active: "quality",
    images: [
      "/assets/company/testing.png",
      "/assets/company/injection-workshop.png",
      "/assets/company/mold-design.png",
    ],
  },
  {
    out: "resources.html",
    root: stitchRoot2,
    src: "rayfancy_technical_resource_center/code.html",
    title: "RayFancy Technical Resource Center",
    active: "resources",
    images: [
      "/assets/company/mold-design.png",
      "/assets/products/a6-double-socket.jpg",
    ],
  },
];

function replaceImages(html, images) {
  let index = 0;
  return html.replace(/src="https:\/\/lh3\.googleusercontent\.com\/aida-public\/[^"]+"/g, () => {
    const image = images[Math.min(index, images.length - 1)];
    index += 1;
    return `src="${image}"`;
  });
}

function fixNav(html, active) {
  let next = html
    .replace(/href="#products"/g, 'href="/products.html"')
    .replace(/href="#about"/g, 'href="/about.html"')
    .replace(/href="#contact"/g, 'href="/contact.html"')
    .replace(/href="#">Trade Collections<\/a>/g, 'href="/products.html">Trade Collections</a>')
    .replace(/href="#">Bespoke Services<\/a>/g, 'href="/quality.html">Bespoke Services</a>')
    .replace(/href="#">Resources<\/a>/g, 'href="/resources.html">Resources</a>')
    .replace(/href="#">Projects<\/a>/g, 'href="/projects.html">Projects</a>')
    .replace(/href="#">Products<\/a>/g, 'href="/products.html">Products</a>')
    .replace(/href="#">About Us<\/a>/g, 'href="/about.html">About Us</a>')
    .replace(/href="#">Contact<\/a>/g, 'href="/contact.html">Contact</a>')
    .replace(/href="#">Technical Support<\/a>/g, 'href="/resources.html">Technical Support</a>')
    .replace(/href="#">Global Offices<\/a>/g, 'href="/projects.html">Global Offices</a>')
    .replace(/href="#">Company Information<\/a>/g, 'href="/about.html">Company Information</a>')
    .replace(/href="#">Trade Account<\/a>/g, 'href="/contact.html">Trade Account</a>')
    .replace(/href="#">/g, 'href="/contact.html">');

  if (active === "products") {
    next = next.replace(/text-slate-gray hover:text-heritage-gold transition-colors duration-300" href="\/products\.html">Products/g, 'text-heritage-gold border-b-2 border-heritage-gold pb-1" href="/products.html">Products');
  }
  if (active === "about") {
    next = next.replace(/text-slate-gray[^"]*" href="\/about\.html">About Us/g, 'text-heritage-gold border-b-2 border-heritage-gold pb-1" href="/about.html">About Us');
  }
  if (active === "contact") {
    next = next.replace(/text-slate-gray[^"]*" href="\/contact\.html">Contact/g, 'text-heritage-gold border-b-2 border-heritage-gold pb-1" href="/contact.html">Contact');
  }
  if (active === "resources") {
    next = next.replace(/text-secondary[^"]*" href="\/resources\.html">Resources/g, 'text-primary dark:text-primary-fixed border-b-2 border-heritage-gold pb-1" href="/resources.html">Resources');
  }
  if (active === "projects") {
    next = next.replace(/text-secondary[^"]*" href="\/projects\.html">Projects/g, 'text-primary border-b-2 border-heritage-gold pb-1" href="/projects.html">Projects');
  }
  if (active === "quality") {
    next = next.replace(/text-secondary[^"]*" href="\/quality\.html">Bespoke Services/g, 'text-primary border-b-2 border-heritage-gold pb-1" href="/quality.html">Bespoke Services');
  }
  return next;
}

function unifiedNavigation(active) {
  const links = [
    ["home", "/", "Home"],
    ["products", "/products.html", "Products"],
    ["quality", "/quality.html", "Quality"],
    ["resources", "/resources.html", "Resources"],
    ["projects", "/projects.html", "Projects"],
    ["about", "/about.html", "About"],
    ["contact", "/contact.html", "Contact"],
  ];
  const desktopLinks = links
    .map(([key, href, label]) => {
      const activeClass = key === active
        ? "text-heritage-gold border-b-2 border-heritage-gold pb-1"
        : "text-slate-gray hover:text-heritage-gold";
      return `<a class="font-label-caps text-label-caps ${activeClass} transition-colors duration-300 whitespace-nowrap" href="${href}">${label}</a>`;
    })
    .join("\n");
  const mobileLinks = links
    .map(([key, href, label]) => {
      const activeClass = key === active ? "text-heritage-gold" : "text-obsidian-black";
      return `<a class="block font-label-caps text-label-caps ${activeClass} py-3 border-b border-slate-gray/10" href="${href}">${label}</a>`;
    })
    .join("\n");

  return `<!-- Unified RayFancy Navigation -->
<header class="w-full top-0 sticky bg-surface z-50 border-b border-slate-gray border-opacity-10 h-20 transition-all duration-300" id="main-nav">
<nav class="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop flex items-center justify-between h-full gap-6">
<a class="font-headline-md text-headline-md font-bold tracking-tight text-obsidian-black whitespace-nowrap" href="/">RAYFANCY</a>
<div class="hidden md:flex items-center gap-3 lg:gap-5 xl:gap-7">
${desktopLinks}
</div>
<details class="rayfancy-mobile-nav md:hidden relative">
<summary class="list-none cursor-pointer text-primary flex items-center justify-center w-11 h-11 border border-slate-gray/20">
<span class="material-symbols-outlined">menu</span>
</summary>
<div class="absolute right-0 top-14 w-64 bg-white tactile-shadow border border-slate-gray/10 p-5">
${mobileLinks}
<a class="block mt-5 bg-primary text-on-primary text-center font-label-caps text-label-caps px-5 py-4 tracking-widest" href="/contact.html">INQUIRY</a>
</div>
</details>
</nav>
</header>`;
}

function replaceNavigation(html, active) {
  const nav = unifiedNavigation(active);
  if (/<!-- TopNavBar(?: Navigation Shell)? -->/.test(html)) {
    return html.replace(/<!-- TopNavBar(?: Navigation Shell)? -->\s*(?:<header[\s\S]*?<\/header>|<nav[\s\S]*?<\/nav>)/, nav);
  }
  if (html.includes("<!-- Top Navigation Bar -->")) {
    return html.replace(/<!-- Top Navigation Bar -->\s*<header[\s\S]*?<\/header>/, nav);
  }
  return html.replace(/<nav[\s\S]*?<\/nav>/, nav);
}

function addSupplementalNav(html) {
  if (!html.includes('href="/contact.html">Contact</a>') || html.includes('href="/resources.html">Resources</a>')) {
    return html;
  }
  const extra = `
<a class="font-label-caps text-label-caps text-slate-gray hover:text-heritage-gold transition-colors duration-300" href="/quality.html">Quality</a>
<a class="font-label-caps text-label-caps text-slate-gray hover:text-heritage-gold transition-colors duration-300" href="/resources.html">Resources</a>
<a class="font-label-caps text-label-caps text-slate-gray hover:text-heritage-gold transition-colors duration-300" href="/projects.html">Projects</a>`;
  return html.replace(/(<a[^>]+href="\/contact\.html">Contact<\/a>\s*)<\/div>/, `$1${extra}</div>`);
}

function replaceBrandAndCopy(html, title) {
  return html
    .replace(/<title>.*?<\/title>/, `<title>${title}</title>`)
    .replace(/TRADITION HARDWARE/g, "RAYFANCY")
    .replace(/Tradition Hardware/g, "RayFancy")
    .replace(/traditionhardware\.com/g, "rayfancy-pro.com")
    .replace(/trade@rayfancy-pro\.com/g, contact.email)
    .replace(/concierge@rayfancy-pro\.com/g, contact.email)
    .replace(/trade@traditionhardware\.com/g, contact.email)
    .replace(/concierge@traditionhardware\.com/g, contact.email)
    .replace(/\+44 \(0\) 20 7946 0123/g, contact.phone1)
    .replace(/\+44 \(0\) 114 234 5678/g, contact.phone1)
    .replace(/1482 Heritage Lane, Suite 400<br>Industrial District, Sheffield S1 4RT<br>United Kingdom/g, contact.address)
    .replace(/London Hub/g, "Wenzhou Factory")
    .replace(/Central Distribution &amp; Trade Showroom/g, "Manufacturing & Export Communication Base")
    .replace(/New York/g, "Regional Buyers")
    .replace(/Design Studio/g, "Market Matching")
    .replace(/Milan/g, "OEM Partners")
    .replace(/European Logistics/g, "Logo & Packaging Support")
    .replace(/© 2024 RAYFANCY\. ARCHITECTURAL QUALITY FOR GENERATIONS\./g, "© 2026 RAYFANCY. WALL SWITCHES AND ELECTRICAL ACCESSORIES.")
    .replace(/Architectural quality for generations\. We believe that the objects you touch every day should be the ones that last the longest\./g, "Factory-direct wall switches, sockets, plugs, and electrical accessories for global distributors, contractors, and OEM partners.")
    .replace(/Forging the future of electrical hardware by honoring the methods of the past\./g, "Supplying practical electrical hardware with stable production, flexible OEM support, and direct factory communication.")
    .replace(/Our collection of hand-finished switches, sockets, and plugs is designed for those who appreciate the tactile weight of excellence and the permanence of classic design\./g, "Our collection of wall switches, sockets, plugs, and power accessories is prepared for distributors, contractors, OEM buyers, and project procurement teams.")
    .replace(/Heirloom-grade electrical hardware crafted from solid brass and precision-engineered for a lifetime of tactile satisfaction\./g, "Factory-direct wall switches and electrical accessories made for reliable B2B supply, tactile product quality, and flexible OEM cooperation.")
    .replace(/Curated archetypes for the modern architectural project, spanning traditional toggles to high-current power solutions\./g, "Curated product categories from the RayFancy product folder, spanning wall switches, sockets, plugs, power strips, and lighting accessories.")
    .replace(/We partner with architects and designers to provide custom finishes and bulk quantities for large-scale developments\./g, "We support distributors, contractors, brand owners, and project buyers with model matching, samples, OEM packaging, and bulk order communication.");
}

function replaceProductCopy(html) {
  return html
    .replace(/Toggle Switches/g, "A6 Wall Switches")
    .replace(/Classic flick mechanism in 5 finishes\./g, "1 gang, 2 gang, and 3 gang switch options.")
    .replace(/Push Buttons/g, "Switch + Socket Units")
    .replace(/Silent mechanical action for ambient spaces\./g, "Combination layouts for compact wall installations.")
    .replace(/Power Outlets/g, "Wall Sockets")
    .replace(/Heavy-duty sockets with integrated USB-C\./g, "Thailand socket and double socket configurations.")
    .replace(/Aged Brass Toggle/g, "A6 1 Gang Switch")
    .replace(/Hand-Finished Patina/g, "A6-02 · 1 Way / 2 Way")
    .replace(/Obsidian Rotary/g, "A6 2 Gang Switch")
    .replace(/Knurled Matte Black/g, "A6-03 · Multiple Finishes")
    .replace(/Classic Porcelain/g, "A6 3 Gang Switch")
    .replace(/Glazed White Ceramic/g, "A6-04 · Project Supply")
    .replace(/Double USB Socket/g, "A6 Thailand Socket")
    .replace(/Brushed Stainless Steel/g, "A6-09 · Wall Socket")
    .replace(/Bronze Single/g, "A6 Double Socket")
    .replace(/Smoked Bronze Finish/g, "A6-16 / A6-17")
    .replace(/Textured Cable Plug/g, "Three Pin Plug")
    .replace(/Braided Nylon &amp; Matte Poly/g, "Plug & Accessory Supply")
    .replace(/FROM \$85/g, "A6-02")
    .replace(/FROM \$110/g, "A6-13")
    .replace(/FROM \$95/g, "A6-09");
}

function replaceAboutCopy(html) {
  return html
    .replace(/ESTABLISHED 1924/g, "FACTORY DIRECT")
    .replace(/THE BEAUTY OF MECHANICAL CERTAINTY\./g, "THE BEAUTY OF PRACTICAL MANUFACTURING CERTAINTY.")
    .replace(/In an age of ephemeral signals and wireless instability, we return to the tactile satisfaction of the physical\. No apps\. No updates\. Just the permanent resonance of solid metal\./g, "RayFancy focuses on reliable wall switches and electrical accessories for overseas distributors, contractors, brand owners, and OEM customers.")
    .replace(/Zero Connectivity Required/g, "Practical Product Range")
    .replace(/Our switches function independently of Wi-Fi or Bluetooth\. They rely on precision-engineered physical contacts that never drop a connection\./g, "Wall switches, sockets, plugs, power strips, and lighting accessories can support different channel needs.")
    .replace(/Generational Durability/g, "Factory Communication")
    .replace(/While software expires, solid brass and ceramic are eternal\. We build for houses that will stand for a century, not a release cycle\./g, "Samples, order quantities, color options, and packaging requirements can be confirmed before production.")
    .replace(/Haptic Feedback/g, "Long-Term Cooperation")
    .replace(/The "click" of a Tradition Hardware switch is tuned to a specific frequency—providing sensory confirmation that is missing from touchscreens\./g, "Our priority is stable supply, clear response, and practical cooperation for B2B customers.")
    .replace(/FORGED FROM THE ELEMENTS\./g, "BUILT FROM REAL FACTORY CAPABILITY.")
    .replace(/RAW MATERIALS\. REFINED FINISHES\. UNCOMPROMISING STANDARDS\./g, "PRODUCT PHOTOS. FACTORY SCENES. PRACTICAL SUPPLY SUPPORT.")
    .replace(/SOLID BRASS/g, "COPPER PARTS")
    .replace(/Cold-forged for structural integrity and a weight that feels substantial in the hand\./g, "Conductive components and electrical accessory details for product supply.")
    .replace(/ARCHITECTURAL CERAMIC/g, "INJECTION WORKSHOP")
    .replace(/Non-conductive and virtually scratch-proof\. A material that matures without aging\./g, "Manufacturing scenes that support repeatable production and order fulfillment.")
    .replace(/BURNISHED STEEL/g, "PACKING WORKSHOP")
    .replace(/Hand-finished by master patineurs to achieve a depth of color that responds to light\./g, "Packaging coordination for distributors and OEM-style supply.")
    .replace(/A CENTURY OF PRECISION\./g, "FROM SAMPLE CONFIRMATION TO REPEAT ORDERS.")
    .replace(/1924/g, "01")
    .replace(/THE FIRST FORGE/g, "MODEL MATCH")
    .replace(/Elias Thorne opens the Tradition Foundry in Sheffield, specializing in heavy-duty industrial contactors for the railway system\./g, "Confirm product type, target market, finish, packaging needs, and estimated quantity.")
    .replace(/1958/g, "02")
    .replace(/THE DOMESTIC SHIFT/g, "SAMPLE REVIEW")
    .replace(/Transitioning industrial reliability to the home\. The first "Executive Lever" series is launched, setting the standard for architectural switches\./g, "Review product appearance, basic function, packaging, and order details before bulk production.")
    .replace(/1990/g, "03")
    .replace(/MATERIAL RENAISSANCE/g, "PRODUCTION")
    .replace(/Tradition Hardware introduces specialized ceramic and rare metal finishes, defying the global trend toward plastic components\./g, "Prepare parts, assemble, inspect, and pack according to confirmed order requirements.")
    .replace(/2024/g, "04")
    .replace(/THE SILENT MAJORITY/g, "LONG-TERM SUPPLY")
    .replace(/In the age of IoT, we remain the definitive choice for those who value permanent, offline mechanical excellence\./g, "Build repeatable channel supply around stable products, direct response, and practical cooperation.")
    .replace(/THE ANCHOR SERIES\./g, "THE A6 SERIES.")
    .replace(/Our flagship toggle switch\. No delay, no software, no failure\. Every component is machined from solid stock brass and tested for over 100,000 cycles\./g, "A practical wall switch and socket series for distributor catalogs, project matching, and OEM packaging programs.")
    .replace(/CYCLE RATING/g, "PRODUCT TYPE")
    .replace(/100,000\+/g, "Switches / Sockets")
    .replace(/RESPONSE TIME/g, "SUPPLY MODE")
    .replace(/0ms \(Mechanical\)/g, "Factory Direct")
    .replace(/WARRANTY/g, "CUSTOMIZATION")
    .replace(/Lifetime/g, "Logo / Packaging");
}

function replaceContactCopy(html) {
  return html
    .replace(/Whether you are an architect planning a large-scale project or a homeowner seeking a single piece of heritage, our team is here to assist with technical specifications and bespoke orders\./g, "Whether you are preparing a distributor catalog, OEM packaging program, or project procurement list, our team can help match products and samples.")
    .replace(/Request a Physical Catalog/g, "Request a Product Catalog")
    .replace(/Our seasonal catalog is printed on heavyweight archival paper, featuring our full collection of switches, sockets, and hardware\./g, "Send your target market, product type, and quantity plan. We will respond with suitable models and sample options.")
    .replace(/ORDER PRINT EDITION/g, "REQUEST BY EMAIL")
    .replace(/SHIPS WORLDWIDE WITHIN 7-10 BUSINESS DAYS\./g, "RESPONSE BY EMAIL OR WHATSAPP.")
    .replace(/Every RAYFANCY component is engineered to exceed international standards\. Our technical support team can provide detailed CAD drawings and wiring schematics upon request\./g, "RayFancy focuses on real product photos, factory scenes, and direct communication for B2B buyers. Product documentation can be discussed by model and market need.")
    .replace(/Every TRADITION component is engineered to exceed international standards\. Our technical support team can provide detailed CAD drawings and wiring schematics upon request\./g, "RayFancy focuses on real product photos, factory scenes, and direct communication for B2B buyers. Product documentation can be discussed by model and market need.")
    .replace(/MATERIAL PURITY/g, "MAIN SUPPLY")
    .replace(/99\.9% Solid Brass/g, "Switches / Sockets / Accessories")
    .replace(/WARRANTY PERIOD/g, "SUPPORT")
    .replace(/Lifetime Mechanical/g, "OEM Logo / Packaging")
    .replace(/CERTIFICATIONS/g, "DOCUMENTATION")
    .replace(/CE, UL, RoHS Compliant/g, "Available by product model and market request")
    .replace(/EST\. 1924/g, "RAYFANCY")
    .replace(/LONDON, UK/g, "WENZHOU, CN");
}

function replaceHomepageTrustCopy(html) {
  return html
    .replace(/40,000 Click <br>Warranty\./g, "Factory <br>Support.")
    .replace(/Crafted for Longevity\./g, "Built for Repeat Supply.")
    .replace(/Mechanical Integrity/g, "Product Range")
    .replace(/Unlike modern plastic alternatives, our internals are milled from solid brass and steel, ensuring a positive, heavy engagement with every use\./g, "Wall switches, sockets, plugs, power strips, lamp holders, and accessories can be matched for different buyer channels.")
    .replace(/Patinated Finishes/g, "OEM Coordination")
    .replace(/Our unlacquered finishes are designed to age gracefully, developing a unique character that tells the story of your home over decades\./g, "Logo printing, packaging direction, sample confirmation, and order details can be discussed before production.")
    .replace(/Architectural Standards/g, "Factory Communication")
    .replace(/Meeting global safety standards without compromising on the thin-plate aesthetic favored by leading interior designers\./g, "Product documents and model information can be prepared according to product type and market request.")
    .replace(/THE PROFESSIONAL CHOICE/g, "THE TRADE BUYER CHOICE")
    .replace(/Trusted by Architects globally\./g, "Built for distributors, contractors, and OEM buyers.")
    .replace(/"The weight of these switches is immediately apparent\. In a world of plastic disposability, RayFancy stands alone\."/g, "\"RayFancy helps buyers compare models quickly with clear product photos and direct communication.\"")
    .replace(/Julian Thorne/g, "Distributor Buyer")
    .replace(/PRINCIPAL AT THORNE STUDIO/g, "PRODUCT SELECTION")
    .replace(/"We specify Tradition for all our heritage restoration projects\. Their attention to material authenticity is unparalleled in the industry\."/g, "\"The product categories are practical for channel catalogs, sample checks, and repeat order discussion.\"")
    .replace(/Elena Rossi/g, "OEM Partner")
    .replace(/HERITAGE PRESERVATION ARCHITECT/g, "PACKAGING PROGRAM")
    .replace(/"The unlacquered brass developed a beautiful patina within months\. It feels like it has always been part of the house\."/g, "\"Factory photos, product images, and fast WhatsApp contact make early sourcing work easier.\"")
    .replace(/Marcus Chen/g, "Project Buyer")
    .replace(/RESIDENTIAL INTERIOR DESIGNER/g, "TRADE INQUIRY")
    .replace(/Private Residential/g, "Distributor Catalog")
    .replace(/Commercial \/ Hospitality/g, "Commercial / Project Order")
    .replace(/Heritage Restoration/g, "OEM Packaging Program")
    .replace(/The Signature Brass/g, "A6 Wall Switches")
    .replace(/Obsidian Matte/g, "Wall Sockets")
    .replace(/Brushed Nickel/g, "Plugs & Accessories")
    .replace(/Bespoke Finishes/g, "OEM Packaging")
    .replace(/Craftsmanship/g, "Factory Capability")
    .replace(/Sustainability/g, "Quality Workflow")
    .replace(/Installation Guides/g, "Product References")
    .replace(/Shipping/g, "Export Communication")
    .replace(/Returns/g, "Sample Confirmation")
    .replace(/Privacy Policy/g, "Contact Sales")
    .replace(/INSTAGRAM/g, "FACEBOOK")
    .replace(/PINTEREST/g, "WHATSAPP")
    .replace(/LINKEDIN/g, "EMAIL");
}

function replaceLatestHomepageCopy(html) {
  return html
    .replace(/RayFancy \| High-End Architectural Hardware/g, "RayFancy | Wall Switches for Global Project Supply")
    .replace(/Premium architectural hardware without the brand markup\. Engineered for global B2B delivery and seamless technical integration\./g, "Factory-direct wall switches, sockets, plugs, and electrical accessories for distributors, contractors, OEM buyers, and project procurement teams.")
    .replace(/Request B2B Catalog/g, "Request Product Catalog")
    .replace(/Partner With Us/g, "Contact RayFancy")
    .replace(/Our manufacturing process prioritizes technical precision and material integrity, ensuring each component meets the rigorous demands of global architecture\./g, "Our product workflow focuses on practical model matching, sample confirmation, factory communication, and repeatable order support for trade buyers.")
    .replace(/EST\. 1994/g, "WENZHOU FACTORY")
    .replace(/8-Step Precision Polishing/g, "Product Matching Support")
    .replace(/Every metal plate undergoes eight distinct stages of mechanical and hand polishing to achieve a flawless, light-catching finish\./g, "Switches, sockets, plugs, power strips, lamp holders, and accessories can be matched by product type and target market.")
    .replace(/100k-Cycle Durability/g, "Sample Confirmation")
    .replace(/Mechanisms are tested to exceed 100,000 cycles, providing a lifetime of reliable tactile feedback and electrical safety\./g, "Before bulk orders, product appearance, basic function, packaging direction, and model details can be confirmed through samples.")
    .replace(/Factory-Direct Pricing/g, "Factory-Direct Supply")
    .replace(/By controlling the entire supply chain from raw material to final assembly, we eliminate middleman premiums for our B2B partners\./g, "Direct communication with RayFancy helps buyers compare models, confirm order details, and prepare repeat supply more efficiently.")
    .replace(/The Collections/g, "Product Collections")
    .replace(/Engineered for architectural harmony across any interior landscape\./g, "Prepared from RayFancy product categories for distributors, contractors, OEM buyers, and project procurement.")
    .replace(/Series T Toggles/g, "A6 Wall Switches")
    .replace(/Heritage-inspired mechanical switches with solid brass internals\./g, "1 gang, 2 gang, and 3 gang wall switch options for product catalogs and project matching.")
    .replace(/Architectural Panels/g, "Switch & Socket Units")
    .replace(/Ultra-slim profiles for contemporary commercial and residential spaces\./g, "Combination layouts and wall socket options for practical electrical installation needs.")
    .replace(/Precision Sockets/g, "Plugs & Power Accessories")
    .replace(/International standards with uncompromising build quality and safety\./g, "Plugs, power strips, lamp holders, and related accessories for channel supply.")
    .replace(/Smart Integration/g, "Accessory Supply")
    .replace(/Specialized Solutions for Global Sectors/g, "Practical Supply for Different Buyer Channels")
    .replace(/Bespoke bedside controls and unified guestroom experiences for luxury hotel groups\./g, "Switches, sockets, and accessories can support room-by-room project procurement and sample review.")
    .replace(/Heavy-duty modules designed for high-traffic office environments and public spaces\./g, "Product matching and bulk order communication for commercial contractors and distributors.")
    .replace(/High-fidelity finishes that transform functional utility into interior design statements\./g, "Practical wall switch and socket options for residential market catalogs and OEM packaging.")
    .replace(/"Excellence is in the finish\."/g, "\"Real products, clear samples, practical supply.\"")
    .replace(/Technical Documentation/g, "Product Documentation")
    .replace(/Access our comprehensive library of BIM\/CAD models, technical datasheets, and wiring diagrams for seamless integration into your project specs\./g, "Request product images, model references, sample details, and available documentation according to confirmed product type.")
    .replace(/Download Specs/g, "Request Specs")
    .replace(/Global Project Deployment/g, "Global Buyer Communication")
    .replace(/From Singaporean high-rises to London's boutique hotels, RayFancy components are specified by the world's leading MEP engineers and architectural firms\./g, "RayFancy supports overseas distributors, contractors, brand owners, and OEM buyers with direct factory communication from Wenzhou, China.")
    .replace(/45\+/g, "B2B")
    .replace(/Countries Supplied/g, "Trade Support")
    .replace(/1\.2M/g, "OEM")
    .replace(/Units Installed/g, "Packaging")
    .replace(/0\.02%/g, "A6")
    .replace(/Defect Rate/g, "Series")
    .replace(/Specified by the Best/g, "Chosen by Practical Buyers")
    .replace(/Our B2B partners choose us for the intersection of industrial reliability and editorial elegance\./g, "Trade buyers choose RayFancy for real product photos, sample communication, and practical OEM support.")
    .replace(/"RayFancy provided a level of customization and material quality that we simply couldn't find with traditional high-street brands\. Their factory-direct model made a luxury finish possible within our client's commercial budget\."/g, "\"RayFancy helps us compare product categories quickly and confirm samples before discussing bulk orders.\"")
    .replace(/Marcus Thornton/g, "Distributor Buyer")
    .replace(/Senior Architect, Studio Apex/g, "Product Selection")
    .replace(/"For hospitality projects, durability is paramount\. We've specified Series T across three major hotel developments, and the tactile feedback remains as crisp as the day of installation\."/g, "\"Direct WhatsApp and email communication makes early sourcing, sample review, and packaging discussion much easier.\"")
    .replace(/Elena Rodriguez/g, "OEM Partner")
    .replace(/Procurement Director, LUXE Stays/g, "Packaging Program")
    .replace(/Inquire about bulk pricing, custom finishes, or technical specifications for your upcoming project\./g, "Send your product type, target market, quantity plan, and packaging needs. We will reply by email or WhatsApp.")
    .replace(/Custom Finishing Inquiry/g, "OEM Packaging Inquiry")
    .replace(/Technical Specification Support/g, "Product Documentation Request")
    .replace(/Bulk Project Quote/g, "Bulk Order Discussion")
    .replace(/Architectural firm or Developer/g, "Distributor / Contractor / Brand Owner")
    .replace(/Tell us about your requirements/g, "Tell us your product type, target market, quantity, and packaging needs")
    .replace(/Submit Professional Inquiry/g, "Submit Trade Inquiry")
    .replace(/Industrial Reliability, Editorial Elegance\. Manufacturing the world's most precise tactile hardware\./g, "Factory-direct wall switches, sockets, plugs, and electrical accessories for global trade buyers.")
    .replace(/Industrial Reliability, Editorial Elegance\./g, "Wall Switches and Electrical Accessories.")
    .replace(/© 2024 RayFancy/g, "© 2026 RayFancy")
    .replace(/Cookie Policy/g, "Contact Sales");
}

function replaceNewPageClaims(html) {
  return html
    .replace(/Quality Without Compromise/g, "Quality Control Without Guesswork")
    .replace(/Our 8-step precision process ensures every switch meets the highest global standards, blending industrial reliability with editorial elegance\./g, "Our quality workflow focuses on material selection, production checks, assembly review, and clear documentation for B2B buyers.")
    .replace(/Our mechanical actuators are stress-tested beyond 100,000 cycles, equivalent to 50 years of daily household use\./g, "Switch feel, component fit, and mechanical structure can be reviewed through sample confirmation before bulk orders.")
    .replace(/High-grade Grade V0 Polycarbonate housing provides the highest level of fire safety, extinguishing itself within 10 seconds\./g, "Material options and housing requirements can be discussed by product model and target market.")
    .replace(/Internal contact points utilize premium Silver-Nickel alloys for superior conductivity and resistance to electric arcing\./g, "Contact structure and conductive components are matched by product model, cost target, and application scenario.")
    .replace(/Global Compliance Standards/g, "Documentation & Market Requirements")
    .replace(/CE MARKING/g, "MODEL DOCUMENTATION")
    .replace(/Conformity with European safety, health, and environmental protection standards\./g, "Product documents can be prepared by model and confirmed requirement.")
    .replace(/UL CERTIFIED/g, "MARKET REQUEST")
    .replace(/Underwriters Laboratories listed for strict safety and durability in North America\./g, "For regulated markets, requested documentation should be confirmed before order.")
    .replace(/RoHS COMPLIANT/g, "MATERIAL NOTES")
    .replace(/Strict restriction of hazardous substances for a safer environment\./g, "Material and packaging notes can be discussed during sample confirmation.")
    .replace(/ISO QUALITY/g, "QC PROCESS")
    .replace(/Global standard for consistent quality management systems\./g, "Production and inspection workflow can be reviewed with trade buyers.")
    .replace(/IEC, UL, CE, BS Standards/g, "Available by product model and market request")
    .replace(/Safety Certification/g, "Documentation Request")
    .replace(/Downloadable copies of CE, UL, and ISO certifications for project compliance records\./g, "Downloadable product documents, model notes, and requested files can be prepared after product confirmation.")
    .replace(/Certification Vault/g, "Documentation Vault")
    .replace(/Download Compliance/g, "Request Documentation")
    .replace(/<span class="text-\[10px\] font-bold text-outline opacity-40">CE<\/span>/g, '<span class="text-[10px] font-bold text-outline opacity-40">DOC</span>')
    .replace(/<span class="text-\[10px\] font-bold text-outline opacity-40">UL<\/span>/g, '<span class="text-[10px] font-bold text-outline opacity-40">SPEC</span>')
    .replace(/<span class="text-\[10px\] font-bold text-outline opacity-40">ISO<\/span>/g, '<span class="text-[10px] font-bold text-outline opacity-40">QC</span>')
    .replace(/<span class="font-bold text-3xl">RoHS<\/span>/g, '<span class="font-bold text-3xl">NOTE</span>')
    .replace(/BOOK A VIRTUAL TOUR/g, "REQUEST FACTORY CALL")
    .replace(/IN-PERSON VISIT/g, "CONTACT SALES")
    .replace(/Shenzhen precision lab/g, "Wenzhou production facility")
    .replace(/Downloadable \.rfa and \.dwg files for all series, optimized for architectural workflow\./g, "Product images, model references, and dimension notes can be prepared for confirmed series.")
    .replace(/Revit Families \(\.RFA\)/g, "Product Image Pack")
    .replace(/CAD Blocks \(\.DWG\)/g, "Dimension Reference")
    .replace(/BIM &amp; CAD Library/g, "Product Asset Library")
    .replace(/Integrated tools and documentation for precision planning\. Access our complete library of technical assets for seamless integration into your architectural projects\./g, "Access product references, model notes, installation guidance, and documentation requests for trade communication.")
    .replace(/Download Specs/g, "Request Specs")
    .replace(/Partner for your next project/g, "Partner for your next order")
    .replace(/Our dedicated trade team provides technical consultation, custom finish matching, and logistics support for developments of any scale\./g, "Our trade team supports product matching, sample confirmation, OEM packaging, and bulk order communication.")
    .replace(/From boutique hotels to high-rise commercial developments, RayFancy delivers industrial reliability and editorial elegance at a global scale\./g, "From distributor channels to residential and commercial projects, RayFancy provides practical electrical hardware and factory-direct communication.")
    .replace(/The Grand Meridian — Dubai/g, "Hospitality Sample Program")
    .replace(/Nexus Tech Headquarters — Singapore/g, "Commercial Project Supply")
    .replace(/Elysian Residences — London/g, "Residential Distributor Program")
    .replace(/400\+ suites/g, "bulk room installations")
    .replace(/Mayfair/g, "regional markets");
}

function addHomepageEnhancements(html) {
  const enhancement = `<!-- RayFancy Homepage Expansion -->
<section class="py-section-gap bg-off-white">
<div class="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
<div class="grid grid-cols-1 lg:grid-cols-12 gap-16 items-end mb-20">
<div class="lg:col-span-7">
<p class="font-label-caps text-label-caps text-heritage-gold mb-5 tracking-[0.2em]">FACTORY-DIRECT SUPPLY</p>
<h2 class="font-headline-lg text-headline-lg text-obsidian-black mb-6">A clearer way to source wall switches and electrical accessories.</h2>
<p class="font-body-lg text-body-lg text-slate-gray max-w-2xl">RayFancy is built for trade buyers who need real products, responsive communication, sample confirmation, and repeatable production support.</p>
</div>
<div class="lg:col-span-5 grid grid-cols-2 gap-4">
<div class="border-t border-heritage-gold pt-5">
<p class="font-headline-md text-headline-md text-obsidian-black">A6 Series</p>
<p class="font-label-caps text-label-caps text-slate-gray mt-2">Switches / Sockets</p>
</div>
<div class="border-t border-heritage-gold pt-5">
<p class="font-headline-md text-headline-md text-obsidian-black">OEM Ready</p>
<p class="font-label-caps text-label-caps text-slate-gray mt-2">Logo / Packaging</p>
</div>
<div class="border-t border-heritage-gold pt-5">
<p class="font-headline-md text-headline-md text-obsidian-black">Wenzhou</p>
<p class="font-label-caps text-label-caps text-slate-gray mt-2">Factory Base</p>
</div>
<div class="border-t border-heritage-gold pt-5">
<p class="font-headline-md text-headline-md text-obsidian-black">B2B</p>
<p class="font-label-caps text-label-caps text-slate-gray mt-2">Distributor Support</p>
</div>
</div>
</div>
<div class="grid grid-cols-1 md:grid-cols-3 gap-8">
<a class="group bg-white block tactile-shadow" href="/products.html">
<div class="aspect-[4/3] overflow-hidden"><img class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src="/assets/products/a6-double-socket.jpg" alt="RayFancy wall socket"></div>
<div class="p-8">
<p class="font-label-caps text-label-caps text-heritage-gold mb-3">PRODUCT CATALOG</p>
<h3 class="font-headline-md text-headline-md text-obsidian-black mb-3">Switches, sockets, plugs, and power accessories.</h3>
<p class="font-body-md text-body-md text-slate-gray">Start from the product categories already prepared in the RayFancy folder.</p>
</div>
</a>
<a class="group bg-white block tactile-shadow" href="/about.html">
<div class="aspect-[4/3] overflow-hidden"><img class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src="/assets/company/injection-workshop.png" alt="RayFancy production workshop"></div>
<div class="p-8">
<p class="font-label-caps text-label-caps text-heritage-gold mb-3">FACTORY CAPABILITY</p>
<h3 class="font-headline-md text-headline-md text-obsidian-black mb-3">Real workshop scenes and practical production support.</h3>
<p class="font-body-md text-body-md text-slate-gray">Show buyers how orders move from model matching to assembly and packing.</p>
</div>
</a>
<a class="group bg-white block tactile-shadow" href="/resources.html">
<div class="aspect-[4/3] overflow-hidden"><img class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src="/assets/company/mold-design.png" alt="RayFancy product resource support"></div>
<div class="p-8">
<p class="font-label-caps text-label-caps text-heritage-gold mb-3">TRADE RESOURCES</p>
<h3 class="font-headline-md text-headline-md text-obsidian-black mb-3">Product references for faster buyer communication.</h3>
<p class="font-body-md text-body-md text-slate-gray">Request product images, model notes, sample details, and market-specific documents.</p>
</div>
</a>
</div>
</div>
</section>
<section class="py-section-gap bg-surface">
<div class="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
<div class="grid grid-cols-2 gap-4">
<img class="w-full aspect-[4/5] object-cover tactile-shadow" src="/assets/company/copper-parts.png" alt="RayFancy copper parts">
<img class="w-full aspect-[4/5] object-cover tactile-shadow mt-12" src="/assets/company/testing.png" alt="RayFancy product testing">
</div>
<div>
<p class="font-label-caps text-label-caps text-heritage-gold mb-5 tracking-[0.2em]">HOW BUYERS WORK WITH US</p>
<h2 class="font-headline-lg text-headline-lg text-obsidian-black mb-10">From sample choice to repeat orders, the path is simple.</h2>
<div class="space-y-8">
<div class="flex gap-6"><span class="font-headline-md text-headline-md text-heritage-gold">01</span><div><h3 class="font-headline-md text-headline-md text-obsidian-black mb-2">Share your target market</h3><p class="font-body-md text-body-md text-slate-gray">Tell us the product type, quantity plan, packaging need, and contact method.</p></div></div>
<div class="flex gap-6"><span class="font-headline-md text-headline-md text-heritage-gold">02</span><div><h3 class="font-headline-md text-headline-md text-obsidian-black mb-2">Confirm models and samples</h3><p class="font-body-md text-body-md text-slate-gray">We help match available switch, socket, plug, and accessory options before bulk order discussion.</p></div></div>
<div class="flex gap-6"><span class="font-headline-md text-headline-md text-heritage-gold">03</span><div><h3 class="font-headline-md text-headline-md text-obsidian-black mb-2">Prepare production and packing</h3><p class="font-body-md text-body-md text-slate-gray">After details are confirmed, production, inspection, and packing can be coordinated clearly.</p></div></div>
</div>
<div class="mt-12 flex flex-wrap gap-4">
<a class="bg-primary text-on-primary font-label-caps text-label-caps px-8 py-4 tracking-widest hover:bg-heritage-gold transition-colors" href="/contact.html">START INQUIRY</a>
<a class="border border-slate-gray text-obsidian-black font-label-caps text-label-caps px-8 py-4 tracking-widest hover:border-heritage-gold hover:text-heritage-gold transition-colors" href="/quality.html">VIEW QUALITY</a>
</div>
</div>
</div>
</section>`;

  if (html.includes("<!-- RayFancy Homepage Expansion -->")) {
    return html;
  }
  return html.replace("<!-- Contact / Trade Section -->", `${enhancement}\n<!-- Contact / Trade Section -->`);
}

function addRayFancyMetadata(html, title) {
  const description = "RayFancy supplies wall switches, sockets, plugs, power strips, and electrical accessories for global distributors, contractors, and OEM buyers.";
  return html.replace("</head>", `<meta name="description" content="${description}">\n<meta property="og:title" content="${title}">\n<meta property="og:description" content="${description}">\n<style>\n  .rayfancy-fb-qr{width:120px;height:120px;object-fit:contain;background:#fff;border:1px solid rgba(83,98,113,.18);padding:6px;margin-top:12px;}\n  .rayfancy-mobile-nav summary::-webkit-details-marker{display:none;}\n  @media (max-width: 1120px){.text-label-caps{font-size:10px!important;}}\n  @media (max-width: 768px){.px-margin-desktop{padding-left:20px!important;padding-right:20px!important}.text-display-lg{font-size:42px!important;line-height:50px!important}.text-headline-lg{font-size:34px!important;line-height:42px!important}}\n</style>\n</head>`);
}

function addFacebookQrToContact(html) {
  return html.replace(
    /(<p class="font-body-md text-body-md">rayfancycn@gmail\.com<\/p>\s*<\/div>\s*<\/div>)/,
    `$1\n<div class="flex items-start gap-4">\n<span class="material-symbols-outlined text-heritage-gold mt-1">public</span>\n<div>\n<p class="font-label-caps text-label-caps text-slate-gray mb-1">FACEBOOK</p>\n<img class="rayfancy-fb-qr" src="/assets/brand/facebook-qr.png" alt="RayFancy Facebook QR code">\n</div>\n</div>`
  );
}

async function buildPreviousHomepageSections() {
  let html = await readFile(path.join(stitchRoot, "tradition_hardware_home/code.html"), "utf8");
  html = replaceImages(html, [
    "/assets/products/a6-switch-socket-combo.jpg",
    "/assets/products/a6-2gang-switch.jpg",
    "/assets/products/a6-switch-socket-combo.jpg",
    "/assets/products/a6-thailand-socket.jpg",
    "/assets/company/product-assembly.png",
  ]);
  html = fixNav(html, "home");
  html = addSupplementalNav(html);
  html = replaceBrandAndCopy(html, "RayFancy | Wall Switches for Global Project Supply");
  html = replaceProductCopy(html);
  html = replaceAboutCopy(html);
  html = replaceContactCopy(html);
  html = replaceHomepageTrustCopy(html);
  html = addHomepageEnhancements(html);
  html = html
    .replace(/<button([^>]*)>\s*EXPLORE COLLECTION\s*<\/button>/g, `<a$1 href="/products.html">EXPLORE COLLECTION</a>`)
    .replace(/<button([^>]*)>\s*VIEW ALL PRODUCTS\s*<\/button>/g, `<a$1 href="/products.html">VIEW ALL PRODUCTS</a>`)
    .replace(/<button([^>]*)>\s*REQUEST TRADE CATALOGUE\s*<\/button>/g, `<a$1 href="mailto:${contact.email}">REQUEST TRADE CATALOGUE</a>`);
  const start = html.indexOf("<!-- Essential Collection -->");
  const end = html.indexOf("<!-- Footer -->");
  if (start === -1 || end === -1 || end <= start) {
    throw new Error("Could not extract previous homepage sections.");
  }
  return `<!-- Previous Stitch Homepage Sections Preserved -->\n${html.slice(start, end)}`;
}

async function buildPage(page) {
  let html = await readFile(path.join(page.root ?? stitchRoot, page.src), "utf8");
  html = replaceImages(html, page.images);
  html = fixNav(html, page.active);
  html = addSupplementalNav(html);
  html = replaceNavigation(html, page.active);
  html = replaceBrandAndCopy(html, page.title);
  html = replaceProductCopy(html);
  html = replaceAboutCopy(html);
  html = replaceContactCopy(html);
  html = replaceHomepageTrustCopy(html);
  html = replaceLatestHomepageCopy(html);
  html = replaceNewPageClaims(html);
  html = addRayFancyMetadata(html, page.title);
  if (page.out === "contact.html") {
    html = addFacebookQrToContact(html);
  }
  html = html
    .replace(/<button([^>]*)>\s*CATALOGUE\s*<\/button>/g, `<a$1 href="mailto:${contact.email}">CATALOGUE</a>`)
    .replace(/<button([^>]*)>\s*Trade Login\s*<\/button>/gi, `<a$1 href="/contact.html">Trade Login</a>`)
    .replace(/<button([^>]*)>\s*Explore Assets\s*<\/button>/gi, `<a$1 href="/resources.html">Explore Assets</a>`)
    .replace(/<button([^>]*)>\s*Support Center\s*<\/button>/gi, `<a$1 href="/contact.html">Support Center</a>`)
    .replace(/<button([^>]*)>\s*Browse Assets\s*<\/button>/gi, `<a$1 href="mailto:${contact.email}">Browse Assets</a>`)
    .replace(/<button([^>]*)>\s*View Documents\s*<\/button>/gi, `<a$1 href="mailto:${contact.email}">View Documents</a>`)
    .replace(/<button([^>]*)>\s*Access Guides\s*<\/button>/gi, `<a$1 href="mailto:${contact.email}">Access Guides</a>`)
    .replace(/<button([^>]*)>\s*Request Documentation\s*<\/button>/gi, `<a$1 href="mailto:${contact.email}">Request Documentation</a>`)
    .replace(/<button([^>]*)>\s*Become a Partner\s*<\/button>/gi, `<a$1 href="/contact.html">Become a Partner</a>`)
    .replace(/<button([^>]*)>\s*Member Sign-in\s*<\/button>/gi, `<a$1 href="/contact.html">Member Sign-in</a>`)
    .replace(/<button([^>]*)>\s*REQUEST FACTORY CALL\s*<\/button>/g, `<a$1 href="/contact.html">REQUEST FACTORY CALL</a>`)
    .replace(/<button([^>]*)>\s*CONTACT SALES\s*<\/button>/g, `<a$1 href="/contact.html">CONTACT SALES</a>`)
    .replace(/<button([^>]*)>\s*Request Product Catalog\s*<\/button>/g, `<a$1 href="mailto:${contact.email}">Request Product Catalog</a>`)
    .replace(/<button([^>]*)>\s*Contact RayFancy\s*<\/button>/g, `<a$1 href="/contact.html">Contact RayFancy</a>`)
    .replace(/<button([^>]*)>\s*Submit Trade Inquiry\s*<\/button>/g, `<a$1 href="mailto:${contact.email}">Submit Trade Inquiry</a>`)
    .replace(/<button([^>]*)>\s*REQUEST TRADE CATALOGUE\s*<\/button>/g, `<a$1 href="mailto:${contact.email}">REQUEST TRADE CATALOGUE</a>`)
    .replace(/<button([^>]*)>\s*ORDER PRINT EDITION\s*<\/button>/g, `<a$1 href="mailto:${contact.email}">REQUEST BY EMAIL</a>`)
    .replace(/href="#">Trade Collections/g, 'href="/products.html">Trade Collections')
    .replace(/href="#">Bespoke Services/g, 'href="/quality.html">Bespoke Services')
    .replace(/href="#">Resources/g, 'href="/resources.html">Resources')
    .replace(/href="#">Projects/g, 'href="/projects.html">Projects')
    .replace(/href="#">Company Information/g, 'href="/about.html">Company Information')
    .replace(/href="#">Technical Support/g, 'href="/resources.html">Technical Support')
    .replace(/href="#">Global Offices/g, 'href="/projects.html">Global Offices')
    .replace(/href="#">Privacy Policy/g, 'href="/contact.html">Privacy Policy')
    .replace(/href="#">Terms of Service/g, 'href="/contact.html">Terms of Service')
    .replace(/href="#">Contact Sales/g, 'href="/contact.html">Contact Sales')
    .replace(/href="#">/g, 'href="/contact.html">');
  return html;
}

const builtPages = new Map();
for (const page of pages) {
  builtPages.set(page.out, await buildPage(page));
}

for (const [name, html] of builtPages) {
  if (!/RAYFANCY|RayFancy/.test(html) || !html.includes("bg-primary")) {
    throw new Error(`Build check failed: ${name} does not preserve Stitch-based content.`);
  }
}

if (!checkOnly) {
  await rm(dist, { recursive: true, force: true });
  await mkdir(dist, { recursive: true });
  await cp(publicDir, dist, { recursive: true });
  for (const [name, html] of builtPages) {
    await writeFile(path.join(dist, name), html);
  }
  await writeFile(path.join(dist, "robots.txt"), "User-agent: *\nAllow: /\nSitemap: https://www.rayfancy-pro.com/sitemap.xml\n");
  await writeFile(path.join(dist, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>https://www.rayfancy-pro.com/</loc></url>\n  <url><loc>https://www.rayfancy-pro.com/products.html</loc></url>\n  <url><loc>https://www.rayfancy-pro.com/about.html</loc></url>\n  <url><loc>https://www.rayfancy-pro.com/contact.html</loc></url>\n  <url><loc>https://www.rayfancy-pro.com/projects.html</loc></url>\n  <url><loc>https://www.rayfancy-pro.com/quality.html</loc></url>\n  <url><loc>https://www.rayfancy-pro.com/resources.html</loc></url>\n</urlset>\n`);
}

console.log(checkOnly ? "Build check passed." : "Site built to dist from Stitch templates.");
