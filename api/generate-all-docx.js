// ── API — GÉNÉRATION DES 5 RAPPORTS (ZIP) ─────────────────────────────────────
// POST /api/generate-all-docx   body = { entry: <objet evenement complet> }
// Retourne une archive .zip contenant les 5 documents Word.
//
// Chaque document a son propre générateur dans /api/_gen*.js — toute
// modification de la mise en forme d'UN document se fait dans SON fichier
// uniquement, sans toucher aux autres.

import { Packer } from "docx";
import JSZip from "jszip";
import { genMenuDoc } from "./_genMenu.js";
import { genDevisDoc } from "./_genDevis.js";
import { genFicheAchatDoc } from "./_genFicheAchat.js";
import { genLogistiqueDoc } from "./_genLogistique.js";
import { genChecklistsDoc } from "./_genChecklists.js";

function safe(name) {
  return String(name || "").replace(/[^a-z0-9]+/gi, "_");
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Methode non autorisee." });
  }
  try {
    const { entry } = req.body;
    if (!entry) return res.status(400).json({ error: "Champ 'entry' manquant." });

    const base = safe(entry.clientNom) + "_" + safe(entry.nomEvenement);

    const docs = [
      { name: `1_Menu_${base}.docx`, doc: genMenuDoc(entry) },
      { name: `2_Devis_${base}.docx`, doc: genDevisDoc(entry) },
      { name: `3_FicheAchat_${base}.docx`, doc: genFicheAchatDoc(entry) },
      { name: `4_Logistique_${base}.docx`, doc: genLogistiqueDoc(entry) },
      { name: `5_CheckLists_${base}.docx`, doc: genChecklistsDoc(entry) },
    ];

    const zip = new JSZip();
    for (const { name, doc } of docs) {
      const buffer = await Packer.toBuffer(doc);
      zip.file(name, buffer);
    }

    const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });

    res.setHeader("Content-Type", "application/zip");
    res.setHeader("Content-Disposition", `attachment; filename="Rapports_${base}.zip"`);
    return res.status(200).send(zipBuffer);
  } catch (err) {
    console.error("Erreur /api/generate-all-docx :", err);
    return res.status(500).json({ error: "Erreur serveur", detail: err.message });
  }
}
