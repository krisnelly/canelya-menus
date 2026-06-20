// ── GÉNÉRATEUR — DOCUMENT 5 : CHECK-LISTS (1 par prestation par jour) ────────
import { Document, Paragraph, Table, TableRow, AlignmentType, WidthType, BorderStyle } from "docx";
import { tc, tp, sp, DARK, GOLD, GREEN, WHITE, LGRAY, RED } from "./_docxHelpers.js";

const COLORS = { matin: "5D3A1A", dejeuner: "1A1812", apm: "1A4A6B", cocktailDej: "2D6A2D", cocktailDin: "6B1A4A" };

const checkRow = (label, detail = "", bg = WHITE) => new TableRow({ children: [
  tc(tp("☐", { size: 20, color: GOLD }), { bg, width: 500 }),
  tc(tp(label, { size: 17, bold: true }), { bg, width: 3800 }),
  tc(tp(detail, { size: 15, italic: true, color: "666666" }), { bg, width: 4726 }),
]});
const checkHdr = () => new TableRow({ children: [
  tc(tp("", { size: 16 }), { bg: "E8E8E8", width: 500 }),
  tc(tp("Element", { bold: true, size: 16 }), { bg: "E8E8E8", width: 3800 }),
  tc(tp("Detail / Quantite", { bold: true, size: 16 }), { bg: "E8E8E8", width: 4726 }),
]});

function getCondiments(pKey, menu) {
  const c = [];
  if (pKey === "matin" && menu.matin) {
    c.push({ label: "Sucre roux / Sucre blanc", detail: "Pour the, cafe et lait" });
    if (menu.matin.bouillie) c.push({ label: "Lait concentre sucre", detail: "Pour la bouillie : " + menu.matin.bouillie });
    if (menu.matin.boisson) c.push({ label: "Glacons", detail: "Pour les boissons froides" });
  }
  if (pKey === "dejeuner" && menu.dejeuner) {
    c.push({ label: "Piment", detail: "Toujours au dejeuner — 20g/pers" });
    const a = menu.dejeuner.accomp || "";
    if (a.includes("Frites")) c.push({ label: "Sauce frites", detail: "20g/pers" });
    if (a.includes("Attieke")) c.push({ label: "Sauce attieke", detail: "40g/pers" });
    if (a.includes("Riz")) c.push({ label: "Sauce tomate", detail: "50g/pers" });
    if (a.includes("Igname") || a.includes("Foutou")) c.push({ label: "Sauce graine ou arachide", detail: "Avec foutou/igname" });
    const entree = menu.dejeuner.entree || "";
    const entreesFroides = ["Salade Canelia", "Cocktail avocat", "Salade composee", "Salade de papaye", "Salade de chou"];
    if (entreesFroides.some(e => entree.toLowerCase().includes(e.toLowerCase().split(" ")[0]))) {
      c.push({ label: "Vinaigrette", detail: "Pour l'entree froide : " + entree });
    }
    if (entree) c.push({ label: "Pain", detail: "A servir avec l'entree — toujours" });
    if (menu.dejeuner.boisson) c.push({ label: "Glacons", detail: "Pour les boissons froides" });
  }
  if (pKey === "apm" && menu.apm) {
    c.push({ label: "Piment", detail: "Pause cafe apres-midi — 20g/pers" });
    if (menu.apm.boisson) c.push({ label: "Glacons", detail: "Pour les boissons froides" });
  }
  if (pKey === "cocktailDej" && menu.cocktailDej) {
    c.push({ label: "Glacons", detail: "Pour les boissons froides" });
  }
  if (pKey === "cocktailDin" && menu.cocktailDin) {
    c.push({ label: "Piment", detail: "Cocktail dinatoire — 20g/pers" });
    c.push({ label: "Glacons", detail: "Pour les boissons froides" });
  }
  return c;
}

