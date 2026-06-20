-- ═══════════════════════════════════════════════════════════════════════════
-- LA MAISON DE CANELYA — Script de creation de la base de donnees
-- Base : canelyac_gen
-- A executer une seule fois via phpMyAdmin (ou outil equivalent de l'hebergeur)
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS evenements (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  event_id    BIGINT NOT NULL UNIQUE,   -- correspond a entry.id (timestamp JS)
  client_id   VARCHAR(50),               -- ex: "uemoa", "epitech"... pour filtrer rapidement
  data        JSON NOT NULL,             -- l'objet evenement complet (menus, devis, planning...)
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_client_id (client_id),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Verification : la table doit apparaitre vide juste apres creation
SELECT COUNT(*) AS nb_evenements FROM evenements;
