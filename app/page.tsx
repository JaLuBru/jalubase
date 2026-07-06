import { CaptureForm } from "@/app/capture-form";
import { changeCaptureStatus } from "@/app/actions";
import { ResurfaceActions } from "@/app/resurface-actions";
import { ThemeToggle } from "@/app/theme-toggle";
import { cookies } from "next/headers";
import { listCaptures, listDueCaptures } from "@/lib/captures";
import type { CaptureStatus } from "@/lib/types";

type HomeProps = {
  searchParams?: Promise<{
    q?: string;
    status?: string;
  }>;
};

function formatDate(value: string | null) {
  if (!value) return null;
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(new Date(value));
}

function labelFromValue(value: string) {
  return value.replaceAll("_", " ");
}

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const cookieStore = await cookies();
  const savedTheme = cookieStore.get("theme")?.value;
  const theme = savedTheme === "light" ? "light" : "dark";
  const query = params?.q?.trim() ?? "";
  const status = parseStatus(params?.status);
  const [captures, dueCaptures] = await Promise.all([
    listCaptures(query, status),
    listDueCaptures()
  ]);
  const inboxCount = captures.filter((capture) => capture.status === "inbox").length;

  return (
    <main>
      <section className="intro">
        <div className="topline">
          <h1>Jalubase</h1>
          <ThemeToggle initialTheme={theme} />
        </div>
        <div className="summary-strip" aria-label="Dashboard summary">
          <div>
            <strong>{captures.length}</strong>
            <span>items</span>
          </div>
          <div>
            <strong>{inboxCount}</strong>
            <span>inbox</span>
          </div>
          <div>
            <strong>{dueCaptures.length}</strong>
            <span>resurface</span>
          </div>
        </div>
      </section>

      <section className="workspace">
        <div className="panel capture-panel">
          <div className="panel-heading">
            <h2>Capture</h2>
          </div>
          <CaptureForm />
        </div>

        <div className="panel">
          <div className="panel-heading">
            <h2>Memory</h2>
          </div>

          {dueCaptures.length ? (
            <section className="due-strip" aria-label="Due resurfacing items">
              {dueCaptures.map((capture) => (
                <article key={capture.id} className="due-item">
                  <a href={`/captures/${capture.id}`}>
                    {capture.title || capture.body.slice(0, 80)}
                  </a>
                  <ResurfaceActions id={capture.id} compact />
                </article>
              ))}
            </section>
          ) : null}

          <form className="search" action="/">
            <input name="q" defaultValue={query} placeholder="Search" />
            <input name="status" type="hidden" value={status} />
            <button type="submit">Search</button>
          </form>

          <nav className="status-tabs" aria-label="Capture status filters">
            {(["inbox", "saved", "archived", "all"] as const).map((item) => (
              <a
                key={item}
                className={status === item ? "active" : ""}
                href={`/?status=${item}${query ? `&q=${encodeURIComponent(query)}` : ""}`}
              >
                {labelFromValue(item)}
              </a>
            ))}
          </nav>

          <div className="capture-list">
            {captures.length ? (
              captures.map((capture) => (
                <article key={capture.id} className="capture-card">
                  <div className="capture-meta">
                    <span>{labelFromValue(capture.capture_type)}</span>
                    <span>{labelFromValue(capture.domain)}</span>
                    {capture.resurface_on ? (
                      <span>Resurface {formatDate(capture.resurface_on)}</span>
                    ) : null}
                  </div>
                  <h3>{capture.title || "Untitled capture"}</h3>
                  <p>{capture.body}</p>
                  {capture.source_url ? (
                    <a href={capture.source_url} target="_blank" rel="noreferrer">
                      Open source
                    </a>
                  ) : null}
                  {capture.tags.length ? (
                    <div className="tags">
                      {capture.tags.map((tag) => (
                        <span key={tag}>{tag}</span>
                      ))}
                    </div>
                  ) : null}
                  <div className="card-actions">
                    <a href={`/captures/${capture.id}`}>Open</a>
                    <a href={`/captures/${capture.id}/edit`}>Edit</a>
                    {capture.status !== "saved" ? (
                      <form action={changeCaptureStatus}>
                        <input name="id" type="hidden" value={capture.id} />
                        <input name="status" type="hidden" value="saved" />
                        <button type="submit">Save</button>
                      </form>
                    ) : null}
                    {capture.status !== "archived" ? (
                      <form action={changeCaptureStatus}>
                        <input name="id" type="hidden" value={capture.id} />
                        <input name="status" type="hidden" value="archived" />
                        <button type="submit" className="secondary-button">
                          Archive
                        </button>
                      </form>
                    ) : null}
                  </div>
                </article>
              ))
            ) : (
              <div className="empty-state">
                <h3>Empty</h3>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

function parseStatus(value?: string): CaptureStatus | "all" {
  if (value === "saved" || value === "archived" || value === "all") {
    return value;
  }

  return "inbox";
}
