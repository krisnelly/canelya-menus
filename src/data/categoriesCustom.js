// ── DONNÉES — CATÉGORIES CONFIGURABLES (items custom) ─────────────────────────
// Liste des catégories « listes simples » que l'utilisateur peut enrichir via
// l'onglet Configuration. La clé `key` correspond EXACTEMENT au nom du pool
// dans data/menus.js, ce qui permet au moteur de fusionner automatiquement les
// items custom dans la bonne liste.
//
// Les protéines et accompagnements NE sont PAS ici : ils portent des règles de
// compatibilité (étape ultérieure).

export const CATEGORIES_CUSTOM = [
  { key: "MATIN_SUCRES_BLE",       label: "Pause café matin — Sucré (blé / viennoiserie)", four: "SUPERMARCHE" },
  { key: "MATIN_SUCRES_ALT",       label: "Pause café matin — Sucré (fonio / manioc)",     four: "PATISSERIE" },
  { key: "MATIN_SALES",            label: "Pause café matin — Salé",                        four: "PATISSERIE" },
  { key: "MATIN_FRUITS",           label: "Pause café matin — Fruits",                      four: "MARCHE" },
  { key: "MATIN_BOUILLIES",        label: "Pause café matin — Bouillie",                    four: "FOURNISSEUR" },
  { key: "MATIN_BOISSONS",         label: "Pause café matin — Boisson froide",              four: "MARCHE" },
  { key: "ENTREES",                label: "Déjeuner — Entrée",                              four: "MARCHE" },
  { key: "DESSERTS",               label: "Déjeuner — Dessert",                             four: "PATISSERIE" },
  { key: "DEJ_BOISSONS",           label: "Déjeuner — Boisson",                             four: "MARCHE" },
  { key: "APM_SUCRES_BLE",         label: "Pause café APM — Sucré (blé)",                   four: "PATISSERIE" },
  { key: "APM_SUCRES_ALT",         label: "Pause café APM — Sucré (alternatif)",            four: "FOURNISSEUR" },
  { key: "APM_SALES",              label: "Pause café APM — Salé",                          four: "FOURNISSEUR" },
  { key: "APM_BOISSONS",           label: "Pause café APM — Boisson",                       four: "MARCHE" },
  { key: "COCKTAIL_SALES",         label: "Cocktail — Salé",                                four: "PATISSERIE" },
  { key: "COCKTAIL_SUCRES",        label: "Cocktail — Sucré",                               four: "PATISSERIE" },
  { key: "COCKTAIL_BOISSONS_SOFT", label: "Cocktail — Boisson sans alcool",                 four: "MARCHE" },
  { key: "COCKTAIL_BOISSONS_ALC",  label: "Cocktail — Boisson alcoolisée",                  four: "SUPERMARCHE" },
];

// Fournisseurs disponibles (mêmes clés que dans api/_genFicheAchat.js → FOURN)
export const FOURNISSEURS_CUSTOM = [
  { key: "VOLAILLER",   label: "Volailler (poulet)" },
  { key: "BOUCHER",     label: "Boucher (bœuf / mouton)" },
  { key: "POISSONNIER", label: "Poissonnier" },
  { key: "MARCHE",      label: "Marché (légumes, fruits, tubercules)" },
  { key: "PATISSERIE",  label: "Pâtisserie / fait maison" },
  { key: "FOURNISSEUR", label: "Fournisseur / commande (partenaires)" },
  { key: "SUPERMARCHE", label: "Supermarché / épicerie" },
];

export const labelCategorie = key => (CATEGORIES_CUSTOM.find(c => c.key === key) || {}).label || key;
export const labelFournisseur = key => (FOURNISSEURS_CUSTOM.find(f => f.key === key) || {}).label || key;
