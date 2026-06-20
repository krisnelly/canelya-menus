// ── DONNÉES — ENTRÉES, DESSERTS, PAUSES CAFÉ, COCKTAILS ───────────────────────
// Toute modification de listes de menus se fait UNIQUEMENT ici.

export const ENTREES = [
  "Salade Canelia", "Cocktail avocat-crevettes", "Salade composee",
  "Macedoine au poulet", "Macedoine boulette de viande", "Coleslaw",
  "Salade de chou", "Salade de papaye",
];

export const DESSERTS = [
  "Degue", "Akpan", "Lait caille", "Riz au lait", "Fondant chocolat",
  "Brownie fonio", "Tartelette fruits", "Cake varie", "Cake renverse ananas",
  "Panna cotta", "Flan",
];

// Sucrés à base de farine de blé (matin)
export const MATIN_SUCRES_BLE = [
  "Mini croissants", "Mini pains chocolat", "Mini viennoiseries",
  "Crepe sucree", "Crepe Nutella", "Pancake sirop erable",
];
// Sucrés alternatifs — équilibre des farines (matin)
export const MATIN_SUCRES_ALT = [
  "Brownie fonio", "Cake farine manioc", "Pancake fonio",
  "Beignet fonio", "Mini cake fonio",
];
export const MATIN_SUCRES = [...MATIN_SUCRES_BLE, ...MATIN_SUCRES_ALT];

export const MATIN_SALES = [
  "Mini friand poisson", "Mini friand boeuf", "Mini quiche", "Mini pizza jambon",
  "Mini pizza boeuf", "Pastel poisson", "Pastel boeuf", "Crepe roulee jambon-fromage",
  "Mini burger viande hachee", "Cornet de tacos a la viande",
];

export const MATIN_FRUITS = ["Fruits frais saison", "Salade de fruits", "Brochette de fruits"];

export const MATIN_BOUILLIES = ["Bouillie de mil", "Aklui (bouillie mais)", "Bouillie Bita", "Bouillie souchet"];

export const MATIN_CHAUDS = "The + Lait + Cafe"; // toujours fixe

export const MATIN_BOISSONS = ["Jus orange", "Jus ananas", "Cocktail de fruits", "Bissap", "Sodas"];

// Sucrés à base de farine de blé (après-midi)
export const APM_SUCRES_BLE = ["Crepe sucree", "Crepe Nutella"];
export const APM_SUCRES_ALT = ["Doko", "Taletale", "Brownie fonio", "Cake farine manioc", "Mini cake fonio", "Beignet fonio"];
export const APM_SUCRES = [...APM_SUCRES_BLE, ...APM_SUCRES_ALT];

export const APM_SALES = [
  "Ata (beignet haricot)", "Burger ata", "Crepe roulee jambon-fromage",
  "Brochettes wagashi", "Beignets wagashi", "Wagashi crispy", "Verrines wagashi",
  "Ablo fretins", "Mini burger viande hachee", "Frites de patates douces",
  "Frites d'igname", "Brochettes d'alloco", "Crevettes roulees a la banane",
  "Tcheke roulee au concombre", "Crispy de poulet", "Boulette patate douce au poisson",
  "Boulette de banane", "Mini brochettes de gesier", "Verrine APF",
  "Verrine choukouya boeuf", "Cornet de tacos a la viande",
];

export const APM_BOISSONS = [
  "Jus orange", "Jus ananas", "Cocktail fruits", "Bissap", "Adoyo",
  "Tchakpalo", "Sodas", "The hibiscus", "The vert",
];

export const DEJ_BOISSONS = ["Eau minerale", "Jus orange", "Jus ananas", "Bissap", "Gingembre frais", "Citronnade"];

export const COCKTAIL_SALES = [
  "Mini bruschetta", "Verrines cocktail", "Brochettes wagashi", "Mini quiche",
  "Pastel poisson", "Mini friand boeuf", "Ata croustillant", "Mini pizza",
  "Bouchees feuilletees", "Rouleaux de printemps",
];

export const COCKTAIL_SUCRES = ["Mini eclair", "Mini tarte fruits", "Brownie fonio", "Verrine dessert", "Mini macaron"];

export const COCKTAIL_BOISSONS_SOFT = ["Jus orange", "Jus ananas", "Bissap", "Cocktail de fruits", "Eau minerale"];

export const COCKTAIL_BOISSONS_ALC = ["Vin rouge", "Vin blanc", "Prosecco", "Biere", "Cocktail alcoolise"];
