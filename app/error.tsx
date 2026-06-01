"use client";

import { useEffect } from "react";
import { SystemErrorUI } from "@/components/errors/SystemErrorUI";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Optionally log the error to an error reporting service
    console.error("Global System Error Caught:", error);
  }, [error]);

  return <SystemErrorUI error={error} reset={reset} />;
}
