import { useCallback, useEffect, useState } from "react";
import { loadVault, saveVault, type Vault } from "@/lib/storage";

export function useVault() {
  const [vault, setVault] = useState<Vault | null>(null);

  useEffect(() => {
    setVault(loadVault());
  }, []);

  const commit = useCallback((update: (current: Vault) => Vault) => {
    setVault((prev) => {
      const base = prev ?? loadVault();
      return saveVault(update(base));
    });
  }, []);

  return { vault, ready: vault !== null, commit };
}
