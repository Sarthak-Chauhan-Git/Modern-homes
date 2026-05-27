import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout | Modern Homes",
  description: "Complete your Modern Homes order securely.",
};

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
