-- FIB topic DB integration checks; ONLY against a disposable, isolated test database.
-- Requires migrated fib schema, fixture app_user and psql variable actor_id.
\set ON_ERROR_STOP on
BEGIN;
SELECT set_config('fib.test_actor_id', :'actor_id', true);
DO $test$
DECLARE
 actor uuid := current_setting('fib.test_actor_id')::uuid;
 tid uuid; approved uuid; revoked uuid; blocked boolean;
BEGIN
 INSERT INTO fib.topics(title,guiding_question,status)
 VALUES('[ROLLBACK INTEGRATION TEST] Thema','Welche Schutzregeln gelten?','draft')
 RETURNING id INTO tid;
 INSERT INTO fib.topic_contribution_versions(topic_id,version_no,body,approved_by)
 VALUES(tid,1,'Freigegebener Inhalt',actor) RETURNING id INTO approved;
 INSERT INTO fib.topic_contribution_versions(topic_id,version_no,body,approved_by,revoked_by,revoked_at)
 VALUES(tid,2,'Widerrufener Inhalt',actor,actor,now()) RETURNING id INTO revoked;

 blocked:=false;
 BEGIN
  INSERT INTO fib.topic_publications(topic_id,contribution_version_id,published_by)
  VALUES(tid,revoked,actor);
 EXCEPTION WHEN OTHERS THEN blocked:=true; END;
 IF NOT blocked THEN RAISE EXCEPTION 'FAIL: revoked approval published'; END IF;

 INSERT INTO fib.topic_publications(topic_id,contribution_version_id,published_by)
 VALUES(tid,approved,actor);

 blocked:=false;
 BEGIN UPDATE fib.topic_contribution_versions SET body='tampered' WHERE id=approved;
 EXCEPTION WHEN OTHERS THEN blocked:=true; END;
 IF NOT blocked THEN RAISE EXCEPTION 'FAIL: approved text modified'; END IF;

 blocked:=false;
 BEGIN UPDATE fib.topic_contribution_versions SET revoked_by=actor,revoked_at=now() WHERE id=approved;
 EXCEPTION WHEN OTHERS THEN blocked:=true; END;
 IF NOT blocked THEN RAISE EXCEPTION 'FAIL: published approval revoked'; END IF;

 blocked:=false;
 BEGIN
  INSERT INTO fib.topic_publications(topic_id,contribution_version_id,published_by)
  VALUES(tid,approved,actor);
 EXCEPTION WHEN unique_violation THEN blocked:=true; END;
 IF NOT blocked THEN RAISE EXCEPTION 'FAIL: duplicate current publication'; END IF;

 RAISE NOTICE 'PASS: four publication invariants';
END
$test$;
ROLLBACK;
