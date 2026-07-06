import { CaptureForm } from "@/app/capture-form";
import { ThemeToggle } from "@/app/theme-toggle";
import { listCaptures } from "@/lib/captures";

type HomeProps = {
  searchParams?: Promise<{
    q?: string;
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
  const query = params?.q?.trim() ?? "";
  const captures = await listCaptures(query);
  const inboxCount = captures.filter((capture) => capture.status === "inbox").length;
  const resurfacingCount = captures.filter((capture) => capture.resurface_on).length;

  return (
    <main>
      <section className="intro">
        <div>
          <div className="topline">
            <p className="eyebrow">Personal Dashboard</p>
            <ThemeToggle />
          </div>
          <h1>Capture first. Remember on purpose.</h1>
          <p className="lede">
            A quiet place for thoughts, links, quotes, people notes, learning
            plans, and anything else that should not vanish just because it is
            out of sight.
          </p>
        </div>
        <div className="summary-strip" aria-label="Dashboard summary">
          <div>
            <strong>{captures.length}</strong>
            <span>saved items</span>
          </div>
          <div>
            <strong>{inboxCount}</strong>
            <span>in inbox</span>
          </div>
          <div>
            <strong>{resurfacingCount}</strong>
            <span>set to resurface</span>
          </div>
        </div>
      </section>

      <section className="workspace">
        <div className="panel capture-panel">
          <div className="panel-heading">
            <h2>Quick Capture</h2>
            <p>Start messy. The system can help organize later.</p>
          </div>
          <CaptureForm />
        </div>

        <div className="panel">
          <div className="panel-heading">
            <h2>Memory Inbox</h2>
            <p>Recently saved items and anything matching your search.</p>
          </div>

          <form className="search" action="/">
            <input
              name="q"
              defaultValue={query}
              placeholder="Search notes, links, tags, quotes..."
            />
            <button type="submit">Search</button>
          </form>

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
                </article>
              ))
            ) : (
              <div className="empty-state">
                <h3>No captures yet</h3>
                <p>
                  Add the first thing you want to remember. A thought, a link, a
                  person detail, a quote, or a learning note all count.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
