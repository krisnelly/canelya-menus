// ── GÉNÉRATEUR — DOCUMENT 3 : FICHE D'ACHAT (BON DE COMMANDE) ────────────────
// Parcourt TOUTES les prestations de TOUS les jours (pause café matin, déjeuner,
// pause café APM, cocktail déjeunatoire, cocktail dînatoire) et reclasse chaque
// item par fournisseur, avec quantité (nb pers × nb d'occurrences dans la
// semaine) et prix unitaire issus de Recettes_Canelya.docx.
//
// IMPORTANT : aucun item du menu ne doit être perdu. Tout ce qui apparaît dans
// le menu généré apparaît ici. Les prix manquants sont marqués « Variable » /
// « A preciser » sans masquer la ligne.
//
// Le catalogue (CAT / PROT) est l'unique endroit à modifier pour ajuster un
// fournisseur ou un prix d'item. Ne touche à aucune autre partie de l'app.

import { Document, Table, TableRow, AlignmentType, WidthType } from "docx";
import { tc, tp, sp, divider, titleBlock, infoTable, header, fmt, DARK, GOLD, WHITE, LGRAY } from "./_docxHelpers.js";

// ── Fournisseurs (libellé + couleur de bandeau) ──────────────────────────────
const FOURN = {
  VOLAILLER:   { label: "VOLAILLER (poulet)",                     color: "5D3A1A" },
  BOUCHER:     { label: "BOUCHER (boeuf / mouton)",               color: "8B1A1A" },
  POISSONNIER: { label: "POISSONNIER",                            color: "1A4A6B" },
  MARCHE:      { label: "MARCHE (legumes, fruits, tubercules)",   color: "2D6A2D" },
  PATISSERIE:  { label: "PATISSERIE / FAIT MAISON",               color: "8B6914" },
  FOURNISSEUR: { label: "FOURNISSEUR / COMMANDE (partenaires)",   color: "6B2A6B" },
  SUPERMARCHE: { label: "SUPERMARCHE / EPICERIE",                 color: "4A4A8B" },
};
const ORDER = ["VOLAILLER", "BOUCHER", "POISSONNIER", "MARCHE", "PATISSERIE", "FOURNISSEUR", "SUPERMARCHE"];

const norm = s => String(s || "").toLowerCase().replace(/\(.*?\)/g, "").replace(/\s+/g, " ").trim();

