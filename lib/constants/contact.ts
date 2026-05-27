const rawWhatsapp = process.env.NEXT_PUBLIC_BUSINESS_WHATSAPP ?? "";

export const BUSINESS_WHATSAPP = rawWhatsapp;
export const BUSINESS_WHATSAPP_URL = rawWhatsapp
  ? `https://wa.me/${rawWhatsapp}`
  : "#";

export const BUSINESS_PHONE_TEL = rawWhatsapp ? `tel:+${rawWhatsapp}` : "";

export const BUSINESS_PHONE_DISPLAY = rawWhatsapp
  ? rawWhatsapp.startsWith("91") && rawWhatsapp.length === 12
    ? `+${rawWhatsapp.slice(0, 2)} ${rawWhatsapp.slice(2, 7)} ${rawWhatsapp.slice(7)}`
    : `+${rawWhatsapp}`
  : "";
