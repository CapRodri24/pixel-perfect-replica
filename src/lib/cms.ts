import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import type { Lang } from "@/i18n/I18nProvider";

export type ContentItem = Tables<"content_items">;
export type ContentKind = "landscape" | "program" | "news" | "team" | "library";

export const contentQueryKey = ["content_items"] as const;

export function useContent() {
  return useQuery({
    queryKey: contentQueryKey,
    queryFn: async () => {
      const { data, error } = await supabase.from("content_items").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    staleTime: 30_000,
  });
}

export function useContentOf(kind: ContentKind) {
  const q = useContent();
  return (q.data ?? []).filter((i) => i.kind === kind);
}

export const pick = (item: ContentItem, field: "title" | "body", lang: Lang) =>
  (lang === "en" ? item[`${field}_en`] : "") || item[`${field}_es`];

export async function uploadMedia(file: File) {
  const path = `${crypto.randomUUID()}-${file.name.replace(/[^\w.-]+/g, "_")}`;
  const { error } = await supabase.storage.from("media").upload(path, file, { contentType: file.type });
  if (error) throw error;
  const { data, error: e2 } = await supabase.storage.from("media").createSignedUrl(path, 60 * 60 * 24 * 365 * 20);
  if (e2) throw e2;
  return data.signedUrl;
}

export function youtubeId(url?: string | null) {
  if (!url) return null;
  const m = url.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/);
  return m ? m[1] : null;
}
