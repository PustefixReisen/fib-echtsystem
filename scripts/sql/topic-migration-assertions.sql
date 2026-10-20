-- Run only against the disposable CI PostgreSQL database.
DO $topic_test$
declare
  t uuid;
  person uuid := 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'::uuid;
  v1 uuid;
  v2 uuid;
  active_count integer;
begin
 insert into fib.app_users(user_id) values(person);
 select id into t from fib.topics limit 1;
 if not exists(select 1 from fib.topics where id=t and status='active') then
  raise exception 'existing status was unexpectedly changed';
 end if;
 insert into fib.topic_contribution_drafts(topic_id,body,updated_by)
 values(t,'Working topic text',person);
 insert into fib.topic_contribution_versions(topic_id,version_no,body,approved_by)
 values(t,1,'Approved text',person) returning id into v1;
 begin
  update fib.topic_contribution_versions set body='Tampered text' where id=v1;
  raise exception 'immutability test failed';
 exception when others then
  if sqlerrm='immutability test failed' then raise; end if;
 end;
 insert into fib.topic_publications(topic_id,contribution_version_id,published_by)
 values(t,v1,person);
 begin
  update fib.topic_contribution_versions set revoked_by=person,revoked_at=now()
  where id=v1;
  raise exception 'published approval revocation test failed';
 exception when others then
  if sqlerrm='published approval revocation test failed' then raise; end if;
 end;
 insert into fib.topic_contribution_versions(topic_id,version_no,body,approved_by)
 values(t,2,'Second approved text',person) returning id into v2;
 update fib.topic_contribution_versions set revoked_by=person,revoked_at=now()
 where id=v2;
 begin
  insert into fib.topic_publications(topic_id,contribution_version_id,published_by)
  values(t,v2,person);
  raise exception 'revoked approval publication test failed';
 exception when others then
  if sqlerrm='revoked approval publication test failed' then raise; end if;
 end;
 select count(*) into active_count from fib.topic_publications where topic_id=t and ended_at is null;
 if active_count<>1 then raise exception 'unexpected active publication count %',active_count; end if;
end
$topic_test$;

-- Runtime RLS denies implicit public roles access; migration grants the internal role.
select current_setting('server_version_num')::int >= 150000 as modern_postgres;
