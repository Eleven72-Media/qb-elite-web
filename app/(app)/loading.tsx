/**
 * Route-group loading skeleton — Next renders this instantly while the
 * server component for the matched page is fetching data. Huge UX win
 * on slow networks: nav feels snappy even when SSR takes a beat.
 */
export default function AppLoading() {
  return (
    <div className="mx-auto w-full max-w-[820px] animate-pulse px-5 pt-2 md:px-6">
      <div className="h-5 w-40 rounded bg-muted" />
      <div className="mt-2 h-3 w-56 rounded bg-muted/70" />

      <div className="mt-5 h-[180px] w-full rounded-[20px] bg-muted" />

      <div className="mt-6 h-5 w-32 rounded bg-muted" />
      <div className="mt-3 space-y-3">
        <div className="h-[88px] w-full rounded-2xl bg-muted/80" />
        <div className="h-[88px] w-full rounded-2xl bg-muted/80" />
        <div className="h-[88px] w-full rounded-2xl bg-muted/80" />
      </div>
    </div>
  );
}
