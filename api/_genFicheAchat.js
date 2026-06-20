// ── GÉNÉRATEUR — DOCUMENT 3 : FICHE D'ACHAT ──────────────────────────────────
// Version actuelle = estimation haut niveau par fournisseur. À affiner plus tard
// avec les recettes précises collectées (voir Recettes_Canelya.docx).
import { Document, Table, TableRow, AlignmentType, WidthType } from "docx";
import { tc, tp, sp, divider, titleBlock, infoTable, header, fmt, DARK, GOLD, WHITE, LGRAY } from "./_docxHelpers.js";

const FCOLORS = { "Volailler": "5D3A1A", "Boucher 1": "8B1A1A", "Boucher 2": "6B2222", "Poissonnier": "1A4A6B", "Marche": "2D6A2D", "Supermarche": "4A4A8B" };

export function genFicheAchatDoc(E) {
  const nb = E.nombrePersonnes;
  const ratio = 0.6;
  const qteV = g => ((nb * g * ratio) / 1000).toFixed(2) + " kg";

  const proteinesDej = {};
  E.jours.forEach(j => {
    const dej = E.menus[j]?.dejeuner;
    if (dej?.proteines) {
      dej.proteines.split(" / ").forEach(p => {
        const nom = p.replace(/ \(.*\)/, "").trim();
        if (nom) proteinesDej[nom] = (proteinesDej[nom] || 0) + 1;
      });
    }
  });

  const achats = { "Volailler": [], "Boucher 1": [], "Boucher 2": [], "Poissonnier": [], "Marche": [], "Supermarche": [] };

  Object.entries(proteinesDej).forEach(([nom, jours]) => {
    const n = nom.toLowerCase();
    if (n.includes("poulet")) {
      if (n.includes("poulet grille")) {
        const morceaux = Math.ceil(nb * 1.5 * ratio * jours);
        const pieces = Math.ceil(morceaux / 5);
        achats["Volailler"].push({ produit: "Poulet entier (" + nom + ")", qte: pieces + " piece(s)", pu: "3 000 FCFA/piece", total: pieces * 3000, note: jours + " jour(s)" });
      } else {
        achats["Volailler"].push({ produit: nom, qte: qteV(100 * jours), pu: "Variable", total: 0, note: jours + " jour(s)" });
      }
    } else if (n.includes("boeuf")) {
      const kg = parseFloat(qteV(100 * jours));
      achats["Boucher 1"].push({ produit: nom, qte: qteV(100 * jours), pu: "4 000-5 000 FCFA/kg", total: Math.ceil(kg) * 4500, note: jours + " jour(s)" });
    } else if (n.includes("poisson")) {
      const kg = parseFloat(qteV(100 * jours));
      achats["Poissonnier"].push({ produit: nom, qte: qteV(100 * jours), pu: "4 000 FCFA/kg", total: Math.ceil(kg) * 4000, note: jours + " jour(s)" });
    }
  });

  achats["Marche"].push({ produit: "Piment", qte: ((nb * 20) / 1000).toFixed(2) + " kg", pu: "Variable", total: 0, note: "20g/pers — tous les dejeuners" });
  achats["Marche"].push({ produit: "Oignons, tomates, ail, epices", qte: "A preciser", pu: "—", total: 0, note: "Bases cuisson" });
  achats["Supermarche"].push({ produit: "Eau minerale", qte: Math.ceil(nb * 0.5 * E.jours.length) + " L", pu: "Variable", total: 0, note: "Toutes prestations" });

  let grandTotal = 0;
  Object.values(achats).forEach(l => l.forEach(x => (grandTotal += x.total || 0)));

  const CW = [3000, 1800, 1500, 1200, 1526];
  const TW = CW.reduce((a, b) => a + b, 0);

  const children = [
    header(), divider(),
    ...titleBlock("FICHE D'ACHAT (BON DE COMMANDE)", ""),
    infoTable([
      ["Client", E.clientNom, true, GOLD, "Evenement", E.nomEvenement],
      ["Date evenement", E.dateDebut, false, "", "Nb personnes", E.nombrePersonnes + " pers. — " + E.service],
      ["Limite achat", E.planning?.dateLimiteAchat || "", true, "AA3300", "Produit prioritaire", E.produitsAEcouler || "—"],
      ["Rupture stock", E.ruptureStock || "Aucune", false, "AA3300", "Dresscode", E.dresscode],
    ]),
    sp(200),
  ];

  Object.entries(achats).forEach(([four, lignes]) => {
    if (!lignes.length) return;
    const col = FCOLORS[four] || DARK;
    const totalF = lignes.reduce((s, l) => s + (l.total || 0), 0);
    children.push(new Table({ width: { size: TW, type: WidthType.DXA }, columnWidths: [TW], rows: [new TableRow({ children: [
      tc(tp(four.toUpperCase(), { bold: true, size: 19, color: WHITE }), { bg: col, width: TW }),
    ]})]}));
    children.push(new Table({
      width: { size: TW, type: WidthType.DXA }, columnWidths: CW,
      rows: [
        new TableRow({ children: [
          tc(tp("Produit", { bold: true, size: 16 }), { bg: "E8E8E8", width: CW[0] }),
          tc(tp("Quantite", { bold: true, size: 16, align: AlignmentType.CENTER }), { bg: "E8E8E8", width: CW[1] }),
          tc(tp("Prix unitaire", { bold: true, size: 16, align: AlignmentType.CENTER }), { bg: "E8E8E8", width: CW[2] }),
          tc(tp("Total est.", { bold: true, size: 16, align: AlignmentType.RIGHT }), { bg: "E8E8E8", width: CW[3] }),
          tc(tp("Note", { bold: true, size: 16 }), { bg: "E8E8E8", width: CW[4] }),
        ]}),
        ...lignes.map((l, i) => new TableRow({ children: [
          tc(tp(l.produit, { size: 17 }), { bg: i % 2 === 0 ? WHITE : LGRAY, width: CW[0] }),
          tc(tp(l.qte || "—", { size: 16, align: AlignmentType.CENTER }), { bg: i % 2 === 0 ? WHITE : LGRAY, width: CW[1] }),
          tc(tp(l.pu || "—", { size: 16, align: AlignmentType.CENTER }), { bg: i % 2 === 0 ? WHITE : LGRAY, width: CW[2] }),
          tc(tp(fmt(l.total || 0), { size: 16, align: AlignmentType.RIGHT }), { bg: i % 2 === 0 ? WHITE : LGRAY, width: CW[3] }),
          tc(tp(l.note || "", { size: 14, italic: true, color: "777777" }), { bg: i % 2 === 0 ? WHITE : LGRAY, width: CW[4] }),
        ]})),
        new TableRow({ children: [
          tc(tp("Sous-total " + four, { bold: true, size: 17, color: WHITE }), { bg: col, width: CW[0] + CW[1] + CW[2], span: 3 }),
          tc(tp(fmt(totalF), { bold: true, size: 17, color: WHITE, align: AlignmentType.RIGHT }), { bg: col, width: CW[3] }),
          tc(tp(""), { bg: col, width: CW[4] }),
        ]}),
      ],
    }));
    children.push(sp(140));
  });

  children.push(new Table({ width: { size: TW, type: WidthType.DXA }, columnWidths: [TW - 2000, 2000], rows: [new TableRow({ children: [
    tc(tp("TOTAL GENERAL ESTIME", { bold: true, size: 22, color: WHITE, align: AlignmentType.RIGHT }), { bg: GOLD, width: TW - 2000 }),
    tc(tp(fmt(grandTotal), { bold: true, size: 22, color: WHITE, align: AlignmentType.RIGHT }), { bg: GOLD, width: 2000 }),
  ]})]}));
  children.push(sp(100));
  children.push(tp("* Estimation. Voir Recettes_Canelya.docx pour quantites et prix detailles.", { size: 15, italic: true, color: "888888" }));

  return new Document({
    styles: { default: { document: { run: { font: "Arial", size: 19, color: DARK } } } },
    sections: [{ properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 720, right: 720, bottom: 720, left: 720 } } }, children }],
  });
}
