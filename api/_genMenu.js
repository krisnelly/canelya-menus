// ── GÉNÉRATEUR — DOCUMENT 1 : MENU ────────────────────────────────────────────
import { Document, Paragraph, Table, TableRow, AlignmentType, WidthType } from "docx";
import { tc, tp, sp, divider, titleBlock, infoTable, header, buildRows, DARK, GOLD, WHITE } from "./_docxHelpers.js";

export function genMenuDoc(E) {
  const jo = E.jours;
  const rows = buildRows(E);
  const colW = Math.floor(6026 / jo.length);

  const children = [
    header("Menu semaine du " + E.dateDebut), divider(),
    ...titleBlock("MENU SEMAINE", E.clientNom + " — " + E.nomEvenement),
    infoTable([
      ["Client", E.clientNom, true, "", "Nb personnes", E.nombrePersonnes + " pers.", true],
      ["Date debut", E.dateDebut, false, "", "Service", E.service],
    ]),
    sp(200),
    new Table({
      width: { size: 9026, type: WidthType.DXA },
      columnWidths: [1600, 1400, ...jo.map(() => colW)],
      rows: [
        new TableRow({ children: [
          tc(tp("Prestation", { bold: true, size: 17, color: GOLD }), { bg: DARK, width: 1600 }),
          tc(tp("Detail", { bold: true, size: 17, color: GOLD }), { bg: DARK, width: 1400 }),
          ...jo.map(j => tc(tp(j, { bold: true, size: 18, color: GOLD, align: AlignmentType.CENTER }), { bg: DARK, width: colW })),
        ]}),
        ...rows.map(row => new TableRow({ children: [
          ...(row.sec ? [tc(tp(row.sec, { bold: true, size: 16, color: GOLD }), { bg: "FFF3DD", width: 1600, rowSpan: row.span })] : []),
          tc(tp(row.sub, { size: 15, color: "7a6e5f", italic: true }), { bg: "FAF7F1", width: 1400 }),
          ...jo.map(j => tc(tp(row.fn(E.menus[j] || {}) || "—", { size: 15, align: AlignmentType.CENTER }), { bg: WHITE, width: colW })),
        ]})),
      ],
    }),
    sp(200),
    tp("Genere le " + E.dateCreation + " — Document confidentiel La Maison de Canelya", { size: 15, color: "AAAAAA", align: AlignmentType.CENTER, italic: true }),
  ];

  return new Document({
    styles: { default: { document: { run: { font: "Arial", size: 19, color: DARK } } } },
    sections: [{ properties: { page: { size: { width: 16838, height: 11906 }, margin: { top: 720, right: 720, bottom: 720, left: 720 } } }, children }],
  });
}
