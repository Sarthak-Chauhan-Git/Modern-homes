"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function ErrorPage({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <div className="rounded-full bg-red-100 p-5 text-red-600">
        <AlertTriangle size={40} />
      </div>
      <h1 className="mt-6 font-display text-4xl text-primary">Something went wrong</h1>
      <p className="mt-3 max-w-md text-text-muted">The page could not load correctly. Please try again.</p>
      <Button type="button" className="mt-6" onClick={reset}>
        Try Again
      </Button>
    </div>
  );
}
