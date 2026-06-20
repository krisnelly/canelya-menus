// ── LOGIQUE — COMPATIBILITÉ & SÉLECTION DES ACCOMPAGNEMENTS ───────────────────
// Toute modification du COMPORTEMENT de matching accompagnement <-> protéine
// se fait UNIQUEMENT ici. Les règles elles-mêmes (table ACCOMP_COMPAT) sont
// dans /data/accompagnements.js.

import {
  ACCOMP, ACCOMP_COMPAT,
  SAUCES_MAN_ET_AUTRES, SAUCES_AKASSA, SAUCES_GRAINE, POULET_BRAISE,
} from "../data/accompagnements";
import { pickNR, filtreRupture } from "./utils";

function estCompatibleSauceMan(protNom) {
  const p = protNom.toLowerCase();
  return SAUCES_MAN_ET_AUTRES.some(s => p.includes(s));
}
function estCompatibleAkassa(protNom) {
  const p = protNom.toLowerCase();
  return SAUCES_AKASSA.some(s => p.includes(s));
}
function estCompatibleSauceGraine(protNom) {
  const p = protNom.toLowerCase();
  return SAUCES_GRAINE.some(s => p.includes(s));
}
function estPouletBraise(protNom) {
  const p = protNom.toLowerCase();
  return POULET_BRAISE.some(s => p.includes(s));
}

// Vérifie si un accompagnement est compatible avec une protéine donnée
export function isCompatible(accomp, protNom) {
  const p = protNom.toLowerCase();
  const rule = ACCOMP_COMPAT[accomp];
  if (!rule) return true;
  if (rule.includes("__neutre__"))        return true;
  if (rule.includes("__sauce_man__"))     return estCompatibleSauceMan(protNom);
  if (rule.includes("__akassa__"))        return estCompatibleAkassa(protNom);
  if (rule.includes("__sauce_graine__"))  return estCompatibleSauceGraine(protNom);
  if (rule.includes("__poulet_braise__")) return estPouletBraise(protNom);
  if (rule.includes("__tout_sauf_gombo_moyo__")) {
    return !p.includes("gombo") && !p.includes("moyo");
  }
  if (rule.includes("__tout_sauf_sauce_locale__")) {
    const saucesLocales = [
      "man tindjan", "man gnignan", "sauce graine", "sauce arachide", "gombo",
      "dakouin", "moyo", "crincrin", "asrokuin", "thiebboudienne", "djongoli",
    ];
    return !saucesLocales.some(s => p.includes(s));
  }
  return rule.some(r => p.includes(r));
}

// Sélectionne des accompagnements compatibles avec les protéines du jour.
// Individuel : 1 accompagnement compatible avec l'unique protéine.
// Buffet : 3 accompagnements — 1 pour la viande, 1 pour le poisson, 1 neutre.
export function getAccomp(style, proteinesNoms, nb, usedA, ruptureP) {
  const grand = nb > 5;
  const all = filtreRupture(ACCOMP[style], ruptureP);

  if (!grand) {
    const pNom = proteinesNoms[0] || "";
    const compat = all.filter(a => isCompatible(a, pNom));
    return pickNR(compat.length ? compat : all, usedA) || all[0];
  }

  const [viande, poisson] = proteinesNoms;
  const vNom = (viande || "").toLowerCase();
  const pNom = (poisson || "").toLowerCase();

  const neutres   = all.filter(a => isCompatible(a, vNom) && isCompatible(a, pNom));
  const pvViande  = all.filter(a => isCompatible(a, vNom) && !isCompatible(a, pNom));
  const pvPoisson = all.filter(a => isCompatible(a, pNom) && !isCompatible(a, vNom));

  const result = [];
  const av = pickNR(pvViande.length ? pvViande : neutres, usedA);
  if (av) result.push(av);

  const used2 = [...usedA, ...result];
  const ap = pickNR(pvPoisson.length ? pvPoisson : neutres, used2);
  if (ap && !result.includes(ap)) result.push(ap);

  const used3 = [...usedA, ...result];
  const an = pickNR(neutres, used3);
  if (an && !result.includes(an)) result.push(an);

  while (result.length < 3) {
    const extra = pickNR(all, [...usedA, ...result]);
    if (extra && !result.includes(extra)) result.push(extra);
    else break;
  }
  return result.slice(0, 3).join(", ");
}
