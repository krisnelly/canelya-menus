// ── API — HELPERS COMMUNS GÉNÉRATION WORD ─────────────────────────────────────
// Fonctions de mise en forme réutilisées par les 5 documents. Toute
// modification de la charte visuelle commune (couleurs, bordures, polices)
// se fait UNIQUEMENT ici.

import {
  Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, BorderStyle, WidthType, ShadingType, VerticalAlign,
} from "docx";

export const GOLD = "8B6914", GREEN = "2D6A2D", DARK = "1A1812", LGRAY = "F5F5F5", WHITE = "FFFFFF", RED = "AA3300", BC = "CCCCCC";

export const brd = (c = BC) => ({ style: BorderStyle.SINGLE, size: 4, color: c });
export const borders = { top: brd(), bottom: brd(), left: brd(), right: brd() };
const noBorder = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
export const noBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };

export const tc = (children, opts = {}) => new TableCell({
  borders: opts.borders || borders,
  width: opts.width ? { size: opts.width, type: WidthType.DXA } : undefined,
  shading: { fill: opts.bg || WHITE, type: ShadingType.CLEAR },
  margins: { top: 80, bottom: 80, left: 120, right: 120 },
  verticalAlign: VerticalAlign.CENTER,
  columnSpan: opts.span,
  rowSpan: opts.rowSpan,
  children: Array.isArray(children) ? children : [children],
});

export const tp = (text, opts = {}) => new Paragraph({
  alignment: opts.align || AlignmentType.LEFT,
  spacing: { before: opts.before || 0, after: opts.after !== undefined ? opts.after : 0 },
  children: [new TextRun({
    text: String(text || ""), bold: opts.bold || false, italics: opts.italic || false,
    color: opts.color || DARK, size: opts.size || 19, font: "Arial",
  })],
});

export const sp = (h = 160) => new Paragraph({ spacing: { before: h, after: 0 }, children: [] });

export const fmt = n => (n > 0 ? n.toLocaleString("fr-FR") + " FCFA" : "—");

// En-tête textuel (pas de logo image dans l'environnement serverless)
export function header(subtitle = "") {
  return new Table({
    width: { size: 9026, type: WidthType.DXA },
    columnWidths: [9026],
    rows: [new TableRow({ children: [
      tc([
        tp("LA MAISON DE CANELYA", { bold: true, size: 26, color: DARK }),
        tp("Jardin et maison", { italic: true, size: 17, color: GREEN }),
        tp("Fidjrosse, Cotonou  |  +229 01 61 13 13  |  info@canelya.com" + (subtitle ? "  |  " + subtitle : ""), { size: 15, color: "555555" }),
      ], { borders: noBorders, width: 9026 }),
    ]})],
  });
}

export function divider() {
  return new Paragraph({ spacing: { before: 120, after: 120 }, border: { bottom: { style: BorderStyle.SINGLE, size: 10, color: GOLD, space: 1 } }, children: [] });
}

export function titleBlock(t, sub = "") {
  return [
    tp(t, { bold: true, size: 28, align: AlignmentType.CENTER }),
    sub ? tp(sub, { size: 18, color: "888888", align: AlignmentType.CENTER, italic: true }) : sp(0),
    sp(200),
  ];
}

export function infoTable(rows2col) {
  return new Table({
    width: { size: 9026, type: WidthType.DXA },
    columnWidths: [2200, 2313, 2200, 2313],
    rows: rows2col.map(r => new TableRow({ children: [
      tc(tp(r[0], { bold: true, size: 16, color: "666666" }), { bg: LGRAY, width: 2200 }),
      tc(tp(r[1], { size: 18, bold: r[2] || false, color: r[3] || DARK }), { bg: WHITE, width: 2313 }),
      tc(tp(r[4] || "", { bold: true, size: 16, color: "666666" }), { bg: LGRAY, width: 2200 }),
      tc(tp(r[5] || "", { size: 18, bold: r[6] || false, color: r[7] || DARK }), { bg: WHITE, width: 2313 }),
    ]})),
  });
}

export function sectionBar(txt, color) {
  return new Table({
    width: { size: 9026, type: WidthType.DXA },
    columnWidths: [9026],
    rows: [new TableRow({ children: [
      tc(tp(txt, { bold: true, size: 20, color: WHITE }), { bg: color, width: 9026, borders: { top: brd(color), bottom: brd(color), left: brd(color), right: brd(color) } }),
    ]})],
  });
}

// Construit les lignes du tableau menu (logique identique au front)
export function buildRows(entry) {
  const rows = [];
  const add = (sec, items) => items.forEach((s, i) => rows.push({ sec: i === 0 ? sec : null, span: items.length, sub: s.k, fn: s.f }));
  if (entry.pMatin) add("Pause cafe Matin", [
    { k: "Sucres", f: m => (m.matin ? m.matin.sucres : "—") },
    { k: "Sales", f: m => (m.matin ? m.matin.sales : "—") },
    { k: "Fruits", f: m => (m.matin ? m.matin.fruits : "—") },
    { k: "The/Lait/Cafe", f: m => (m.matin ? m.matin.chauds : "—") },
    { k: "Bouillie", f: m => (m.matin ? m.matin.bouillie : "—") },
    { k: "Boisson froide", f: m => (m.matin ? m.matin.boisson : "—") },
  ]);
  if (entry.pDej) add("Dejeuner", [
    { k: "Entree", f: m => (m.dejeuner ? m.dejeuner.entree : "—") },
    { k: "Proteine(s)", f: m => (m.dejeuner ? m.dejeuner.proteines : "—") },
    { k: "Accomp.", f: m => (m.dejeuner ? m.dejeuner.accomp : "—") },
    { k: "Dessert", f: m => (m.dejeuner ? m.dejeuner.dessert : "—") },
    { k: "Boisson", f: m => (m.dejeuner ? m.dejeuner.boisson : "—") },
  ]);
  if (entry.pApm) add("Pause cafe Apres-midi", [
    { k: "Sucres", f: m => (m.apm ? m.apm.sucres : "—") },
    { k: "Sales", f: m => (m.apm ? m.apm.sales : "—") },
    { k: "Boisson", f: m => (m.apm ? m.apm.boisson : "—") },
  ]);
  if (entry.pCocktailDej) add("Cocktail Dejeunatoire", [
    { k: "Sales", f: m => (m.cocktailDej ? m.cocktailDej.sales : "—") },
    { k: "Sucres", f: m => (m.cocktailDej ? m.cocktailDej.sucres : "—") },
    { k: "Boissons", f: m => (m.cocktailDej ? m.cocktailDej.boissons : "—") },
  ]);
  if (entry.pCocktailDin) add("Cocktail Dinatoire", [
    { k: "Sales", f: m => (m.cocktailDin ? m.cocktailDin.sales : "—") },
    { k: "Sucres", f: m => (m.cocktailDin ? m.cocktailDin.sucres : "—") },
    { k: "Boissons", f: m => (m.cocktailDin ? m.cocktailDin.boissons : "—") },
  ]);
  return rows;
}
