// ── GÉNÉRATEUR — DOCUMENT 2 : DEVIS ──────────────────────────────────────────
import { Document, Table, TableRow, AlignmentType, WidthType } from "docx";
import { tc, tp, sp, divider, titleBlock, infoTable, header, fmt, DARK, GOLD, WHITE, LGRAY } from "./_docxHelpers.js";

export function genDevisDoc(E) {
  const d = E.devis;
  const children = [
    header("IFU : 2201400667102"), divider(),
    ...titleBlock("DEVIS / PRO FORMA", "N° " + E.numeroDevis),
    infoTable([
      ["Client", E.clientNom, true, GOLD, "Date emission", E.dateCreation],
      ["Evenement", E.nomEvenement, false, "", "Validite", "30 jours"],
      ["Date prestation", E.dateDebut, false, "", "Nb personnes", E.nombrePersonnes + " pers. — " + E.service],
      ["Type evenement", E.typeEvenement, false, "", "Limite achat", E.planning?.dateLimiteAchat || ""],
    ]),
    sp(200),
    new Table({
      width: { size: 9026, type: WidthType.DXA },
      columnWidths: [3000, 2500, 900, 1200, 1426],
      rows: [
        new TableRow({ children: [
          tc(tp("Designation", { bold: true, size: 18, color: WHITE }), { bg: DARK, width: 3000 }),
          tc(tp("Detail", { bold: true, size: 18, color: WHITE }), { bg: DARK, width: 2500 }),
          tc(tp("Qte", { bold: true, size: 18, color: WHITE, align: AlignmentType.CENTER }), { bg: DARK, width: 900 }),
          tc(tp("P.U. HT", { bold: true, size: 18, color: WHITE, align: AlignmentType.RIGHT }), { bg: DARK, width: 1200 }),
          tc(tp("Total HT", { bold: true, size: 18, color: WHITE, align: AlignmentType.RIGHT }), { bg: DARK, width: 1426 }),
        ]}),
        ...d.lignes.map((l, i) => new TableRow({ children: [
          tc(tp(l.designation, { bold: true, size: 18 }), { bg: i % 2 === 0 ? WHITE : LGRAY, width: 3000 }),
          tc(tp(l.detail, { size: 16, italic: true, color: "555555" }), { bg: i % 2 === 0 ? WHITE : LGRAY, width: 2500 }),
          tc(tp(l.qte + " pers.", { size: 18, align: AlignmentType.CENTER }), { bg: i % 2 === 0 ? WHITE : LGRAY, width: 900 }),
          tc(tp(fmt(l.pu), { size: 18, align: AlignmentType.RIGHT }), { bg: i % 2 === 0 ? WHITE : LGRAY, width: 1200 }),
          tc(tp(fmt(l.qte * l.pu), { bold: true, size: 18, align: AlignmentType.RIGHT }), { bg: i % 2 === 0 ? WHITE : LGRAY, width: 1426 }),
        ]})),
        new TableRow({ children: [
          tc(tp(""), { borders: { top: { style: "none" }, bottom: { style: "none" }, left: { style: "none" }, right: { style: "none" } }, width: 3000, span: 3 }),
          tc(tp("Sous-total HT", { bold: true, size: 18, align: AlignmentType.RIGHT }), { bg: LGRAY, width: 1200 }),
          tc(tp(fmt(d.totalHT), { bold: true, size: 18, align: AlignmentType.RIGHT }), { bg: LGRAY, width: 1426 }),
        ]}),
        new TableRow({ children: [
          tc(tp(""), { borders: { top: { style: "none" }, bottom: { style: "none" }, left: { style: "none" }, right: { style: "none" } }, width: 3000, span: 3 }),
          tc(tp("TVA (18%)", { size: 18, align: AlignmentType.RIGHT, color: "666666" }), { bg: WHITE, width: 1200 }),
          tc(tp(fmt(d.tva), { size: 18, align: AlignmentType.RIGHT, color: "666666" }), { bg: WHITE, width: 1426 }),
        ]}),
        new TableRow({ children: [
          tc(tp(""), { borders: { top: { style: "none" }, bottom: { style: "none" }, left: { style: "none" }, right: { style: "none" } }, width: 3000, span: 3 }),
          tc(tp("TOTAL TTC", { bold: true, size: 22, color: WHITE, align: AlignmentType.RIGHT }), { bg: GOLD, width: 1200 }),
          tc(tp(fmt(d.totalTTC), { bold: true, size: 22, color: WHITE, align: AlignmentType.RIGHT }), { bg: GOLD, width: 1426 }),
        ]}),
      ],
    }),
    sp(200),
    tp("Transport, logistique, service, mise en place et materiel inclus.", { size: 17, italic: true, color: "555555" }),
    tp("Devis valable 30 jours a compter de la date d'emission.", { size: 16, italic: true, color: "888888" }),
    sp(300),
    tp("La Maison de Canelya  |  Fidjrosse, Cotonou, Benin  |  +229 01 61 13 13  |  info@canelya.com  |  IFU : 2201400667102", { size: 15, color: "AAAAAA", align: AlignmentType.CENTER, italic: true }),
  ];

  return new Document({
    styles: { default: { document: { run: { font: "Arial", size: 19, color: DARK } } } },
    sections: [{ properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 720, right: 720, bottom: 720, left: 720 } } }, children }],
  });
}