// ── Catalogue des items « à la portion » : nom -> [fournisseur, prix/pers, note]
// prix = FCFA/pers (null = à préciser). Source : Recettes_Canelya.docx.
const CAT = {
  // Pause café — sucrés (blé / viennoiseries)
  "mini croissants": ["SUPERMARCHE", null, "viennoiserie — 3/pers"],
  "mini pains chocolat": ["SUPERMARCHE", null, "viennoiserie — 3/pers"],
  "mini viennoiseries": ["SUPERMARCHE", null, "viennoiserie — 3/pers"],
  "crepe sucree": ["PATISSERIE", 138, "1/pers"],
  "crepe nutella": ["PATISSERIE", 198, "1/pers"],
  "pancake sirop erable": ["PATISSERIE", 127, "1/pers"],
  // Pause café — sucrés alternatifs (fonio / manioc)
  "brownie fonio": ["FOURNISSEUR", 200, "1/pers — boite de 10"],
  "cake farine manioc": ["PATISSERIE", 225, "1/pers"],
  "pancake fonio": ["PATISSERIE", null, "1/pers"],
  "beignet fonio": ["PATISSERIE", null, "1/pers"],
  "mini cake fonio": ["PATISSERIE", 225, "1/pers"],
  "doko": ["FOURNISSEUR", null, "farine de ble — 1/pers"],
  "taletale": ["PATISSERIE", 185, "1/pers"],
  // Pause café — salés
  "mini friand poisson": ["FOURNISSEUR", null, "2/pers"],
  "mini friand boeuf": ["FOURNISSEUR", null, "2/pers"],
  "mini quiche": ["FOURNISSEUR", null, "1/pers — commande ou maison"],
  "mini pizza jambon": ["FOURNISSEUR", null, "1/pers — commande ou maison"],
  "mini pizza boeuf": ["FOURNISSEUR", null, "1/pers — commande ou maison"],
  "mini pizza": ["FOURNISSEUR", null, "1/pers — commande ou maison"],
  "pastel poisson": ["PATISSERIE", 79, "2/pers"],
  "pastel boeuf": ["PATISSERIE", 70, "2/pers"],
  "crepe roulee jambon-fromage": ["PATISSERIE", 238, "1/pers"],
  "mini burger viande hachee": ["PATISSERIE", 375, "1/pers"],
  "cornet de tacos a la viande": ["PATISSERIE", 176, "1/pers"],
  // Fruits
  "fruits frais saison": ["MARCHE", null, "1 portion/pers"],
  "salade de fruits": ["MARCHE", null, "1 portion/pers"],
  "brochette de fruits": ["MARCHE", null, "1 portion/pers"],
  // Boissons chaudes (matin) — éclatées depuis « The + Lait + Cafe »
  "the": ["SUPERMARCHE", null, "1/pers (+ sucre)"],
  "lait": ["SUPERMARCHE", null, "1/pers"],
  "cafe": ["SUPERMARCHE", null, "1/pers (+ sucre)"],
  "the hibiscus": ["SUPERMARCHE", null, "1/pers"],
  "the vert": ["SUPERMARCHE", null, "1/pers"],
  // Bouillies (commandées sauf tapioca)
  "bouillie de mil": ["FOURNISSEUR", null, "1/pers (+ lait concentre)"],
  "aklui": ["FOURNISSEUR", null, "bouillie mais — 1/pers (+ lait concentre)"],
  "bouillie bita": ["FOURNISSEUR", null, "1/pers (+ lait concentre)"],
  "bouillie souchet": ["FOURNISSEUR", null, "1/pers (+ lait concentre)"],
  // Boissons froides / jus
  "jus orange": ["MARCHE", null, "~33cl/pers"],
  "jus ananas": ["MARCHE", 225, "1 ananas/pers"],
  "cocktail de fruits": ["MARCHE", null, "~33cl/pers"],
  "cocktail fruits": ["MARCHE", null, "~33cl/pers"],
  "bissap": ["MARCHE", 155, "333ml/pers — fait maison"],
  "adoyo": ["MARCHE", 79, "333ml/pers"],
  "tchakpalo": ["FOURNISSEUR", 183, "333ml/pers — achete 550F/L"],
  "gingembre frais": ["MARCHE", 689, "333ml/pers"],
  "citronnade": ["MARCHE", 339, "667ml/pers"],
  "sodas": ["SUPERMARCHE", 292, "1 canette/pers — pack 24"],
  "eau minerale": ["SUPERMARCHE", 317, "~0.5L/pers — pack 6"],
  // Boissons alcoolisées (cocktail)
  "vin rouge": ["SUPERMARCHE", null, "a preciser"],
  "vin blanc": ["SUPERMARCHE", null, "a preciser"],
  "prosecco": ["SUPERMARCHE", null, "a preciser"],
  "biere": ["SUPERMARCHE", null, "a preciser"],
  "cocktail alcoolise": ["SUPERMARCHE", null, "a preciser"],
  // APM salés — wagashi & goûters locaux
  "ata": ["FOURNISSEUR", null, "beignet haricot — 1/pers"],
  "burger ata": ["PATISSERIE", 226, "1/pers"],
  "brochettes wagashi": ["FOURNISSEUR", 350, "2/pers"],
  "beignets wagashi": ["FOURNISSEUR", 158, "1/pers"],
  "wagashi crispy": ["FOURNISSEUR", 155, "1/pers"],
  "verrines wagashi": ["FOURNISSEUR", 180, "1/pers"],
  "ablo fretins": ["FOURNISSEUR", 73, "1/pers"],
  "frites de patates douces": ["MARCHE", 75, "1 portion/pers"],
  "frites patate douce": ["MARCHE", 75, "1 portion/pers"],
  "frites d'igname": ["MARCHE", 125, "1 portion/pers"],
  "frites igname": ["MARCHE", 125, "1 portion/pers"],
  "brochettes d'alloco": ["MARCHE", 170, "2/pers"],
  "crevettes roulees a la banane": ["POISSONNIER", 280, "1/pers"],
  "tcheke roulee au concombre": ["MARCHE", 70, "2/pers"],
  "crispy de poulet": ["VOLAILLER", 138, "1/pers"],
  "boulette patate douce au poisson": ["POISSONNIER", 245, "3/pers"],
  "boulette de banane": ["MARCHE", 95, "2/pers"],
  "mini brochettes de gesier": ["VOLAILLER", 170, "2/pers"],
  "verrine apf": ["POISSONNIER", 130, "attieke poisson fume — 1/pers"],
  "verrine choukouya boeuf": ["BOUCHER", 120, "1/pers"],
  // Cocktail salés/sucrés spécifiques
  "mini bruschetta": ["PATISSERIE", null, "1/pers"],
  "verrines cocktail": ["MARCHE", null, "1/pers"],
  "ata croustillant": ["FOURNISSEUR", null, "1/pers"],
  "bouchees feuilletees": ["PATISSERIE", null, "1/pers"],
  "rouleaux de printemps": ["MARCHE", null, "1/pers"],
  "mini eclair": ["PATISSERIE", null, "1/pers"],
  "mini tarte fruits": ["PATISSERIE", null, "1/pers"],
  "verrine dessert": ["PATISSERIE", null, "1/pers"],
  "mini macaron": ["PATISSERIE", null, "1/pers"],
  // Entrées (déjeuner)
  "salade canelia": ["MARCHE", null, "1/pers (+ wagashi, proteine, vinaigrette)"],
  "cocktail avocat-crevettes": ["POISSONNIER", null, "1/pers (avocat + crevettes)"],
  "salade composee": ["MARCHE", null, "1/pers (+ vinaigrette)"],
  "macedoine au poulet": ["MARCHE", null, "1/pers (+ poulet, creme)"],
  "macedoine boulette de viande": ["MARCHE", null, "1/pers (+ boulettes, creme)"],
  "coleslaw": ["MARCHE", null, "1/pers (+ vinaigrette legere)"],
  "salade de chou": ["MARCHE", null, "1/pers (chaude)"],
  "salade de papaye": ["MARCHE", null, "1/pers (+ vinaigrette)"],
  // Desserts (déjeuner)
  "degue": ["FOURNISSEUR", 437, "15-20cl/pers — 2500F/L"],
  "akpan": ["FOURNISSEUR", 100, "yaourt vegetal + lait concentre"],
  "lait caille": ["FOURNISSEUR", 437, "15-20cl/pers — 2500F/L"],
  "riz au lait": ["PATISSERIE", 20, "20g riz/pers"],
  "fondant chocolat": ["PATISSERIE", 525, "1/pers"],
  "tartelette fruits": ["PATISSERIE", 440, "2 morceaux/pers"],
  "cake varie": ["PATISSERIE", 225, "1/pers"],
  "cake renverse ananas": ["PATISSERIE", 275, "1/pers + tranche ananas"],
  "panna cotta": ["PATISSERIE", 854, "1/pers + coulis mangue"],
  "flan": ["PATISSERIE", 380, "1/pers"],
  // Accompagnements (déjeuner)
  "riz garni": ["SUPERMARCHE", null, "riz — 1 portion/pers"],
  "telibo": ["MARCHE", 125, "2 ramequins/pers — 250g farine"],
  "pate blanche": ["MARCHE", 125, "2 ramequins/pers — 250g farine"],
  "wokoli": ["MARCHE", 125, "2 ramequins/pers — 250g farine"],
  "agbeli": ["FOURNISSEUR", 200, "2 boules/pers"],
  "amiwo": ["MARCHE", 125, "2 ramequins/pers — 250g farine"],
  "bomiwo": ["MARCHE", 125, "2 ramequins/pers — 250g farine"],
  "pyron": ["MARCHE", 80, "2 ramequins/pers — garri"],
  "akassa": ["FOURNISSEUR", 75, "1.5 boule/pers"],
  "attieke": ["FOURNISSEUR", 125, "100g/pers"],
  "ablo": ["FOURNISSEUR", 150, "3/pers"],
  "come": ["FOURNISSEUR", 100, "2 boules/pers"],
  "alloco": ["MARCHE", 350, "2-3 bananes/pers — 100g"],
  "foutou banane": ["MARCHE", null, "3-4 bananes plantain/pers"],
  "igname pilee": ["FOURNISSEUR", 500, "1 portion/pers"],
  "frites manioc": ["MARCHE", null, "1 portion/pers"],
  "frites pommes de terre": ["MARCHE", null, "1 portion/pers"],
  "pommes sautees": ["MARCHE", null, "1 portion/pers"],
  "semoule": ["SUPERMARCHE", null, "1 portion/pers"],
};

