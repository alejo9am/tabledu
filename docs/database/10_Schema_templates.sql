-- 1. Crear el esquema aislado (en plural)
CREATE SCHEMA IF NOT EXISTS templates;

-- 2. Tabla de Tableros (Plantilla)
CREATE TABLE IF NOT EXISTS templates.boards (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name varchar(100) NOT NULL UNIQUE,
  description text,
  score_correct integer NOT NULL DEFAULT 3,
  score_incorrect integer NOT NULL DEFAULT -1,
  score_attack integer NOT NULL DEFAULT -5,
  score_challenge_winner integer NOT NULL DEFAULT 5,
  score_challenge_loser integer NOT NULL DEFAULT -3,
  score_challenge_draw_defender integer NOT NULL DEFAULT 1,
  score_challenge_draw_attacker integer NOT NULL DEFAULT -1
);

-- 3. Tabla de Categorías (Plantilla)
CREATE TABLE IF NOT EXISTS templates.categories (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name varchar(50) NOT NULL UNIQUE,
  type category_type NOT NULL DEFAULT 'question',
  icon varchar(100) NOT NULL,
  description text
);

-- 4. Tabla de Preguntas (Plantilla)
CREATE TABLE IF NOT EXISTS templates.questions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  text text NOT NULL,
  answer boolean NOT NULL,
  -- Mantenemos la protección de integridad igual que en public
  category_id uuid NOT NULL REFERENCES templates.categories(id) ON DELETE RESTRICT 
);

-- 5. Tabla de Layout (Plantilla)
CREATE TABLE IF NOT EXISTS templates.board_category (
  board_id uuid NOT NULL REFERENCES templates.boards(id) ON DELETE CASCADE,
  -- Mantenemos la protección de integridad igual que en public
  category_id uuid NOT NULL REFERENCES templates.categories(id) ON DELETE RESTRICT, 
  position integer NOT NULL CHECK (position > 0 AND position <= 30),
  PRIMARY KEY (board_id, position)
);