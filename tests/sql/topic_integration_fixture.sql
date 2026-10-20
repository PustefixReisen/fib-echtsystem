-- Minimal fixture for executing the real FIB topic migration in disposable CI PostgreSQL.
CREATE SCHEMA fib;
CREATE ROLE fib_runtime NOLOGIN;
CREATE TABLE fib.app_users(user_id uuid PRIMARY KEY, active boolean NOT NULL DEFAULT true);
CREATE TABLE fib.topics(
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 title text NOT NULL,
 guiding_question text NOT NULL,
 status text NOT NULL DEFAULT 'active',
 CONSTRAINT topics_status_check CHECK (status IN ('active','dormant','archived'))
);
INSERT INTO fib.app_users(user_id) VALUES ('11111111-1111-4111-8111-111111111111');
