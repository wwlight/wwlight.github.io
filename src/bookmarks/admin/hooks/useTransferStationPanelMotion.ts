import { useLayoutEffect, useRef, useState } from "react";

interface UseTransferStationPanelMotionOptions {
  panelOpen: boolean;
  forceExpanded: boolean;
  dragApproaching: boolean;
}

/** 拖拽靠近时瞬间展开，跳过 aside 宽高过渡 */
export function useTransferStationPanelMotion({
  panelOpen,
  forceExpanded,
  dragApproaching,
}: UseTransferStationPanelMotionOptions) {
  const [panelInstant, setPanelInstant] = useState(false);
  const prevPanelOpenRef = useRef(panelOpen);
  const mountedRef = useRef(false);

  useLayoutEffect(() => {
    const opening = panelOpen && !prevPanelOpenRef.current;
    const instantOpen = opening && forceExpanded && dragApproaching;

    if (!mountedRef.current) {
      mountedRef.current = true;
      prevPanelOpenRef.current = panelOpen;
      return;
    }

    if (instantOpen) {
      setPanelInstant(true);
      window.requestAnimationFrame(() => setPanelInstant(false));
    }

    prevPanelOpenRef.current = panelOpen;
  }, [panelOpen, forceExpanded, dragApproaching]);

  return { panelInstant };
}
