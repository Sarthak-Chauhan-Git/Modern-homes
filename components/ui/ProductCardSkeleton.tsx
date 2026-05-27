export function ProductCardSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-white p-4 shadow-sm">
      <div className="aspect-[4/3] w-full animate-pulse rounded-lg bg-surface-2" />
      <div className="mt-4 space-y-3">
        <div className="h-3 w-1/3 animate-pulse rounded bg-surface-2" />
        <div className="h-4 w-4/5 animate-pulse rounded bg-surface-2" />
        <div className="h-4 w-2/3 animate-pulse rounded bg-surface-2" />
        <div className="h-10 w-full animate-pulse rounded-full bg-surface-2" />
      </div>
    </div>
  );
}
