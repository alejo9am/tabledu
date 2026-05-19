> Implementar la gestion completa de categorias en `/categories`: listar, crear, editar y eliminar categorias del usuario autenticado, siguiendo la arquitectura por feature y convenciones de UI/datos del proyecto.

## Steps
- [ ] Crear servicios CRUD de categorias en `@/services/categories.js` (listar por usuario autenticado, crear, actualizar, eliminar) reutilizando `supabase` y manejo de errores consistente.
- [ ] Crear hook de estado y acciones de la ruta en `@/features/categories/routes/CategoriesList/hooks/useCategoriesList.hook.js` para centralizar carga, mutaciones y estados de UI (loading/error/success).
- [ ] Crear `@/features/categories/routes/CategoriesList/components/CategoriesHeader.jsx` con titulo, descripcion y CTA para nueva categoria.
- [ ] Crear `@/features/categories/routes/CategoriesList/components/CategoriesGrid.jsx` para renderizar la lista y estado vacio.
- [ ] Crear `@/features/categories/routes/CategoriesList/components/CategoryCard.jsx` para mostrar datos de categoria, icono seleccionado y acciones de editar/eliminar.
- [ ] Crear `@/features/categories/routes/CategoriesList/components/IconPicker.jsx` para mostrar la libreria de iconos disponible (grid/lista), con busqueda simple y seleccion explicita.
- [ ] Crear `@/features/categories/routes/CategoriesList/components/CategoryFormDialog.jsx` (crear/editar) con validaciones basicas de campos requeridos e integracion con `IconPicker`.
- [ ] Crear `@/features/categories/routes/CategoriesList/components/DeleteCategoryDialog.jsx` para confirmacion explicita de borrado.
- [ ] Integrar la orquestacion final en `@/features/categories/routes/CategoriesList/CategoriesList.route.jsx` conectando hook + componentes y estados de feedback.
- [ ] Exportar/ajustar API de reuso en `@/services/api.js` si la ruta consume categorias desde el barrel central.
- [ ] Run `pnpm build` - no errors

## Scope
**In:** `@/features/categories/routes/CategoriesList/CategoriesList.route.jsx`, `@/features/categories/routes/CategoriesList/components/*`, `@/features/categories/routes/CategoriesList/hooks/*`, `@/services/categories.js`, `@/services/api.js`
**Out:** rutas de juegos/tableros, cambios de esquema SQL o RLS, cambios de navegacion global, modificaciones de `pnpm-lock.yaml`, `components.json`, `vercel.json`

## Decisions
| Question | Decision |
|---|---|
| Que significa "personalizar" categoria? | Se implementa como edicion de los campos de categoria (`name`, `type`, `icon`, `description`). |
| Como se selecciona el icono? | Desde una libreria de iconos visible en UI (lista/grid), con seleccion explicita en el formulario. |
| Que se guarda en `categories.icon`? | El identificador/nombre del icono seleccionado en la libreria. |
| Como se renderiza el icono en listados/tarjetas? | Se resuelve por identificador de icono; si falta o es invalido, fallback a la primera letra de `category.name`. |
| Donde vive la logica de estado de esta ruta? | En hook local de ruta (`@/features/categories/routes/CategoriesList/hooks/*`) para mantener separacion de responsabilidades. |
| Debe quedar alineado con convenciones de arquitectura? | Si: ruta orquestadora `*.route.jsx`, componentes/hook internos por responsabilidad, sin imports relativos profundos. |
