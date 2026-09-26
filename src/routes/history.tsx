import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { Shell } from "@/components/shell";
import { useVault } from "@/lib/use-vault";

export const Route = createFileRoute("/history")({ component: History });

function History() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const nested = pathname.replace(/\/$/, "").startsWith("/history/");
  if (nested) return <Outlet />;
  return <HistoryList />;
}

function HistoryList() {
  const { vault, ready } = useVault();
  const items = vault?.history ?? [];

  return (
    <Shell>
      <h1 className="font-serif text-4xl">History</h1>
      <p className="mt-3 max-w-xl text-muted">The latest forty readings stay in this browser. One can be deleted. There is no erase-all.</p>
      {vault?.saveError ? <p className="mt-4 text-sm text-rose">{vault.saveError}</p> : null}
      {ready && items.length === 0 ? <p className="mt-8">No readings yet.</p> : null}
      <ul className="mt-6 divide-y divide-line border-y border-line">
        {items.map((reading) => (
          <li key={reading.id}>
            <Link to="/history/$readingId" params={{ readingId: reading.id }} className="block py-4">
              <p className="font-serif text-xl">{reading.question || "Unfocused reading"}</p>
              <p className="mt-1 text-sm text-muted">
                {reading.spreadId} · {new Date(reading.createdAt).toLocaleString()} · {reading.seats.map((seat) => seat.cardName).join(", ")}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </Shell>
  );
}
