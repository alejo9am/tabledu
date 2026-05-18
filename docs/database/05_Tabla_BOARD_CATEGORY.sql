-- Tabla intermedia para definir el mapa de casillas de cada tablero
CREATE TABLE IF NOT EXISTS public.board_category (
  board_id uuid NOT NULL REFERENCES public.boards(id) ON DELETE CASCADE,
  category_id uuid NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
  
  -- Posición de la casilla en el tablero (ej: 1, 2, 3...)
  position integer NOT NULL,

  -- PK Compuesta: Un tablero no puede tener dos categorías en la misma casilla
  PRIMARY KEY (board_id, position),
  
  -- Restricción: Tablero fijo de 30 casillas
  CONSTRAINT valid_square_position CHECK (position > 0 AND position <= 30)
);

-- Nota: No incluimos timestamps aquí porque es una tabla de unión pura,
-- la trazabilidad se lleva en las tablas maestras (boards y categories).