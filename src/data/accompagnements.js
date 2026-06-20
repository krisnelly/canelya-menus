// ── DONNÉES — ACCOMPAGNEMENTS & RÈGLES DE COMPATIBILITÉ ───────────────────────
// Toute modification de règle d'association accompagnement <-> protéine
// se fait UNIQUEMENT ici. Ne touche à aucune autre partie de l'app.

export const ACCOMP = {
  local: [
    "Riz garni", "Telibo", "Pate blanche", "Wokoli", "Agbeli", "Amiwo", "Bomiwo",
    "Pyron", "Akassa", "Attieke", "Ablo", "Come", "Alloco", "Foutou banane",
    "Igname pilee", "Frites igname", "Frites manioc", "Frites patate douce",
  ],
  international: [
    "Riz garni", "Pommes sautees", "Frites pommes de terre", "Frites patate douce",
    "Frites igname", "Frites manioc", "Semoule",
  ],
  mixte: [
    "Riz garni", "Attieke", "Alloco", "Ablo", "Foutou banane", "Igname pilee",
    "Wokoli", "Agbeli", "Pommes sautees", "Frites pommes de terre",
    "Frites patate douce", "Frites igname", "Telibo", "Akassa",
  ],
};

// Sauces locales compatibles avec Télibo, Pâte blanche, Wokoli, Agbeli
export const SAUCES_MAN_ET_AUTRES = [
  "sauce man tindjan", "sauce man gnignan", "sauce graine", "sauce arachide",
  "sauce gombo", "sauce crincrin", "sauce asrokuin", "thiebboudienne", "djongoli",
];

// Sauces/protéines compatibles avec Akassa (+ poisson frit)
export const SAUCES_AKASSA = [
  "sauce man tindjan", "sauce man gnignan", "sauce moyo", "poisson frit",
  "ablo", "djongoli", "tilapia", "capitaine",
];

// Sauces compatibles avec Foutou banane et Igname pilée
export const SAUCES_GRAINE = ["sauce graine", "sauce arachide"];

// Protéines compatibles avec Amiwo et Bomiwo
export const POULET_BRAISE = ["poulet grille", "poulet braise"];

// Table de règles : pour chaque accompagnement, soit un marqueur de règle
// spéciale (__xxx__), soit une liste de mots-clés à matcher dans le nom
// de la protéine.
export const ACCOMP_COMPAT = {
  "Telibo":               ["__sauce_man__"],
  "Pate blanche":         ["__sauce_man__"],
  "Wokoli":                ["__sauce_man__"],
  "Agbeli":                ["__sauce_man__"],
  "Akassa":                ["__akassa__"],
  "Amiwo":                 ["__poulet_braise__"],
  "Bomiwo":                ["__poulet_braise__"],
  "Pyron":                 ["dakouin"],
  "Attieke":               ["poisson grille", "choukouya", "brochette de poisson"],
  "Ablo":                  ["poisson grille", "brochette de poisson", "tilapia", "capitaine", "djongoli"],
  "Come":                  ["poisson", "fretin", "djongoli"],
  "Foutou banane":         ["__sauce_graine__"],
  "Igname pilee":          ["__sauce_graine__"],
  "Riz garni":             ["__tout_sauf_gombo_moyo__"],
  "Alloco":                ["__tout_sauf_sauce_locale__"],
  "Frites igname":         ["__neutre__"],
  "Frites manioc":         ["__neutre__"],
  "Frites patate douce":   ["__neutre__"],
  "Frites pommes de terre":["__neutre__"],
  "Pommes sautees":        ["__neutre__"],
  "Semoule":               ["couscous poulet merguez", "poulet", "boeuf"],
};
