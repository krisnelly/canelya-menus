// ── API — GÉNÉRATION DU RAPPORT MENU EN WORD ─────────────────────────────────
// POST /api/generate-menu-docx   body = { entry: <objet evenement complet> }
// Retourne le fichier .docx en binaire, prêt à être téléchargé par le navigateur.
//
// Toute modification de la mise en forme du document se fait UNIQUEMENT ici.
// La logique de génération de menu elle-même reste dans /src/logic — ce fichier
// ne fait que MISE EN FORME du document à partir des données déjà calculées.

import {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, BorderStyle, WidthType, ShadingType, VerticalAlign,
} from "docx";

const GOLD = "8B6914", DARK = "1A1812", LGRAY = "F5F5F5", WHITE = "FFFFFF", BC = "CCCCCC";
const brd = (c = BC) => ({ style: BorderStyle.SINGLE, size: 4, color: c });
const borders = { top: brd(), bottom: brd(), left: brd(), right: brd() };

const tc = (children, opts = {}) => new TableCell({
  borders: opts.borders || borders,
  width: opts.width ? { size: opts.width, type: WidthType.DXA } : undefined,
  shading: { fill: opts.bg || WHITE, type: ShadingType.CLEAR },
  margins: { top: 80, bottom: 80, left: 120, right: 120 },
  verticalAlign: VerticalAlign.CENTER,
  columnSpan: opts.span,
  rowSpan: opts.rowSpan,
  children: Array.isArray(children) ? children : [children],
});
const tp = (text, opts = {}) => new Paragraph({
  alignment: opts.align || AlignmentType.LEFT,
  spacing: { after: 0 },
  children: [new TextRun({ text: String(text || ""), bold: opts.bold || false, color: opts.color || DARK, size: opts.size || 19, font: "Arial" })],
});

// Construit les lignes du tableau menu (même logique que buildRows côté front,
// dupliquée ici car ce fichier tourne côté serveur sans accès au bundle React)
function buildRows(entry) {
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

function genDoc(entry) {
  const jo = entry.jours;
  const rows = buildRows(entry);
  const colW = Math.floor(6500 / jo.length);

  const children = [
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 60 }, children: [
      new TextRun({ text: "LA MAISON DE CANELYA", bold: true, size: 30, font: "Arial", color: DARK }),
    ]}),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 200 }, children: [
      new TextRun({ text: "Jardin et maison", italics: true, size: 18, font: "Arial", color: "2D6A2D" }),
    ]}),
    new Paragraph({ spacing: { after: 40 }, children: [
      new TextRun({ text: entry.clientNom + " — " + entry.nomEvenement, bold: true, size: 24, font: "Arial", color: GOLD }),
    ]}),
    new Paragraph({ spacing: { after: 200 }, children: [
      new TextRun({ text: entry.dateDebut + "  |  " + entry.nombrePersonnes + " personnes  |  " + entry.service, size: 18, font: "Arial", color: "555555" }),
    ]}),
    new Table({
      width: { size: 9026, type: WidthType.DXA },
      columnWidths: [1400, 1126, ...jo.map(() => colW)],
      rows: [
        new TableRow({ children: [
          tc(tp("Prestation", { bold: true, color: WHITE }), { bg: DARK, width: 1400 }),
          tc(tp("Detail", { bold: true, color: WHITE }), { bg: DARK, width: 1126 }),
          ...jo.map(j => tc(tp(j, { bold: true, color: WHITE, align: AlignmentType.CENTER }), { bg: DARK, width: colW })),
        ]}),
        ...rows.map(row => new TableRow({ children: [
          ...(row.sec ? [tc(tp(row.sec, { bold: true, color: GOLD }), { bg: "FFF3DD", width: 1400, rowSpan: row.span })] : []),
          tc(tp(row.sub, { color: "777777" }), { bg: LGRAY, width: 1126 }),
          ...jo.map(j => tc(tp(row.fn(entry.menus[j] || {}), { align: AlignmentType.CENTER }), { bg: WHITE, width: colW })),
        ]})),
      ],
    }),
    new Paragraph({ spacing: { before: 300 }, alignment: AlignmentType.CENTER, children: [
      new TextRun({ text: "La Maison de Canelya  |  Fidjrosse, Cotonou, Benin  |  +229 01 61 13 13  |  info@canelya.com", size: 15, font: "Arial", color: "AAAAAA" }),
    ]}),
  ];

  return new Document({
    styles: { default: { document: { run: { font: "Arial", size: 19, color: DARK } } } },
    sections: [{ properties: { page: { size: { width: 16838, height: 11906 }, margin: { top: 720, right: 720, bottom: 720, left: 720 } } }, children }],
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Methode non autorisee." });
  }
  try {
    const { entry } = req.body;
    if (!entry) return res.status(400).json({ error: "Champ 'entry' manquant." });

    const doc = genDoc(entry);
    const buffer = await Packer.toBuffer(doc);

    const filename = `Menu_${entry.clientNom}_${entry.nomEvenement}`.replace(/[^a-z0-9]+/gi, "_") + ".docx";
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    return res.status(200).send(buffer);
  } catch (err) {
    console.error("Erreur /api/generate-menu-docx :", err);
    return res.status(500).json({ error: "Erreur serveur", detail: err.message });
  }
}
