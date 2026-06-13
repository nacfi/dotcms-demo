/**
 * Shown on the home route before the dotCMS connection is configured, so the
 * first `npm run dev` is a helpful checklist instead of a 404.
 */
export function SetupNotice() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-20">
      <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
        Almost there
      </p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
        Connect your dotCMS instance
      </h1>
      <p className="mt-3 text-slate-600">
        The app is running, but no dotCMS credentials are set yet. Add them and
        restart the dev server:
      </p>

      <ol className="mt-6 space-y-3 text-slate-700">
        <li className="flex gap-3">
          <span className="grid h-6 w-6 flex-none place-items-center rounded-full bg-slate-900 text-xs font-bold text-white">
            1
          </span>
          <span>
            Copy the env template:{" "}
            <code className="rounded bg-slate-100 px-1.5 py-0.5 text-sm">
              cp .env.example .env.local
            </code>
          </span>
        </li>
        <li className="flex gap-3">
          <span className="grid h-6 w-6 flex-none place-items-center rounded-full bg-slate-900 text-xs font-bold text-white">
            2
          </span>
          <span>
            Set <code className="rounded bg-slate-100 px-1.5 py-0.5 text-sm">NEXT_PUBLIC_DOTCMS_HOST</code>{" "}
            and a read-only{" "}
            <code className="rounded bg-slate-100 px-1.5 py-0.5 text-sm">NEXT_PUBLIC_DOTCMS_AUTH_TOKEN</code>.
          </span>
        </li>
        <li className="flex gap-3">
          <span className="grid h-6 w-6 flex-none place-items-center rounded-full bg-slate-900 text-xs font-bold text-white">
            3
          </span>
          <span>
            Restart{" "}
            <code className="rounded bg-slate-100 px-1.5 py-0.5 text-sm">
              npm run dev
            </code>
            . See the README for tokens, Site ID, and enabling UVE.
          </span>
        </li>
      </ol>
    </div>
  );
}
