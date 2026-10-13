import { createHmac, randomUUID } from 'node:crypto';
import assert from 'node:assert/strict';
import { AUTH, REDIRECT, inviteNewTestAccount } from './preview-invite.mjs';

const secret=process.env.TEST_JWT_SECRET;
assert.ok(secret);
const enc=value=>Buffer.from(JSON.stringify(value)).toString('base64url');
const body=enc({alg:'HS256',typ:'JWT'})+'.'+enc({role:'service_role',exp:Math.floor(Date.now()/1000)+600});
const apiKey=body+'.'+createHmac('sha256',secret).update(body).digest('base64url');
const headers={Authorization:'Bearer '+apiKey,'Content-Type':'application/json'};
// Production destinations in the operator are always remapped to isolated Auth.
const localFetch=(url,options)=>{
  assert.ok(url.startsWith(AUTH+'/'));
  return fetch('http://127.0.0.1:9999'+url.slice(AUTH.length),options);
};
const local=async(path,options={})=>fetch('http://127.0.0.1:9999'+path,{...options,headers,redirect:'error'});
async function mailCount(email){
  const list=await(await fetch('http://127.0.0.1:54324/api/v1/messages')).json();
  return list.messages.filter(m=>m.To.some(to=>to.Address===email));
}
let phase='startup';
try {
  for(let n=0;n<60;n++) {
    try { if((await local('/health')).ok)break; }catch{}
    if(n===59)throw Error(); await new Promise(r=>setTimeout(r,500));
  }
  for(const confirmed of [false,true]) {
    phase='protect-existing-'+confirmed;
    const email='existing-'+randomUUID()+'@example.test';
    const password=randomUUID()+randomUUID();
    const made=await local('/admin/users',{method:'POST',body:JSON.stringify({email,password,email_confirm:confirmed})});
    assert.ok(made.ok); const before=await made.json();
    await assert.rejects(inviteNewTestAccount({email,apiKey,caseId:randomUUID(),fetcher:localFetch}));
    const after=await(await local('/admin/users/'+before.id)).json();
    assert.equal(after.updated_at,before.updated_at);assert.equal(after.invited_at,before.invited_at);
    assert.equal((await mailCount(email)).length,0);
    if(confirmed)assert.ok((await local('/token?grant_type=password',{method:'POST',body:JSON.stringify({email,password})})).ok);
    console.log('PASS Existing '+(confirmed?'confirmed':'unconfirmed')+' account unchanged; no invitation sent');
  }
  phase='new-test-invitation';
  const email='new-'+randomUUID()+'@example.test', caseId=randomUUID();
  const result=await inviteNewTestAccount({email,apiKey,caseId,fetcher:localFetch});
  assert.equal(result.result,'invitation-sent');
  const messages=await mailCount(email);assert.equal(messages.length,1);
  const mail=await(await fetch('http://127.0.0.1:54324/api/v1/message/'+messages[0].ID)).json();
  const links=((mail.HTML??'')+'\n'+(mail.Text??'')).replaceAll('&amp;','&').match(/https?:\/\/[^\s<>"']+/g)??[];
  assert.ok(links.some(link=>{const u=new URL(link);return u.hostname==='127.0.0.1'&&u.searchParams.get('type')==='invite'&&u.searchParams.get('redirect_to')===REDIRECT;}));
  console.log('PASS New unconfirmed account receives exactly one invitation with explicit preview redirect');
  phase='duplicate-send';
  await assert.rejects(inviteNewTestAccount({email,apiKey,caseId:randomUUID(),fetcher:localFetch}));
  assert.equal((await mailCount(email)).length,1);
  console.log('PASS Repeated operation stops without resending or modifying the new test account');
  // Dashboard-equivalent invite: no redirect at creation. Only synthetic mail,
  // never follow the verification redirect or print its credentials.
  phase='dashboard-invite-preview-before-consumption';
  const dashboardEmail='dashboard-'+randomUUID()+'@example.test';
  const invited=await local('/invite',{method:'POST',body:JSON.stringify({email:dashboardEmail})});
  assert.ok(invited.ok); const invitedUser=await invited.json();
  const dashboardMessages=await mailCount(dashboardEmail);assert.equal(dashboardMessages.length,1);
  const dashboardMail=await(await fetch('http://127.0.0.1:54324/api/v1/message/'+dashboardMessages[0].ID)).json();
  const dashboardLinks=((dashboardMail.HTML??'')+'\n'+(dashboardMail.Text??'')).replaceAll('&amp;','&').match(/https?:\/\/[^\s<>"']+/g)??[];
  const original=dashboardLinks.map(link=>new URL(link)).find(u=>u.pathname==='/auth/v1/verify'&&u.searchParams.get('type')==='invite');
  assert.ok(original);assert.equal(original.origin,'http://127.0.0.1:54321');
  assert.equal(original.searchParams.get('redirect_to'),'http://127.0.0.1:4173/production');
  const adjusted=new URL(original);adjusted.searchParams.set('redirect_to',REDIRECT);
  assert.equal(adjusted.searchParams.get('token'),original.searchParams.get('token'));
  const verified=await fetch('http://127.0.0.1:9999/verify'+adjusted.search,{redirect:'manual'});
  assert.ok([302,303].includes(verified.status));
  const target=new URL(verified.headers.get('location'));
  assert.equal(target.origin+target.pathname,REDIRECT);
  const credentials=new URLSearchParams(target.hash.slice(1));
  assert.equal(credentials.get('type'),'invite');assert.ok(credentials.get('access_token'));assert.ok(credentials.get('refresh_token'));
  const confirmed=await(await local('/admin/users/'+invitedUser.id)).json();
  assert.equal(confirmed.id,invitedUser.id);assert.ok(confirmed.email_confirmed_at);
  console.log('PASS Dashboard-style invitation accepts allowlisted preview redirect before first use; same identity confirmed');
  phase='dashboard-invite-replay';
  const replay=await fetch('http://127.0.0.1:9999/verify'+adjusted.search,{redirect:'manual'});
  const rejected=new URL(replay.headers.get('location'));
  const rejection=new URLSearchParams(rejected.hash.slice(1));
  assert.ok(rejection.get('error'));assert.equal(rejection.has('access_token'),false);
  console.log('PASS Consumed dashboard invitation cannot issue another session');
}catch{
  console.log('FAIL Isolated invitation operator: '+phase);process.exitCode=1;
}
