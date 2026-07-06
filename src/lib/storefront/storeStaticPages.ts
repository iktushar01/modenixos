export type StoreStaticPageId =
  | "about"
  | "privacy-policy"
  | "shipping-policy"
  | "return-exchange-policy"
  | "payment-refund-policy"
  | "contact-us";

export interface StoreStaticPageSection {
  title: string;
  paragraphs?: string[];
  bullets?: string[];
}

export interface StoreStaticPageMeta {
  id: StoreStaticPageId;
  eyebrow: string;
  title: string;
  description: string;
  lastUpdated: string;
  sections: StoreStaticPageSection[];
}

function withBrand(brandName: string, pages: Record<StoreStaticPageId, Omit<StoreStaticPageMeta, "id">>): Record<StoreStaticPageId, StoreStaticPageMeta> {
  const result = {} as Record<StoreStaticPageId, StoreStaticPageMeta>;
  for (const [id, page] of Object.entries(pages) as [StoreStaticPageId, Omit<StoreStaticPageMeta, "id">][]) {
    result[id] = {
      id,
      ...page,
      title: page.title.replace(/\{brand\}/g, brandName),
      description: page.description.replace(/\{brand\}/g, brandName),
      sections: page.sections.map((section) => ({
        ...section,
        title: section.title.replace(/\{brand\}/g, brandName),
        paragraphs: section.paragraphs?.map((p) => p.replace(/\{brand\}/g, brandName)),
        bullets: section.bullets?.map((b) => b.replace(/\{brand\}/g, brandName)),
      })),
    };
  }
  return result;
}

