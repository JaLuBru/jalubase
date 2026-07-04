"use server";

import { revalidatePath } from "next/cache";
import { createCapture, captureInputSchema } from "@/lib/captures";

export type CaptureFormState = {
  ok: boolean;
  message: string;
};

export async function saveCapture(
  _previousState: CaptureFormState,
  formData: FormData
): Promise<CaptureFormState> {
  const parsed = captureInputSchema.safeParse({
    title: formData.get("title"),
    body: formData.get("body"),
    captureType: formData.get("captureType") || "raw_thought",
    domain: formData.get("domain") || "things_to_remember",
    sourceUrl: formData.get("sourceUrl"),
    tags: formData.get("tags"),
    resurfaceOn: formData.get("resurfaceOn")
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Could not save capture."
    };
  }

  await createCapture(parsed.data);
  revalidatePath("/");

  return {
    ok: true,
    message: "Saved to your capture inbox."
  };
}
