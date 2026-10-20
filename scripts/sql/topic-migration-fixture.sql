-- Minimal FIB test fixture for an isolated disposable PostgreSQL service.
create role fib_runtime nologin;
create schema fib;
create table fib.app_users (user_id uuid primary key);
create table fib.topics (
 id uuid primary key default gen_random_uuid(),
 title text not null,
 status text not null default 'active',
 constraint topics_status_check check(status in ('active','dormant','archived'))
);
insert into fib.topics(title) values ('Unit test theme');
