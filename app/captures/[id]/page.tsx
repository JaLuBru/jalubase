import { notFound } from "next/navigation";
import { changeCaptureStatusAndReturn } from "@/app/actions";
import { DeleteCaptureButton } from "@/app/delete-capture-button";
import { getCapture } from "@/lib/captures";

type CaptureDetailProps = {
  params: Promise<{
    id: string;
  }>;
};

function formatDate(value: string | null) {
  if (!value) return "Not set";
  return new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    year: "numeric"
  }).format(new Date(value));
}

function labelFromValue(value: string) {
  return value.replaceAll("_", " ");
}

export default async function CaptureDetail({ params }: CaptureDetailProps) {
  const { id } = await params;
  const capture = await getCapture(id);

  if (!capture) {
    notFound();
  }

  return (
    <main className="detail-page">
      <a className="back-link" href="/">
        Back to inbox
      </a>

      <article className="detail-panel">
        <div className="capture-meta">
          <span>{labelFromValue(capture.capture_type)}</span>
          <span>{labelFromValue(capture.domain)}</span>
          <span>{capture.status}</span>
        </div>

        <h1>{capture.title || "Untitled capture"}</h1>
        <p className="detail-body">{capture.body}</p>

        {capture.source_url ? (
          <a href={capture.source_url} target="_blank" rel="noreferrer">
            Open source
          </a>
        ) : null}

        <dl className="detail-list">
          <div>
            <dt>Resurface</dt>
            <dd>{formatDate(capture.resurface_on)}</dd>
          </div>
          <div>
            <dt>Created</dt>
            <dd>{formatDate(capture.created_at)}</dd>
          </div>
          <div>
            <dt>Tags</dt>
            <dd>{capture.tags.length ? capture.tags.join(", ") : "None yet"}</dd>
          </div>
        </dl>

        <div className="card-actions">
          <a href={`/captures/${capture.id}/edit`}>Edit</a>
          {capture.status !== "saved" ? (
            <form action={changeCaptureStatusAndReturn}>
              <input name="id" type="hidden" value={capture.id} />
              <input name="status" type="hidden" value="saved" />
              <button type="submit">Save</button>
            </form>
          ) : null}
          {capture.status !== "inbox" ? (
            <form action={changeCaptureStatusAndReturn}>
              <input name="id" type="hidden" value={capture.id} />
              <input name="status" type="hidden" value="inbox" />
              <button type="submit" className="secondary-button">
                Move to inbox
              </button>
            </form>
          ) : null}
          {capture.status !== "archived" ? (
            <form action={changeCaptureStatusAndReturn}>
              <input name="id" type="hidden" value={capture.id} />
              <input name="status" type="hidden" value="archived" />
              <button type="submit" className="secondary-button">
                Archive
              </button>
            </form>
          ) : null}
          <DeleteCaptureButton id={capture.id} />
        </div>
      </article>
    </main>
  );
}