function getMateriel(pKey, nb) {
  if (pKey === "dejeuner") return [
    { label: "Assiettes", detail: Math.ceil(nb * 1.1) + " assiettes (+10%)" },
    { label: "Verres", detail: Math.ceil(nb * 1.1) + " verres" },
    { label: "Couverts", detail: Math.ceil(nb * 1.1) + " couverts" },
    { label: "Pinces et louches", detail: "1 par element servi" },
    { label: "Nappes", detail: "Selon nb de tables" },
    { label: "Papier sopalin", detail: nb * 3 + " feuilles min." },
    { label: "Sacs poubelle", detail: "Min. 2" },
  ];
  if (pKey === "cocktailDej" || pKey === "cocktailDin") return [
    { label: "Plateaux de service", detail: "Pour circulation" },
    { label: "Petites assiettes", detail: Math.ceil(nb * 1.1) + " pieces" },
    { label: "Cure-dents / piques", detail: "Pour petits fours" },
    { label: "Serviettes cocktail", detail: nb * 3 + " min." },
    { label: "Sacs poubelle", detail: "Min. 2" },
  ];
  return [
    { label: "Assiettes / Verrines", detail: Math.ceil(nb * 1.1) + " pieces (+10%)" },
    { label: "Verres", detail: Math.ceil(nb * 1.1) + " verres" },
    { label: "Presentoirs / paniers", detail: "Selon nb produits" },
    { label: "Pinces de service", detail: "1 par produit" },
    { label: "Sacs poubelle", detail: "Min. 2" },
  ];
}

function getMenuRows(pKey, menu) {
  const rows = [];
  if (pKey === "matin" && menu.matin) {
    rows.push(checkRow("Sucres", menu.matin.sucres, WHITE));
    rows.push(checkRow("Sales", menu.matin.sales, LGRAY));
    rows.push(checkRow("Fruits", menu.matin.fruits, WHITE));
    rows.push(checkRow("The + Lait + Cafe", "Boissons chaudes fixes", LGRAY));
    rows.push(checkRow("Bouillie", menu.matin.bouillie, WHITE));
    rows.push(checkRow("Boisson froide", menu.matin.boisson, LGRAY));
  }
  if (pKey === "dejeuner" && menu.dejeuner) {
    rows.push(checkRow("Entree", menu.dejeuner.entree, WHITE));
    rows.push(checkRow("Proteine(s)", menu.dejeuner.proteines, LGRAY));
    rows.push(checkRow("Accompagnement(s)", menu.dejeuner.accomp, WHITE));
    rows.push(checkRow("Dessert", menu.dejeuner.dessert, LGRAY));
    rows.push(checkRow("Boisson", menu.dejeuner.boisson, WHITE));
  }
  if (pKey === "apm" && menu.apm) {
    rows.push(checkRow("Sucres / Gouters", menu.apm.sucres, WHITE));
    rows.push(checkRow("Sales", menu.apm.sales, LGRAY));
    rows.push(checkRow("Boisson", menu.apm.boisson, WHITE));
  }
  if (pKey === "cocktailDej" && menu.cocktailDej) {
    rows.push(checkRow("Petits fours sales", menu.cocktailDej.sales, WHITE));
    rows.push(checkRow("Petits fours sucres", menu.cocktailDej.sucres, LGRAY));
    rows.push(checkRow("Boissons", menu.cocktailDej.boissons, WHITE));
  }
  if (pKey === "cocktailDin" && menu.cocktailDin) {
    rows.push(checkRow("Petits fours sales", menu.cocktailDin.sales, WHITE));
    rows.push(checkRow("Petits fours sucres", menu.cocktailDin.sucres, LGRAY));
    rows.push(checkRow("Boissons", menu.cocktailDin.boissons, WHITE));
  }
  return rows;
}

