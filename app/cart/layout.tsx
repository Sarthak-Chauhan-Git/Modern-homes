import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cart | Modern Homes",
  description: "Review your Modern Homes cart before checkout.",
};

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return children;
}
