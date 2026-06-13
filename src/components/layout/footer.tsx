export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-8 text-sm text-slate-500 sm:flex-row">
        <p>
          Built with{" "}
          <a
            href="https://dev.dotcms.com/docs/sdk-react-library"
            className="font-medium text-slate-700 underline-offset-2 hover:underline"
          >
            dotCMS React SDK
          </a>{" "}
          + Next.js.
        </p>
        <p>Front-End Sales Engineer technical challenge.</p>
      </div>
    </footer>
  );
}
