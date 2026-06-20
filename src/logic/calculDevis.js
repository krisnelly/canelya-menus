// ── LOGIQUE — CALCUL DU DEVIS ──────────────────────────────────────────────────
// Toute modification des tarifs ou de la structure du devis se fait
// UNIQUEMENT ici.

// Tarifs unitaires par prestation (FCFA / personne)
export const TARIFS = {
  matin:       4000,
  dejeuner:    9500,
  apm:         4000,
  cocktailDej: 5000,
  cocktailDin: 6000,
};

export const TVA_TAUX = 0.18;

export function calculDevis(form) {
  const nb = form.nombrePersonnes;
  const lignes = [];

  if (form.pMatin)       lignes.push({ designation: "Pause cafe matin",      detail: "Sucres, sales, fruits, boissons",   qte: nb, pu: TARIFS.matin });
  if (form.pDej)         lignes.push({ designation: "Dejeuner complet",      detail: "Entree + Plat + Dessert + Boisson", qte: nb, pu: TARIFS.dejeuner });
  if (form.pApm)         lignes.push({ designation: "Pause cafe apres-midi", detail: "Sucres, sales, boissons",           qte: nb, pu: TARIFS.apm });
  if (form.pCocktailDej) lignes.push({ designation: "Cocktail dejeunatoire", detail: "4-5 petits fours + boissons",       qte: nb, pu: TARIFS.cocktailDej });
  if (form.pCocktailDin) lignes.push({ designation: "Cocktail dinatoire",    detail: "5-7 petits fours + boissons",       qte: nb, pu: TARIFS.cocktailDin });

  const totalHT = lignes.reduce((s, l) => s + l.qte * l.pu, 0);
  const tva = Math.round(totalHT * TVA_TAUX);
  const totalTTC = totalHT + tva;

  return { lignes, totalHT, tva, totalTTC };
}
