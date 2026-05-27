import Link from "next/link";
import { SearchX } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <div className="rounded-full bg-surface-2 p-6 text-text-muted">
        <SearchX size={48} />
      </div>
      <h1 className="mt-6 font-display text-5xl text-primary">Page Not Found</h1>
      <p className="mt-3 max-w-md text-text-muted">The page you are looking for does not exist or may have moved.</p>
      <Link href="/" className="mt-6">
        <Button>Go Home</Button>
      </Link>
    </div>
  );
}
