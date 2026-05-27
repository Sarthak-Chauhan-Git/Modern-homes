import Link from "next/link";
import { Mail, MapPin, Phone, MessageCircle } from "lucide-react";
import {
  BUSINESS_PHONE_DISPLAY,
  BUSINESS_PHONE_TEL,
  BUSINESS_WHATSAPP_URL,
} from "@/lib/constants/contact";

export function Footer() {
  return (
    <footer className="mt-24 bg-primary text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-4">
        <div>
          <div className="font-display text-2xl tracking-[0.2em]">
            MODERN HOMES
          </div>
          <p className="mt-4 text-sm text-white/70">
            Premium sanitary ware for every space. Curated collections for
            retail and wholesale buyers.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-widest text-white/80">
            Quick Links
          </h4>
          <ul className="mt-4 space-y-2 text-sm text-white/70">
            <li>
              <Link href="/" className="hover:text-white">
                Home
              </Link>
            </li>
            <li>
              <Link href="/products" className="hover:text-white">
                Products
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-white">
                About
              </Link>
            </li>
            <li>
              <Link href="/services" className="hover:text-white">
                Services
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-white">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-widest text-white/80">
            Categories
          </h4>
          <ul className="mt-4 space-y-2 text-sm text-white/70">
            <li>Accessories</li>
            <li>Diverter and Shower Valve</li>
            <li>Faucet</li>
            <li>Flush</li>
            <li>Sanitary Ware</li>
            <li>Shower Panel</li>
            <li>Thermostatic Mixture</li>
            <li>Water Heater / Geyser</li>
            <li>Whirpool</li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-widest text-white/80">
            Contact
          </h4>
          <ul className="mt-4 space-y-3 text-sm text-white/70">
            <li className="flex items-center gap-3">
              <Phone size={16} />
              <a href={BUSINESS_PHONE_TEL} className="hover:text-white">
                {BUSINESS_PHONE_DISPLAY || "Contact us"}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <MessageCircle size={16} />
              <a href={BUSINESS_WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                WhatsApp Us
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Mail size={16} />
              <a href="mailto:info@modernhomes.in" className="hover:text-white">
                info@modernhomes.in
              </a>
            </li>
            <li className="flex items-start gap-3">
              <MapPin size={16} className="mt-0.5" />
              <span>Premium sanitary ware showroom, India</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-6 text-center text-xs text-white/60">
        © 2026 Modern Homes. All rights reserved.
      </div>
    </footer>
  );
}
