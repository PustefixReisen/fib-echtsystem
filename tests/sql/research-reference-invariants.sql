-- Isolated Postgres 17 tests for migration 20261104143000.
-- CI creates only temporary, fictitious auth users.
insert into auth.users(id) values
 ('11111111-1111-4111-8111-111111111111'),
 ('22222222-2222-4222-8222-222222222222');

insert into fib.research_reference_objects(object_kind,label)
values ('infrastructure','Radschnellweg München–Markt Schwaben'),('place','Feldkirchen');

insert into fib.research_reference_links(subject_id,object_id,relation_kind,evidence_url,rationale,created_by)
select s.id,o.id,'crosses','https://example.org/reference','Verläuft durch den Ort laut geprüftem Beleg.',
 '11111111-1111-4111-8111-111111111111'::uuid
from fib.research_reference_objects s
cross join fib.research_reference_objects o
where s.label='Radschnellweg München–Markt Schwaben' and o.label='Feldkirchen';

do $test$
begin
 if (select count(*) from fib.research_active_reference_context)<>0 then
  raise exception 'Unconfirmed relationship became active';
 end if;
 if (select count(*) from fib.research_reference_links where status='proposed')<>1 then
  raise exception 'Expected one proposal';
 end if;
end $test$;

update fib.research_reference_links
set status='confirmed',revision=revision+1,decided_by='22222222-2222-4222-8222-222222222222',decided_at=now()
where status='proposed';
update fib.research_context_state set active_revision=active_revision+1 where singleton=true;

do $test$
begin
 if (select count(*) from fib.research_active_reference_context)<>1 then
  raise exception 'Confirmed relationship missing from active view';
 end if;
 if (select active_revision from fib.research_context_state where singleton=true)<>1 then
  raise exception 'Active revision did not increment';
 end if;
end $test$;

set role fib_runtime;
select subject_label,relation_kind,object_label from fib.research_active_reference_context;
reset role;

-- Non-runtime roles must not have read access to these private reference tables.
do $test$
begin
 if has_table_privilege('authenticated', 'fib.research_reference_links', 'SELECT')
    or has_table_privilege('anon', 'fib.research_reference_links', 'SELECT')
    or has_table_privilege('service_role', 'fib.research_reference_links', 'SELECT') then
   raise exception 'A generic Supabase role has unintended read privilege';
 end if;
end $test$;

-- Constraints prevent self-reference and weak evidence URLs.
do $test$
declare ref uuid;
begin
 select id into ref from fib.research_reference_objects where label='Feldkirchen';
 begin
   insert into fib.research_reference_links
     (subject_id,object_id,relation_kind,evidence_url,rationale,created_by)
   values (ref,ref,'crosses','http://example.org','invalid link',
     '11111111-1111-4111-8111-111111111111');
   raise exception 'Self-reference or HTTP evidence was accepted';
 exception when check_violation then null;
 end;
end $test$;
