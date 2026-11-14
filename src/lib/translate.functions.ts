import { createServerFn } from "@tanstack/react-start";
import { generateResponse } from "@lovable.dev/ai-gateway";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

// Translates Spanish CMS fields to English for the bilingual landing page.
export const translateToEnglish = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { title: string; body: string }) => ({
    title: String(input.title ?? "").slice(0, 500),
    body: String(input.body ?? "").slice(0, 8000),
  }))
  .handler(async ({ data, context }) => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", { _user_id: context.userId, _role: "admin" });
    if (!isAdmin) throw new Error("Forbidden");
    if (!data.title && !data.body) return { title: "", body: "" };
    const res = await generateResponse({
      model: "openai/gpt-6-astra",
      instructions:
        "Translate the JSON values from Spanish to natural English for a Bolivian conservation NGO website. Keep proper names (species, places, program names in Spanish when they are names). Reply ONLY with JSON {\"title\":string,\"body\":string}.",
      input: JSON.stringify(data),
    });
    const out = (res as unknown as { output?: { type: string; content?: { type: string; text?: string }[] }[] }).output ?? [];
    const text = out.flatMap((o) => (o.type === "message" ? o.content ?? [] : [])).filter((c) => c.type === "output_text").map((c) => c.text ?? "").join("");
    const match = text.match(/\{[\s\S]*\}/);
    const parsed = match ? (JSON.parse(match[0]) as { title?: string; body?: string }) : {};
    return { title: parsed.title ?? "", body: parsed.body ?? "" };
  });
