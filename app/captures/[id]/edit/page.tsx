import { notFound } from "next/navigation";
import { saveCaptureEdits } from "@/app/actions";
import { getCapture } from "@/lib/captures";
import { captureTypes, domains } from "@/lib/types";

type EditCaptureProps = {
  params: Promise<{
    id: string;
  }>;
};

function labelFromValue(value: string) {
  return value
    .split("_")
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(" ");
}

function dateValue(value: string | null) {
  if (!value) return "";
  return value.slice(0, 10);
}

export default async function EditCapture({ params }: EditCaptureProps) {
  const { id } = await params;
  const capture = await getCapture(id);

  if (!capture) {
    notFound();
  }

  return (
    <main className="detail-page">
      <a className="back-link" href={`/captures/${capture.id}`}>
        Back to memory
      </a>

      <section className="detail-panel">
        <h1>Edit memory</h1>
        <form action={saveCaptureEdits} className="capture-form edit-form">
          <input name="id" type="hidden" value={capture.id} />

          <div className="field">
            <label htmlFor="body">Memory or note</label>
            <textarea
              id="body"
              name="body"
              rows={9}
              required
              defaultValue={capture.body}
            />
          </div>

          <div className="form-grid">
            <div className="field">
              <label htmlFor="title">Title</label>
              <input id="title" name="title" defaultValue={capture.title ?? ""} />
            </div>

            <div className="field">
              <label htmlFor="captureType">Type</label>
              <select
                id="captureType"
                name="captureType"
                defaultValue={capture.capture_type}
              >
                {captureTypes.map((type) => (
                  <option key={type} value={type}>
                    {labelFromValue(type)}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label htmlFor="domain">Domain</label>
              <select id="domain" name="domain" defaultValue={capture.domain}>
                {domains.map((domain) => (
                  <option key={domain} value={domain}>
                    {labelFromValue(domain)}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label htmlFor="resurfaceOn">Resurface on</label>
              <input
                id="resurfaceOn"
                name="resurfaceOn"
                type="date"
                defaultValue={dateValue(capture.resurface_on)}
              />
            </div>

            <div className="field">
              <label htmlFor="sourceUrl">Link</label>
              <input
                id="sourceUrl"
                name="sourceUrl"
                defaultValue={capture.source_url ?? ""}
              />
            </div>

            <div className="field">
              <label htmlFor="tags">Tags</label>
              <input id="tags" name="tags" defaultValue={capture.tags.join(", ")} />
            </div>
          </div>

          <div className="form-footer">
            <button type="submit">Save changes</button>
            <a className="text-link" href={`/captures/${capture.id}`}>
              Cancel
            </a>
          </div>
        </form>
      </section>
    </main>
  );
}
