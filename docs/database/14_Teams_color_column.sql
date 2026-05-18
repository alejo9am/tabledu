-- Add required color field to teams.
-- Stores hex values like #A855F7 (7 chars including '#').

alter table public.teams
add column color varchar(7);

alter table public.teams
alter column color set not null;

alter table public.teams
add constraint teams_color_hex_format
check (color ~ '^#[0-9A-Fa-f]{6}$');
