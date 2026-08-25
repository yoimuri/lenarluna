"use client";

import { useEffect } from "react";

// Flips reveal animations on only once JS has actually mounted. See the
// comment above .reveal in globals.css -- this is what keeps no-JS visitors
// and crawlers seeing full content instead of a permanently-hidden section.
export default function JsEnabled() {
  useEffect(() => {
    document.documentElement.classList.add("js-enabled");
  }, []);
  return null;
}
