-- Run only on ephemeral CI PostgreSQL.
do $event_test$
declare
 theme uuid;
 ev uuid;
 actor uuid := 'cccccccc-cccc-4ccc-8ccc-cccccccccccc'::uuid;
 proposal uuid;
begin
 insert into fib.app_users(user_id) values(actor);
 select id into theme from fib.topics where deleted_at is null limit 1;
 insert into fib.events(title) values('Test event') returning id into ev;
 insert into fib.event_topic_proposals
   (topic_id,event_id,suggested_significance,suggested_rationale,origin)
 values(theme,ev,'relevant','Direct supplementary link','editor') returning id into proposal;
 begin
  insert into fib.event_topic_proposals
    (topic_id,event_id,suggested_significance,suggested_rationale,origin)
  values(theme,ev,'relevant','Duplicate pending candidate','editor');
  raise exception 'duplicate pending candidate accepted';
 exception when others then
  if sqlerrm='duplicate pending candidate accepted' then raise; end if;
 end;
 update fib.event_topic_proposals set status='rejected',reviewed_by=actor,
  reviewed_at=now(),rejection_reason='already_covered' where id=proposal;
 insert into fib.event_topic_proposals
   (topic_id,event_id,suggested_significance,suggested_rationale,origin)
 values(theme,ev,'relevant','New facts allow renewed proposal','editor');
 begin
  update fib.event_topic_proposals set status='rejected',reviewed_by=actor,
   reviewed_at=now(),rejection_reason='other',rejection_detail=null
  where topic_id=theme and event_id=ev and status='pending';
  raise exception 'missing other-reason detail accepted';
 exception when others then
  if sqlerrm='missing other-reason detail accepted' then raise; end if;
 end;
end
$event_test$;
