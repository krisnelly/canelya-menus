// ── LOGIQUE — CALCUL DU PLANNING HORAIRE ──────────────────────────────────────
// Toute modification des règles de calcul des heures de départ se fait
// UNIQUEMENT ici.

import { heureDepart } from "./utils";

// form = objet formulaire (voir data initiale FORM0 dans App)
export function calculPlanning(form) {
  const dist = form.distanceKm;
  const deltaH = dist < 10 ? 1 : dist <= 20 ? 2 : 4;

  const premiereH =
    form.pMatin ? form.hMatin :
    form.pDej ? form.hDej :
    form.pCocktailDej ? form.hCocktailDej :
    form.hCocktailDin;

  const hLogistique = heureDepart(premiereH, form.cuissonSurPlace ? 6 : 3);

  const hDepartPrestations = [
    form.pMatin       ? { label: "Pause cafe matin",      hPresta: form.hMatin,       hDepart: heureDepart(form.hMatin, deltaH) } : null,
    form.pDej         ? { label: "Dejeuner",              hPresta: form.hDej,         hDepart: heureDepart(form.hDej, deltaH) } : null,
    form.pApm         ? { label: "Pause cafe apres-midi", hPresta: form.hApm,         hDepart: heureDepart(form.hApm, deltaH) } : null,
    form.pCocktailDej ? { label: "Cocktail dejeunatoire", hPresta: form.hCocktailDej, hDepart: heureDepart(form.hCocktailDej, deltaH) } : null,
    form.pCocktailDin ? { label: "Cocktail dinatoire",    hPresta: form.hCocktailDin, hDepart: heureDepart(form.hCocktailDin, deltaH) } : null,
  ].filter(Boolean);

  const dEvt = new Date(form.dateDebut);
  dEvt.setDate(dEvt.getDate() - 2);
  const dateLimiteAchat =
    dEvt.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" }) + " (J-2)";

  return { hLogistique, hDepartPrestations, dateLimiteAchat };
}
