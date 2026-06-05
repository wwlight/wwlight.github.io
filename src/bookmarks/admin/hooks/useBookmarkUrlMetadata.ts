/**
 * 功能：EditDialog URL debounce 自动/手动识别标题与描述建议。
 * 关联：EditDialog.tsx、fetch-bookmark-metadata.client.ts
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { resolveBookmarkMetadata } from "@/bookmarks/admin/lib/fetch-bookmark-metadata.client";
import { getAuthorizationHeader } from "@/bookmarks/admin/lib/admin-auth";

const URL_DEBOUNCE_MS = 600;
const METADATA_ERROR_MESSAGE = "未能识别页面信息，可手动填写";

interface UseBookmarkUrlMetadataOptions {
  enabled: boolean;
  /** URL 变更后 debounce 自动识别（新增，或编辑时 URL 已改动） */
  autoFetch: boolean;
  url: string;
  title: string;
  /** 用户是否手动改过标题；为 true 时自动识别不再覆盖 */
  titleTouched: boolean;
  onApplyTitle: (title: string) => void;
}

/** 自动识别时：未手改标题，且当前为空或仍是上次自动填入的值 */
function shouldAutoFillTitle(
  mode: "auto" | "manual",
  titleTouched: boolean,
  title: string,
  lastAutoTitle: string,
): boolean {
  return (
    mode === "manual" ||
    (!titleTouched && (!title.trim() || title.trim() === lastAutoTitle))
  );
}

export function useBookmarkUrlMetadata({
  enabled,
  autoFetch,
  url,
  title,
  titleTouched,
  onApplyTitle,
}: UseBookmarkUrlMetadataOptions) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestedDescription, setSuggestedDescription] = useState("");
  const requestIdRef = useRef(0);
  const lastAutoTitleRef = useRef("");
  const onApplyTitleRef = useRef(onApplyTitle);

  onApplyTitleRef.current = onApplyTitle;

  const runFetch = useCallback(
    async (mode: "auto" | "manual") => {
      const trimmedUrl = url.trim();
      if (!trimmedUrl) {
        setSuggestedDescription("");
        setError(null);
        return;
      }

      const requestId = ++requestIdRef.current;
      setLoading(true);
      setError(null);

      try {
        const authorization = await getAuthorizationHeader();
        const metadata = await resolveBookmarkMetadata(trimmedUrl, authorization);
        if (requestId !== requestIdRef.current) return;

        const nextTitle = metadata?.title?.trim();
        if (!nextTitle) {
          setSuggestedDescription("");
          setError(METADATA_ERROR_MESSAGE);
          return;
        }

        if (shouldAutoFillTitle(mode, titleTouched, title, lastAutoTitleRef.current)) {
          lastAutoTitleRef.current = nextTitle;
          onApplyTitleRef.current(nextTitle);
        }

        setSuggestedDescription(metadata?.description?.trim() ?? "");
      } catch {
        if (requestId !== requestIdRef.current) return;
        setSuggestedDescription("");
        setError(METADATA_ERROR_MESSAGE);
      } finally {
        if (requestId === requestIdRef.current) setLoading(false);
      }
    },
    [title, titleTouched, url],
  );

  const fetchMetadata = useCallback(() => {
    void runFetch("manual");
  }, [runFetch]);

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      setError(null);
      setSuggestedDescription("");
      lastAutoTitleRef.current = "";
      return;
    }

    if (!autoFetch) return;

    const trimmedUrl = url.trim();
    if (!trimmedUrl) {
      setSuggestedDescription("");
      setError(null);
      return;
    }

    const timer = window.setTimeout(() => {
      void runFetch("auto");
    }, URL_DEBOUNCE_MS);

    return () => {
      window.clearTimeout(timer);
    };
  }, [autoFetch, enabled, runFetch, url]);

  return { loading, error, suggestedDescription, fetchMetadata };
}
