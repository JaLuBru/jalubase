"use client";

import { useActionState } from "react";
import { saveCapture, type CaptureFormState } from "@/app/actions";
import { captureTypes, domains } from "@/lib/types";

const initialState: CaptureFormState = {
  ok: false,
  message: ""
};

function labelFromValue(value: string) {
  return value
    .split("_")
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(" ");
}

export function CaptureForm() {
  const [state, action, isPending] = useActionState(saveCapture, initialState);

  return (
    <form action={action} className="capture-form">
      <div className="field">
        <label htmlFor="body">Quick capture</label>
        <textarea
          id="body"
          name="body"
          placeholder="Dictate or jot down anything you want to remember..."
          rows={7}
          required
        />
      </div>

      <div className="form-grid">
        <div className="field">
          <label htmlFor="title">Optional title</label>
          <input id="title" name="title" placeholder="Short label" />
        </div>

        <div className="field">
          <label htmlFor="captureType">Type</label>
          <select id="captureType" name="captureType" defaultValue="raw_thought">
            {captureTypes.map((type) => (
              <option key={type} value={type}>
                {labelFromValue(type)}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="domain">Domain</label>
          <select id="domain" name="domain" defaultValue="things_to_remember">
            {domains.map((domain) => (
              <option key={domain} value={domain}>
                {labelFromValue(domain)}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="resurfaceOn">Resurface on</label>
          <input id="resurfaceOn" name="resurfaceOn" type="date" />
        </div>

        <div className="field">
          <label htmlFor="sourceUrl">Link</label>
          <input id="sourceUrl" name="sourceUrl" placeholder="https://..." />
        </div>

        <div className="field">
          <label htmlFor="tags">Tags</label>
          <input id="tags" name="tags" placeholder="comma, separated" />
        </div>
      </div>

      <div className="form-footer">
        <button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : "Save capture"}
        </button>
        {state.message ? (
          <p className={state.ok ? "success" : "error"}>{state.message}</p>
        ) : null}
      </div>
    </form>
  );
}
