> Implementar el flujo completo de creacion de tableros en `/boards/new` con wizard de 3 pasos: detalles + categorias especiales, categorias de pregunta, y generacion/confirmacion de layout, soportando usuarios nuevos sin categorias previas.

## Steps
- [ ] Reemplazar el stub en `@/features/boards/routes/BoardCreate/BoardCreate.route.jsx` por un orquestador de 3 pasos con navegacion `Back/Next` y `BoardCreateStepper`.
- [ ] Crear `@/features/boards/routes/BoardCreate/hooks/useBoardCreateForm.hook.js` para centralizar estado del wizard (name, description, specials, scoring, questionCategories, generatedLayout) sin llamadas de escritura a API.
- [ ] Crear `@/features/boards/routes/BoardCreate/pages/BoardCreateDetails.page.jsx` (paso 1) con campos de tablero y cards de especiales editables (`attack`, `pipe`, `challenge`), con toggle enable/disable y validacion de nombre requerido.
- [ ] En paso 1, cargar `fetchUserCategories(userId)` y prehidratar especiales por tipo; si faltan, usar defaults hardcodeados (`Attack`, `Pipe`, `Challenge`) con iconos `system/*`.
- [ ] Crear `@/features/boards/routes/BoardCreate/components/SpecialCategoryCard.jsx` con icono via `getCategoryIconPublicUrl`, fallback visual, descripcion editable y campos de scoring segun tipo (`attack` y `challenge`).
- [ ] Crear `@/features/boards/routes/BoardCreate/pages/BoardCreateQuestionCategories.page.jsx` (paso 2) con:
  - seleccion/deseleccion de categorias `question` existentes,
  - busqueda local por nombre,
  - `+ New` inline para crear categorias de pregunta locales (sin persistir aun),
  - widget de scoring `scoreCorrect`/`scoreIncorrect`.
- [ ] En paso 2, cargar `fetchUserCategories(userId)` y filtrar `type === 'question'`; validar minimo 1 categoria seleccionada/creada para avanzar.
- [ ] Crear `@/features/boards/routes/BoardCreate/components/QuestionCategoryCard.jsx` y `BoardCreateStepper.jsx` siguiendo estilo de `DESIGN.md` y componentes UI existentes.
- [ ] Crear `@/features/boards/routes/BoardCreate/pages/BoardCreateLayout.page.jsx` (paso 3) con estado ghost inicial, accion `Generate/Regenerate`, preview read-only y `Confirm & Create Board` solo cuando exista layout.
- [ ] Crear `@/features/boards/routes/BoardCreate/components/BoardLayoutPreview.jsx` reutilizando el rendering tipo serpiente existente (o adaptacion minima compatible con `CategoryTile`).
- [ ] Implementar utilidad pura de layout (en `@/features/boards/routes/BoardCreate/`) para generar exactamente 29 tiles (`1..29`), excluyendo `0` y `30`, con reglas:
  - especiales solo si `enabled`,
  - nunca dos especiales consecutivas,
  - distribucion de especiales no sesgada,
  - si no hay especiales, reparto ciclico-aleatorio de question categories.
- [ ] Extender servicios:
  - `@/services/categories.js`: `fetchUserCategories`, `createCategory`, `upsertCategory`
  - `@/services/boards.js`: `createBoard`
  - `@/services/boardCategory.js`: `createBoardLayout`
  siguiendo patron de supabase + `throwIfSupabaseError`.
- [ ] Implementar secuencia de guardado al confirmar (paso 3):
  1) upsert especiales activas,
  2) upsert question categories nuevas,
  3) create board,
  4) resolver `categoryRef -> real category_id`,
  5) create board layout,
  6) `goTo('/boards/:boardId')`,
  con loading state bloqueante y toast de error.
- [ ] Verificar compatibilidad de layout con gameplay (`@/features/games/routes/GamePlay/components/BoardTile.jsx` y consumo de categorias/layout).
- [ ] Run `pnpm build` - no errors

## Scope
**In:** `@/features/boards/routes/BoardCreate/**`, `@/services/categories.js`, `@/services/boards.js`, `@/services/boardCategory.js`, compatibilidad de render en `@/features/games/routes/GamePlay/components/BoardTile.jsx`  
**Out:** cambios SQL/RLS, UI de creacion de preguntas, rediseño global de `/categories`, mecanicas de juego, cambios en `pnpm-lock.yaml`, `components.json`, `vercel.json`

## Decisions
| Question | Decision |
|---|---|
| Usuario nuevo sin categorias previas | Se soporta con defaults para especiales y alta inline de question categories en paso 2. |
| Cuando se persisten cambios | Solo en confirmacion del paso 3 (excepto lecturas iniciales en pasos 1/2). |
| Posiciones del tablero | Solo `1..29`; `0` (start) y `30` (goal) fuera de `board_category`. |
| Tipos de categoria especiales | `attack`, `pipe`, `challenge` (enum actual). |
| Edicion manual tile por tile | No incluida; solo `Generate/Regenerate` y volver a pasos previos. |
| Compatibilidad gameplay sin preguntas cargadas | Se permite crear tablero; el manejo UX de "sin preguntas" queda para tarea futura. |
