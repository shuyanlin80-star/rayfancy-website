import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const dist = path.join(root, "dist");
const publicDir = path.join(root, "public");
const stitchRoot = path.join(root, "src/stitch/base");
const stitchRoot2 = path.join(root, "src/stitch/pages");
const stitchRoot3 = path.join(root, "src/stitch/home");
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
      "/assets/products/a6-thailand-socket.jpg",
      "/assets/products/a6-thailand-socket.jpg",
      "/assets/products/a6-1gang-switch.jpg",
      "/assets/products/a6-2gang-switch.jpg",
      "/assets/products/application-scene.jpg",
      "/assets/products/a6-2gang-switch.jpg",
      "/assets/company/product-assembly.jpg",
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
      "/assets/company/mold-design.jpg",
      "/assets/company/testing.jpg",
      "/assets/company/copper-parts.jpg",
      "/assets/company/injection-workshop.jpg",
      "/assets/company/packing-workshop.jpg",
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
      "/assets/company/mold-design.jpg",
      "/assets/company/office.jpg",
    ],
  },
  {
    out: "projects.html",
    root: stitchRoot2,
    src: "rayfancy_global_projects_case_studies/code.html",
    title: "RayFancy Global Projects | Case Studies",
    active: "projects",
    images: [
      "/assets/company/office.jpg",
      "/assets/products/a6-switch-socket-combo.jpg",
      "/assets/company/injection-workshop.jpg",
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
      "/assets/company/testing.jpg",
      "/assets/company/injection-workshop.jpg",
      "/assets/company/mold-design.jpg",
    ],
  },
  {
    out: "resources.html",
    root: stitchRoot2,
    src: "rayfancy_technical_resource_center/code.html",
    title: "RayFancy Technical Resource Center",
    active: "resources",
    images: [
      "/assets/company/mold-design.jpg",
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
<header class="w-full top-0 sticky bg-surface z-50 border-b border-slate-gray border-opacity-10 h-16 transition-all duration-300" id="main-nav">
<nav class="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop flex items-center justify-between h-full gap-4">
<a class="flex items-end gap-3 shrink-0" href="/" aria-label="RayFancy home">
<span class="flex h-10 w-10 md:h-11 md:w-11 items-center justify-center overflow-hidden">
<img class="h-16 w-16 md:h-[70px] md:w-[70px] max-w-none object-contain -translate-y-[1px] rayfancy-header-logo" src="/assets/brand/rayfancy-logo-mark.png" alt="">
</span>
<span class="[font-family:Azonix,Montserrat,Arial,sans-serif] text-[22px] leading-none md:text-[26px] font-normal tracking-normal text-obsidian-black whitespace-nowrap rayfancy-header-wordmark">RAYFANCY</span>
</a>
<div class="hidden md:flex items-center gap-2 lg:gap-4 xl:gap-5">
${desktopLinks}
</div>
<details class="rayfancy-mobile-nav md:hidden relative">
<summary class="list-none cursor-pointer text-primary flex items-center justify-center w-10 h-10 border border-slate-gray/20">
<span class="material-symbols-outlined">menu</span>
</summary>
<div class="absolute right-0 top-12 w-64 bg-white tactile-shadow border border-slate-gray/10 p-5">
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
    .replace(/Toggle Switches/g, "Wall Switches")
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
    .replace(/The Signature Brass/g, "Wall Switches")
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
    .replace(/EST\. 1994/g, "DIRECT SUPPLY")
    .replace(/8-Step Precision Polishing/g, "Product Matching Support")
    .replace(/Every metal plate undergoes eight distinct stages of mechanical and hand polishing to achieve a flawless, light-catching finish\./g, "Switches, sockets, plugs, power strips, lamp holders, and accessories can be matched by product type and target market.")
    .replace(/100k-Cycle Durability/g, "Sample Confirmation")
    .replace(/Mechanisms are tested to exceed 100,000 cycles, providing a lifetime of reliable tactile feedback and electrical safety\./g, "Before bulk orders, product appearance, basic function, packaging direction, and model details can be confirmed through samples.")
    .replace(/Factory-Direct Pricing/g, "Factory-Direct Supply")
    .replace(/By controlling the entire supply chain from raw material to final assembly, we eliminate middleman premiums for our B2B partners\./g, "Direct communication with RayFancy helps buyers compare models, confirm order details, and prepare repeat supply more efficiently.")
    .replace(/The Collections/g, "Product Collections")
    .replace(/Engineered for architectural harmony across any interior landscape\./g, "Prepared from RayFancy product categories for distributors, contractors, OEM buyers, and project procurement.")
    .replace(/Series T Toggles/g, "Wall Switches")
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
<div class="aspect-[4/3] overflow-hidden"><img class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src="/assets/company/injection-workshop.jpg" alt="RayFancy production workshop"></div>
<div class="p-8">
<p class="font-label-caps text-label-caps text-heritage-gold mb-3">FACTORY CAPABILITY</p>
<h3 class="font-headline-md text-headline-md text-obsidian-black mb-3">Real workshop scenes and practical production support.</h3>
<p class="font-body-md text-body-md text-slate-gray">Show buyers how orders move from model matching to assembly and packing.</p>
</div>
</a>
<a class="group bg-white block tactile-shadow" href="/resources.html">
<div class="aspect-[4/3] overflow-hidden"><img class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src="/assets/company/mold-design.jpg" alt="RayFancy product resource support"></div>
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
<img class="w-full aspect-[4/5] object-cover tactile-shadow" src="/assets/company/copper-parts.jpg" alt="RayFancy copper parts">
<img class="w-full aspect-[4/5] object-cover tactile-shadow mt-12" src="/assets/company/testing.jpg" alt="RayFancy product testing">
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
  return html.replace("</head>", `<meta name="description" content="${description}">\n<meta property="og:title" content="${title}">\n<meta property="og:description" content="${description}">\n<style>\n  @font-face{font-family:'Azonix';src:url('/assets/fonts/Azonix.otf') format('opentype');font-weight:400;font-style:normal;font-display:swap;}\n  .rayfancy-fb-qr{width:120px;height:120px;object-fit:contain;background:#fff;border:1px solid rgba(83,98,113,.18);padding:6px;margin-top:12px;}\n  .rayfancy-mobile-nav summary::-webkit-details-marker{display:none;}\n  .rayfancy-hero-bg{object-position:68% 48%;animation:none;will-change:auto;filter:saturate(1.04) contrast(1.03);}\n  .rayfancy-edge-section{position:relative;overflow:hidden;background:#fff!important;}\n  .rayfancy-edge-section::before{display:none;}\n  .rayfancy-edge-badge{position:relative;border:1px solid rgba(184,151,91,.34);border-left:5px solid #b8975b;background:#101010;padding:30px 36px;min-width:430px;width:calc(430px + max(24px,(100vw - 1280px)/2));margin-right:calc(-1 * max(24px,(100vw - 1280px)/2));box-shadow:0 28px 70px rgba(18,30,42,.18);}\n  .rayfancy-edge-kicker{display:block;font-family:var(--font-headline),'Times New Roman',serif;font-size:44px;line-height:1.02;color:#d2b06d;letter-spacing:0;}\n  .rayfancy-edge-note{display:block;margin-top:14px;font-size:12px;line-height:1.5;letter-spacing:.22em;text-transform:uppercase;color:rgba(248,246,240,.76);}\n  .rayfancy-application-image{object-fit:contain!important;object-position:center center!important;background:#f3eee3;}
  .rayfancy-quote-card{width:260px!important;padding:28px 32px!important;background:rgba(35,49,61,.82)!important;border-left:4px solid #b8975b;backdrop-filter:blur(8px);}\n  .rayfancy-quote-card p{font-family:Georgia,'Times New Roman',serif!important;font-size:18px!important;line-height:1.55!important;letter-spacing:.08em;color:#f8f6f0!important;}\n  .rayfancy-kpi-number{font-family:Azonix,serif!important;font-size:46px!important;line-height:.95!important;letter-spacing:.12em;color:#d2b06d!important;text-shadow:0 10px 32px rgba(184,151,91,.24);}\n  .rayfancy-kpi-label{font-size:11px!important;letter-spacing:.3em!important;color:#f4f0e6!important;}\n  .rayfancy-resource-label{font-size:13px!important;letter-spacing:.18em!important;}\n  .rayfancy-submit-button{display:inline-flex!important;align-items:center;justify-content:center;width:100%;min-height:52px;padding:0 28px!important;background:#b8975b!important;color:#fff!important;white-space:nowrap;border:1px solid rgba(16,24,32,.18);box-shadow:0 14px 34px rgba(184,151,91,.28);font-size:14px!important;letter-spacing:.16em!important;}\n  .rayfancy-submit-button:hover{background:#d2b06d!important;color:#fff!important;}\n  .rayfancy-footer-brand{font-family:Azonix,serif!important;font-size:32px!important;line-height:1!important;letter-spacing:.03em;font-weight:400!important;color:#d2b06d!important;}
  .rayfancy-footer-copy{font-style:italic!important;letter-spacing:.02em;}\n  .rayfancy-social-icon{width:56px!important;height:56px!important;display:inline-flex!important;align-items:center;justify-content:center;border-color:transparent!important;color:#d2b06d!important;box-shadow:none!important;}\n  .rayfancy-social-icon .material-symbols-outlined{font-size:34px!important;color:#d2b06d!important;}\n  .rayfancy-footer-heading{font-size:18px!important;letter-spacing:.24em!important;color:#c8b27a!important;}\n  .rayfancy-footer-link{font-size:14px!important;line-height:1.45!important;color:#b4bfca!important;}
  .rayfancy-header-logo,.rayfancy-header-wordmark{filter:none;}\n  @keyframes rayfancyHeroDrift{from{transform:scale(1.02) translate3d(0,0,0);}to{transform:scale(1.08) translate3d(-18px,10px,0);}}\n  @media (prefers-reduced-motion: reduce){.rayfancy-hero-bg{animation:none;}}\n  @media (max-width: 1120px){.text-label-caps{font-size:10px!important;}.rayfancy-kpi-number{font-size:40px!important;}.rayfancy-edge-kicker{font-size:36px;}.rayfancy-edge-badge{min-width:360px;width:calc(360px + 24px);margin-right:-24px;padding:26px 30px;}}\n  @media (max-width: 768px){.px-margin-desktop{padding-left:20px!important;padding-right:20px!important}.text-display-lg{font-size:42px!important;line-height:50px!important}.text-headline-lg{font-size:34px!important;line-height:42px!important}.rayfancy-hero-bg{object-position:72% 50%;}.rayfancy-application-image{object-fit:contain!important;object-position:center center!important;background:#f3eee3;}
  .rayfancy-quote-card{width:220px!important;padding:22px 24px!important}.rayfancy-kpi-number{font-size:32px!important;}.rayfancy-social-icon{width:48px!important;height:48px!important;}}\n</style>\n</head>`);
}

function tuneHeroCopyLayout(html, out) {
  const heroPages = new Set(["index.html", "quality.html", "projects.html", "about.html"]);
  if (!heroPages.has(out)) {
    return html;
  }

  let next = html.replace(
    "</style>",
    `\n  .rayfancy-hero-copy{max-width:1040px!important;}\n  .rayfancy-hero-copy h1{font-size:clamp(72px,5.8vw,104px)!important;line-height:1.04!important;letter-spacing:-.02em!important;margin-bottom:28px!important;}\n  .rayfancy-hero-copy p{font-size:clamp(18px,1.35vw,22px)!important;line-height:1.5!important;max-width:760px!important;}\n  .rayfancy-about-hero-copy{grid-column:1 / -1!important;max-width:1120px!important;}\n  .rayfancy-about-hero-copy h1{font-size:clamp(68px,5.2vw,96px)!important;line-height:1.04!important;}\n  @media (max-width:768px){.rayfancy-hero-copy{max-width:100%!important}.rayfancy-hero-copy h1{font-size:42px!important;line-height:50px!important;margin-bottom:22px!important}.rayfancy-hero-copy p{font-size:17px!important;line-height:1.55!important}.rayfancy-about-hero-copy{grid-column:1 / -1!important}.rayfancy-about-hero-copy h1{font-size:40px!important;line-height:48px!important}}\n</style>`
  );

  if (out === "index.html") {
    next = next.replace(
      `<div class="max-w-2xl">\n<span class="inline-block font-label-caps text-label-caps text-heritage-gold mb-6 tracking-[0.2em]">B2B EXCELLENCE</span>`,
      `<div class="max-w-2xl rayfancy-hero-copy rayfancy-home-hero-copy">\n<span class="inline-block font-label-caps text-label-caps text-heritage-gold mb-6 tracking-[0.2em]">B2B EXCELLENCE</span>`
    );
  }
  if (out === "quality.html") {
    next = next.replace(
      `<div class="max-w-2xl text-white">\n<span class="font-label-caps text-label-caps text-heritage-gold mb-4 block rayfancy-quality-eyebrow">EXCELLENCE IN ENGINEERING</span>`,
      `<div class="max-w-2xl text-white rayfancy-hero-copy rayfancy-quality-hero-copy">\n<span class="font-label-caps text-label-caps text-heritage-gold mb-4 block rayfancy-quality-eyebrow">EXCELLENCE IN ENGINEERING</span>`
    );
  }
  if (out === "projects.html") {
    next = next.replace(
      `<div class="max-w-2xl">\n<span class="font-label-caps text-label-caps tracking-[0.3em] uppercase text-heritage-gold mb-6 block rayfancy-projects-eyebrow">Case Studies</span>`,
      `<div class="max-w-2xl rayfancy-hero-copy rayfancy-projects-hero-copy">\n<span class="font-label-caps text-label-caps tracking-[0.3em] uppercase text-heritage-gold mb-6 block rayfancy-projects-eyebrow">Case Studies</span>`
    );
  }
  if (out === "about.html") {
    next = next.replace(
      `<div class="md:col-span-8">\n<span class="font-label-caps text-label-caps text-heritage-gold mb-4 block rayfancy-about-hero-kicker">FACTORY DIRECT</span>`,
      `<div class="md:col-span-8 rayfancy-hero-copy rayfancy-about-hero-copy">\n<span class="font-label-caps text-label-caps text-heritage-gold mb-4 block rayfancy-about-hero-kicker">FACTORY DIRECT</span>`
    );
  }
  return next;
}

function addQualityPageStyles(html) {
  return html.replace("</style>", `\n  .rayfancy-quality-eyebrow{font-size:14px!important;letter-spacing:.24em!important;}\n  .rayfancy-quality-card{background:#172838;border:1px solid rgba(210,176,109,.22);box-shadow:0 24px 60px rgba(0,0,0,.22);}\n  .rayfancy-quality-card-media{height:210px;overflow:hidden;background:#0e1c29;}\n  .rayfancy-quality-card-img{width:100%;height:100%;object-fit:cover;filter:saturate(.96) contrast(1.03);}\n  .rayfancy-quality-card-content{position:relative;min-height:250px;padding:30px 34px 34px;background:linear-gradient(180deg,#1b3143,#132536);}\n  .rayfancy-quality-card .material-symbols-outlined{position:absolute;top:28px;right:30px;font-size:42px!important;opacity:.16!important;color:#d2b06d!important;}\n  .rayfancy-quality-docs{position:relative;overflow:hidden;background:#11150f!important;color:#fff;}\n  .rayfancy-quality-docs::before{content:\"\";position:absolute;inset:0;background:linear-gradient(90deg,rgba(17,21,15,.90),rgba(17,21,15,.66),rgba(17,21,15,.78)),url('/assets/products/premium-switch-closeup-202606072357.jpeg') center/cover no-repeat;}\n  .rayfancy-quality-docs>div{position:relative;z-index:1;}\n  .rayfancy-quality-docs h2,.rayfancy-quality-docs h4{color:#fff!important;}\n  .rayfancy-quality-docs p{color:rgba(255,255,255,.72)!important;}\n  .rayfancy-doc-icon{width:112px!important;height:112px!important;border:0!important;border-radius:0!important;background:rgba(255,255,255,.10)!important;backdrop-filter:blur(12px);box-shadow:inset 0 0 0 1px rgba(255,255,255,.10);}\n  .rayfancy-doc-icon span{color:#d2b06d!important;}\n  .rayfancy-quality-cta-card{background-image:linear-gradient(90deg,rgba(4,18,31,.88),rgba(4,18,31,.68),rgba(4,18,31,.22)),url('/assets/products/premium-architectural-202606080002.jpeg')!important;background-size:cover!important;background-position:center!important;}\n  .rayfancy-footer-social-plain{font-size:42px!important;opacity:.52!important;color:#d2b06d!important;filter:drop-shadow(0 12px 22px rgba(0,0,0,.24));}\n  .rayfancy-footer-social-plain:hover{opacity:.86!important;}\n  .rayfancy-quality-footer-heading{font-size:22px!important;letter-spacing:.24em!important;color:#d2b06d!important;}\n  .rayfancy-quality-footer-link{font-size:16px!important;line-height:1.45!important;color:rgba(255,255,255,.54)!important;}\n  .rayfancy-quality-footer-link:hover{color:#fff!important;}\n  .rayfancy-quality-flow{row-gap:28px!important;}\n  .rayfancy-quality-flow h4{font-size:12px!important;letter-spacing:.18em!important;}\n  .rayfancy-quality-flow p{font-size:15px!important;line-height:1.55!important;}\n  .rayfancy-quality-flow-dot{box-shadow:0 0 0 8px #f9f9f8!important;}\n  .rayfancy-quality-metric{font-size:52px!important;letter-spacing:.02em!important;color:#d2b06d!important;}\n  .rayfancy-quality-metric-title{font-size:12px!important;letter-spacing:.18em!important;color:#fff!important;}\n  .rayfancy-quality-metric-copy{font-size:16px!important;line-height:1.6!important;color:rgba(255,255,255,.68)!important;opacity:1!important;}\n  @media (max-width:768px){.rayfancy-quality-card-media{height:190px}.rayfancy-quality-card-content{min-height:auto;padding:26px}.rayfancy-quality-metric{font-size:42px!important}.rayfancy-quality-footer-heading{font-size:18px!important}.rayfancy-quality-footer-link{font-size:15px!important;}}\n</style>`);
}

function addAboutPageStyles(html) {
  return html.replace("</style>", `\n  .rayfancy-about-hero-bg{opacity:1!important;filter:saturate(.88) contrast(1.1) brightness(.46)!important;object-position:center;}\n  .rayfancy-about-hero-overlay{position:absolute;inset:0;background:linear-gradient(90deg,rgba(7,18,30,.82),rgba(7,18,30,.58),rgba(7,18,30,.28));}\n  .rayfancy-about-hero-kicker{font-size:14px!important;letter-spacing:.24em!important;}\n  .rayfancy-about-philosophy-img{filter:none!important;opacity:1!important;}\n  .rayfancy-about-material-card{position:relative;height:560px;background:#09131d;border:1px solid rgba(210,176,109,.18);box-shadow:0 28px 70px rgba(8,14,20,.28);overflow:hidden;}\n  .rayfancy-about-material-media{position:absolute;inset:0;height:100%;overflow:hidden;background:#07111b;}\n  .rayfancy-about-material-media::after{content:\"\";position:absolute;inset:0;background:linear-gradient(180deg,rgba(5,12,20,.18),rgba(5,12,20,.34));}\n  .rayfancy-about-material-img{width:100%;height:100%;object-fit:cover;opacity:1!important;filter:saturate(.96) contrast(1.03) brightness(1)!important;}\n  .rayfancy-about-material-content{position:relative;z-index:1;height:100%;padding:48px 42px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;background:transparent;}\n  .rayfancy-about-material-content h3{color:#fff!important;margin-bottom:18px!important;max-width:320px;text-shadow:0 8px 28px rgba(0,0,0,.55);}\n  .rayfancy-about-material-content p{max-width:300px;color:rgba(255,255,255,.82)!important;line-height:1.6!important;text-shadow:0 8px 24px rgba(0,0,0,.55);}\n  .rayfancy-about-product-copy{height:100%;min-height:380px;display:flex;flex-direction:column;justify-content:space-between;}\n  .rayfancy-about-product-copy h2{font-size:40px!important;line-height:1.08!important;margin-bottom:22px!important;}\n  .rayfancy-about-product-copy p{font-size:16px!important;line-height:1.55!important;margin-bottom:30px!important;max-width:440px;}\n  .rayfancy-about-spec-list{margin-bottom:28px!important;}\n  .rayfancy-about-spec-list li{padding-bottom:10px!important;}\n  .rayfancy-about-spec-list span{font-size:13px!important;line-height:1.35!important;}\n  .rayfancy-about-product-frame{height:380px;overflow:hidden;}\n  .rayfancy-about-product-img{width:100%;height:100%;aspect-ratio:auto;object-fit:cover;transform:scale(1.14);transform-origin:center;box-shadow:0 24px 60px rgba(20,30,40,.14);}\n  .rayfancy-about-footer-brand{font-family:Azonix,Montserrat,Arial,sans-serif!important;font-size:36px!important;line-height:1!important;font-weight:400!important;letter-spacing:.03em!important;color:#c8c0ae!important;}\n  .rayfancy-about-footer-copy{font-size:14px!important;line-height:1.5!important;}\n  .rayfancy-about-footer-heading{font-size:16px!important;letter-spacing:.24em!important;color:#d2b06d!important;}\n  .rayfancy-about-footer-social{margin-top:30px;display:flex;gap:24px;align-items:center;}\n  .rayfancy-about-footer-icon{font-size:42px!important;color:#d2b06d!important;opacity:.74!important;}\n  .rayfancy-about-footer-icon:hover{opacity:1!important;}\n  .rayfancy-about-chronicle{font-size:16px!important;letter-spacing:.28em!important;}\n  @media (max-width:768px){.rayfancy-about-material-card{height:420px}.rayfancy-about-material-content{padding:34px 28px}.rayfancy-about-product-copy{min-height:auto}.rayfancy-about-product-frame{height:280px}.rayfancy-about-footer-brand{font-size:30px!important}.rayfancy-about-chronicle{font-size:14px!important}.rayfancy-about-hero-kicker{font-size:13px!important;}}\n</style>`);
}

function addResourcesPageStyles(html) {
  return html.replace("</style>", `\n  .rayfancy-resources-hero-img{object-position:44% center!important;filter:saturate(.98) contrast(1.04) brightness(.98)!important;}\n  .rayfancy-resources-gold-button{background:#11150f!important;color:#fff!important;border-color:#11150f!important;box-shadow:0 16px 34px rgba(17,21,15,.18);}\n  .rayfancy-resources-gold-button:hover{background:#2a2f28!important;border-color:#2a2f28!important;color:#fff!important;}\n  .rayfancy-resources-filter{align-items:center;}\n  .rayfancy-resources-filter-active{background:#b8975b!important;color:#fff!important;border:1px solid #b8975b!important;font-size:11px!important;letter-spacing:.08em!important;}\n  .rayfancy-resources-filter-link{color:#b8975b!important;font-size:11px!important;letter-spacing:.08em!important;}\n  .rayfancy-resources-filter-link:hover{color:#11150f!important;border-color:#b8975b!important;}\n  .rayfancy-resources-material-panel{height:500px!important;padding:64px 56px!important;background:#f6f4ee!important;border-left:1px solid rgba(184,151,91,.24);display:flex!important;flex-direction:column!important;justify-content:center!important;}\n  .rayfancy-resources-material-panel p{max-width:440px!important;margin-bottom:42px!important;}\n  .rayfancy-resources-materials-title{font-size:34px!important;line-height:1.08!important;}\n  .rayfancy-resources-swatch-grid{display:grid!important;grid-template-columns:repeat(2,minmax(150px,1fr))!important;gap:24px 34px!important;align-items:center!important;}\n  .rayfancy-resources-swatch{display:grid!important;grid-template-columns:32px max-content!important;align-items:center!important;column-gap:14px!important;}\n  .rayfancy-resources-swatch div{grid-column:1;width:32px!important;height:32px!important;}\n  .rayfancy-resources-swatch span{grid-column:2;white-space:nowrap;}\n  .rayfancy-resources-footer-brand{font-family:Azonix,Montserrat,Arial,sans-serif!important;font-size:34px!important;line-height:1!important;font-weight:400!important;letter-spacing:.03em!important;color:#d2b06d!important;}\n  .rayfancy-resources-footer-heading{font-size:14px!important;letter-spacing:.24em!important;color:#d2b06d!important;}\n  .rayfancy-resources-footer-icon{font-size:30px!important;color:#d2b06d!important;opacity:.86!important;border:0!important;box-shadow:none!important;}\n  .rayfancy-resources-footer-icon:hover{opacity:1!important;color:#d2b06d!important;}\n  @media (max-width:900px){.rayfancy-resources-material-panel{height:auto!important;padding:42px 32px!important}.rayfancy-resources-swatch-grid{grid-template-columns:1fr!important;}}\n  @media (max-width:768px){.rayfancy-resources-hero-img{object-position:55% center!important}.rayfancy-resources-materials-title{font-size:28px!important}.rayfancy-resources-footer-brand{font-size:30px!important}.rayfancy-resources-filter-active,.rayfancy-resources-filter-link{font-size:10px!important;}}\n</style>`);
}

function addProjectsPageStyles(html) {
  return html.replace("</style>", `\n  .rayfancy-projects-hero-img{object-position:center!important;filter:saturate(.95) contrast(1.03) brightness(.72)!important;}\n  .rayfancy-projects-eyebrow{font-size:14px!important;letter-spacing:.32em!important;}\n  .rayfancy-projects-category{font-size:13px!important;letter-spacing:.2em!important;}\n  .rayfancy-projects-footer-brand{font-family:Azonix,Montserrat,Arial,sans-serif!important;font-size:34px!important;line-height:1!important;font-weight:400!important;letter-spacing:.03em!important;color:#d2b06d!important;}\n  .rayfancy-projects-footer-icon{font-size:34px!important;color:#d2b06d!important;opacity:.78!important;border:0!important;box-shadow:none!important;}\n  .rayfancy-projects-footer-icon:hover{opacity:1!important;}\n  .rayfancy-projects-footer-heading{font-size:18px!important;letter-spacing:.22em!important;color:#d2b06d!important;}\n  @media (max-width:768px){.rayfancy-projects-eyebrow{font-size:13px!important}.rayfancy-projects-footer-brand{font-size:30px!important}.rayfancy-projects-footer-heading{font-size:16px!important}.rayfancy-projects-footer-icon{font-size:30px!important;}}\n</style>`);
}

function addProductsPageStyles(html) {
  return html.replace("</style>", `\n  .rayfancy-product-finish-grid{display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr))!important;gap:16px!important;align-items:start!important;}\n  .rayfancy-product-swatch{display:flex!important;flex-direction:column!important;align-items:center!important;text-align:center!important;min-width:0!important;}\n  .rayfancy-product-swatch-dot{margin-left:auto!important;margin-right:auto!important;}\n  .rayfancy-product-swatch-label{width:100%!important;min-height:24px!important;display:flex!important;align-items:flex-start!important;justify-content:center!important;text-align:center!important;line-height:1.2!important;}\n  .rayfancy-products-footer-brand{font-family:Azonix,Montserrat,Arial,sans-serif!important;font-size:34px!important;line-height:1!important;font-weight:400!important;letter-spacing:.03em!important;color:#d2b06d!important;}\n  .rayfancy-products-footer-copy{font-style:italic!important;}\n  .rayfancy-products-footer-icon{font-size:32px!important;color:#d2b06d!important;border:0!important;box-shadow:none!important;background:transparent!important;}\n  .rayfancy-products-footer-heading{font-size:14px!important;letter-spacing:.18em!important;color:#d2b06d!important;}\n  .rayfancy-products-footer-link{font-size:14px!important;line-height:1.4!important;}\n  .rayfancy-products-copyright{font-size:10px!important;font-weight:400!important;letter-spacing:.08em!important;text-align:left!important;opacity:.48!important;}\n  @media (max-width:768px){.rayfancy-products-footer-brand{font-size:30px!important}.rayfancy-product-finish-grid{gap:12px!important}.rayfancy-products-footer-heading{font-size:13px!important}}\n</style>`);
}

function tuneHomepageHero(html) {
  return html
    .replace(
      /<div class="absolute inset-0 z-0">\s*<img alt="Tactile Excellence" class="w-full h-full object-cover" src="\/assets\/products\/a6-thailand-socket\.jpg"\/>/,
      `<div class="absolute inset-0 z-0 bg-[#f4f4f2]">\n<img alt="RayFancy product macro detail" class="rayfancy-hero-bg w-full h-full object-cover" src="/assets/products/product-macro-hero.jpg"/>`
    )
    .replace(
      /<div class="absolute inset-0 bg-gradient-to-r from-surface via-surface\/60 to-transparent"><\/div>/,
      `<div class="absolute inset-0 bg-gradient-to-r from-surface via-surface/70 to-surface/10"></div>`
    );
}

function tuneLatestHomepageVisuals(html) {
  return html
    .replace(/<!-- Brand Identity: The RayFancy Edge -->\s*<section class="py-section-gap bg-surface">/, `<!-- Brand Identity: The RayFancy Edge -->\n<section class="py-section-gap bg-surface rayfancy-edge-section">`)
    .replace(
      /<div class="hidden md:block">\s*<span class="font-headline-lg text-headline-lg text-outline-stroke">DIRECT SUPPLY<\/span>\s*<\/div>/,
      `<div class="hidden md:block rayfancy-edge-badge">\n<span class="rayfancy-edge-kicker">DIRECT SUPPLY</span>\n<span class="rayfancy-edge-note">Factory communication · sample clarity · OEM support</span>\n</div>`
    )
    .replace(
      /<div class="absolute -bottom-8 -left-8 bg-slate-gray p-12">\s*<p class="font-headline-md text-white italic max-w-\[200px\]">"Real products, clear samples, practical supply\."<\/p>\s*<\/div>/,
      `<div class="absolute -bottom-6 -left-6 bg-slate-gray p-8 rayfancy-quote-card">\n<p class="font-headline-md text-white italic max-w-[200px]">"Real products, clear samples, practical supply."</p>\n</div>`
    )
    .replace(/<p class="font-headline-lg text-headline-lg text-heritage-gold mb-2">B2B<\/p>/, `<p class="font-headline-lg text-headline-lg text-heritage-gold mb-2 rayfancy-kpi-number">B2B</p>`)
    .replace(/<p class="font-headline-lg text-headline-lg text-heritage-gold mb-2">OEM<\/p>/, `<p class="font-headline-lg text-headline-lg text-heritage-gold mb-2 rayfancy-kpi-number">OEM</p>`)
    .replace(/<p class="font-headline-lg text-headline-lg text-heritage-gold mb-2">A6<\/p>/, `<p class="font-headline-lg text-headline-lg text-heritage-gold mb-2 rayfancy-kpi-number">QC</p>`)
    .replace(/<p class="font-label-caps text-label-caps text-white">Trade Support<\/p>/, `<p class="font-label-caps text-label-caps text-white rayfancy-kpi-label">Trade Support</p>`)
    .replace(/<p class="font-label-caps text-label-caps text-white">Packaging<\/p>/, `<p class="font-label-caps text-label-caps text-white rayfancy-kpi-label">Packaging</p>`)
    .replace(/<p class="font-label-caps text-label-caps text-white">Series<\/p>/, `<p class="font-label-caps text-label-caps text-white rayfancy-kpi-label">Order Check</p>`)
    .replace(/<p class="font-label-caps text-label-caps text-xs">Trade Support<\/p>/, `<p class="font-label-caps text-label-caps text-xs rayfancy-kpi-label">Trade Support</p>`)
    .replace(/<p class="font-label-caps text-label-caps text-xs">Packaging<\/p>/, `<p class="font-label-caps text-label-caps text-xs rayfancy-kpi-label">Packaging</p>`)
    .replace(/<p class="font-label-caps text-label-caps text-xs">Series<\/p>/, `<p class="font-label-caps text-label-caps text-xs rayfancy-kpi-label">Order Check</p>`)
    .replace(/<img class="w-full h-full object-cover"([^>]+src="\/assets\/products\/application-scene\.jpg")/, `<img class="w-full h-full object-cover rayfancy-application-image"$1`)
    .replace(/<a class="w-full bg-primary text-white font-label-caps text-label-caps py-5 hover:bg-heritage-gold transition-all duration-300" href="mailto:rayfancycn@gmail.com">Submit Trade Inquiry<\/a>/, `<a class="w-full bg-primary text-white font-label-caps text-label-caps py-5 hover:bg-heritage-gold transition-all duration-300 rayfancy-submit-button" href="mailto:rayfancycn@gmail.com">Submit Trade Inquiry</a>`)
    .replace(/<span class="font-headline-md text-headline-md text-heritage-gold">RayFancy<\/span>/, `<span class="font-headline-md text-headline-md text-heritage-gold rayfancy-footer-brand">RayFancy</span>`)
    .replace(/<p class="font-body-md text-body-md text-on-primary-container max-w-xs mb-8">/, `<p class="font-body-md text-body-md text-on-primary-container max-w-xs mb-8 rayfancy-footer-copy">`)
    .replace(/<a class="w-(?:10|14) h-(?:10|14) border border-on-primary-container\/(?:20|30) flex items-center justify-center hover:(?:bg-heritage-gold hover:text-primary|border-heritage-gold hover:text-heritage-gold) transition-colors" href="\/contact\.html">\s*<span class="material-symbols-outlined text-sm">share<\/span>\s*<\/a>/, `<a class="w-10 h-10 border border-on-primary-container/30 flex items-center justify-center hover:border-heritage-gold hover:text-heritage-gold transition-colors rayfancy-social-icon" href="/contact.html">\n<span class="material-symbols-outlined text-sm">share</span>\n</a>`)
    .replace(/<a class="w-(?:10|14) h-(?:10|14) border border-on-primary-container\/(?:20|30) flex items-center justify-center hover:(?:bg-heritage-gold hover:text-primary|border-heritage-gold hover:text-heritage-gold) transition-colors" href="\/contact\.html">\s*<span class="material-symbols-outlined text-sm">language<\/span>\s*<\/a>/, `<a class="w-10 h-10 border border-on-primary-container/30 flex items-center justify-center hover:border-heritage-gold hover:text-heritage-gold transition-colors rayfancy-social-icon" href="/contact.html">\n<span class="material-symbols-outlined text-sm">language</span>\n</a>`)
    .replace(/<span class="font-label-caps text-label-caps text-heritage-gold mb-6 block">RESOURCE CENTER<\/span>/, `<span class="font-label-caps text-label-caps text-heritage-gold mb-6 block rayfancy-resource-label">RESOURCE CENTER</span>`)
    .replace(/class="font-label-caps text-label-caps text-heritage-gold mb-6"/g, `class="font-label-caps text-label-caps text-heritage-gold mb-6 rayfancy-footer-heading"`)
    .replace(/class="font-body-md text-body-md text-on-primary-container hover:text-white transition-colors"/g, `class="font-body-md text-body-md text-on-primary-container hover:text-white transition-colors rayfancy-footer-link"`);
}

function tuneQualityPage(html) {
  const qualityFlow = `<!-- Switch Quality Control Process -->
<section class="py-section-gap bg-off-white">
<div class="max-w-container-max mx-auto px-margin-desktop">
<div class="grid md:grid-cols-2 gap-gutter items-start">
<div>
<h2 class="font-headline-lg text-headline-lg mb-8">The 8-Step Switch Inspection Process</h2>
<p class="font-body-md text-body-md text-secondary mb-12 max-w-md">
                        Each switch is checked from incoming parts to final packing, so buyers can review appearance, click feel, safety details, and order consistency before bulk shipment.
                    </p>
</div>
<div class="space-y-12 relative border-l-2 border-heritage-gold/20 pl-8 ml-4 rayfancy-quality-flow">
<div class="relative group">
<div class="absolute -left-[41px] top-0 w-4 h-4 rounded-full bg-heritage-gold ring-4 ring-off-white rayfancy-quality-flow-dot"></div>
<h4 class="font-label-caps text-label-caps text-heritage-gold">01. INCOMING MATERIAL CHECK</h4>
<p class="font-body-md text-body-md mt-2">Key parts are checked against the confirmed product model.</p>
</div>
<div class="relative group">
<div class="absolute -left-[41px] top-0 w-4 h-4 rounded-full bg-heritage-gold ring-4 ring-off-white rayfancy-quality-flow-dot"></div>
<h4 class="font-label-caps text-label-caps text-heritage-gold">02. HOUSING AND PANEL REVIEW</h4>
<p class="font-body-md text-body-md mt-2">Surface, color, logo, and edge quality are reviewed.</p>
</div>
<div class="relative group">
<div class="absolute -left-[41px] top-0 w-4 h-4 rounded-full bg-heritage-gold ring-4 ring-off-white rayfancy-quality-flow-dot"></div>
<h4 class="font-label-caps text-label-caps text-heritage-gold">03. TERMINAL FIT CHECK</h4>
<p class="font-body-md text-body-md mt-2">Terminals and conductive parts are checked for stable fit.</p>
</div>
<div class="relative group">
<div class="absolute -left-[41px] top-0 w-4 h-4 rounded-full bg-heritage-gold ring-4 ring-off-white rayfancy-quality-flow-dot"></div>
<h4 class="font-label-caps text-label-caps text-heritage-gold">04. SWITCH FEEL TEST</h4>
<p class="font-body-md text-body-md mt-2">Click feel, movement, and reset response are tested.</p>
</div>
<div class="relative group">
<div class="absolute -left-[41px] top-0 w-4 h-4 rounded-full bg-heritage-gold ring-4 ring-off-white rayfancy-quality-flow-dot"></div>
<h4 class="font-label-caps text-label-caps text-heritage-gold">05. ELECTRICAL FUNCTION TEST</h4>
<p class="font-body-md text-body-md mt-2">Samples are connected to confirm basic on/off function.</p>
</div>
<div class="relative group">
<div class="absolute -left-[41px] top-0 w-4 h-4 rounded-full bg-heritage-gold ring-4 ring-off-white rayfancy-quality-flow-dot"></div>
<h4 class="font-label-caps text-label-caps text-heritage-gold">06. LOAD AND HEAT REVIEW</h4>
<p class="font-body-md text-body-md mt-2">Selected models can be reviewed under agreed test conditions.</p>
</div>
<div class="relative group">
<div class="absolute -left-[41px] top-0 w-4 h-4 rounded-full bg-heritage-gold ring-4 ring-off-white rayfancy-quality-flow-dot"></div>
<h4 class="font-label-caps text-label-caps text-heritage-gold">07. PACKAGING INSPECTION</h4>
<p class="font-body-md text-body-md mt-2">Labels, cartons, and OEM details are checked before shipment.</p>
</div>
<div class="relative group">
<div class="absolute -left-[41px] top-0 w-4 h-4 rounded-full bg-heritage-gold ring-4 ring-off-white rayfancy-quality-flow-dot"></div>
<h4 class="font-label-caps text-label-caps text-heritage-gold">08. FINAL RANDOM CHECK</h4>
<p class="font-body-md text-body-md mt-2">Finished goods are randomly reviewed before release.</p>
</div>
</div>
</div>
</div>
</section>`;

  const benchmarks = `<!-- Testing Benchmarks -->
<section class="py-section-gap bg-primary text-white overflow-hidden">
<div class="max-w-container-max mx-auto px-margin-desktop">
<div class="mb-16 max-w-3xl">
<p class="font-label-caps text-label-caps text-heritage-gold mb-5 tracking-[0.2em]">QUALITY TESTING</p>
<h2 class="font-headline-lg text-headline-lg">Technical Benchmarks</h2>
<p class="font-body-lg text-body-lg text-on-primary-container mt-6">The core checks focus on switch endurance, material safety, and conductive parts. Background images show the related test scene so the section feels more concrete and premium.</p>
<div class="w-24 h-1 bg-heritage-gold mt-8"></div>
</div>
<div class="grid md:grid-cols-3 gap-8">
<div class="overflow-hidden rayfancy-quality-card">
<div class="rayfancy-quality-card-media">
<img class="rayfancy-quality-card-img" src="/assets/company/click-cycle-test-202606082234.jpeg" alt="Switch click cycle testing">
</div>
<div class="rayfancy-quality-card-content">
<div class="text-heritage-gold font-display-lg text-5xl mb-4 rayfancy-quality-metric">100k+</div>
<h3 class="font-label-caps text-label-caps mb-4 rayfancy-quality-metric-title">CLICK CYCLE TESTING</h3>
<p class="font-body-md text-body-md opacity-80 leading-relaxed rayfancy-quality-metric-copy">Switch feel, component fit, and mechanical structure can be reviewed through sample confirmation before bulk orders.</p>
<span class="material-symbols-outlined">sync</span>
</div>
</div>
<div class="overflow-hidden rayfancy-quality-card">
<div class="rayfancy-quality-card-media">
<img class="rayfancy-quality-card-img" src="/assets/company/flame-test-202606082235.jpeg" alt="Flame retardant material testing">
</div>
<div class="rayfancy-quality-card-content">
<div class="text-heritage-gold font-display-lg text-5xl mb-4 rayfancy-quality-metric">V0</div>
<h3 class="font-label-caps text-label-caps mb-4 rayfancy-quality-metric-title">FLAME RETARDANT PC</h3>
<p class="font-body-md text-body-md opacity-80 leading-relaxed rayfancy-quality-metric-copy">Material options and housing requirements can be discussed by product model and target market.</p>
<span class="material-symbols-outlined">local_fire_department</span>
</div>
</div>
<div class="overflow-hidden rayfancy-quality-card">
<div class="rayfancy-quality-card-media">
<img class="rayfancy-quality-card-img" src="/assets/company/contact-parts-202606082243.jpeg" alt="Copper and contact parts">
</div>
<div class="rayfancy-quality-card-content">
<div class="text-heritage-gold font-display-lg text-5xl mb-4 rayfancy-quality-metric">AgNi</div>
<h3 class="font-label-caps text-label-caps mb-4 rayfancy-quality-metric-title">SILVER ALLOY CONTACTS</h3>
<p class="font-body-md text-body-md opacity-80 leading-relaxed rayfancy-quality-metric-copy">Contact structure and conductive components are matched by product model, cost target, and application scenario.</p>
<span class="material-symbols-outlined">bolt</span>
</div>
</div>
</div>
</div>
</section>`;

  return html
    .replace(/<img alt="Technical Laboratory" class="absolute inset-0 w-full h-full object-cover" src="\/assets\/company\/testing\.jpg"\/>/, `<img alt="RayFancy switch quality laboratory" class="absolute inset-0 w-full h-full object-cover" src="/assets/company/quality-lab-202606082239.jpeg"/>`)
    .replace(/<span class="font-label-caps text-label-caps text-heritage-gold mb-4 block">EXCELLENCE IN ENGINEERING<\/span>/, `<span class="font-label-caps text-label-caps text-heritage-gold mb-4 block rayfancy-quality-eyebrow">EXCELLENCE IN ENGINEERING</span>`)
    .replace(/<!-- 8-Step Polishing Process -->[\s\S]*?<\/section>\s*<!-- Testing Benchmarks -->/, `${qualityFlow}\n<!-- Testing Benchmarks -->`)
    .replace(/<!-- Testing Benchmarks -->[\s\S]*?<\/section>\s*<!-- Compliance Section -->/, `${benchmarks}\n<!-- Compliance Section -->`)
    .replace(/<section class="py-section-gap bg-surface">/, `<section class="py-section-gap bg-surface rayfancy-quality-docs">`)
    .replace(/<div class="w-24 h-24 mb-6 flex items-center justify-center border border-outline-variant\/30 rounded-full grayscale hover:grayscale-0 transition-all">/g, `<div class="w-24 h-24 mb-6 flex items-center justify-center border border-outline-variant/30 rounded-full grayscale hover:grayscale-0 transition-all rayfancy-doc-icon">`)
    .replace(/<div class="bg-obsidian-black text-white p-12 md:p-24 relative overflow-hidden">/, `<div class="bg-obsidian-black text-white p-12 md:p-24 relative overflow-hidden rayfancy-quality-cta-card">`)
    .replace(/<div class="absolute top-0 right-0 w-1\/2 h-full opacity-20 hidden md:block">[\s\S]*?<\/div>\s*<div class="relative z-10 max-w-xl">/, `<div class="relative z-10 max-w-xl">`)
    .replace(/<div class="font-headline-md text-headline-md text-heritage-gold mb-6">RayFancy<\/div>/, `<div class="font-headline-md text-headline-md text-heritage-gold mb-6 rayfancy-footer-brand">RayFancy</div>`)
    .replace(/<span class="material-symbols-outlined text-heritage-gold cursor-pointer">(public|mail|share)<\/span>/g, `<span class="material-symbols-outlined text-heritage-gold cursor-pointer rayfancy-footer-social-plain">$1</span>`)
    .replace(/<h5 class="font-label-caps text-label-caps text-heritage-gold">/g, `<h5 class="font-label-caps text-label-caps text-heritage-gold rayfancy-quality-footer-heading">`)
    .replace(/<a class="text-on-primary-container hover:text-white transition-colors"/g, `<a class="text-on-primary-container hover:text-white transition-colors rayfancy-quality-footer-link"`);
}

function tuneAboutPage(html) {
  return html
    .replace(
      /<img class="w-full h-full object-cover grayscale opacity-20"([^>]+src="\/assets\/company\/mold-design\.jpg")>/,
      `<img class="w-full h-full object-cover grayscale opacity-20 rayfancy-about-hero-bg" data-alt="RayFancy production detail" src="/assets/company/about-hero-202606082237.jpeg">\n<div class="rayfancy-about-hero-overlay"></div>`
    )
    .replace(
      /<span class="font-label-caps text-label-caps text-heritage-gold mb-4 block">FACTORY DIRECT<\/span>/,
      `<span class="font-label-caps text-label-caps text-heritage-gold mb-4 block rayfancy-about-hero-kicker">FACTORY DIRECT</span>`
    )
    .replace(
      /<p class="font-body-lg text-body-lg max-w-xl text-on-surface-variant">/,
      `<p class="font-body-lg text-body-lg max-w-xl text-white/75">`
    )
    .replace(
      /<h1 class="font-display-lg text-display-lg md:text-\[84px\] leading-tight mb-8">/,
      `<h1 class="font-display-lg text-display-lg md:text-[84px] leading-tight mb-8 text-white">`
    )
    .replace(
      /<img class="w-full grayscale h-\[500px\] object-cover"([^>]+src="\/assets\/company\/testing\.jpg")>/,
      `<img class="w-full h-[500px] object-cover rayfancy-about-philosophy-img" data-alt="RayFancy switch component machining detail" src="/assets/company/about-machine-detail-202606082238.jpeg">`
    )
    .replace(
      /<img class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"([^>]+src="\/assets\/company\/copper-parts\.jpg")>/,
      `<img class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 rayfancy-about-material-img" data-alt="RayFancy press workshop" src="/assets/company/about-press-workshop-06e299.jpeg">`
    )
    .replace(
      /<img class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 grayscale"([^>]+src="\/assets\/company\/injection-workshop\.jpg")>/,
      `<img class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 rayfancy-about-material-img" data-alt="RayFancy injection workshop" src="/assets/company/about-injection-202606082240.jpeg">`
    )
    .replace(
      /<img class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"([^>]+src="\/assets\/company\/packing-workshop\.jpg")>/,
      `<img class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 rayfancy-about-material-img" data-alt="RayFancy assembly workshop" src="/assets/company/about-assembly-workshop-202606082243.jpeg">`
    )
    .replace(
      /<div class="group relative h-\[600px\] overflow-hidden">\s*(<img[^>]+about-press-workshop-06e299\.jpeg[^>]+>)\s*<div class="absolute inset-0 bg-black\/40 p-12 flex flex-col justify-end">/,
      `<div class="group rayfancy-about-material-card">\n<div class="rayfancy-about-material-media">\n$1\n</div>\n<div class="rayfancy-about-material-content">`
    )
    .replace(
      /<div class="group relative h-\[600px\] overflow-hidden">\s*(<img[^>]+about-injection-202606082240\.jpeg[^>]+>)\s*<div class="absolute inset-0 bg-heritage-gold\/20 p-12 flex flex-col justify-end">/,
      `<div class="group rayfancy-about-material-card">\n<div class="rayfancy-about-material-media">\n$1\n</div>\n<div class="rayfancy-about-material-content">`
    )
    .replace(
      /<div class="group relative h-\[600px\] overflow-hidden">\s*(<img[^>]+about-assembly-workshop-202606082243\.jpeg[^>]+>)\s*<div class="absolute inset-0 bg-black\/40 p-12 flex flex-col justify-end">/,
      `<div class="group rayfancy-about-material-card">\n<div class="rayfancy-about-material-media">\n$1\n</div>\n<div class="rayfancy-about-material-content">`
    )
    .replace(/<h2 class="font-headline-lg text-headline-lg mb-8">THE A6 SERIES\.<\/h2>/, `<h2 class="font-headline-lg text-headline-lg mb-8">PRACTICAL SWITCH &amp; SOCKET SUPPLY.</h2>`)
    .replace(
      /<!-- Product Highlight Card \(Tactile Shadow\) -->[\s\S]*?<div class="relative z-10">/,
      (match) => match.replace(`<div class="relative z-10">`, `<div class="relative z-10 rayfancy-about-product-copy">`)
    )
    .replace(
      /A practical wall switch and socket series for distributor catalogs, project matching, and OEM packaging programs\./,
      "A flexible product range prepared for distributor catalogs, project matching, sample review, and OEM packaging discussion."
    )
    .replace(/<ul class="space-y-4 mb-12">/, `<ul class="space-y-4 mb-12 rayfancy-about-spec-list">`)
    .replace(
      /<div class="relative">\s*<div class="absolute -inset-10 bg-surface-container rounded-full opacity-50 scale-0 group-hover:scale-100 transition-transform duration-1000"><\/div>\s*<img class="w-full relative z-10"([^>]+src="\/assets\/products\/a6-1gang-switch\.jpg")>\s*<\/div>/,
      `<div class="relative rayfancy-about-product-frame">\n<div class="absolute -inset-10 bg-surface-container rounded-full opacity-50 scale-0 group-hover:scale-100 transition-transform duration-1000"></div>\n<img class="w-full relative z-10 rayfancy-about-product-img" data-alt="RayFancy wall switch and socket product collection" src="/assets/products/about-switch-collection-still095.png">\n</div>`
    )
    .replace(/<span class="font-label-caps text-label-caps text-heritage-gold mb-4 block">THE CHRONICLE<\/span>/, `<span class="font-label-caps text-label-caps text-heritage-gold mb-4 block rayfancy-about-chronicle">THE CHRONICLE</span>`)
    .replace(/<h4 class="font-headline-md text-headline-md mb-4 uppercase">The First Forge<\/h4>/, `<h4 class="font-headline-md text-headline-md mb-4 uppercase">Model Matching</h4>`)
    .replace(/<h4 class="font-headline-md text-headline-md mb-4 uppercase">The Domestic Shift<\/h4>/, `<h4 class="font-headline-md text-headline-md mb-4 uppercase">Sample Confirmation</h4>`)
    .replace(/<h4 class="font-headline-md text-headline-md mb-4 uppercase">Material Renaissance<\/h4>/, `<h4 class="font-headline-md text-headline-md mb-4 uppercase">Production Inspection</h4>`)
    .replace(/RayFancy introduces specialized ceramic and rare metal finishes, defying the global trend toward plastic components\./, `Prepare parts, assemble products, review appearance and function, then coordinate packing according to confirmed order details.`)
    .replace(/<h4 class="font-headline-md text-headline-md mb-4 uppercase">The Silent Majority<\/h4>/, `<h4 class="font-headline-md text-headline-md mb-4 uppercase">Repeat Supply</h4>`)
    .replace(/<div class="font-headline-md text-headline-md text-off-white mb-6">RAYFANCY<\/div>/, `<div class="font-headline-md text-headline-md text-off-white mb-6 rayfancy-about-footer-brand">RAYFANCY</div>`)
    .replace(/<h4 class="font-label-caps text-label-caps text-heritage-gold mb-2">/g, `<h4 class="font-label-caps text-label-caps text-heritage-gold mb-2 rayfancy-about-footer-heading">`)
    .replace(/<p class="text-primary-fixed-dim max-w-sm mb-8 font-body-md">/, `<p class="text-primary-fixed-dim max-w-sm mb-8 font-body-md rayfancy-about-footer-copy">`)
    .replace(/(<p class="text-primary-fixed-dim max-w-sm mb-8 font-body-md rayfancy-about-footer-copy">[\s\S]*?<\/p>)/, `$1\n<div class="rayfancy-about-footer-social">\n<span class="material-symbols-outlined cursor-pointer hover:text-heritage-gold transition-colors rayfancy-about-footer-icon">hub</span>\n<span class="material-symbols-outlined cursor-pointer hover:text-heritage-gold transition-colors rayfancy-about-footer-icon">camera</span>\n</div>`)
    .replace(/<div class="mt-8 flex gap-4">\s*<span class="material-symbols-outlined text-off-white cursor-pointer hover:text-heritage-gold transition-colors">hub<\/span>\s*<span class="material-symbols-outlined text-off-white cursor-pointer hover:text-heritage-gold transition-colors">camera<\/span>\s*<\/div>/, ``);
}

function tuneResourcesPage(html) {
  return html
    .replace(
      /<img alt="Technical workspace with architectural CAD models and dual monitor setup" class="w-full h-full object-cover" src="\/assets\/company\/mold-design\.jpg"\/>/,
      `<img alt="Premium interior with RayFancy wall switch" class="w-full h-full object-cover rayfancy-resources-hero-img" src="/assets/products/resources-hero-202606072359.jpeg?v=20260610"/>`
    )
    .replace(
      /<a class="bg-obsidian-black text-white px-8 py-4 font-label-caps text-label-caps uppercase tracking-widest hover:bg-opacity-90 transition-all" href="\/resources\.html">Explore Assets<\/a>/,
      `<a class="bg-obsidian-black text-white px-8 py-4 font-label-caps text-label-caps uppercase tracking-widest hover:bg-opacity-90 transition-all rayfancy-resources-gold-button" href="/resources.html">Explore Assets</a>`
    )
    .replace(
      /<div class="flex gap-4 overflow-x-auto pb-2 md:pb-0">/,
      `<div class="flex gap-4 overflow-x-auto pb-2 md:pb-0 rayfancy-resources-filter">`
    )
    .replace(
      /<button class="bg-primary text-white px-5 py-2 text-\[10px\] font-bold uppercase tracking-tighter">All Files<\/button>/,
      `<button class="bg-primary text-white px-5 py-2 text-[10px] font-bold uppercase tracking-tighter rayfancy-resources-filter-active">All Files</button>`
    )
    .replace(
      /<button class="text-secondary hover:text-primary px-5 py-2 text-\[10px\] font-bold uppercase tracking-tighter border border-transparent hover:border-outline-variant transition-all">(Revit|AutoCAD|Specifications)<\/button>/g,
      `<button class="text-secondary hover:text-primary px-5 py-2 text-[10px] font-bold uppercase tracking-tighter border border-transparent hover:border-outline-variant transition-all rayfancy-resources-filter-link">$1</button>`
    )
    .replace(
      /<h3 class="font-headline-md text-headline-md text-primary mb-6">Materials &amp; Finishes<\/h3>/,
      `<h3 class="font-headline-md text-headline-md text-primary mb-6 rayfancy-resources-materials-title">Materials &amp; Finishes</h3>`
    )
    .replace(
      /<div class="md:col-span-5 flex flex-col justify-center bg-off-white p-12">/,
      `<div class="md:col-span-5 flex flex-col justify-center bg-off-white p-12 rayfancy-resources-material-panel">`
    )
    .replace(
      /<div class="flex flex-wrap gap-4">/,
      `<div class="flex flex-wrap gap-4 rayfancy-resources-swatch-grid">`
    )
    .replace(
      /<div class="flex items-center gap-3">\s*<div class="w-8 h-8 rounded-full bg-\[#E5E4E2\] border border-outline-variant"><\/div>/,
      `<div class="flex items-center gap-3 rayfancy-resources-swatch">\n<div class="w-8 h-8 rounded-full bg-[#E5E4E2] border border-outline-variant"></div>`
    )
    .replace(
      /<div class="flex items-center gap-3">\s*<div class="w-8 h-8 rounded-full bg-\[#B5A27A\] border border-outline-variant"><\/div>/,
      `<div class="flex items-center gap-3 rayfancy-resources-swatch">\n<div class="w-8 h-8 rounded-full bg-[#B5A27A] border border-outline-variant"></div>`
    )
    .replace(
      /<div class="flex items-center gap-3">\s*<div class="w-8 h-8 rounded-full bg-\[#2C2C2B\] border border-outline-variant"><\/div>/,
      `<div class="flex items-center gap-3 rayfancy-resources-swatch">\n<div class="w-8 h-8 rounded-full bg-[#2C2C2B] border border-outline-variant"></div>`
    )
    .replace(
      /<div class="flex items-center gap-3">\s*<div class="w-8 h-8 rounded-full bg-white border border-outline-variant"><\/div>/,
      `<div class="flex items-center gap-3 rayfancy-resources-swatch">\n<div class="w-8 h-8 rounded-full bg-white border border-outline-variant"></div>`
    )
    .replace(
      /(<div class="flex items-center gap-3 rayfancy-resources-swatch">\s*<div class="w-8 h-8 rounded-full bg-\[#2C2C2B\] border border-outline-variant"><\/div>\s*<span class="font-label-caps text-label-caps text-primary">Matte Obsidian<\/span>\s*<\/div>)/,
      (match) => html.includes("Clean White")
        ? match
        : `${match}\n<div class="flex items-center gap-3 rayfancy-resources-swatch">\n<div class="w-8 h-8 rounded-full bg-white border border-outline-variant"></div>\n<span class="font-label-caps text-label-caps text-primary">Clean White</span>\n</div>`
    )
    .replace(
      /href="\/contact\.html">Become a Partner<\/a>/,
      `href="/contact.html#trade-inquiry">Become a Partner</a>`
    )
    .replace(
      /href="\/contact\.html">Member Sign-in<\/a>/,
      `href="/contact.html#trade-inquiry">Member Sign-in</a>`
    )
    .replace(
      /<div class="font-headline-md text-headline-md text-heritage-gold mb-8">RayFancy<\/div>/,
      `<div class="font-headline-md text-headline-md text-heritage-gold mb-8 rayfancy-resources-footer-brand">RayFancy</div>`
    )
    .replace(
      /<h4 class="text-white font-label-caps text-label-caps tracking-widest uppercase mb-2">(Navigation|Legal)<\/h4>/g,
      `<h4 class="text-white font-label-caps text-label-caps tracking-widest uppercase mb-2 rayfancy-resources-footer-heading">$1</h4>`
    )
    .replace(
      /<a class="text-on-primary hover:text-heritage-gold transition-colors" href="\/contact\.html"><span class="material-symbols-outlined">(public|mail|share)<\/span><\/a>/g,
      `<a class="text-on-primary hover:text-heritage-gold transition-colors" href="/contact.html"><span class="material-symbols-outlined rayfancy-resources-footer-icon">$1</span></a>`
    );
}

function tuneProjectsPage(html) {
  return html
    .replace(
      /<img alt="Luxury Hotel Project Portfolio" class="w-full h-full object-cover grayscale-\[20%\] brightness-\[85%\]" src="\/assets\/company\/office\.jpg"\/>/,
      `<img alt="RayFancy premium lifestyle project scene" class="w-full h-full object-cover grayscale-[20%] brightness-[85%] rayfancy-projects-hero-img" src="/assets/products/projects-hero-lifestyle-202606080002.jpeg?v=20260610"/>`
    )
    .replace(
      /<span class="font-label-caps text-label-caps tracking-\[0\.3em\] uppercase text-heritage-gold mb-6 block">Case Studies<\/span>/,
      `<span class="font-label-caps text-label-caps tracking-[0.3em] uppercase text-heritage-gold mb-6 block rayfancy-projects-eyebrow">Case Studies</span>`
    )
    .replace(
      /<img class="project-image w-full h-\[500px\] object-cover tactile-shadow"([^>]+)src="\/assets\/products\/a6-switch-socket-combo\.jpg"\/>/,
      `<img class="project-image w-full h-[500px] object-cover tactile-shadow" data-alt="Premium architectural interior project scene" src="/assets/products/projects-feature-architectural-202606072358.jpeg"/>`
    )
    .replace(
      /<img class="project-image w-full h-\[400px\] object-cover tactile-shadow"([^>]+)src="\/assets\/company\/injection-workshop\.jpg"\/>/,
      `<img class="project-image w-full h-[400px] object-cover tactile-shadow" data-alt="Premium website hero project scene" src="/assets/products/projects-commercial-hero-202606080007.jpeg"/>`
    )
    .replace(
      /<img class="project-image w-full h-\[400px\] object-cover tactile-shadow"([^>]+)src="\/assets\/products\/a6-1gang-switch\.jpg"\/>/,
      `<img class="project-image w-full h-[400px] object-cover tactile-shadow" data-alt="High-end luxury interior project scene" src="/assets/products/projects-luxury-interior-202606080008.jpeg"/>`
    )
    .replace(
      /<span class="font-label-caps text-label-caps text-heritage-gold mb-2">(Hospitality|Commercial|Luxury Residential)<\/span>/g,
      `<span class="font-label-caps text-label-caps text-heritage-gold mb-2 rayfancy-projects-category">$1</span>`
    )
    .replace(
      /<div class="font-headline-md text-headline-md text-heritage-gold mb-6">RayFancy<\/div>/,
      `<div class="font-headline-md text-headline-md text-heritage-gold mb-6 rayfancy-projects-footer-brand">RayFancy</div>`
    )
    .replace(
      /<span class="material-symbols-outlined text-heritage-gold cursor-pointer">(language|share|mail)<\/span>/g,
      `<span class="material-symbols-outlined text-heritage-gold cursor-pointer rayfancy-projects-footer-icon">$1</span>`
    )
    .replace(
      /<h5 class="font-label-caps text-label-caps text-white mb-2">(Company|Legal &amp; Support)<\/h5>/g,
      `<h5 class="font-label-caps text-label-caps text-white mb-2 rayfancy-projects-footer-heading">$1</h5>`
    );
}

function tuneContactPage(html) {
  const mailtoScript = `<script>
        const form = document.querySelector('#trade-inquiry');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const data = new FormData(form);
                const subject = encodeURIComponent('RayFancy trade inquiry');
                const body = encodeURIComponent([
                    'Full name: ' + (data.get('full_name') || ''),
                    'Company: ' + (data.get('company') || ''),
                    'Email: ' + (data.get('email') || ''),
                    'Inquiry type: ' + (data.get('inquiry_type') || ''),
                    '',
                    'Message:',
                    data.get('message') || ''
                ].join('\\n'));
                window.location.href = 'mailto:${contact.email}?subject=' + subject + '&body=' + body;
            });
        }
    </script>`;

  return html
    .replace("</style>", `\n  .rayfancy-contact-hero-img{object-position:center 54%!important;filter:saturate(.92) contrast(1.03) brightness(.72)!important;}\n  .rayfancy-contact-kicker{font-size:13px!important;letter-spacing:.18em!important;}\n  .rayfancy-contact-card-img{object-position:center center!important;filter:saturate(.9) contrast(1.04) brightness(.9)!important;}\n  .rayfancy-contact-factory-img{object-position:center center!important;filter:saturate(.85) contrast(1.02) brightness(1.04)!important;}\n  .rayfancy-contact-phone-icon{font-size:23px!important;margin-top:2px!important;color:#b8975b!important;flex:0 0 auto;}\n  .rayfancy-contact-badge{background:#b8975b!important;min-width:260px;}\n  .rayfancy-contact-badge-label{font-size:12px!important;letter-spacing:.18em!important;color:#fff!important;opacity:.82;}\n  .rayfancy-contact-badge-title{font-size:24px!important;line-height:1.15!important;color:#fff!important;}\n  .rayfancy-contact-footer-brand{font-family:Azonix,Montserrat,Arial,sans-serif!important;font-size:34px!important;line-height:1!important;font-weight:400!important;letter-spacing:.03em!important;color:#d2b06d!important;}\n  .rayfancy-contact-footer-heading{font-size:14px!important;letter-spacing:.18em!important;color:#d2b06d!important;}\n  .rayfancy-contact-footer-link{font-size:14px!important;line-height:1.4!important;}\n  .rayfancy-contact-footer-icon{font-size:34px!important;color:#d2b06d!important;border:0!important;box-shadow:none!important;}\n  .rayfancy-contact-footer-icon-wrap{border:0!important;background:transparent!important;color:#d2b06d!important;}\n  .rayfancy-contact-copyright{font-size:10px!important;font-weight:400!important;letter-spacing:.08em!important;opacity:.42!important;}\n  @media (max-width:768px){.rayfancy-contact-footer-brand{font-size:30px!important}.rayfancy-contact-badge{min-width:220px}.rayfancy-contact-badge-title{font-size:20px!important}}\n</style>`)
    .replace(
      /<img alt="Architectural Hardware Detail" class="w-full h-full object-cover"([^>]+)src="\/assets\/products\/a6-switch-socket-combo\.jpg">/,
      `<img alt="Premium architectural RayFancy product scene" class="w-full h-full object-cover rayfancy-contact-hero-img"$1src="/assets/products/contact-hero-premium-202606072358.jpeg">`
    )
    .replace(
      /<span class="font-label-caps text-label-caps text-heritage-gold mb-4 block">EXCEPTIONAL SUPPORT<\/span>/,
      `<span class="font-label-caps text-label-caps text-heritage-gold mb-4 block rayfancy-contact-kicker">EXCEPTIONAL SUPPORT</span>`
    )
    .replace(
      /<div class="flex items-start gap-4">\s*<span class="material-symbols-outlined text-heritage-gold mt-1" data-icon="call">call<\/span>\s*<div>\s*<p class="font-label-caps text-label-caps text-slate-gray mb-1">DIRECT PHONE<\/p>\s*<p class="font-body-md text-body-md">\+86 18357812915<\/p>\s*<\/div>\s*<\/div>/,
      `<div class="flex items-start gap-4">\n<span class="material-symbols-outlined rayfancy-contact-phone-icon" data-icon="call">call</span>\n<div>\n<p class="font-label-caps text-label-caps text-slate-gray mb-1">WHATSAPP</p>\n<p class="font-body-md text-body-md"><a href="${contact.whatsapp1}">${contact.phone1}</a></p>\n<p class="font-body-md text-body-md"><a href="${contact.whatsapp2}">${contact.phone2}</a></p>\n</div>\n</div>`
    )
    .replace(
      /<img alt="Hardware Engineering" class="w-full h-full object-cover grayscale"([^>]+)src="\/assets\/company\/mold-design\.jpg">/,
      `<img alt="Premium close-up lifestyle RayFancy product detail" class="w-full h-full object-cover rayfancy-contact-card-img"$1src="/assets/products/contact-reliability-closeup-202606080001.jpeg">`
    )
    .replace(
      /<div class="absolute -bottom-8 -right-8 bg-heritage-gold p-8 hidden md:block">\s*<p class="font-label-caps text-label-caps text-on-tertiary">EST\. 01<\/p>\s*<p class="font-headline-md text-headline-md text-on-tertiary">WENZHOU, CN<\/p>\s*<\/div>/,
      `<div class="absolute -bottom-8 -right-8 bg-heritage-gold p-8 hidden md:block rayfancy-contact-badge">\n<p class="font-label-caps text-label-caps text-on-tertiary rayfancy-contact-badge-label">FACTORY DIRECT</p>\n<p class="font-headline-md text-headline-md text-on-tertiary rayfancy-contact-badge-title">GLOBAL SUPPLY</p>\n</div>`
    )
    .replace(
      /<img alt="London" class="w-full h-full object-cover grayscale"([^>]+)src="\/assets\/company\/office\.jpg">/,
      `<img alt="RayFancy factory communication base" class="w-full h-full object-cover rayfancy-contact-factory-img"$1src="/assets/company/contact-factory-clean-202606082238.jpeg">`
    )
    .replace(
      /<div class="font-headline-md text-headline-md text-off-white mb-6">RAYFANCY<\/div>/,
      `<div class="font-headline-md text-headline-md text-off-white mb-6 rayfancy-contact-footer-brand">RAYFANCY</div>`
    )
    .replace(
      /<a class="text-off-white hover:text-heritage-gold transition-colors" href="\/contact\.html"><span class="material-symbols-outlined" data-icon="(share|public)">\1<\/span><\/a>/g,
      `<a class="text-off-white hover:text-heritage-gold transition-colors rayfancy-contact-footer-icon-wrap" href="/contact.html"><span class="material-symbols-outlined rayfancy-contact-footer-icon" data-icon="$1">$1</span></a>`
    )
    .replace(
      /<h5 class="font-label-caps text-label-caps text-off-white mb-6">(NAVIGATION|LEGAL)<\/h5>/g,
      `<h5 class="font-label-caps text-label-caps text-off-white mb-6 rayfancy-contact-footer-heading">$1</h5>`
    )
    .replace(
      /class="font-body-md text-body-md text-primary-fixed-dim hover:text-off-white transition-colors"/g,
      `class="font-body-md text-body-md text-primary-fixed-dim hover:text-off-white transition-colors rayfancy-contact-footer-link"`
    )
    .replace(
      /<p class="font-label-caps text-label-caps text-primary-fixed-dim opacity-60">© 2026 RAYFANCY\. WALL SWITCHES AND ELECTRICAL ACCESSORIES\.<\/p>/,
      `<p class="font-label-caps text-label-caps text-primary-fixed-dim opacity-60 rayfancy-contact-copyright">© 2026 RAYFANCY. WALL SWITCHES AND ELECTRICAL ACCESSORIES.</p>`
    )
    .replace(
      /<form class="space-y-10">/,
      `<form id="trade-inquiry" class="space-y-10" action="mailto:${contact.email}" method="post" enctype="text/plain">`
    )
    .replace(
      /<input class="form-underline bg-transparent py-2 font-body-md text-body-md" placeholder="Johnathan Doe" type="text">/,
      `<input class="form-underline bg-transparent py-2 font-body-md text-body-md" name="full_name" placeholder="Johnathan Doe" required type="text">`
    )
    .replace(
      /<input class="form-underline bg-transparent py-2 font-body-md text-body-md" placeholder="Aethelred Architecture" type="text">/,
      `<input class="form-underline bg-transparent py-2 font-body-md text-body-md" name="company" placeholder="Aethelred Architecture" type="text">`
    )
    .replace(
      /<input class="form-underline bg-transparent py-2 font-body-md text-body-md" placeholder="j\.doe@example\.com" type="email">/,
      `<input class="form-underline bg-transparent py-2 font-body-md text-body-md" name="email" placeholder="j.doe@example.com" required type="email">`
    )
    .replace(
      /<select class="form-underline bg-transparent py-2 font-body-md text-body-md appearance-none">/,
      `<select class="form-underline bg-transparent py-2 font-body-md text-body-md appearance-none" name="inquiry_type">`
    )
    .replace(
      /<textarea class="form-underline bg-transparent py-2 font-body-md text-body-md resize-none" placeholder="How may our specialists assist you today\?" rows="4"><\/textarea>/,
      `<textarea class="form-underline bg-transparent py-2 font-body-md text-body-md resize-none" name="message" placeholder="How may our specialists assist you today?" required rows="4"></textarea>`
    )
    .replace(/<script>\s*\/\/ Simple form interaction[\s\S]*?<\/script>/, mailtoScript);
}

function tuneProductsPage(html) {
  return html
    .replace(/src="\/assets\/products\/a6-1gang-switch\.jpg"/, `src="/assets/products/a2-series-wall-switch-still070.png"`)
    .replace(/src="\/assets\/products\/a6-2gang-switch\.jpg"/, `src="/assets/products/a6-series-wall-switch-still038.png"`)
    .replace(/src="\/assets\/products\/a6-3gang-switch\.jpg"/, `src="/assets/products/a8-series-wall-switch-lzk02871.png"`)
    .replace(/src="\/assets\/products\/a6-thailand-socket\.jpg"/, `src="/assets/products/residential-socket-ecommerce-202606082309.jpeg"`)
    .replace(/src="\/assets\/products\/a6-double-socket\.jpg"/, `src="/assets/products/commercial-socket-ecommerce-202606082310.jpeg"`)
    .replace(/src="\/assets\/products\/three-pin-plug\.jpg"/, `src="/assets/products/lighting-accessory-lamp-holder-4b0a8145.jpg"`)
    .replace(/<h1 class="font-display-lg text-display-lg text-obsidian-black mb-6">ARCHITECTURAL QUALITY\.<\/h1>/, `<h1 class="font-display-lg text-display-lg text-obsidian-black mb-6">PRODUCT SUPPLY.</h1>`)
    .replace(/<h3 class="font-label-caps text-label-caps mb-6 text-obsidian-black">FINISH<\/h3>/, `<h3 class="font-label-caps text-label-caps mb-6 text-obsidian-black">COLOR OPTIONS</h3>`)
    .replace(/<div class="grid grid-cols-4 gap-4">/, `<div class="grid grid-cols-4 gap-4 rayfancy-product-finish-grid">`)
    .replace(/<div class="group cursor-pointer">\s*<div class="w-10 h-10 rounded-full bg-\[#D4AF37\] border border-slate-gray\/10 mb-2 ring-offset-2 group-hover:ring-2 ring-heritage-gold transition-all"><\/div>\s*<span class="text-\[10px\] font-bold text-slate-gray uppercase block text-center">Gold<\/span>\s*<\/div>/, `<div class="group cursor-pointer rayfancy-product-swatch">\n<div class="w-10 h-10 rounded-full bg-[#D4AF37] border border-slate-gray/10 mb-2 ring-offset-2 group-hover:ring-2 ring-heritage-gold transition-all rayfancy-product-swatch-dot"></div>\n<span class="text-[10px] font-bold text-slate-gray uppercase block text-center rayfancy-product-swatch-label">Champagne Gold</span>\n</div>`)
    .replace(/<div class="group cursor-pointer">\s*<div class="w-10 h-10 rounded-full bg-\[#1c1d18\] border border-slate-gray\/10 mb-2 ring-offset-2 group-hover:ring-2 ring-obsidian-black transition-all"><\/div>\s*<span class="text-\[10px\] font-bold text-slate-gray uppercase block text-center">Matt<\/span>\s*<\/div>/, `<div class="group cursor-pointer rayfancy-product-swatch">\n<div class="w-10 h-10 rounded-full bg-[#1c1d18] border border-slate-gray/10 mb-2 ring-offset-2 group-hover:ring-2 ring-obsidian-black transition-all rayfancy-product-swatch-dot"></div>\n<span class="text-[10px] font-bold text-slate-gray uppercase block text-center rayfancy-product-swatch-label">Matte Black</span>\n</div>`)
    .replace(/<div class="group cursor-pointer">\s*<div class="w-10 h-10 rounded-full bg-\[#E5E4E2\] border border-slate-gray\/10 mb-2 ring-offset-2 group-hover:ring-2 ring-slate-gray transition-all"><\/div>\s*<span class="text-\[10px\] font-bold text-slate-gray uppercase block text-center">Steel<\/span>\s*<\/div>/, `<div class="group cursor-pointer rayfancy-product-swatch">\n<div class="w-10 h-10 rounded-full bg-[#E5E4E2] border border-slate-gray/10 mb-2 ring-offset-2 group-hover:ring-2 ring-slate-gray transition-all rayfancy-product-swatch-dot"></div>\n<span class="text-[10px] font-bold text-slate-gray uppercase block text-center rayfancy-product-swatch-label">Brushed Silver</span>\n</div>`)
    .replace(/<div class="group cursor-pointer">\s*<div class="w-10 h-10 rounded-full bg-\[#F5F5F5\] border border-slate-gray\/10 mb-2 ring-offset-2 group-hover:ring-2 ring-slate-gray transition-all"><\/div>\s*<span class="text-\[10px\] font-bold text-slate-gray uppercase block text-center">White<\/span>\s*<\/div>/, `<div class="group cursor-pointer rayfancy-product-swatch">\n<div class="w-10 h-10 rounded-full bg-[#F5F5F5] border border-slate-gray/10 mb-2 ring-offset-2 group-hover:ring-2 ring-slate-gray transition-all rayfancy-product-swatch-dot"></div>\n<span class="text-[10px] font-bold text-slate-gray uppercase block text-center rayfancy-product-swatch-label">Clean White</span>\n</div>`)
    .replace(/A6 1 Gang Switch/g, "1 Gang Wall Switch")
    .replace(/A6-02 · 1 Way \/ 2 Way/g, "Single control wall switch")
    .replace(/A6 2 Gang Switch/g, "2 Gang Wall Switch")
    .replace(/A6-03 · Multiple Finishes/g, "Double control wall switch")
    .replace(/A6 3 Gang Switch/g, "3 Gang Wall Switch")
    .replace(/A6-04 · Project Supply/g, "Triple control wall switch")
    .replace(/A6 Thailand Socket/g, "Thailand Wall Socket")
    .replace(/A6-09 · Wall Socket/g, "Regional socket series")
    .replace(/A6 Double Socket/g, "Double Wall Socket")
    .replace(/A6-16 \/ A6-17/g, "Multi-outlet socket series")
    .replace(/1 Gang Wall Switch/g, "A2 Series Wall Switch")
    .replace(/Single control wall switch/g, "Entry series for residential projects")
    .replace(/2 Gang Wall Switch/g, "A6 Series Wall Switch")
    .replace(/Double control wall switch/g, "Mainstream series for trade supply")
    .replace(/3 Gang Wall Switch/g, "A8 Series Wall Switch")
    .replace(/Triple control wall switch/g, "Premium series for commercial projects")
    .replace(/Thailand Wall Socket/g, "Residential Socket")
    .replace(/Regional socket series/g, "Home and apartment applications")
    .replace(/Double Wall Socket/g, "Commercial Socket")
    .replace(/Multi-outlet socket series/g, "Office, retail, and project use")
    .replace(/<h2 class="font-headline-lg text-headline-lg text-obsidian-black">Plugs<\/h2>/, `<h2 class="font-headline-lg text-headline-lg text-obsidian-black">Extensions</h2>`)
    .replace(/Three Pin Plug/g, "Lighting Accessories")
    .replace(/Plug & Accessory Supply/g, "Lamp holders and lighting support")
    .replace(/<div class="font-headline-md text-headline-md text-off-white mb-6">RAYFANCY<\/div>/, `<div class="font-headline-md text-headline-md text-off-white mb-6 rayfancy-products-footer-brand">RAYFANCY</div>`)
    .replace(/<p class="text-primary-fixed-dim max-w-sm mb-12">/, `<p class="text-primary-fixed-dim max-w-sm mb-12 rayfancy-products-footer-copy">`)
    .replace(/<span class="material-symbols-outlined text-off-white cursor-pointer hover:text-heritage-gold transition-colors">(language|mail|phone)<\/span>/g, `<span class="material-symbols-outlined text-off-white cursor-pointer hover:text-heritage-gold transition-colors rayfancy-products-footer-icon">$1</span>`)
    .replace(/<h4 class="font-label-caps text-label-caps text-off-white mb-6">(RESOURCES|SUPPORT)<\/h4>/g, `<h4 class="font-label-caps text-label-caps text-off-white mb-6 rayfancy-products-footer-heading">$1</h4>`)
    .replace(/<a class="block text-primary-fixed-dim hover:text-off-white transition-colors"/g, `<a class="block text-primary-fixed-dim hover:text-off-white transition-colors rayfancy-products-footer-link"`)
    .replace(/<p class="font-label-caps text-label-caps text-primary-fixed-dim text-center">© 2026 RAYFANCY\. WALL SWITCHES AND ELECTRICAL ACCESSORIES\.<\/p>/, `<p class="font-label-caps text-label-caps text-primary-fixed-dim text-center rayfancy-products-copyright">© 2026 RAYFANCY. WALL SWITCHES AND ELECTRICAL ACCESSORIES.</p>`);
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
    "/assets/company/product-assembly.jpg",
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
  if (page.out === "index.html") {
    html = tuneHomepageHero(html);
    html = tuneLatestHomepageVisuals(html);
  }
  if (page.out === "contact.html") {
    html = addFacebookQrToContact(html);
    html = tuneContactPage(html);
  }
  if (page.out === "about.html") {
    html = addAboutPageStyles(html);
    html = tuneAboutPage(html);
  }
  if (page.out === "quality.html") {
    html = addQualityPageStyles(html);
    html = tuneQualityPage(html);
  }
  if (page.out === "resources.html") {
    html = addResourcesPageStyles(html);
    html = tuneResourcesPage(html);
  }
  if (page.out === "projects.html") {
    html = addProjectsPageStyles(html);
    html = tuneProjectsPage(html);
  }
  if (page.out === "products.html") {
    html = addProductsPageStyles(html);
    html = tuneProductsPage(html);
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
    .replace(/header\.classList\.add\('h-20'\);/g, "header.classList.add('h-16');")
    .replace(/href="#">/g, 'href="/contact.html">');
  if (page.out === "index.html") {
    html = tuneLatestHomepageVisuals(html);
  }
  if (page.out === "resources.html") {
    html = tuneResourcesPage(html);
  }
  html = tuneHeroCopyLayout(html, page.out);
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
