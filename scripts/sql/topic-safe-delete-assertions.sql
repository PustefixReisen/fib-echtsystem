-- Isolated test: logically removing an unpublished topic retains related entities.
do $topic_delete_test$
declare
  who uuid := 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb'::uuid;
  theme uuid;
begin
 insert into fib.app_users(user_id) values(who);
 insert into fib.topics(title,status) values('Unpublished development theme','draft')
 returning id into theme;
 update fib.topics set deleted_at=now(),deleted_by=who where id=theme;
 if not exists (select 1 from fib.topics where id=theme and deleted_at is not null and deleted_by=who) then
   raise exception 'audit soft-delete missing';
 end if;
 begin
   update fib.topics set deleted_by=null where id=theme;
   raise exception 'deletion audit consistency failed';
 exception when others then
   if sqlerrm='deletion audit consistency failed' then raise; end if;
 end;
end
$topic_delete_test$;
