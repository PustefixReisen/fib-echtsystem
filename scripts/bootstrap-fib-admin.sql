-- FIB – initialen Admin bewusst freischalten
--
-- Dieses Skript ist KEINE reguläre Benutzerverwaltung.
-- Es dient ausschließlich zum einmaligen Bootstrap des ersten FIB-Admins.
-- Vor Ausführung EMAIL ersetzen und Ergebnis prüfen.
-- Keine Passwörter oder Secrets eintragen.

begin;

-- 1. Zielbenutzer eindeutig ermitteln.
-- Erwartung: genau eine Zeile.
select id, email
from auth.users
where lower(email) = lower('EMAIL_HIER_EINTRAGEN');

-- 2. FIB-Mitgliedschaft anlegen bzw. bewusst reaktivieren.
insert into fib.app_users (user_id, role, active)
select id, 'admin', true
from auth.users
where lower(email) = lower('EMAIL_HIER_EINTRAGEN')
on conflict (user_id) do update
set role = excluded.role,
    active = excluded.active,
    updated_at = now();

-- 3. Ergebnis kontrollieren.
select u.email, a.user_id, a.role, a.active, a.updated_at
from fib.app_users a
join auth.users u on u.id = a.user_id
where lower(u.email) = lower('EMAIL_HIER_EINTRAGEN');

-- Vor der echten Erstfreigabe zunächst mit ROLLBACK testen.
rollback;

-- Für die bewusste produktive Freigabe nach Kontrolle:
-- 1. EMAIL ersetzen
-- 2. rollback; am Ende durch commit; ersetzen
-- 3. Skript einmalig ausführen
