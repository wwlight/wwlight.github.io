import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

const AdminDialogLayerContext = createContext<(() => void) | null>(null);

const BACKDROP_HIDE_MS = 150;
const SCROLL_LOCK_CLASS = "admin-dialog-scroll-lock";

function AdminDialogBackdrop({ openCount }: { openCount: number }) {
  const [mounted, setMounted] = useState(openCount > 0);
  const [visible, setVisible] = useState(openCount > 0);
  const hideTimerRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (openCount > 0) {
      window.clearTimeout(hideTimerRef.current);
      setMounted(true);
      requestAnimationFrame(() => setVisible(true));
      return;
    }

    setVisible(false);
    hideTimerRef.current = window.setTimeout(() => setMounted(false), BACKDROP_HIDE_MS);
    return () => window.clearTimeout(hideTimerRef.current);
  }, [openCount]);

  if (!mounted || typeof document === "undefined") return null;

  return createPortal(
    <div
      aria-hidden
      data-visible={visible ? "true" : "false"}
      className="admin-dialog-backdrop pointer-events-auto fixed inset-0 z-60 bg-black/80"
    />,
    document.body,
  );
}

export function AdminDialogProvider({ children }: { children: React.ReactNode }) {
  const [openCount, setOpenCount] = useState(0);

  useEffect(() => {
    if (openCount <= 0) return;
    document.documentElement.classList.add(SCROLL_LOCK_CLASS);
    return () => document.documentElement.classList.remove(SCROLL_LOCK_CLASS);
  }, [openCount]);

  const register = useCallback(() => {
    setOpenCount((count) => count + 1);
    return () => setOpenCount((count) => count - 1);
  }, []);

  return (
    <AdminDialogLayerContext.Provider value={register}>
      <AdminDialogBackdrop openCount={openCount} />
      {children}
    </AdminDialogLayerContext.Provider>
  );
}

/** Keeps the shared admin backdrop mounted while this dialog is open. */
export function useAdminDialogLayer(open: boolean) {
  const register = useContext(AdminDialogLayerContext);

  useLayoutEffect(() => {
    if (!open || !register) return;
    return register();
  }, [open, register]);
}
