interface TableSkeletonProps {
  rows?: number;
  cols?: number;
}

export function TableSkeleton({ rows = 5, cols = 5 }: TableSkeletonProps) {
  const rowArray = Array.from({ length: rows });
  const colArray = Array.from({ length: cols });

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-white">
      <div
        className="grid gap-4 p-6"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      >
        {rowArray.map((_, rowIndex) =>
          colArray.map((__, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className="h-4 w-full animate-pulse rounded bg-surface-2"
            />
          )),
        )}
      </div>
    </div>
  );
}
