import { Spinner } from "@/components/ui/Spinner";

export default function AdminLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-2">
      <Spinner size={40} />
    </div>
  );
}
