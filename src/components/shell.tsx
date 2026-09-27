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
      <header className="running-head">
        <div className="running-head-row">
          <Link to="/" className="wordmark">
            Night School
          </Link>
          <nav className="running-nav">
            {links.map((link) => (
              <Link key={link.to} to={link.to} className="running-link" activeProps={{ className: "running-link is-on" }}>
                {link.label}
              </Link>
            ))}
            <button
              type="button"
              className="sound-toggle"
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

export const btn = "act";
export const btnQuiet = "act-quiet";
export const btnSeal = "act-seal";
