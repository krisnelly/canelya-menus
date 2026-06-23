// ── LOGIQUE — GÉNÉRATION D'UN JOUR DE MENU COMPLET ────────────────────────────
// Orchestre les données + les autres modules de /logic pour produire le menu
// d'une journée. Toute modification du DÉROULÉ de génération (ordre, règle du
// lundi appliquée à quelle prestation, etc.) se fait ici.

import {
  MATIN_SUCRES_BLE, MATIN_SUCRES_ALT, MATIN_SUCRES, MATIN_SALES, MATIN_FRUITS,
  MATIN_BOUILLIES, MATIN_CHAUDS, MATIN_BOISSONS,
  APM_SUCRES_BLE, APM_SUCRES_ALT, APM_SUCRES, APM_SALES, APM_BOISSONS,
  ENTREES, DESSERTS, DEJ_BOISSONS,
  COCKTAIL_SALES, COCKTAIL_SUCRES, COCKTAIL_BOISSONS_SOFT, COCKTAIL_BOISSONS_ALC,
} from "../data/menus";
import { LUNDI_PROTEINES, LUNDI_MATIN_SALES, LUNDI_DESSERTS } from "../data/proteines";
import { pick, pickNR, filtreRupture } from "./utils";
import { getProteines } from "./proteines";
import { getAccomp } from "./accompagnements";

