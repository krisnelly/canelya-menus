// ── CONNEXION MYSQL CENTRALISÉE ───────────────────────────────────────────────
// Toute modification de la config de connexion se fait UNIQUEMENT ici.
// Les identifiants viennent EXCLUSIVEMENT des variables d'environnement Vercel
// (jamais en dur dans le code, jamais commités sur GitHub).

import mysql from "mysql2/promise";

let pool;

// Réutilise un pool de connexions entre les invocations de fonction serverless
// (évite d'ouvrir une nouvelle connexion à chaque appel, plus rapide et plus sûr)
export function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER,        // canelyac_gen
      password: process.env.DB_PASSWORD, // défini uniquement dans Vercel
      database: process.env.DB_NAME,    // canelyac_gen
      waitForConnections: true,
      connectionLimit: 5,
      queueLimit: 0,
      ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : undefined,
    });
  }
  return pool;
}
