"use client";

import { useEffect } from "react";

/** Scroll to `#hash` on mount / hash changes (Next soft nav often skips native hash scroll). */
export function ScrollToHash({ offset = 96 }: { offset?: number }) {
  useEffect(() => {
    const scrollToHash = () => {
      const id = window.location.hash.replace(/^#/, "");
      if (!id) return;
      const el = document.getElementById(id);
      if (!el) return;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
      el.setAttribute("data-highlight", "true");
      window.setTimeout(() => el.removeAttribute("data-highlight"), 1800);
    };

    scrollToHash();
    window.addEventListener("hashchange", scrollToHash);
    return () => window.removeEventListener("hashchange", scrollToHash);
  }, [offset]);

  return null;
}
