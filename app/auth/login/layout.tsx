import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | Modern Homes",
  description: "Login to your Modern Homes account.",
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
