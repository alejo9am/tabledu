> Implementar y cerrar el flujo de creacion de tableros en `/boards/new` con wizard de 4 pasos.

## Steps
- [x] Definir y montar la base del wizard en `/boards/new`: orquestador de pasos, estado central del formulario y navegacion `Back/Next`.
- [x] Implementar UX del paso 1 (`Board info`): captura y validacion de nombre y descripcion del tablero.
- [x] Implementar UX del paso 2 (`Special tiles`): carga de especiales del usuario, edicion de metadatos, toggles, feedback de errores bloqueantes y guardado consistente.
- [x] Implementar UX del paso 3 (`Question tiles`): listado, busqueda, seleccion/deseleccion (1..6), scoring de preguntas y creacion/edicion de tiles con persistencia en DB.
- [x] Implementar UX del paso 4 (`Board layout`): generar/regenerar layout, previsualizacion, reemplazo manual de casillas y confirmacion final del tablero.
- [x] Separar la migracion de dominio y naming: `categories` -> `tiles`, `board_category` -> `board_layouts`, `category_id` -> `tile_id`, con actualizacion de SQL, servicios y frontend.
- [x] Consolidar reglas de puntuacion en `form.scores` y desacoplar score de metadatos de tiles especiales.
- [x] Simplificar el flujo final de guardado con ids reales y sin entidades temporales/locales.
- [x] Agregar proteccion para layout obsoleto tras cambios posteriores (flag stale + confirmacion con `AlertDialog` antes de crear).
- [x] Ajustar calidad de UX final (stepper estable con iconos/visibilidad correcta y layout generation mas variable).
- [x] Run `pnpm build` - no errors

## Scope
**In:** `@/features/boards/routes/BoardCreate/**`, servicios relacionados (`tiles`, `boards`, `boardLayouts`, `questions`), y scripts SQL de soporte para la migracion de modelo.  
**Out:** rediseño global fuera de BoardCreate, mecanicas nuevas de gameplay, cambios en `pnpm-lock.yaml`, `components.json`, `vercel.json`.

## Decisions
| Question | Decision |
|---|---|
| Termino de dominio principal | `tile` (usar `topic` solo como copy contextual para preguntas). |
| Persistencia de question tiles | Se crean/guardan en DB en el paso 3 (no estado local temporal). |
| Scoring del board | Estado central en `form.scores`; no depende de datos embebidos en tiles. |
| Posiciones de layout | Solo `1..29` (`0` start y `30` goal fuera de `board_layouts`). |
| Cambios tras generar layout | Se marca layout como stale y se advierte antes de crear board. |
