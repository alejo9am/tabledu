-- 1. Asegurar la extensión para UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Crear el tipo para las casillas del tablero
-- 'question' para contenido educativo y 'special' para mecánicas de juego
CREATE TYPE category_type AS ENUM ('question', 'special');

-- 3. Crear el tipo para el estado de la partida
-- Controla el flujo desde que el profesor crea el PIN hasta que finaliza
CREATE TYPE game_status AS ENUM ('lobby', 'playing', 'finished');