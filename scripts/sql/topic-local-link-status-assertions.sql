-- Four editorial states and coherent review metadata; disposable CI database only.
do $local_link_test$
declare
  t uuid;
  p uuid;
  reviewer uuid := 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb'::uuid;
  proposal uuid;
begin
  insert into fib.app_users(user_id) values (reviewer);
  select id into t from fib.topics limit 1;
  select id into p from fib.processes limit 1;
  insert into fib.process_topic_proposals
    (topic_id, process_id, suggested_significance, suggested_rationale, origin)
  values (t,p,'relevant','Initial candidate','editor') returning id into proposal;
  update fib.process_topic_proposals set status='deferred', reviewed_by=reviewer, reviewed_at=now() where id=proposal;
  if (select status from fib.process_topic_proposals where id=proposal) <> 'deferred' then
    raise exception 'deferred status missing';
  end if;
  begin
    update fib.process_topic_proposals set status='confirmed' where id=proposal;
    raise exception 'invalid confirmation was accepted';
  exception when check_violation then null;
  end;
  update fib.process_topic_proposals set status='rejected' where id=proposal;
  update fib.process_topic_proposals set status='pending', reviewed_by=null, reviewed_at=null where id=proposal;
  update fib.process_topic_proposals
    set status='confirmed', reviewed_by=reviewer, reviewed_at=now(),
        confirmed_significance='defining', confirmed_rationale='Editorially verified'
    where id=proposal;
  begin
    update fib.process_topic_proposals set status='deferred' where id=proposal;
    raise exception 'stale confirmed metadata was accepted for deferred state';
  exception when check_violation then null;
  end;
  update fib.process_topic_proposals set status='deferred', confirmed_significance=null, confirmed_rationale=null where id=proposal;
  if (select status from fib.process_topic_proposals where id=proposal) <> 'deferred' then
    raise exception 'confirmed to deferred transition failed';
  end if;
end
$local_link_test$;
