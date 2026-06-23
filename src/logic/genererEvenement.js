// ── LOGIQUE — ORCHESTRATION GÉNÉRATION D'UN ÉVÉNEMENT COMPLET ─────────────────
// Assemble tous les modules de /logic pour produire l'objet `entry` complet
// à partir du formulaire. Aucune logique métier nouvelle ici — uniquement
// l'enchaînement des étapes. Si une règle métier change, elle se modifie
// dans le module concerné (genererMenu, calculEquipe, calculPlanning, calculDevis).

import { CLIENTS, JOURS } from "../data/clients";
import { genJour, buildDayUsed, emptyUsed, getUsedFromHistory } from "./genererMenu";
import { calculEquipe } from "./calculEquipe";
import { calculPlanning } from "./calculPlanning";
import { calculDevis } from "./calculDevis";
import { numDevis } from "./utils";

// Normalisation cohérente avec api/_genFicheAchat.js (clés du catalogue)
const norm = s => String(s || "").toLowerCase().replace(/\(.*?\)/g, "").replace(/\s+/g, " ").trim();

// À partir de la liste d'items custom, construit :
//  - pools : { CATEGORIE: [noms...] } pour fusion dans le moteur de génération
//  - catalogue : { nomNormalise: [fournisseur, prix, portion] } pour la fiche d'achat
function buildCustom(items) {
  const pools = {};
  const catalogue = {};
  (items || []).forEach(it => {
    if (!it || !it.category || !it.nom) return;
    (pools[it.category] = pools[it.category] || []).push(it.nom);
    catalogue[norm(it.nom)] = [it.fournisseur || "MARCHE", it.prix ?? null, it.portion || ""];
  });
  return { pools, catalogue };
}

// Construit un nouvel événement complet (menus + équipe + planning + devis).
// `items` = items custom (catalogue enrichi) ; optionnel, par défaut aucun.
export function genererEvenement(form, hist, items = []) {
  const cd = CLIENTS.find(c => c.id === form.clientId) || { style: "mixte" };
  const clientNom = form.clientId === "autre" ? (form.clientAutre || "Autre") : cd.nom;

  const usedBase = getUsedFromHistory(hist, form.clientId);
  const prest = {
    matin: form.pMatin, dejeuner: form.pDej, apm: form.pApm,
    cocktailDej: form.pCocktailDej, cocktailDin: form.pCocktailDin, alcool: form.alcool,
  };
  const produitsP = (form.produitsAEcouler || "").toLowerCase().split(",").map(x => x.trim()).filter(Boolean);
  const ruptureP  = (form.ruptureStock || "").toLowerCase().split(",").map(x => x.trim()).filter(Boolean);

  const { pools: customPools, catalogue: customCatalogue } = buildCustom(items);

  const menus = {};
  const joursOrd = JOURS.filter(j => form.jours.includes(j));
  joursOrd.forEach((j, idx) => {
    const du = buildDayUsed(usedBase, menus, joursOrd, idx);
    menus[j] = genJour(cd.style, form.nombrePersonnes, prest, du, idx, produitsP, j === "Lundi", ruptureP, customPools);
  });

  const equipe = calculEquipe(form.nombrePersonnes, form.distanceKm);
  const planning = calculPlanning(form);
  const devis = calculDevis(form);

  return {
    id: Date.now(),
    ...form,
    clientNom,
    dateCreation: new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }),
    numeroDevis: numDevis(),
    jours: joursOrd,
    service: form.nombrePersonnes > 5 ? "Buffet" : "Parts individuelles",
    menus,
    customCatalogue, // fournisseur/prix/portion des items custom → fiche d'achat conforme
    equipe,
    planning,
    devis,
  };
}

// Régénère uniquement le menu d'un jour donné, sans toucher au reste de
// l'événement (devis, planning, équipe restent identiques).
export function regenererJour(entry, jour, items = []) {
  const cd = CLIENTS.find(c => c.id === entry.clientId) || { style: "mixte" };
  const prest = {
    matin: entry.pMatin, dejeuner: entry.pDej, apm: entry.pApm,
    cocktailDej: entry.pCocktailDej, cocktailDin: entry.pCocktailDin, alcool: entry.alcool,
  };
  const { pools: customPools, catalogue: customCatalogue } = buildCustom(items);
  const idx = entry.jours.indexOf(jour);
  const newMenuJour = genJour(cd.style, entry.nombrePersonnes, prest, emptyUsed(), idx, [], jour === "Lundi", [], customPools);
  return { ...entry, menus: { ...entry.menus, [jour]: newMenuJour }, customCatalogue: customCatalogue && Object.keys(customCatalogue).length ? customCatalogue : entry.customCatalogue };
}
