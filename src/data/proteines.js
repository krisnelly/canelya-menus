// ── DONNÉES — PROTÉINES (VIANDES, POISSONS) ───────────────────────────────────
// Toute modification de recette/protéine se fait UNIQUEMENT ici.
// Ne touche ni à la logique de génération (logic/proteines.js) ni à l'UI.

export const VR_LOCAL = [
  { n: "Boeuf yassa",            t: "viande", cat: "rouge" },
  { n: "Brochette de boeuf",     t: "viande", cat: "rouge" },
  { n: "Choukouya de boeuf",     t: "viande", cat: "rouge" },
  { n: "Emince boeuf curry coco",t: "viande", cat: "rouge" },
  { n: "Ragout d'igname",        t: "viande", cat: "rouge" },
  { n: "Ragout de patate douce", t: "viande", cat: "rouge" },
];

export const VB_LOCAL = [
  { n: "Poulet yassa",             t: "viande", cat: "blanc" },
  { n: "Kedjenou de poulet",       t: "viande", cat: "blanc" },
  { n: "Poulet grille",            t: "viande", cat: "blanc" },
  { n: "Brochette de poulet",      t: "viande", cat: "blanc" },
  { n: "Choukouya de mouton",      t: "viande", cat: "blanc" },
  { n: "Feijoada",                 t: "viande", cat: "blanc" },
  { n: "Atassi",                   t: "viande", cat: "blanc" },
  { n: "Emince poulet curry coco", t: "viande", cat: "blanc" },
];

export const PO_LOCAL = [
  { n: "Thiebboudienne",        t: "poisson" },
  { n: "Djongoli",               t: "poisson" },
  { n: "Poisson grille",         t: "poisson" },
  { n: "Brochette de poisson",   t: "poisson" },
];

export const VR_INTER = [
  { n: "Emince boeuf curry coco", t: "viande", cat: "rouge" },
  { n: "Brochette de boeuf",      t: "viande", cat: "rouge" },
];

export const VB_INTER = [
  { n: "Emince poulet curry coco",  t: "viande", cat: "blanc" },
  { n: "Poulet grille",             t: "viande", cat: "blanc" },
  { n: "Couscous poulet merguez",   t: "viande", cat: "blanc" },
];

export const PO_INTER = [
  { n: "Poisson grille",       t: "poisson" },
  { n: "Brochette de poisson", t: "poisson" },
];

// ── RÈGLE DU LUNDI : plats simples / partenaires (peu de mise en place) ───────
export const LUNDI_PROTEINES = [
  "Thiebboudienne", "Sauce graine + Igname pilee", "Poulet yassa",
  "Choukouya de boeuf", "Kedjenou de poulet", "Poulet grille",
  "Poisson grille", "Brochette de poulet",
];

export const LUNDI_MATIN_SALES = [
  "Mini friand poisson", "Mini friand boeuf", "Mini quiche",
  "Mini pizza jambon", "Mini pizza boeuf", "Mini croissants", "Mini pains chocolat",
];

export const LUNDI_DESSERTS = ["Brownie fonio"];