// Génère le menu complet d'un jour pour les prestations actives.
// `used` = éléments déjà servis cette semaine (alternance) — voir buildDayUsed.
export function genJour(style, nb, prest, used, idx = 0, produitsP = [], isLundi = false, ruptureP = [], custom = {}) {
  const m = {};
  const fR = arr => filtreRupture(arr, ruptureP);
  // Fusionne la liste d'origine avec les items custom de la MÊME catégorie.
  // Additif uniquement : aucune règle de sélection n'est modifiée.
  const C = (pool, key) => [...pool, ...((custom && custom[key]) || [])];

  if (prest.matin) {
    m.matin = {
      sucres: (() => {
        // Garantir 1 base blé + 1 alternatif (équilibre des farines)
        const ble = pickNR(fR(C(MATIN_SUCRES_BLE, "MATIN_SUCRES_BLE")), used.matinSucres || []);
        const alt = pickNR(fR(C(MATIN_SUCRES_ALT, "MATIN_SUCRES_ALT")), [...(used.matinSucres || []), ble || ""]);
        if (ble && alt) return [ble, alt].join(", ");
        return pickNR(fR(MATIN_SUCRES), used.matinSucres || [], 2).join(", ");
      })(),
      sales: isLundi
        ? pickNR(fR(LUNDI_MATIN_SALES), used.matinSales || [], 2).join(", ")
        : pickNR(fR(C(MATIN_SALES, "MATIN_SALES")), used.matinSales || [], 2).join(", "),
      fruits: pickNR(fR(C(MATIN_FRUITS, "MATIN_FRUITS")), used.matinFruits || []),
      chauds: MATIN_CHAUDS, // toujours The + Lait + Cafe
      bouillie: pickNR(fR(C(MATIN_BOUILLIES, "MATIN_BOUILLIES")), used.matinBouillies || []),
      boisson: pickNR(fR(C(MATIN_BOISSONS, "MATIN_BOISSONS")), used.matinBoissons || []),
      isLundi,
    };
  }

  if (prest.dejeuner) {
    const entree = pickNR(fR(C(ENTREES, "ENTREES")), used.entrees || []);
    let proteinesStr, proteinesNoms;
    if (isLundi) {
      const lp = pickNR(fR(LUNDI_PROTEINES), used.proteines || []);
      proteinesStr = lp || "Poulet yassa";
      proteinesNoms = [proteinesStr];
    } else {
      const pr = getProteines(style, nb, idx, used.proteines || [], produitsP, ruptureP);
      proteinesStr = pr.str;
      proteinesNoms = pr.noms;
    }
    const accomp = isLundi
      ? "Igname pilee"
      : getAccomp(style, proteinesNoms, nb, used.accomp || [], ruptureP);

    m.dejeuner = {
      entree, proteines: proteinesStr, accomp,
      dessert: isLundi
        ? pickNR(fR(LUNDI_DESSERTS), used.desserts || [])
        : pickNR(fR(C(DESSERTS, "DESSERTS")), used.desserts || []),
      boisson: pickNR(fR(C(DEJ_BOISSONS, "DEJ_BOISSONS")), used.dejBoissons || []),
      isLundi,
    };
  }

  if (prest.apm) {
    m.apm = {
      sucres: (() => {
        const ble = pickNR(fR(C(APM_SUCRES_BLE, "APM_SUCRES_BLE")), used.apmSucres || []);
        const alt = pickNR(fR(C(APM_SUCRES_ALT, "APM_SUCRES_ALT")), [...(used.apmSucres || []), ble || ""]);
        if (ble && alt) return [ble, alt].join(", ");
        return pickNR(fR(APM_SUCRES), used.apmSucres || [], 2).join(", ");
      })(),
      sales: pickNR(fR(C(APM_SALES, "APM_SALES")), used.apmSales || [], 2).join(", "),
      boisson: pickNR(fR(C(APM_BOISSONS, "APM_BOISSONS")), used.apmBoissons || []),
    };
  }

  if (prest.cocktailDej) {
    m.cocktailDej = {
      sales: pickNR(fR(C(COCKTAIL_SALES, "COCKTAIL_SALES")), used.cSales || [], 4).join(", "),
      sucres: pickNR(fR(C(COCKTAIL_SUCRES, "COCKTAIL_SUCRES")), used.cSucres || []),
      boissons: pickNR(fR(C(COCKTAIL_BOISSONS_SOFT, "COCKTAIL_BOISSONS_SOFT")), used.cBoissons || [], 2).join(", ") + " + Eau minerale",
    };
  }

  if (prest.cocktailDin) {
    const nb2 = Math.floor(Math.random() * 3) + 5; // 5 à 7 choix
    m.cocktailDin = {
      sales: pickNR(fR(C(COCKTAIL_SALES, "COCKTAIL_SALES")), used.cSales || [], nb2 - 1).join(", "),
      sucres: pickNR(fR(C(COCKTAIL_SUCRES, "COCKTAIL_SUCRES")), used.cSucres || [], 2).join(", "),
      boissons: prest.alcool
        ? pickNR(fR(C(COCKTAIL_BOISSONS_SOFT, "COCKTAIL_BOISSONS_SOFT")), used.cBoissons || [], 2).join(", ") + " / " + pick(C(COCKTAIL_BOISSONS_ALC, "COCKTAIL_BOISSONS_ALC"), [], 2).join(", ")
        : pickNR(fR(C(COCKTAIL_BOISSONS_SOFT, "COCKTAIL_BOISSONS_SOFT")), used.cBoissons || [], 3).join(", "),
    };
  }

  return m;
}