// ── Protéines du déjeuner : nom -> [fournisseur, mode de calcul] ──────────────
// modes : poulet (poulet entier 3000F), boeuf/mouton/poisson (au kg),
// commande2500 (Thiéboudienne, prix/pers).
const PROT = {
  "poulet yassa": ["VOLAILLER", "poulet"],
  "kedjenou de poulet": ["VOLAILLER", "poulet"],
  "poulet grille": ["VOLAILLER", "poulet"],
  "brochette de poulet": ["VOLAILLER", "poulet"],
  "emince poulet curry coco": ["VOLAILLER", "poulet"],
  "couscous poulet merguez": ["VOLAILLER", "poulet"],
  "boeuf yassa": ["BOUCHER", "boeuf"],
  "brochette de boeuf": ["BOUCHER", "boeuf"],
  "choukouya de boeuf": ["BOUCHER", "boeuf"],
  "emince boeuf curry coco": ["BOUCHER", "boeuf"],
  "ragout d'igname": ["BOUCHER", "boeuf"],
  "ragout de patate douce": ["BOUCHER", "boeuf"],
  "feijoada": ["BOUCHER", "boeuf"],
  "choukouya de mouton": ["BOUCHER", "mouton"],
  "atassi": ["POISSONNIER", "poisson"],
  "djongoli": ["POISSONNIER", "poisson"],
  "poisson grille": ["POISSONNIER", "poisson"],
  "brochette de poisson": ["POISSONNIER", "poisson"],
  "thiebboudienne": ["FOURNISSEUR", "commande2500"],
};

