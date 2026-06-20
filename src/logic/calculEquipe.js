// ── LOGIQUE — CALCUL DE L'ÉQUIPE ──────────────────────────────────────────────
// Toute modification des règles de dimensionnement d'équipe se fait UNIQUEMENT
// ici. Aucune autre partie de l'app ne doit contenir ces formules.

// nb = nombre de personnes, dist = distance en km
export function calculEquipe(nb, dist) {
  const buffet = nb > 5;
  const nbServeurs = buffet ? Math.ceil(nb / 9) : Math.ceil(nb / 4);
  const nbCuisiniers =
    nb < 20 ? 2 :
    nb >= 200 ? 5 :
    2 + Math.floor((nb - 20) / 20) + 1;
  const nbChauffeurs = dist >= 20 ? 2 : 1;
  const retroplanning = nb >= 200;

  return { nbServeurs, nbCuisiniers, nbChauffeurs, retroplanning };
}
