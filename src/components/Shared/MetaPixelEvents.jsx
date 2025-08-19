"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function MetaPixelEvents() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window.fbq === "undefined") return;

    const queryString = searchParams?.toString() || "";
    const pagePath = pathname + (queryString ? `?${queryString}` : "");

    const pageTitle = document.title;

    // Extract first path segment for dynamic category
    // e.g., "/blog/article" => "Blog", "/" => "Home"
    let contentCategory = "Home";
    const segments = pathname.split("/").filter(Boolean); // remove empty strings

    if (segments.length > 0) {
      // Capitalize first letter
      contentCategory =
        segments[0].charAt(0).toUpperCase() + segments[0].slice(1);
    }

    const params = {
      page_path: pagePath,
      page_title: pageTitle,
      content_category: contentCategory,
    };

    window.fbq("track", "PageView", params);
  }, [pathname, searchParams]);

  return null;
}
