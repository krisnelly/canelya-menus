// ── GÉNÉRATEUR — DOCUMENT 4 : LOGISTIQUE & ÉQUIPE ────────────────────────────
import { Document, Table, TableRow, AlignmentType, WidthType } from "docx";
import { tc, tp, sp, divider, titleBlock, infoTable, header, sectionBar, DARK, GOLD, GREEN, WHITE, LGRAY, RED } from "./_docxHelpers.js";

export function genLogistiqueDoc(E) {
  const nb = E.nombrePersonnes;
  const children = [
    header(), divider(),
    ...titleBlock("FICHE LOGISTIQUE & EQUIPE", E.clientNom + " — " + E.nomEvenement),
    sp(160),
    sectionBar("1. INFORMATIONS EVENEMENT", DARK),
    infoTable([
      ["Client", E.clientNom, true, GOLD, "Evenement", E.nomEvenement],
      ["Date debut", E.dateDebut, false, "", "Nb personnes", nb + " pers. — " + E.service],
      ["Type", E.typeEvenement, false, "", "Distance", E.distanceKm + " km"],
      ["Sensible", E.sensible ? "OUI" : "Non", E.sensible, E.sensible ? RED : DARK, "Cuisson sur place", E.cuissonSurPlace ? "Oui" : "Non"],
    ]),
    sp(200),
    sectionBar("2. PLANNING HORAIRE", "2A2520"),
    new Table({
      width: { size: 9026, type: WidthType.DXA }, columnWidths: [4513, 4513],
      rows: [
        new TableRow({ children: [
          tc(tp("Etape", { bold: true, size: 17, color: WHITE }), { bg: "2A2520", width: 4513 }),
          tc(tp("Heure", { bold: true, size: 17, color: WHITE, align: AlignmentType.CENTER }), { bg: "2A2520", width: 4513 }),
        ]}),
        new TableRow({ children: [
          tc(tp("Depart logistique / installation", { size: 18 }), { bg: LGRAY, width: 4513 }),
          tc(tp((E.planning?.hLogistique || "—") + " (H-3h min.)", { bold: true, size: 19, color: RED, align: AlignmentType.CENTER }), { bg: LGRAY, width: 4513 }),
        ]}),
        ...(E.planning?.hDepartPrestations || []).map((p, i) => new TableRow({ children: [
          tc(tp("Depart repas — " + p.label + " (service " + p.hPresta + ")", { size: 18 }), { bg: i % 2 === 0 ? WHITE : LGRAY, width: 4513 }),
          tc(tp(p.hDepart, { bold: true, size: 19, color: RED, align: AlignmentType.CENTER }), { bg: i % 2 === 0 ? WHITE : LGRAY, width: 4513 }),
        ]})),
        new TableRow({ children: [
          tc(tp("Limite achat ingredients", { bold: true, size: 18 }), { bg: WHITE, width: 4513 }),
          tc(tp(E.planning?.dateLimiteAchat || "—", { bold: true, size: 18, color: RED, align: AlignmentType.CENTER }), { bg: WHITE, width: 4513 }),
        ]}),
      ],
    }),
    sp(200),
    sectionBar("3. MATERIEL LOGISTIQUE", GREEN),
    new Table({
      width: { size: 9026, type: WidthType.DXA }, columnWidths: [3500, 2500, 3026],
      rows: [
        new TableRow({ children: [
          tc(tp("Materiel", { bold: true, size: 17, color: WHITE }), { bg: GREEN, width: 3500 }),
          tc(tp("Quantite", { bold: true, size: 17, color: WHITE, align: AlignmentType.CENTER }), { bg: GREEN, width: 2500 }),
          tc(tp("Remarque", { bold: true, size: 17, color: WHITE }), { bg: GREEN, width: 3026 }),
        ]}),
        ...[
          ["Assiettes", Math.ceil(nb * 1.1) + " assiettes", "Nb pers. + 10%"],
          ["Verres", Math.ceil(nb * 1.1) + " verres", ""],
          ["Couverts", Math.ceil(nb * 1.1) + " couverts", "Fourchette, couteau, cuillere"],
          ["Pinces et louches", "1 par element servi", ""],
          ["Nappes", Math.ceil(nb / 8) + " nappes", "1 par table"],
          ["Papier sopalin / serviettes", nb * 3 + " feuilles min.", ""],
          ["Sacs poubelle", "Min. 3", ""],
        ].map((r, i) => new TableRow({ children: [
          tc(tp(r[0], { size: 17 }), { bg: i % 2 === 0 ? WHITE : LGRAY, width: 3500 }),
          tc(tp(r[1], { size: 17, align: AlignmentType.CENTER }), { bg: i % 2 === 0 ? WHITE : LGRAY, width: 2500 }),
          tc(tp(r[2], { size: 15, italic: true, color: "777777" }), { bg: i % 2 === 0 ? WHITE : LGRAY, width: 3026 }),
        ]})),
      ],
    }),
    sp(200),
    sectionBar("4. COMPOSITION DE L'EQUIPE", "5D3A8B"),
    new Table({
      width: { size: 9026, type: WidthType.DXA }, columnWidths: [2500, 600, 2500, 3426],
      rows: [
        new TableRow({ children: [
          tc(tp("Role", { bold: true, size: 17, color: WHITE }), { bg: "5D3A8B", width: 2500 }),
          tc(tp("Nb", { bold: true, size: 17, color: WHITE, align: AlignmentType.CENTER }), { bg: "5D3A8B", width: 600 }),
          tc(tp("Personne(s)", { bold: true, size: 17, color: WHITE }), { bg: "5D3A8B", width: 2500 }),
          tc(tp("Remarque", { bold: true, size: 17, color: WHITE }), { bg: "5D3A8B", width: 3426 }),
        ]}),
        ...[
          ["Superviseur terrain", "1", E.superviseurTerrain, ""],
          ["Superviseur cuisine", "1", E.superviseurCuisine, "Gout, temperature, quantite avant depart"],
          ["Cuisinier(s)", E.equipe.nbCuisiniers, "A definir", ""],
          ["Serveur(s)", E.equipe.nbServeurs, "A definir", E.service === "Buffet" ? "1 pour 8-10 pers." : "1 pour 4 pers."],
          ["Chauffeur(s)", E.equipe.nbChauffeurs, "A definir", E.distanceKm >= 20 ? "2 chauf. (>= 20km)" : "1 chauffeur"],
        ].map((r, i) => new TableRow({ children: [
          tc(tp(r[0], { bold: true, size: 17 }), { bg: i % 2 === 0 ? WHITE : LGRAY, width: 2500 }),
          tc(tp(String(r[1]), { bold: true, size: 19, align: AlignmentType.CENTER, color: "5D3A8B" }), { bg: i % 2 === 0 ? WHITE : LGRAY, width: 600 }),
          tc(tp(r[2], { size: 17 }), { bg: i % 2 === 0 ? WHITE : LGRAY, width: 2500 }),
          tc(tp(r[3], { size: 15, italic: true, color: "777777" }), { bg: i % 2 === 0 ? WHITE : LGRAY, width: 3426 }),
        ]})),
      ],
    }),
    sp(200),
    sectionBar("5. DRESS CODE", GOLD),
    new Table({
      width: { size: 9026, type: WidthType.DXA }, columnWidths: [3000, 6026],
      rows: [new TableRow({ children: [
        tc(tp("Tenue selectionnee", { bold: true, size: 17, color: "666666" }), { bg: LGRAY, width: 3000 }),
        tc(tp(E.dresscode, { bold: true, size: 22, color: GOLD }), { bg: WHITE, width: 6026 }),
      ]})],
    }),
  ];

  return new Document({
    styles: { default: { document: { run: { font: "Arial", size: 19, color: DARK } } } },
    sections: [{ properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 720, right: 720, bottom: 720, left: 720 } } }, children }],
  });
}