// ── CONSTRUCTION DES LIGNES DU TABLEAU MENU (UI) ──────────────────────────────
// Pure transformation de données → structure consommée par TableauMenu.jsx.
export function buildRows(entry) {
  const rows = [];
  const add = (sec, items) => items.forEach((s, i) => rows.push({ sec: i === 0 ? sec : null, span: items.length, sub: s.k, fn: s.f }));

  if (entry.pMatin) add("☕ Pause cafe Matin", [
    { k: "Sucres",         f: m => (m.matin ? m.matin.sucres   : "—") },
    { k: "Sales",          f: m => (m.matin ? m.matin.sales    : "—") },
    { k: "Fruits",         f: m => (m.matin ? m.matin.fruits   : "—") },
    { k: "The/Lait/Cafe",  f: m => (m.matin ? m.matin.chauds   : "—") },
    { k: "Bouillie",       f: m => (m.matin ? m.matin.bouillie : "—") },
    { k: "Boisson froide", f: m => (m.matin ? m.matin.boisson  : "—") },
  ]);
  if (entry.pDej) add("🍽️ Dejeuner", [
    { k: "Entree",      f: m => (m.dejeuner ? m.dejeuner.entree    : "—") },
    { k: "Proteine(s)", f: m => (m.dejeuner ? m.dejeuner.proteines : "—") },
    { k: "Accomp.",     f: m => (m.dejeuner ? m.dejeuner.accomp    : "—") },
    { k: "Dessert",     f: m => (m.dejeuner ? m.dejeuner.dessert   : "—") },
    { k: "Boisson",     f: m => (m.dejeuner ? m.dejeuner.boisson   : "—") },
  ]);
  if (entry.pApm) add("🌅 Pause cafe Apres-midi", [
    { k: "Sucres",  f: m => (m.apm ? m.apm.sucres  : "—") },
    { k: "Sales",   f: m => (m.apm ? m.apm.sales   : "—") },
    { k: "Boisson", f: m => (m.apm ? m.apm.boisson : "—") },
  ]);
  if (entry.pCocktailDej) add("🥂 Cocktail Dejeunatoire", [
    { k: "Sales",    f: m => (m.cocktailDej ? m.cocktailDej.sales    : "—") },
    { k: "Sucres",   f: m => (m.cocktailDej ? m.cocktailDej.sucres   : "—") },
    { k: "Boissons", f: m => (m.cocktailDej ? m.cocktailDej.boissons : "—") },
  ]);
  if (entry.pCocktailDin) add("🍷 Cocktail Dinatoire", [
    { k: "Sales",    f: m => (m.cocktailDin ? m.cocktailDin.sales    : "—") },
    { k: "Sucres",   f: m => (m.cocktailDin ? m.cocktailDin.sucres   : "—") },
    { k: "Boissons", f: m => (m.cocktailDin ? m.cocktailDin.boissons : "—") },
  ]);
  return rows;
}

// ── TRACKING DES ÉLÉMENTS DÉJÀ SERVIS (alternance intra/inter-semaine) ────────
// État vide initial du suivi d'alternance
export function emptyUsed() {
  return {
    entrees: [], proteines: [], accomp: [], desserts: [], dejBoissons: [],
    matinSucres: [], matinSales: [], matinFruits: [], matinBouillies: [], matinBoissons: [],
    apmSucres: [], apmSales: [], apmBoissons: [],
    cSales: [], cSucres: [], cBoissons: [],
  };
}