export function genChecklistsDoc(E) {
  const nb = E.nombrePersonnes;
  const PREST_DEF = [
    { key: "matin", label: "Pause cafe matin", hKey: "hMatin", flagKey: "pMatin" },
    { key: "dejeuner", label: "Dejeuner", hKey: "hDej", flagKey: "pDej" },
    { key: "apm", label: "Pause cafe Apres-midi", hKey: "hApm", flagKey: "pApm" },
    { key: "cocktailDej", label: "Cocktail Dejeunatoire", hKey: "hCocktailDej", flagKey: "pCocktailDej" },
    { key: "cocktailDin", label: "Cocktail Dinatoire", hKey: "hCocktailDin", flagKey: "pCocktailDin" },
  ];
  const activePrest = PREST_DEF.filter(p => E[p.flagKey]);

  const children = [];
  let isFirst = true;

  E.jours.forEach(jour => {
    activePrest.forEach(pDef => {
      const menu = E.menus[jour] || {};
      const menuRows = getMenuRows(pDef.key, menu);
      if (!menuRows.length) return;

      const condiments = getCondiments(pDef.key, menu);
      const materiel = getMateriel(pDef.key, nb);
      const hPresta = E[pDef.hKey] || "—";
      const planEntry = (E.planning?.hDepartPrestations || []).find(p => p.label.toLowerCase().includes(pDef.label.toLowerCase().split(" ")[0].toLowerCase()));
      const hDepart = planEntry ? planEntry.hDepart : "—";
      const color = COLORS[pDef.key] || DARK;

      if (!isFirst) children.push(new Paragraph({ pageBreakBefore: true, spacing: { before: 0, after: 0 }, children: [] }));
      isFirst = false;

      children.push(new Table({
        width: { size: 9026, type: WidthType.DXA }, columnWidths: [9026],
        rows: [new TableRow({ children: [
          tc([
            tp("CHECK-LISTE DE DEPART", { bold: true, size: 26, color: WHITE }),
            tp(jour.toUpperCase() + " — " + pDef.label.toUpperCase(), { bold: true, size: 18, color: "DDDDDD" }),
            tp(E.clientNom + " — " + E.nomEvenement + " — " + nb + " pers.", { size: 15, color: "CCCCCC" }),
          ], { bg: color, width: 9026 }),
        ]})],
      }));
      children.push(sp(120));
      children.push(new Table({
        width: { size: 9026, type: WidthType.DXA }, columnWidths: [2200, 2313, 2200, 2313],
        rows: [new TableRow({ children: [
          tc(tp("Depart repas", { bold: true, size: 16, color: "666666" }), { bg: LGRAY, width: 2200 }),
          tc(tp(hDepart, { bold: true, size: 20, color: RED }), { bg: WHITE, width: 2313 }),
          tc(tp("Heure de service", { bold: true, size: 16, color: "666666" }), { bg: LGRAY, width: 2200 }),
          tc(tp(hPresta, { bold: true, size: 20, color: GOLD }), { bg: WHITE, width: 2313 }),
        ]})],
      }));
      children.push(sp(120));

      children.push(tp("MENU", { bold: true, size: 18, color }));
      children.push(sp(60));
      children.push(new Table({ width: { size: 9026, type: WidthType.DXA }, columnWidths: [500, 3800, 4726], rows: [checkHdr(), ...menuRows] }));

      if (condiments.length) {
        children.push(sp(120));
        children.push(tp("CONDIMENTS & SAUCES", { bold: true, size: 18, color: GREEN }));
        children.push(sp(60));
        children.push(new Table({ width: { size: 9026, type: WidthType.DXA }, columnWidths: [500, 3800, 4726], rows: [checkHdr(), ...condiments.map((c, i) => checkRow(c.label, c.detail, i % 2 === 0 ? WHITE : LGRAY))] }));
      }

      children.push(sp(120));
      children.push(tp("MATERIEL DE SERVICE", { bold: true, size: 18, color: "5D3A8B" }));
      children.push(sp(60));
      children.push(new Table({ width: { size: 9026, type: WidthType.DXA }, columnWidths: [500, 3800, 4726], rows: [checkHdr(), ...materiel.map((m, i) => checkRow(m.label, m.detail, i % 2 === 0 ? WHITE : LGRAY))] }));

      children.push(sp(140));
      children.push(new Table({
        width: { size: 9026, type: WidthType.DXA }, columnWidths: [4513, 4513],
        rows: [new TableRow({ children: [
          tc([tp("Verifie : " + E.superviseurCuisine, { bold: true, size: 17 }), sp(240), tp("Signature : ________________________", { size: 15, color: "888888" })], { bg: LGRAY, width: 4513 }),
          tc([tp("Valide : " + E.superviseurTerrain, { bold: true, size: 17 }), sp(240), tp("Signature : ________________________", { size: 15, color: "888888" })], { bg: LGRAY, width: 4513 }),
        ]})],
      }));
    });
  });

  return new Document({
    styles: { default: { document: { run: { font: "Arial", size: 19, color: DARK } } } },
    sections: [{ properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 600, right: 600, bottom: 600, left: 600 } } }, children }],
  });
}
