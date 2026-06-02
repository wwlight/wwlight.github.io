import { useCallback, useLayoutEffect, useRef, useState } from "react";

interface UseTransferStationPanelMotionOptions {
  panelOpen: boolean;
  forceExpanded: boolean;
  dragApproaching: boolean;
  /** 列表条目或空态变化时重测高度 */
  contentRevision: number;
}

function measureBodyWrapContentHeight(bodyWrap: HTMLDivElement | null) {
  const inner = bodyWrap?.firstElementChild;
  if (!(inner instanceof HTMLElement)) return 0;
  return inner.scrollHeight;
}

/** 双 rAF：保证浏览器先提交起始 height，再过渡至目标值 */
function runHeightTransition(
  apply: (height: number) => void,
  from: number,
  to: number,
) {
  apply(from);
  let outerFrame = 0;
  let innerFrame = 0;
  outerFrame = window.requestAnimationFrame(() => {
    innerFrame = window.requestAnimationFrame(() => {
      apply(to);
    });
  });
  return () => {
    window.cancelAnimationFrame(outerFrame);
    window.cancelAnimationFrame(innerFrame);
  };
}

export function useTransferStationPanelMotion({
  panelOpen,
  forceExpanded,
  dragApproaching,
  contentRevision,
}: UseTransferStationPanelMotionOptions) {
  const bodyWrapRef = useRef<HTMLDivElement>(null);
  const [bodyWrapHeight, setBodyWrapHeight] = useState(0);
  const [panelInstant, setPanelInstant] = useState(false);
  const prevPanelOpenRef = useRef(panelOpen);
  const mountedRef = useRef(false);

  const measure = useCallback(
    () => measureBodyWrapContentHeight(bodyWrapRef.current),
    [],
  );

  useLayoutEffect(() => {
    const target = measure();
    const wasOpen = prevPanelOpenRef.current;
    const opening = panelOpen && !wasOpen;
    const closing = !panelOpen && wasOpen;
    const instantOpen = opening && forceExpanded && dragApproaching;

    if (!mountedRef.current) {
      mountedRef.current = true;
      setBodyWrapHeight(panelOpen ? target : 0);
      prevPanelOpenRef.current = panelOpen;
      return;
    }

    if (instantOpen) {
      setPanelInstant(true);
      window.requestAnimationFrame(() => setPanelInstant(false));
      setBodyWrapHeight(target);
      prevPanelOpenRef.current = panelOpen;
      return;
    }

    let cancelTransition = () => {};

    if (opening) {
      cancelTransition = runHeightTransition(setBodyWrapHeight, 0, measure());
    } else if (closing) {
      cancelTransition = runHeightTransition(setBodyWrapHeight, measure(), 0);
    } else {
      setBodyWrapHeight(panelOpen ? target : 0);
    }

    prevPanelOpenRef.current = panelOpen;
    return cancelTransition;
  }, [panelOpen, forceExpanded, dragApproaching, contentRevision, measure]);

  return { bodyWrapRef, bodyWrapHeight, panelInstant };
}