// Construit le `used` cumulatif pour un jour donné en intégrant tout ce qui a
// été généré les jours précédents de la même semaine (idx croissant).
export function buildDayUsed(base, menus, joursOrd, idx) {
  const u = { ...Object.fromEntries(Object.entries(base).map(([k, v]) => [k, [...v]])) };
  joursOrd.slice(0, idx).forEach(j => {
    const m = menus[j];
    if (!m) return;
    if (m.matin) {
      (m.matin.sucres || "").split(", ").filter(Boolean).forEach(x => u.matinSucres.push(x));
      (m.matin.sales || "").split(", ").filter(Boolean).forEach(x => u.matinSales.push(x));
      if (m.matin.fruits) u.matinFruits.push(m.matin.fruits);
      if (m.matin.bouillie) u.matinBouillies.push(m.matin.bouillie);
      if (m.matin.boisson) u.matinBoissons.push(m.matin.boisson);
    }
    if (m.dejeuner) {
      if (m.dejeuner.entree) u.entrees.push(m.dejeuner.entree);
      if (m.dejeuner.dessert) u.desserts.push(m.dejeuner.dessert);
      if (m.dejeuner.boisson) u.dejBoissons.push(m.dejeuner.boisson);
      (m.dejeuner.accomp || "").split(", ").filter(Boolean).forEach(x => u.accomp.push(x));
      (m.dejeuner.proteines || "").split(" / ").forEach(p => {
        const nom = p.replace(/ \(.*\)/, "").trim();
        if (nom) u.proteines.push(nom);
      });
    }
    if (m.apm) {
      (m.apm.sucres || "").split(", ").filter(Boolean).forEach(x => u.apmSucres.push(x));
      (m.apm.sales || "").split(", ").filter(Boolean).forEach(x => u.apmSales.push(x));
      if (m.apm.boisson) u.apmBoissons.push(m.apm.boisson);
    }
    if (m.cocktailDej) {
      (m.cocktailDej.sales || "").split(", ").filter(Boolean).forEach(x => u.cSales.push(x));
      if (m.cocktailDej.sucres) u.cSucres.push(m.cocktailDej.sucres);
      (m.cocktailDej.boissons || "").split(", ").filter(Boolean).forEach(x => u.cBoissons.push(x));
    }
    if (m.cocktailDin) {
      (m.cocktailDin.sales || "").split(", ").filter(Boolean).forEach(x => u.cSales.push(x));
      (m.cocktailDin.sucres || "").split(", ").filter(Boolean).forEach(x => u.cSucres.push(x));
      (m.cocktailDin.boissons || "").split(", ").filter(Boolean).forEach(x => u.cBoissons.push(x));
    }
  });
  return u;
}

// Construit le `used` de base à partir de l'historique d'un client (toutes
// semaines précédentes confondues) pour éviter les répétitions inter-événements.
export function getUsedFromHistory(hist, clientId) {
  const u = emptyUsed();
  hist.filter(h => h.clientId === clientId).forEach(h => {
    Object.values(h.menus || {}).forEach(m => {
      if (m.matin) {
        (m.matin.sucres || "").split(", ").filter(Boolean).forEach(x => u.matinSucres.push(x));
        (m.matin.sales || "").split(", ").filter(Boolean).forEach(x => u.matinSales.push(x));
        if (m.matin.fruits) u.matinFruits.push(m.matin.fruits);
        if (m.matin.bouillie) u.matinBouillies.push(m.matin.bouillie);
        if (m.matin.boisson) u.matinBoissons.push(m.matin.boisson);
      }
      if (m.dejeuner) {
        if (m.dejeuner.entree) u.entrees.push(m.dejeuner.entree);
        if (m.dejeuner.dessert) u.desserts.push(m.dejeuner.dessert);
        if (m.dejeuner.boisson) u.dejBoissons.push(m.dejeuner.boisson);
        (m.dejeuner.accomp || "").split(", ").filter(Boolean).forEach(x => u.accomp.push(x));
        (m.dejeuner.proteines || "").split(" / ").forEach(p => {
          const nom = p.replace(/ \(.*\)/, "").trim();
          if (nom) u.proteines.push(nom);
        });
      }
      if (m.apm) {
        (m.apm.sucres || "").split(", ").filter(Boolean).forEach(x => u.apmSucres.push(x));
        (m.apm.sales || "").split(", ").filter(Boolean).forEach(x => u.apmSales.push(x));
        if (m.apm.boisson) u.apmBoissons.push(m.apm.boisson);
      }
      if (m.cocktailDej) {
        (m.cocktailDej.sales || "").split(", ").filter(Boolean).forEach(x => u.cSales.push(x));
        if (m.cocktailDej.sucres) u.cSucres.push(m.cocktailDej.sucres);
      }
      if (m.cocktailDin) {
        (m.cocktailDin.sales || "").split(", ").filter(Boolean).forEach(x => u.cSales.push(x));
        (m.cocktailDin.sucres || "").split(", ").filter(Boolean).forEach(x => u.cSucres.push(x));
      }
    });
  });
  return u;
}