const DEMO_PAGES: Record<StoreStaticPageId, Omit<StoreStaticPageMeta, "id">> = {
  about: {
    eyebrow: "Our story",
    title: "About {brand}",
    description:
      "Rooted in craftsmanship and contemporary design, {brand} creates apparel that moves with you — from everyday essentials to statement pieces.",
    lastUpdated: "July 2026",
    sections: [
      {
        title: "Who we are",
        paragraphs: [
          "{brand} began with a simple belief: clothing should feel as good as it looks. We design and curate collections that blend comfort, quality fabrics, and timeless silhouettes for modern wardrobes.",
          "Every piece is thoughtfully sourced and quality-checked before it reaches you. We work with trusted partners who share our commitment to ethical production and sustainable practices.",
        ],
      },
      {
        title: "Our mission",
        paragraphs: [
          "We aim to make premium fashion accessible — without compromising on fit, fabric, or finish. Whether you're dressing for work, weekend, or celebration, {brand} is built to be your go-to.",
        ],
      },
      {
        title: "What sets us apart",
        bullets: [
          "Premium fabrics selected for comfort and durability",
          "Inclusive sizing with detailed fit guides on every product",
          "Transparent pricing — no hidden fees at checkout",
          "Responsive customer support, 7 days a week",
          "Easy returns within 14 days of delivery",
        ],
      },
    ],
  },
  "privacy-policy": {
    eyebrow: "Legal",
    title: "Privacy Policy",
    description:
      "Your privacy matters to us. This policy explains how {brand} collects, uses, and protects your personal information when you shop with us.",
    lastUpdated: "July 2026",
    sections: [
      {
        title: "Information we collect",
        paragraphs: [
          "When you create an account, place an order, or contact us, we may collect your name, email address, phone number, shipping and billing addresses, and payment details (processed securely by our payment partners — we do not store full card numbers).",
          "We also collect technical data such as IP address, browser type, and pages visited to improve your shopping experience.",
        ],
      },
      {
        title: "How we use your information",
        bullets: [
          "Process and fulfill your orders",
          "Send order confirmations, shipping updates, and delivery notifications",
          "Respond to customer service requests",
          "Send marketing emails (only if you opt in — unsubscribe anytime)",
          "Detect and prevent fraud or abuse",
          "Improve our website, products, and services",
        ],
      },
      {
        title: "Sharing your data",
        paragraphs: [
          "We share information only with trusted third parties necessary to operate our store: payment processors, shipping carriers, and email service providers. We never sell your personal data to advertisers.",
        ],
      },
      {
        title: "Cookies",
        paragraphs: [
          "We use cookies and similar technologies to remember your preferences, keep items in your cart, and analyze site traffic. You can control cookies through your browser settings.",
        ],
      },
      {
        title: "Your rights",
        bullets: [
          "Request access to the personal data we hold about you",
          "Request correction or deletion of your data",
          "Opt out of marketing communications at any time",
          "Lodge a complaint with your local data protection authority",
        ],
      },
      {
        title: "Contact",
        paragraphs: [
          "For privacy-related questions, email us at privacy@{brand}.com or use our Contact Us page.",
        ],
      },
    ],
  },
  "shipping-policy": {
    eyebrow: "Delivery",
    title: "Shipping Policy",
    description:
      "Everything you need to know about how {brand} ships your orders — timelines, rates, and tracking.",
    lastUpdated: "July 2026",
    sections: [
      {
        title: "Processing time",
        paragraphs: [
          "Orders are processed within 1–2 business days (Monday–Saturday, excluding public holidays). You'll receive a confirmation email once your order is placed and a shipping notification with tracking when it leaves our warehouse.",
        ],
      },
      {
        title: "Delivery areas",
        bullets: [
          "Nationwide delivery across Bangladesh",
          "Dhaka metro: 1–3 business days after dispatch",
          "Outside Dhaka: 3–7 business days after dispatch",
          "Remote areas may require an additional 1–2 days",
        ],
      },
      {
        title: "Shipping rates",
        bullets: [
          "Dhaka metro: ৳60 flat rate",
          "Outside Dhaka: ৳120 flat rate",
          "Free shipping on orders over ৳2,500 (automatically applied at checkout)",
        ],
      },
      {
        title: "Order tracking",
        paragraphs: [
          "Track your package anytime using the link in your shipping email or visit our Track Order page with your order number and email.",
        ],
      },
      {
        title: "Delivery attempts",
        paragraphs: [
          "Our courier partners typically make up to two delivery attempts. If delivery fails, the package may be returned to us. Contact our support team within 48 hours to arrange re-delivery.",
        ],
      },
    ],
  },
  "return-exchange-policy": {
    eyebrow: "Returns",
    title: "Return & Exchange Policy",
    description:
      "Not quite right? {brand} offers hassle-free returns and exchanges so you can shop with confidence.",
    lastUpdated: "July 2026",
    sections: [
      {
        title: "Return window",
        paragraphs: [
          "You may return or exchange eligible items within 14 days of delivery. Items must be unworn, unwashed, with original tags attached and in original packaging.",
        ],
      },
      {
        title: "Eligible items",
        bullets: [
          "Regular-priced clothing and accessories in sellable condition",
          "Items with manufacturing defects (report within 7 days with photos)",
        ],
      },
      {
        title: "Non-returnable items",
        bullets: [
          "Final sale or clearance items marked as non-returnable",
          "Undergarments, swimwear, and socks (for hygiene reasons)",
          "Customized or personalized products",
          "Items without original tags or packaging",
        ],
      },
      {
        title: "How to return",
        bullets: [
          "Email support@{brand}.com or use Contact Us with your order number",
          "We'll send a return authorization and pickup/drop-off instructions",
          "Pack items securely in original packaging",
          "Refund or exchange is processed within 5–7 business days after we receive the item",
        ],
      },
      {
        title: "Exchanges",
        paragraphs: [
          "Prefer a different size or color? Exchanges are subject to stock availability. If your preferred variant is out of stock, we'll issue a full refund to your original payment method.",
        ],
      },
      {
        title: "Return shipping",
        paragraphs: [
          "Return shipping is free for defective or incorrect items. For change-of-mind returns, a ৳80 return fee may be deducted from your refund unless you opt for store credit (full value, no fee).",
        ],
      },
    ],
  },
  "payment-refund-policy": {
    eyebrow: "Payments",
    title: "Payment & Refund Policy",
    description:
      "Secure checkout, flexible payment options, and clear refund timelines — how {brand} handles your money.",
    lastUpdated: "July 2026",
    sections: [
      {
        title: "Accepted payment methods",
        bullets: [
          "bKash, Nagad, and Rocket mobile wallets",
          "Visa, Mastercard, and American Express debit/credit cards",
          "Cash on Delivery (COD) — available in select areas",
        ],
      },
      {
        title: "Payment security",
        paragraphs: [
          "All card and mobile wallet transactions are encrypted and processed through PCI-compliant payment gateways. {brand} never stores your full card number or wallet PIN on our servers.",
        ],
      },
      {
        title: "Order confirmation",
        paragraphs: [
          "Your order is confirmed once payment is successfully processed (or COD order is placed). You'll receive an email receipt with your order number and itemized breakdown including taxes and shipping.",
        ],
      },
      {
        title: "Refund process",
        bullets: [
          "Refunds are issued to the original payment method within 5–10 business days",
          "COD orders refunded via bKash or bank transfer (details collected during return)",
          "Partial refunds apply if only some items from an order are returned",
          "Shipping fees are non-refundable unless the return is due to our error",
        ],
      },
      {
        title: "Failed or duplicate charges",
        paragraphs: [
          "If you notice an unauthorized or duplicate charge, contact us within 48 hours at billing@{brand}.com with your order number and transaction ID. We'll investigate and resolve within 3 business days.",
        ],
      },
      {
        title: "Promotions & discounts",
        paragraphs: [
          "Promo codes must be applied at checkout and cannot be added retroactively. Refunds for discounted orders reflect the amount actually paid, not the original list price.",
        ],
      },
    ],
  },
  "contact-us": {
    eyebrow: "Get in touch",
    title: "Contact Us",
    description:
      "Questions about your order, sizing, or returns? The {brand} team is here to help.",
    lastUpdated: "July 2026",
    sections: [
      {
        title: "Customer support hours",
        paragraphs: [
          "Saturday – Thursday, 10:00 AM – 8:00 PM (BST). We aim to respond to all inquiries within 24 hours on business days.",
        ],
      },
      {
        title: "Before you write",
        bullets: [
          "Have your order number ready for order-related queries",
          "Check our Shipping and Return policies — your answer may already be there",
          "Include photos for damage or defect claims",
        ],
      },
    ],
  },
};

export function getStoreStaticPage(brandName: string, pageId: StoreStaticPageId): StoreStaticPageMeta {
  const pages = withBrand(brandName, DEMO_PAGES);
  return pages[pageId];
}

export const STORE_POLICY_LINKS: { id: StoreStaticPageId; label: string; path: string }[] = [
  { id: "about", label: "About", path: "about" },
  { id: "privacy-policy", label: "Privacy Policy", path: "privacy-policy" },
  { id: "shipping-policy", label: "Shipping Policy", path: "shipping-policy" },
  { id: "return-exchange-policy", label: "Return & Exchange", path: "return-exchange-policy" },
  { id: "payment-refund-policy", label: "Payment & Refund", path: "payment-refund-policy" },
  { id: "contact-us", label: "Contact Us", path: "contact-us" },
];
