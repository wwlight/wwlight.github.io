/**
 * 功能：`(hover: hover) and (pointer: fine)` 媒体查询封装；触屏设备返回 false。
 */
import { useEffect, useState } from "react";

const HOVER_CAPABLE_QUERY = "(hover: hover) and (pointer: fine)";

export function useHoverCapable() {
  const [hoverCapable, setHoverCapable] = useState(
    () => typeof window !== "undefined" && window.matchMedia(HOVER_CAPABLE_QUERY).matches,
  );

  useEffect(() => {
    const query = window.matchMedia(HOVER_CAPABLE_QUERY);
    const sync = () => setHoverCapable(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  return hoverCapable;
}
