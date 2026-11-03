"use client";

import { useEffect } from "react";
import { RefreshCw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("BookNook error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="text-center">
        <h1 className="font-heading text-3xl font-semibold text-[#173D32]">
          Something went wrong
        </h1>

        <p className="mt-3 text-sm text-[#777D74]">
          We couldn't load this page. Please try again.
        </p>

        <button
          onClick={() => reset()}
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#173D32] px-6 py-3 text-sm font-semibold text-white hover:bg-[#245747]"
        >
          <RefreshCw size={16} />
          Try Again
        </button>
      </div>
    </div>
  );
}

