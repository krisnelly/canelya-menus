// ── LOGIQUE — TÉLÉCHARGEMENT DU RAPPORT MENU (WORD) ───────────────────────────
// Appelle /api/generate-menu-docx et déclenche le téléchargement du fichier
// dans le navigateur. Toute modification du comportement de téléchargement se
// fait UNIQUEMENT ici. La mise en forme du document Word se modifie dans
// /api/generate-menu-docx.js.

export async function genererRapportMenu(entry) {
  const r = await fetch("/api/generate-menu-docx", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ entry }),
  });
  if (!r.ok) throw new Error("Echec de la generation du document.");

  const blob = await r.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Menu_${entry.clientNom}_${entry.nomEvenement}`.replace(/[^a-z0-9]+/gi, "_") + ".docx";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}

// Génère les 5 documents (menu, devis, fiche d'achat, logistique, check-lists)
// et déclenche le téléchargement d'une archive .zip les contenant tous.
export async function genererTousLesRapports(entry) {
  const r = await fetch("/api/generate-all-docx", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ entry }),
  });
  if (!r.ok) throw new Error("Echec de la generation des rapports.");

  const blob = await r.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Rapports_${entry.clientNom}_${entry.nomEvenement}`.replace(/[^a-z0-9]+/gi, "_") + ".zip";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}
