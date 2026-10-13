import { test } from 'node:test';
import assert from 'node:assert/strict';
import { AUTH, REDIRECT, OperatorError, validateEmail, inviteNewTestAccount, obtainAdminKey, checkAdminAccess } from './preview-invite.mjs';
const email = 'fib-new@example.test';
const caseId = '11111111-2222-4333-8444-555555555555';
const user = { id:'new-user', email, app_metadata:{fib_pr74_test_case:caseId} };
const json = (body, status=200) => new Response(JSON.stringify(body), {status});

test('invalid recipient is rejected before any network operation', async()=>{
  for(const value of ['', ' user@example.test', 'a\nb@example.test', 'a@example.test,b@example.test']) {
    assert.throws(()=>validateEmail(value), OperatorError);
    await assert.rejects(inviteNewTestAccount({email:value,apiKey:'test',caseId,fetcher:()=>assert.fail('network')}));
  }
});
test('new account has no initial password, no confirmation and no role; fixed redirect', async()=>{
  const calls=[];
  const result=await inviteNewTestAccount({email,apiKey:'test',caseId,fetcher:async(url,options)=>{
    calls.push({url,options}); return json(calls.length===1?user:{...user,invited_at:'2026-10-13T11:00:00Z'});
  }});
  assert.equal(calls.length,2);
  assert.equal(calls[0].url,AUTH+'/admin/users');
  assert.deepEqual(JSON.parse(calls[0].options.body),{email,email_confirm:false,app_metadata:{fib_pr74_test_case:caseId}});
  assert.equal(calls[1].url,AUTH+'/invite?redirect_to='+encodeURIComponent(REDIRECT));
  assert.deepEqual(JSON.parse(calls[1].options.body),{email});
  assert.ok(calls.every(c=>c.options.redirect==='error'&&c.options.method==='POST'));
  assert.equal(result.result,'invitation-sent');
  assert.ok(!JSON.stringify(result).includes(email));
});
test('existing-account conflict never proceeds to invitation',async()=>{
  let count=0;
  await assert.rejects(inviteNewTestAccount({email,apiKey:'test',caseId,fetcher:async()=>{count++;return json({message:'private'},422);}}),e=>e.phase==='create-new-account'&&e.status===422);
  assert.equal(count,1);
});
test('mismatching or already confirmed create response stops before mail',async()=>{
  for(const changed of [{...user,id:null},{...user,email:'other@example.test'},{...user,email_confirmed_at:'2026-01-01'},{...user,app_metadata:{}}]) {
    let count=0;
    await assert.rejects(inviteNewTestAccount({email,apiKey:'test',caseId,fetcher:async()=>{count++;return json(changed);}}),e=>e.phase==='validate-created-account');
    assert.equal(count,1);
  }
});
test('mail failure leaves a marked new account; no retry, deletion or reset',async()=>{
  let count=0;
  await assert.rejects(inviteNewTestAccount({email,apiKey:'test',caseId,fetcher:async()=>++count===1?json(user):json({},503)}),e=>e.phase==='send-invitation'&&e.accountState==='created-review-required');
  assert.equal(count,2);
});
test('ambiguous transport failure is sanitized and never retried',async()=>{
  let count=0;
  await assert.rejects(inviteNewTestAccount({email,apiKey:'test',caseId,fetcher:async()=>{count++;throw Error('secret-body');}}),e=>e.accountState==='unknown-after-create-attempt'&&!e.message.includes('secret-body'));
  assert.equal(count,1);
});
test('mail response must belong to exactly the newly created identity',async()=>{
  let count=0;
  await assert.rejects(inviteNewTestAccount({email,apiKey:'test',caseId,fetcher:async()=>json(++count===1?user:{...user,id:'other',invited_at:'now'})}),e=>e.phase==='validate-invitation');
});
test('management lookup is fixed, read-only, prefers existing secret key and never creates keys',async()=>{
  let count=0;
  const key=await obtainAdminKey('operator',async(url,options)=>{
    count++;assert.equal(url,'https://api.supabase.com/v1/projects/apaubomxffcwtzjimori/api-keys?reveal=true');
    assert.equal(options.method,undefined);assert.equal(options.redirect,'error');
    return json([{name:'service_role',api_key:'legacy-test'},{type:'secret',api_key:'sb_secret_test'}]);
  });assert.equal(key,'sb_secret_test');assert.equal(count,1);
});
test('missing access and unsuitable key responses fail closed',async()=>{
  await assert.rejects(obtainAdminKey('',()=>assert.fail('network')));
  for(const response of [[],{},[{name:'anon',api_key:'public'}]]) await assert.rejects(obtainAdminKey('operator',async()=>json(response)));
});
test('administrative preflight reads at most one user and reports no account data',async()=>{
  const result=await checkAdminAccess('test',async(url,options)=>{
    assert.equal(url,AUTH+'/admin/users?page=1&per_page=1');assert.equal(options.method,undefined);
    return json({users:[{email:'private@example.test',id:'private-id'}]});
  });assert.equal(result.accountState,'unchanged');assert.ok(!JSON.stringify(result).includes('private'));
});
