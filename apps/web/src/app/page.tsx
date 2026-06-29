const statusCards = [
  {
    label: "Failed Runs",
    value: "0",
    detail: "Waiting for GitHub data",
  },
  {
    label: "Failure Clusters",
    value: "0",
    detail: "Clustering starts after ingestion",
  },
  {
    label: "Triage Reports",
    value: "0",
    detail: "AI reports will appear here",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen px-6 py-8">
      <section className="mx-auto flex max-w-6xl flex-col gap-8">
        <header className="border-b border-slate-200 pb-6">
          <p className="text-sm font-medium uppercase tracking-wide text-slate-500">
            DevOps / SRE workflow tool
          </p>
          <h1 className="mt-3 text-4xl font-semibold text-slate-950">
            GitHub Incident Triage Agent
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
            A dashboard for detecting failed GitHub Actions runs, grouping
            related failures, and reviewing AI-assisted triage reports.
          </p>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          {statusCards.map((card) => (
            <article
              key={card.label}
              className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
            >
              <p className="text-sm font-medium text-slate-500">{card.label}</p>
              <p className="mt-3 text-3xl font-semibold text-slate-950">
                {card.value}
              </p>
              <p className="mt-2 text-sm text-slate-600">{card.detail}</p>
            </article>
          ))}
        </section>

        <section className="rounded-lg border border-dashed border-slate-300 bg-white p-6">
          <h2 className="text-lg font-semibold text-slate-950">
            Dashboard shell is running
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            The frontend is ready. In later phases, this page will read incident
            data from the API and display real workflow failures.
          </p>
        </section>
      </section>
    </main>
  );
}
