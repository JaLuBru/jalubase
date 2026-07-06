"use client";

import { deleteCaptureAndReturn } from "@/app/actions";

type DeleteCaptureButtonProps = {
  id: string;
};

export function DeleteCaptureButton({ id }: DeleteCaptureButtonProps) {
  return (
    <form
      action={deleteCaptureAndReturn}
      onSubmit={(event) => {
        if (!window.confirm("Delete this memory or note permanently?")) {
          event.preventDefault();
        }
      }}
    >
      <input name="id" type="hidden" value={id} />
      <button type="submit" className="danger-button">
        Delete
      </button>
    </form>
  );
}
