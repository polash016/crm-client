"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function GA4Events() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window.gtag === "undefined") return;

    const page_path =
      pathname + (searchParams ? `?${searchParams.toString()}` : "");

    window.gtag("event", "page_view", {
      page_path,
      page_title: document.title,
    });
  }, [pathname, searchParams]);

  return null;
}
