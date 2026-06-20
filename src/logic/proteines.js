// ── LOGIQUE — SÉLECTION DES PROTÉINES ─────────────────────────────────────────
// Toute modification du COMPORTEMENT d'alternance/priorisation des protéines
// se fait UNIQUEMENT ici. Les données (listes de plats) sont dans /data/proteines.js.

import { VR_LOCAL, VB_LOCAL, PO_LOCAL, VR_INTER, VB_INTER, PO_INTER } from "../data/proteines";
import { pickNR, prioritize } from "./utils";

// Détermine la catégorie de viande à servir pour un jour donné, selon le mode
// de service (buffet ou individuel) — garantit l'alternance rouge/blanc/poisson.
export function getTypeViande(idx, grand) {
  if (grand) return idx % 2 === 0 ? "rouge" : "blanc";
  const c = idx % 4;
  return c === 0 ? "rouge" : c === 1 ? "poisson" : c === 2 ? "blanc" : "poisson";
}

// Sélectionne la ou les protéines du jour pour le déjeuner.
// Retourne { str, noms } où str est la chaîne d'affichage et noms le tableau
// des noms de recette exacts (utilisé pour la compatibilité accompagnements).
export function getProteines(style, nb, idx, usedP, produitsP = [], ruptureP = []) {
  const grand = nb > 5;
  const cat = getTypeViande(idx, grand);
  const VR = style === "international" ? VR_INTER : VR_LOCAL;
  const VB = style === "international" ? VB_INTER : VB_LOCAL;
  const PO = style === "international" ? PO_INTER : PO_LOCAL;

  if (grand) {
    const v = pickNR(prioritize(cat === "rouge" ? VR : VB, produitsP, ruptureP), usedP);
    const p = pickNR(prioritize(PO, produitsP, ruptureP), usedP);
    return {
      str: [v, p].filter(Boolean).map(x => x.n + " (" + x.t + ")").join(" / "),
      noms: [v ? v.n : "", p ? p.n : ""],
    };
  }

  if (cat === "poisson") {
    const p = pickNR(prioritize(PO, produitsP, ruptureP), usedP) || { n: "Poisson grille" };
    return { str: p.n + " (poisson)", noms: [p.n] };
  }
  const src = cat === "rouge" ? VR : VB;
  const p = pickNR(prioritize(src, produitsP, ruptureP), usedP);
  return { str: p ? p.n + " (" + p.t + ")" : "—", noms: [p ? p.n : ""] };
}
