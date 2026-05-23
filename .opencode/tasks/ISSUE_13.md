> Crear la pagina `/tiles/special` para edicion de Special Tiles fijos de plataforma.

## Steps
- [ ] Definir estructura de la vista: encabezado educativo + mensaje explicito de set fijo (sin crear/eliminar).
- [ ] Cargar los 3 special tiles del usuario (`penalty`, `reroll`, `duel`) y mostrarlos en cards con icono, nombre y mecanica.
- [ ] Implementar edicion por tile de `icon`, `name` y `description`, con guardado y feedback de exito/error.
- [ ] Reforzar el objetivo UX: dejar claro que el efecto existe en juego y que el scoring se configura despues por tablero.
- [ ] Validar estados de carga/error y ejecutar `pnpm build` sin errores.

## Scope
**In:** `@/features/tiles/routes/SpecialTiles/**`, servicios de tiles usados por esta ruta y copy UX de contexto.  
**Out:** configuracion de scoring por tile (wizard de board), creacion/eliminacion de tipos especiales, Question Tiles (#14).

## Decisions
| Question | Decision |
|---|---|
| Naturaleza del catalogo | Fijo por plataforma (3 tiles iniciales), editable solo en metadatos. |
| Campos editables en esta pagina | Solo `icon`, `name`, `description`. |
| Donde se configura puntaje | En el flujo de creacion/configuracion del board, no aqui. |
