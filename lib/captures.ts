import { z } from "zod";
import { getPool } from "@/lib/db";
import { captureTypes, domains, type Capture, type CaptureStatus } from "@/lib/types";

export const captureInputSchema = z.object({
  title: z.string().trim().max(160).optional(),
  body: z.string().trim().min(1, "Capture text is required."),
  captureType: z.enum(captureTypes).default("raw_thought"),
  domain: z.enum(domains).default("things_to_remember"),
  sourceUrl: z.string().trim().url().optional().or(z.literal("")),
  tags: z.string().trim().optional(),
  resurfaceOn: z.string().optional().or(z.literal(""))
});

export const captureUpdateSchema = captureInputSchema.extend({
  id: z.string().uuid()
});

export async function listCaptures(
  query?: string,
  status?: CaptureStatus | "all"
): Promise<Capture[]> {
  const pool = getPool();
  const hasQuery = Boolean(query?.trim());
  const hasStatus = Boolean(status && status !== "all");

  const conditions: string[] = [];
  const values: string[] = [];

  if (hasQuery && query) {
    values.push(`%${query}%`, query);
    conditions.push(
      `(body ilike $1 or title ilike $1 or source_url ilike $1 or $2 = any(tags))`
    );
  }

  if (hasStatus && status) {
    values.push(status);
    conditions.push(`status = $${values.length}`);
  }

  const whereClause = conditions.length ? `where ${conditions.join(" and ")}` : "";
  const result = await pool.query<Capture>(
    `select *
     from captures
     ${whereClause}
     order by created_at desc
     limit 50`,
    values
  );

  return result.rows;
}

export async function getCapture(id: string): Promise<Capture | null> {
  const pool = getPool();
  const result = await pool.query<Capture>("select * from captures where id = $1", [
    id
  ]);

  return result.rows[0] ?? null;
}

export async function listDueCaptures(): Promise<Capture[]> {
  const pool = getPool();
  const result = await pool.query<Capture>(
    `select *
     from captures
     where resurface_on is not null
       and resurface_on <= current_date
       and status != 'archived'
     order by resurface_on asc, created_at desc
     limit 12`
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

export async function updateCaptureStatus(id: string, status: CaptureStatus) {
  const pool = getPool();

  await pool.query(
    `update captures
     set status = $2,
         updated_at = now()
     where id = $1`,
    [id, status]
  );
}

export async function updateCaptureResurface(id: string, resurfaceOn: string | null) {
  const pool = getPool();

  await pool.query(
    `update captures
     set resurface_on = $2,
         updated_at = now()
     where id = $1`,
    [id, resurfaceOn]
  );
}

export async function updateCapture(input: z.infer<typeof captureUpdateSchema>) {
  const pool = getPool();
  const tags = input.tags
    ? input.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)
    : [];

  await pool.query(
    `update captures
     set title = $2,
         body = $3,
         capture_type = $4,
         domain = $5,
         source_url = $6,
         tags = $7,
         resurface_on = $8,
         updated_at = now()
     where id = $1`,
    [
      input.id,
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

export async function deleteCapture(id: string) {
  const pool = getPool();
  await pool.query("delete from captures where id = $1", [id]);
}
