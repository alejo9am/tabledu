-- ============================================================
-- Tabla: public_boards (Biblioteca pública de tableros)
-- ============================================================
-- Almacena snapshots completos e independientes de tableros
-- listos para importar. No depende de ninguna entidad viva
-- del usuario autor: es una foto fija en el momento de publicar.
--
-- Un usuario importa un tablero desde esta biblioteca y el
-- sistema crea copias propias en sus tablas (boards, categories,
-- questions, board_category) sin modificar el snapshot original.
--
-- Ejecutar DESPUÉS de: 15_Simplify_provisioning_trigger.sql
-- ============================================================


-- ------------------------------------------------------------
-- PASO 1: Crear la tabla
-- ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.public_boards (
  id          uuid        PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        varchar(100) NOT NULL,
  description text,

  -- Autor del tablero. Si el usuario borra su cuenta,
  -- sus tableros publicados desaparecen de la biblioteca.
  author_id   uuid        REFERENCES public.users(id) ON DELETE CASCADE,

  -- Snapshot del tablero: configuración, categorías y layout.
  -- Siempre presente. Estructura:
  -- {
  --   "board":      { name, description, score_correct, score_incorrect,
  --                   score_attack, score_challenge_winner,
  --                   score_challenge_loser, score_challenge_draw_defender,
  --                   score_challenge_draw_attacker },
  --   "categories": [ { ref, name, type, icon, description } ],
  --   "layout":     [ { position, category_ref } ]
  -- }
  board_data  jsonb       NOT NULL,

  -- Snapshot de preguntas. Nullable: el autor decide si compartirlas.
  -- Estructura:
  -- [ { category_ref, text, answer, justification } ]
  --
  -- Si es NULL, el usuario importa el tablero con las categorías
  -- vacías y añade sus propias preguntas.
  questions_data jsonb    DEFAULT NULL,

  created_at  timestamptz NOT NULL DEFAULT now()
);


-- ------------------------------------------------------------
-- PASO 2: Activar RLS
-- ------------------------------------------------------------

ALTER TABLE public.public_boards ENABLE ROW LEVEL SECURITY;

-- Cualquier usuario autenticado puede leer todos los tableros públicos.
CREATE POLICY "Cualquier usuario puede leer la biblioteca"
ON public.public_boards
FOR SELECT
USING (auth.role() = 'authenticated');

-- Solo el autor puede insertar, actualizar o eliminar sus tableros.
CREATE POLICY "El autor gestiona sus tableros publicados"
ON public.public_boards
FOR ALL
USING (auth.uid() = author_id);


-- ------------------------------------------------------------
-- PASO 3: Seed — Tablero Cyberpatrol (tablero oficial Tabledu)
-- ------------------------------------------------------------
-- Insertar con el UUID del usuario de la cuenta oficial Tabledu.
-- Reemplaza <TABLEDU_USER_ID> por el UUID real antes de ejecutar.
--
-- Este tablero es el equivalente al que antes se clonaba
-- automáticamente desde templates.* al registrar un usuario.

INSERT INTO public.public_boards (name, description, author_id, board_data, questions_data)
VALUES (
  'Cyberpatrol',
  'Board game based on the game of the goose for teaching security analysis in higher education.',
  '<TABLEDU_USER_ID>',

  -- board_data: configuración completa + categorías + layout
  '{
    "board": {
      "name": "Cyberpatrol",
      "description": "Board game based on the game of the goose for teaching security analysis in higher education.",
      "score_correct": 3,
      "score_incorrect": -1,
      "score_attack": -5,
      "score_challenge_winner": 5,
      "score_challenge_loser": -3,
      "score_challenge_draw_defender": 1,
      "score_challenge_draw_attacker": -1
    },
    "categories": [
      { "ref": "cat_concepts",   "name": "Concepts",   "type": "question", "icon": "system/lightbulb.png", "description": "True or false? Answer a question on core cybersecurity concepts." },
      { "ref": "cat_encryption", "name": "Encryption", "type": "question", "icon": "system/padlock.png",   "description": "True or false? Answer a question on encryption and data security." },
      { "ref": "cat_protection", "name": "Protection", "type": "question", "icon": "system/shield.png",    "description": "True or false? Answer a question on cybersecurity protection measures." },
      { "ref": "cat_history",    "name": "History",    "type": "question", "icon": "system/hourglass.png", "description": "True or false? Answer a question on the history of cybersecurity." },
      { "ref": "cat_attack",     "name": "Attack",     "type": "attack",   "icon": "system/hacker.png",    "description": "Cyber attack! Your team loses 5 points. Tighten your defenses." },
      { "ref": "cat_pipe",       "name": "Pipe",       "type": "pipe",     "icon": "system/pipe.png",      "description": "Lucky break! Roll the dice again for another shot at advancing." },
      { "ref": "cat_challenge",  "name": "Challenge",  "type": "challenge","icon": "system/swords.png",    "description": "Duel time. Call out a rival and fight for points answering two questions." }
    ],
    "layout": [
      { "position": 1,  "category_ref": "cat_concepts" },
      { "position": 2,  "category_ref": "cat_encryption" },
      { "position": 3,  "category_ref": "cat_attack" },
      { "position": 4,  "category_ref": "cat_protection" },
      { "position": 5,  "category_ref": "cat_pipe" },
      { "position": 6,  "category_ref": "cat_history" },
      { "position": 7,  "category_ref": "cat_concepts" },
      { "position": 8,  "category_ref": "cat_challenge" },
      { "position": 9,  "category_ref": "cat_encryption" },
      { "position": 10, "category_ref": "cat_protection" },
      { "position": 11, "category_ref": "cat_attack" },
      { "position": 12, "category_ref": "cat_history" },
      { "position": 13, "category_ref": "cat_concepts" },
      { "position": 14, "category_ref": "cat_pipe" },
      { "position": 15, "category_ref": "cat_encryption" },
      { "position": 16, "category_ref": "cat_protection" },
      { "position": 17, "category_ref": "cat_challenge" },
      { "position": 18, "category_ref": "cat_history" },
      { "position": 19, "category_ref": "cat_concepts" },
      { "position": 20, "category_ref": "cat_attack" },
      { "position": 21, "category_ref": "cat_encryption" },
      { "position": 22, "category_ref": "cat_pipe" },
      { "position": 23, "category_ref": "cat_protection" },
      { "position": 24, "category_ref": "cat_history" },
      { "position": 25, "category_ref": "cat_concepts" },
      { "position": 26, "category_ref": "cat_challenge" },
      { "position": 27, "category_ref": "cat_encryption" },
      { "position": 28, "category_ref": "cat_attack" },
      { "position": 29, "category_ref": "cat_protection" },
      { "position": 30, "category_ref": "cat_history" }
    ]
  }',

  -- questions_data: preguntas completas por categoría
  -- Rellena aquí las preguntas reales de Cyberpatrol.
  -- Formato: [ { category_ref, text, answer, justification } ]
  NULL
);