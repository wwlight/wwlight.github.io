import { useEffect, useState } from "react";

const DRAG_MEDIA_QUERY = "(min-width: 768px) and (pointer: fine)";

/** 桌面端精确指针才启用书签拖拽与中转站 */
export function useAdminDragEnabled() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const query = window.matchMedia(DRAG_MEDIA_QUERY);
    const sync = () => setEnabled(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  return enabled;
}
