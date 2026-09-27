import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useVault } from "@/lib/use-vault";

const links = [
  { to: "/study", label: "Study" },
  { to: "/library", label: "Library" },
  { to: "/read", label: "Reading" },
  { to: "/history", label: "History" },
  { to: "/about", label: "About" },
] as const;

export function Shell({ children }: { children: ReactNode }) {
  const { vault, commit } = useVault();
  const sound = vault?.settings.sound === true;

  return (
    <div className="night-shell min-h-screen text-paper">
      <header className="border-b border-line/80">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-4">
          <Link to="/" className="font-serif text-xl tracking-tight text-gold-2">
            Night School
          </Link>
          <nav className="flex flex-wrap items-center gap-x-1">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="inline-flex min-h-11 items-center px-3 text-sm text-muted"
                activeProps={{ className: "inline-flex min-h-11 items-center px-3 text-sm text-gold-2" }}
              >
                {link.label}
              </Link>
            ))}
            <button
              type="button"
              className="inline-flex min-h-11 items-center px-3 text-sm text-muted"
              aria-pressed={sound}
              onClick={() =>
                commit((current) => ({
                  ...current,
                  settings: { ...current.settings, sound: !current.settings.sound },
                }))
              }
            >
              Sound {sound ? "on" : "off"}
            </button>
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl px-4 py-8">{children}</main>
    </div>
  );
}

export const btn =
  "inline-flex min-h-11 items-center justify-center rounded-full bg-gold px-5 text-sm font-medium text-ink disabled:cursor-not-allowed disabled:opacity-40";
export const btnQuiet =
  "inline-flex min-h-11 items-center justify-center rounded-full border border-line px-5 text-sm text-paper disabled:cursor-not-allowed disabled:opacity-40";
