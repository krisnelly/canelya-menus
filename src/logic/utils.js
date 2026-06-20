// ── UTILITAIRES PURS ──────────────────────────────────────────────────────────
// Fonctions génériques sans dépendance aux données métier. Aucune modification
// de recette/règle métier ne doit se faire ici — voir /data et les autres
// fichiers de /logic pour ça.

// Sélection aléatoire simple avec exclusion
export function pick(arr, excl = [], n = 1) {
  const av = arr.filter(x => !excl.includes(typeof x === "object" ? x.n : x));
  const pool = av.length ? av : arr;
  const sh = [...pool].sort(() => Math.random() - 0.5);
  return n === 1 ? sh[0] : sh.slice(0, n);
}

// Sélection garantissant l'absence de répétition par rapport à `used`
// (alternance jour après jour / élément après élément)
export function pickNR(arr, used, n = 1) {
  const av = arr.filter(x => {
    const k = typeof x === "object" ? x.n : x;
    return !used.includes(k);
  });
  const sh = [...av].sort(() => Math.random() - 0.5);
  if (n === 1) {
    if (!sh.length) {
      const last = used[used.length - 1];
      const fb = arr.filter(x => (typeof x === "object" ? x.n : x) !== last);
      return [...(fb.length ? fb : arr)].sort(() => Math.random() - 0.5)[0];
    }
    return sh[0];
  }
  if (sh.length >= n) return sh.slice(0, n);
  const extra = arr
    .filter(x => !sh.map(s => (typeof s === "object" ? s.n : s)).includes(typeof x === "object" ? x.n : x))
    .sort(() => Math.random() - 0.5);
  return [...sh, ...extra].slice(0, n);
}

// Exclut tout élément contenant un mot-clé de rupture de stock
export function filtreRupture(arr, ruptureP) {
  if (!ruptureP || !ruptureP.length) return arr;
  return arr.filter(x => !ruptureP.some(r => (typeof x === "object" ? x.n : x).toLowerCase().includes(r)));
}

// Met en tête de liste les éléments correspondant aux produits à écouler
export function prioritize(arr, produitsP, ruptureP) {
  const filtered = filtreRupture(arr, ruptureP);
  if (!produitsP || !produitsP.length) return filtered;
  const prio = filtered.filter(p => produitsP.some(pp => (typeof p === "object" ? p.n : p).toLowerCase().includes(pp)));
  const rest = filtered.filter(p => !produitsP.some(pp => (typeof p === "object" ? p.n : p).toLowerCase().includes(pp)));
  return [...prio, ...rest];
}

// Calcule une heure de départ en soustrayant `h` heures à une heure donnée (HH:MM)
export function heureDepart(heure, h) {
  if (!heure) return "—";
  const [hh, mm] = heure.split(":").map(Number);
  let hd = hh - h;
  if (hd < 0) hd += 24;
  return String(hd).padStart(2, "0") + ":" + String(mm).padStart(2, "0");
}

// Génère un numéro de devis unique basé sur la date/heure courante
export function numDevis() {
  const n = new Date();
  return (
    "DEV-" +
    n.getFullYear() +
    String(n.getMonth() + 1).padStart(2, "0") +
    String(n.getDate()).padStart(2, "0") +
    "-" +
    String(n.getHours()).padStart(2, "0") +
    String(n.getMinutes()).padStart(2, "0") +
    "-001"
  );
}
