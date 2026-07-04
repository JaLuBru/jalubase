import { z } from "zod";
import { getPool } from "@/lib/db";
import { captureTypes, domains, type Capture } from "@/lib/types";

export const captureInputSchema = z.object({
  title: z.string().trim().max(160).optional(),
  body: z.string().trim().min(1, "Capture text is required."),
  captureType: z.enum(captureTypes).default("raw_thought"),
  domain: z.enum(domains).default("things_to_remember"),
  sourceUrl: z.string().trim().url().optional().or(z.literal("")),
  tags: z.string().trim().optional(),
  resurfaceOn: z.string().optional().or(z.literal(""))
});

export async function listCaptures(query?: string): Promise<Capture[]> {
  const pool = getPool();
  const hasQuery = Boolean(query?.trim());

  const result = await pool.query<Capture>(
    hasQuery
      ? `select *
         from captures
         where body ilike $1
            or title ilike $1
            or source_url ilike $1
            or $2 = any(tags)
         order by created_at desc
         limit 50`
      : `select *
         from captures
         order by created_at desc
         limit 50`,
    hasQuery ? [`%${query}%`, query] : []
  );

  return result.rows;
}

export async function createCapture(input: z.infer<typeof captureInputSchema>) {
  const pool = getPool();
  const tags = input.tags
    ? input.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)
    : [];

  await pool.query(
    `insert into captures
      (title, body, capture_type, domain, source_url, tags, resurface_on)
     values
      ($1, $2, $3, $4, $5, $6, $7)`,
    [
      input.title || null,
      input.body,
      input.captureType,
      input.domain,
      input.sourceUrl || null,
      tags,
      input.resurfaceOn || null
    ]
  );
}