// Découpe un champ texte en items atomiques (gère « , » « / » « + »)
const splitItems = s => String(s || "").split(/\s*[,/+]\s*/).map(x => x.trim()).filter(x => x && x !== "—");

export function genFicheAchatDoc(E) {
  const nb = E.nombrePersonnes || 0;
  const jours = E.jours || [];

  // items[four] = { key -> {nom, occ, four, price, note} }  (à la portion)
  // prot[four]  = { key -> {nom, occ, four, mode} }           (au poids/pièce)
  const items = {};
  const prots = {};
  ORDER.forEach(f => { items[f] = {}; prots[f] = {}; });

  // Ajoute un item « à la portion » (1 occurrence = 1 apparition sur 1 jour)
  const addItem = raw => {
    const key = norm(raw);
    if (!key) return;
    let [four, price, note] = CAT[key] || [];
    if (!four) {                                   // fallback par mots-clés
      if (/poulet|poule|gesier/.test(key)) four = "VOLAILLER";
      else if (/boeuf|mouton|viande/.test(key)) four = "BOUCHER";
      else if (/poisson|crevette|fretin|fumé|fume/.test(key)) four = "POISSONNIER";
      else if (/eau|soda|the|cafe|lait|vin|biere|sucre/.test(key)) four = "SUPERMARCHE";
      else if (/wagashi|brownie|bouillie|akassa|ablo|igname pilee|degue|akpan/.test(key)) four = "FOURNISSEUR";
      else four = "MARCHE";
      price = null; note = "a preciser";
    }
    const store = items[four];
    if (!store[key]) store[key] = { nom: raw.trim(), occ: 0, four, price, note };
    store[key].occ += 1;
  };

  // Ajoute une protéine de déjeuner (au poids / à la pièce)
  const addProt = raw => {
    const key = norm(raw);
    if (!key) return;
    let entry = PROT[key];
    let four, mode;
    if (entry) { [four, mode] = entry; }
    else if (/poulet/.test(key)) { four = "VOLAILLER"; mode = "poulet"; }
    else if (/mouton/.test(key)) { four = "BOUCHER"; mode = "mouton"; }
    else if (/boeuf|viande|boulette/.test(key)) { four = "BOUCHER"; mode = "boeuf"; }
    else if (/poisson|fretin|tilapia|capitaine/.test(key)) { four = "POISSONNIER"; mode = "poisson"; }
    else { addItem(raw); return; }              // ex. « sauce graine » -> marché
    const store = prots[four];
    if (!store[key]) store[key] = { nom: raw.trim(), occ: 0, four, mode };
    store[key].occ += 1;
  };

  // ── Parcours de TOUTES les prestations de TOUS les jours ───────────────────
  let nbDej = 0, hasMatin = false, hasBouillie = false, hasFroid = false, hasEntree = false, hasColdEntree = false;
  const COLD_ENTREES = ["salade canelia", "cocktail avocat-crevettes", "salade composee", "coleslaw", "salade de papaye"];

  jours.forEach(j => {
    const m = E.menus?.[j];
    if (!m) return;

    if (m.matin) {
      hasMatin = true;
      splitItems(m.matin.sucres).forEach(addItem);
      splitItems(m.matin.sales).forEach(addItem);
      if (m.matin.fruits) addItem(m.matin.fruits);
      splitItems(m.matin.chauds).forEach(addItem);   // The + Lait + Cafe
      if (m.matin.bouillie) { addItem(m.matin.bouillie); hasBouillie = true; }
      if (m.matin.boisson) { addItem(m.matin.boisson); hasFroid = true; }
    }

    if (m.dejeuner) {
      nbDej += 1;
      if (m.dejeuner.entree) {
        addItem(m.dejeuner.entree);
        hasEntree = true;
        if (COLD_ENTREES.includes(norm(m.dejeuner.entree))) hasColdEntree = true;
      }
      (m.dejeuner.proteines || "").split(/\s*[/+]\s*/).forEach(addProt);
      splitItems(m.dejeuner.accomp).forEach(addItem);
      if (m.dejeuner.dessert) addItem(m.dejeuner.dessert);
      if (m.dejeuner.boisson) { addItem(m.dejeuner.boisson); hasFroid = true; }
    }

    if (m.apm) {
      splitItems(m.apm.sucres).forEach(addItem);
      splitItems(m.apm.sales).forEach(addItem);
      if (m.apm.boisson) { addItem(m.apm.boisson); hasFroid = true; }
    }

    if (m.cocktailDej) {
      splitItems(m.cocktailDej.sales).forEach(addItem);
      splitItems(m.cocktailDej.sucres).forEach(addItem);
      splitItems(m.cocktailDej.boissons).forEach(addItem);
      hasFroid = true;
    }

    if (m.cocktailDin) {
      splitItems(m.cocktailDin.sales).forEach(addItem);
      splitItems(m.cocktailDin.sucres).forEach(addItem);
      splitItems(m.cocktailDin.boissons).forEach(addItem);
      hasFroid = true;
    }
  });

  // ── Condiments & bases automatiques (règles métier Canélya) ────────────────
  if (nbDej > 0) {
    addItemFixed(items, "Piment (prepare)", "MARCHE", null, `~20g/pers — ${nbDej} dejeuner(s) + APM/cocktail`);
    addItemFixed(items, "Oignons, tomates, ail, gingembre, epices", "MARCHE", null, "bases cuisson sauces");
  }
  if (hasEntree)      addItemFixed(items, "Pain", "SUPERMARCHE", null, "avec les entrees du dejeuner");
  if (hasColdEntree)  addItemFixed(items, "Vinaigrette (mayo, moutarde, huile)", "SUPERMARCHE", null, "entrees froides uniquement");
  if (hasMatin)       addItemFixed(items, "Sucre roux / blanc", "SUPERMARCHE", null, "avec the / cafe / lait");
  if (hasBouillie)    addItemFixed(items, "Lait concentre sucre", "SUPERMARCHE", null, "avec les bouillies");
  if (hasFroid)       addItemFixed(items, "Glacons", "MARCHE", null, "avec toutes les boissons froides");

  // ── Construction des lignes par fournisseur ────────────────────────────────
  const lignesParFour = {};
  ORDER.forEach(f => (lignesParFour[f] = []));

  // Protéines (poids / pièces)
  ORDER.forEach(f => {
    Object.values(prots[f]).forEach(p => {
      const tot = nb * p.occ; // servings cumulés
      let qte, pu, total, note = `${p.occ} jour(s)`;
      if (p.mode === "poulet") {
        const morceaux = Math.ceil(tot * 1.5);
        const pieces = Math.ceil(morceaux / 5);   // ~5 morceaux / poulet bicyclette
        qte = `${pieces} poulet(s)`; pu = "3 000 FCFA/piece"; total = pieces * 3000;
        note += " — 1.5 morceau/pers";
      } else if (p.mode === "commande2500") {
        qte = `${tot} pers`; pu = "2 500 FCFA/pers"; total = tot * 2500;
        note += " — commande partenaire";
      } else {
        const kg = tot * 0.1;                      // ~100 g / pers
        qte = `${kg.toFixed(2)} kg`;
        if (p.mode === "poisson") { pu = "3 000-4 000 FCFA/kg"; total = Math.round(kg * 4000); }
        else if (p.mode === "mouton") { pu = "4 000-5 000 FCFA/kg"; total = Math.round(kg * 4500); }
        else { pu = "4 000-5 000 FCFA/kg"; total = Math.round(kg * 4500); }
        note += " — 100g/pers";
      }
      lignesParFour[f].push({ produit: p.nom, qte, pu, total, note });
    });
  });

  // Items à la portion
  ORDER.forEach(f => {
    Object.values(items[f]).forEach(it => {
      const tot = nb * it.occ;
      const total = it.price ? tot * it.price : 0;
      const pu = it.price ? `${it.price.toLocaleString("fr-FR")} FCFA/pers` : "Variable";
      const occNote = it.occ > 1 ? ` • ${it.occ}x/semaine` : "";
      lignesParFour[f].push({ produit: it.nom, qte: `${tot} pers`, pu, total, note: (it.note || "") + occNote });
    });
  });

  // Tri par produit dans chaque fournisseur
  ORDER.forEach(f => lignesParFour[f].sort((a, b) => a.produit.localeCompare(b.produit, "fr")));

  let grandTotal = 0;
  Object.values(lignesParFour).forEach(l => l.forEach(x => (grandTotal += x.total || 0)));

  // ── Rendu Word ─────────────────────────────────────────────────────────────
  const CW = [3000, 1800, 1500, 1200, 1526];
  const TW = CW.reduce((a, b) => a + b, 0);

  const children = [
    header(), divider(),
    ...titleBlock("FICHE D'ACHAT (BON DE COMMANDE)", `${jours.length} jour(s) — toutes prestations`),
    infoTable([
      ["Client", E.clientNom, true, GOLD, "Evenement", E.nomEvenement],
      ["Date evenement", E.dateDebut, false, "", "Nb personnes", nb + " pers. — " + E.service],
      ["Limite achat", E.planning?.dateLimiteAchat || "", true, "AA3300", "Produit prioritaire", E.produitsAEcouler || "—"],
      ["Rupture stock", E.ruptureStock || "Aucune", false, "AA3300", "Dresscode", E.dresscode],
    ]),
    sp(200),
  ];

  ORDER.forEach(four => {
    const lignes = lignesParFour[four];
    if (!lignes.length) return;
    const col = FOURN[four].color;
    const totalF = lignes.reduce((s, l) => s + (l.total || 0), 0);

    children.push(new Table({ width: { size: TW, type: WidthType.DXA }, columnWidths: [TW], rows: [new TableRow({ children: [
      tc(tp(FOURN[four].label, { bold: true, size: 19, color: WHITE }), { bg: col, width: TW }),
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
          tc(tp(l.total ? fmt(l.total) : "—", { size: 16, align: AlignmentType.RIGHT }), { bg: i % 2 === 0 ? WHITE : LGRAY, width: CW[3] }),
          tc(tp(l.note || "", { size: 14, italic: true, color: "777777" }), { bg: i % 2 === 0 ? WHITE : LGRAY, width: CW[4] }),
        ]})),
        new TableRow({ children: [
          tc(tp("Sous-total " + FOURN[four].label.split(" ")[0], { bold: true, size: 17, color: WHITE }), { bg: col, width: CW[0] + CW[1] + CW[2], span: 3 }),
          tc(tp(totalF ? fmt(totalF) : "—", { bold: true, size: 17, color: WHITE, align: AlignmentType.RIGHT }), { bg: col, width: CW[3] }),
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
  children.push(tp("* Estimation calculee a partir des portions et prix de Recettes_Canelya.docx. Les lignes « Variable » sont a chiffrer selon le marche du jour.", { size: 15, italic: true, color: "888888" }));

  return new Document({
    styles: { default: { document: { run: { font: "Arial", size: 19, color: DARK } } } },
    sections: [{ properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 720, right: 720, bottom: 720, left: 720 } } }, children }],
  });
}

// Ajoute un item fixe (condiment/base) sans passer par le compteur d'occurrences
function addItemFixed(items, nom, four, price, note) {
  const key = "__fixed__" + norm(nom);
  if (!items[four][key]) items[four][key] = { nom, occ: 1, four, price, note };
}
