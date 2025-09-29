import { useState, useEffect } from "react";

function App() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const root = document.documentElement;
    if (dark) root.classList.add("dark");
    else root.classList.remove("dark");
  }, [dark]);

  return (
    <main className="container-page py-10 transition-colors min-h-screen bg-neutral-50 dark:bg-neutral-900 dark:text-neutral-100">
      <header className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            GDG Blog App
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Frontend scaffolding in progress.
          </p>
        </div>
        <button
          onClick={() => setDark((d) => !d)}
          className="btn-outline"
          aria-label="Toggle dark mode"
        >
          {dark ? "Light" : "Dark"} mode
        </button>
      </header>
      <section className="space-y-4">
        <h2 className="text-lg font-medium">Upcoming Routes</h2>
        <ul className="list-disc pl-5 text-sm marker:text-brand-600 space-y-1">
          <li>Home: blog list</li>
          <li>Blog detail: /blog/:slug</li>
          <li>Create: protected form</li>
          <li>Auth: login / signup</li>
        </ul>
        <div className="card">
          <p className="text-sm text-neutral-700 dark:text-neutral-300 mb-2">
            Typography sample:
          </p>
          <article className="prose-blog">
            <h3>Design Goals</h3>
            <p>
              A clean, distraction-free reading experience with responsive
              layout, accessible components, and elegant dark mode.
            </p>
          </article>
        </div>
      </section>
    </main>
  );
}

export default App;
