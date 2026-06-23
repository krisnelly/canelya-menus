// ── LOGIQUE — CATALOGUES D'OPTIONS POUR LA CRÉATION MANUELLE ─────────────────
// Expose toutes les options sélectionnables par catégorie pour le mode manuel.
// Lecture seule des données existantes : ne modifie ni les listes ni les règles.

import * as M from "../data/menus";
import { VR_LOCAL, VB_LOCAL, PO_LOCAL, VR_INTER, VB_INTER, PO_INTER, LUNDI_PROTEINES } from "../data/proteines";
import { ACCOMP } from "../data/accompagnements";

const uniq = a => [...new Set(a.filter(Boolean))].sort((x, y) => x.localeCompare(y, "fr"));

// Toutes les protéines connues (toutes styles confondus) + protéines du lundi
export const PROTEINES_ALL = uniq([
  ...[...VR_LOCAL, ...VB_LOCAL, ...PO_LOCAL, ...VR_INTER, ...VB_INTER, ...PO_INTER].map(p => p.n),
  ...LUNDI_PROTEINES,
]);

// Tous les accompagnements connus (local + international + mixte)
export const ACCOMP_ALL = uniq([...ACCOMP.local, ...ACCOMP.international, ...ACCOMP.mixte]);

// Options de base par clé de catégorie « liste simple »
export const BASE_OPTIONS = {
  MATIN_SUCRES_BLE: M.MATIN_SUCRES_BLE,
  MATIN_SUCRES_ALT: M.MATIN_SUCRES_ALT,
  MATIN_SALES: M.MATIN_SALES,
  MATIN_FRUITS: M.MATIN_FRUITS,
  MATIN_BOUILLIES: M.MATIN_BOUILLIES,
  MATIN_BOISSONS: M.MATIN_BOISSONS,
  ENTREES: M.ENTREES,
  DESSERTS: M.DESSERTS,
  DEJ_BOISSONS: M.DEJ_BOISSONS,
  APM_SUCRES_BLE: M.APM_SUCRES_BLE,
  APM_SUCRES_ALT: M.APM_SUCRES_ALT,
  APM_SALES: M.APM_SALES,
  APM_BOISSONS: M.APM_BOISSONS,
  COCKTAIL_SALES: M.COCKTAIL_SALES,
  COCKTAIL_SUCRES: M.COCKTAIL_SUCRES,
  COCKTAIL_BOISSONS_SOFT: M.COCKTAIL_BOISSONS_SOFT,
  COCKTAIL_BOISSONS_ALC: M.COCKTAIL_BOISSONS_ALC,
  PROTEINES: PROTEINES_ALL,
  ACCOMPAGNEMENTS: ACCOMP_ALL,
};

// Renvoie la liste d'options pour une catégorie = base + items custom (config)
// + items ponctuels (ad-hoc) de cette même catégorie.
export function optionsFor(categoryKey, customItems = [], adHoc = []) {
  const base = BASE_OPTIONS[categoryKey] || [];
  const cust = (customItems || []).filter(it => it.category === categoryKey).map(it => it.nom);
  const ah = (adHoc || []).filter(it => it.category === categoryKey).map(it => it.nom);
  return uniq([...base, ...cust, ...ah]);
}
