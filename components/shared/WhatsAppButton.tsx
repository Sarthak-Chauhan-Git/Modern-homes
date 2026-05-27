"use client";

import { MessageCircle } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { BUSINESS_WHATSAPP_URL } from "@/lib/constants/contact";

export function WhatsAppButton() {
  const [hovered, setHovered] = useState(false);
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="relative">
        <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366]/40" />
        <a
          href={BUSINESS_WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-2xl"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          aria-label="Chat on WhatsApp"
        >
          <MessageCircle size={22} />
        </a>
        <AnimatePresence>
          {hovered ? (
            <motion.div
              className="absolute right-16 top-1/2 -translate-y-1/2 rounded-full bg-primary px-4 py-2 text-xs uppercase tracking-widest text-white shadow-lg"
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
            >
              Chat with us
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}
