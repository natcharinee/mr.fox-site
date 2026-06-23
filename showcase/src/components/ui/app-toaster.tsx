"use client";

import { Toaster } from "sonner";

export function AppToaster() {
  return (
    <Toaster
      position="top-center"
      richColors
      closeButton
      expand
      duration={4000}
      style={{ zIndex: 99999 }}
    />
  );
}
