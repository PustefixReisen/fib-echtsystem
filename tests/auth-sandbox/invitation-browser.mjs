// Disposable loopback accounts only. No token, password, email body or TOTP secret in output.
import {chromium} from 'playwright';
import {createHmac,randomBytes} from 'node:crypto';
import {writeFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
const base='http://127.0.0.1:4173';
const results=[];
function check(test,condition){results.push({test,result:condition?'PASS':'FAIL'});console.log((condition?'PASS ':'FAIL ')+test);if(!condition)throw Error('assertion');}
function jwt(){const enc=o=>Buffer.from(JSON.stringify(o)).toString('base64url');const data=enc({alg:'HS256',typ:'JWT'})+'.'+enc({role:'service_role',exp:Math.floor(Date.now()/1000)+3600});return data+'.'+createHmac('sha256',process.env.TEST_JWT_SECRET).update(data).digest('base64url');}
async function auth(path,body,token,method){const response=await fetch('http://127.0.0.1:9999'+path,{method:method??(body?'POST':'GET'),headers:{'content-type':'application/json',...(token?{authorization:'Bearer '+token}:{})},body:body?JSON.stringify(body):undefined});const data=await response.json();return {status:response.status,data};}
async function emailLink(address){for(let n=0;n<40;n++){const list=await(await fetch('http://127.0.0.1:54324/api/v1/messages')).json();for(const item of list.messages??[]){if(!(item.To??[]).some(to=>to.Address===address))continue;const mail=await(await fetch('http://127.0.0.1:54324/api/v1/message/'+item.ID)).json();for(const s of ((mail.HTML??'')+' '+(mail.Text??'')).replaceAll('&amp;','&').match(/https?:\/\/[^\s<>"']+/g)??[]){const u=new URL(s);if(u.hostname==='127.0.0.1'&&u.port==='54321'&&u.searchParams.get('type')==='invite')return s;}}await new Promise(r=>setTimeout(r,250));}throw Error('mail missing');}
function totp(secret){const alphabet='ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';const bits=[...secret.replace(/=+$/,'')].map(c=>alphabet.indexOf(c).toString(2).padStart(5,'0')).join('');const key=Buffer.from(bits.match(/.{8}/g).map(b=>parseInt(b,2)));const c=Buffer.alloc(8);c.writeBigUInt64BE(BigInt(Math.floor(Date.now()/30000)));const h=createHmac('sha1',key).update(c).digest(),o=h[19]&15;return ((h.readUInt32BE(o)&0x7fffffff)%1000000).toString().padStart(6,'0');}
function sql(statement){execFileSync('docker',['compose','-f','tests/auth-sandbox/compose.yml','exec','-T','db','psql','-U','postgres','-d','auth_test','-v','ON_ERROR_STOP=1','-c',statement],{stdio:'pipe'});}
const browser=await chromium.launch();
try{
 const page=await browser.newPage();
 await page.route('**/*',route=>new URL(route.request().url()).hostname==='127.0.0.1'?route.continue():route.abort());
 // A separate synthetic existing account demonstrates that the invite cannot overwrite it.
 const existingEmail='fib-existing-'+randomBytes(5).toString('hex')+'@example.test',existingPassword=randomBytes(24).toString('base64url');
 const existing=await auth('/admin/users',{email:existingEmail,password:existingPassword,email_confirm:true},jwt());
 if(existing.status!==200)throw Error('fixture creation');
 await page.goto(base);
 await page.getByLabel('E-Mail',{exact:true}).fill(existingEmail);await page.getByLabel('Passwort',{exact:true}).fill(existingPassword);
 await page.getByRole('button',{name:'Anmelden',exact:true}).click();await page.getByRole('button',{name:'Authenticator einrichten'}).waitFor();
 const before=await page.evaluate(()=>JSON.stringify(localStorage));
 await page.goto(base+'/#type=invite');
 await page.getByText('Die Einladung ist ungültig, abgelaufen oder bereits verwendet.',{exact:false}).waitFor();
 check('Forged invitation flag cannot use the existing normal session',await page.getByRole('heading',{name:'Passwort festlegen',exact:true}).count()===0&&(await page.evaluate(()=>JSON.stringify(localStorage)))===before);
 const email='fib-onboarding-'+randomBytes(5).toString('hex')+'@example.test';
 const invited=await auth('/invite',{email},jwt());if(invited.status!==200)throw Error('invite failed');
 const userId=invited.data.id;if(!/^[a-f0-9-]{36}$/.test(userId))throw Error('fixture id');
 const link=await emailLink(email);
 let dataRequests=0,updates=0;
 page.on('request',r=>{if(r.url().includes('/functions/v1/'))dataRequests++;if(r.method()==='PUT'&&r.url().endsWith('/auth/v1/user'))updates++;});
 await page.goto(link);await page.getByRole('heading',{name:'Passwort festlegen',exact:true}).waitFor();
 check('Real invitation opens initial password form for the invited identity',await page.getByText(email,{exact:true}).count()===1);
 check('No FIB service is called before initial password and MFA',dataRequests===0);
 check('Invitation callback tokens are removed from the URL',!(new URL(page.url())).hash);
 check('Invitation leaves normal session storage unchanged',(await page.evaluate(()=>JSON.stringify(localStorage)))===before);
 await page.reload();await page.getByRole('heading',{name:'Passwort festlegen',exact:true}).waitFor();
 check('Reload resumes password setup without granting FIB access',dataRequests===0);
 const pass=page.getByLabel('Erstes Passwort',{exact:true}),confirm=page.getByLabel('Erstes Passwort wiederholen',{exact:true});
 await pass.fill('Long-test-password-1');await confirm.fill('Long-test-password-2');await page.getByRole('button',{name:'Passwort festlegen',exact:true}).click();
 await page.getByText('Bitte mindestens 12 Zeichen',{exact:false}).waitFor();check('Mismatching first passwords do not reach Auth',updates===0);
 await page.route('**/auth/v1/user',async route=>route.request().method()==='PUT'?route.fulfill({status:422,contentType:'application/json',body:JSON.stringify({code:422,error_code:'weak_password',msg:'rejected test password'})}):route.continue());
 await pass.fill('Long-test-password-1');await confirm.fill('Long-test-password-1');await page.getByRole('button',{name:'Passwort festlegen',exact:true}).click();
 await page.getByText('Passwort konnte nicht festgelegt werden.',{exact:false}).waitFor();
 check('Rejected first password clears inputs and allows retry',!(await pass.inputValue())&&!(await confirm.inputValue())&&await page.getByRole('button',{name:'Passwort festlegen',exact:true}).isEnabled());
 await page.unroute('**/auth/v1/user');
 const password=randomBytes(24).toString('base64url');await pass.fill(password);await confirm.fill(password);await page.getByRole('button',{name:'Passwort festlegen',exact:true}).click();
 await page.getByRole('button',{name:'Authenticator einrichten'}).waitFor();
 check('Initial password advances to MFA without querying editorial data',dataRequests===0);
 await page.reload();await page.getByRole('button',{name:'Authenticator einrichten'}).waitFor();check('Reload after password success resumes MFA setup',await page.getByRole('heading',{name:'Passwort festlegen',exact:true}).count()===0);
 const aal1=await auth('/token?grant_type=password',{email,password});
 const gate=async token=>{const r=await fetch('http://127.0.0.1:54321/functions/v1/fib-session-context',{method:'POST',headers:{authorization:'Bearer '+token,'content-type':'application/json'},body:'{}'});return {status:r.status,data:await r.json()};};
 check('Actual session-context handler rejects invitation AAL1',(await gate(aal1.data.access_token)).status===403);
 await page.getByRole('button',{name:'Authenticator einrichten'}).click();
 await page.locator('.notice code').waitFor();
 const abandoned=(await auth('/user',null,aal1.data.access_token)).data.factors.find(f=>f.status==='unverified').id;
 await page.reload();await page.getByRole('button',{name:'Authenticator einrichten'}).click();await page.locator('.notice code').waitFor();
 const resumedFactors=(await auth('/user',null,aal1.data.access_token)).data.factors;
 check('Interrupted MFA setup replaces only its own unverified factor',resumedFactors.length===1&&resumedFactors[0].id!==abandoned&&resumedFactors[0].status==='unverified');
 const secret=await page.locator('.notice code').innerText();
 const wrong=((Number(totp(secret))+1)%1000000).toString().padStart(6,'0');
 await page.locator('input[autocomplete="one-time-code"]').fill(wrong);await page.getByRole('button',{name:'Bestätigen',exact:true}).click();
 await page.getByText('Der MFA-Code konnte nicht bestätigt werden.',{exact:false}).waitFor();check('Wrong enrollment code does not unlock FIB',dataRequests===0);
 await page.locator('input[autocomplete="one-time-code"]').fill(totp(secret));await page.getByRole('button',{name:'Bestätigen',exact:true}).click();
 await page.getByRole('heading',{name:'Freischaltung ausstehend'}).waitFor();
 check('Verified MFA without membership shows pending activation',await page.getByRole('button',{name:'Mein Profil öffnen'}).count()===0);
 const token=await page.evaluate(()=>JSON.parse(sessionStorage.getItem(sessionStorage.getItem('fib-invitation-storage-key'))).access_token);
 check('Real server handler denies AAL2 without FIB membership',(await gate(token)).data.error==='fib_membership_missing_or_inactive');
 await auth('/user',{data:{role:'admin',active:true,setup_status:'active'}},token,'PUT');
 check('Self-edited metadata cannot grant FIB membership',(await gate(token)).status===403);
 sql(`insert into fib.app_users(user_id,full_name,role,active,setup_status) values ('${userId}','Eingeladene Testredaktion','editor',false,'invited')`);
 check('Real server handler denies inactive invited membership',(await gate(token)).status===403);
 sql(`update fib.app_users set active=true where user_id='${userId}'`);
 check('Active flag alone cannot bypass incomplete setup status',(await gate(token)).status===403);
 await page.getByRole('button',{name:'Freischaltung erneut prüfen'}).click();await page.getByRole('heading',{name:'Freischaltung ausstehend'}).waitFor();
 await page.setViewportSize({width:390,height:844});await page.screenshot({path:'auth-test-results/invitation-pending.png',fullPage:true});
 // Explicit test fixture operation simulates administrator approval; no client grant endpoint exists.
 sql(`update fib.app_users set setup_status='active' where user_id='${userId}'`);
 const allowed=await gate(token);check('Separate active editor membership permits AAL2 access',allowed.status===200&&allowed.data.user.role==='editor');
 check('Even activated membership cannot use AAL1',(await gate(aal1.data.access_token)).status===403);
 await page.getByRole('button',{name:'Freischaltung erneut prüfen'}).click();await page.getByRole('heading',{name:'Dashboard',exact:true}).waitFor();
 check('UI opens editorial dashboard only after separate activation',true);
 const normal=await browser.newPage();
 await normal.goto(base);await normal.getByLabel('E-Mail',{exact:true}).fill(email);await normal.getByLabel('Passwort',{exact:true}).fill(password);await normal.getByRole('button',{name:'Anmelden',exact:true}).click();
 await normal.getByRole('button',{name:'MFA bestätigen'}).waitFor();
 check('First normal password login still requires enrolled MFA',await normal.getByRole('heading',{name:'Dashboard',exact:true}).count()===0);
 await new Promise(r=>setTimeout(r,31000-Date.now()%30000));
 await normal.locator('input[autocomplete="one-time-code"]').fill(totp(secret));await normal.getByRole('button',{name:'MFA bestätigen'}).click();await normal.getByRole('heading',{name:'Dashboard',exact:true}).waitFor();
 check('Normal login completes after password and MFA without invitation loop',true);
 sql(`update fib.app_users set active=false where user_id='${userId}'`);
 check('Server immediately rejects deactivated membership',(await gate(token)).status===403);
 const existingLogin=await auth('/token?grant_type=password',{email:existingEmail,password:existingPassword});
 check('Existing synthetic account password and factors remain unchanged',existingLogin.status===200&&!(existingLogin.data.user.factors??[]).length&&(await page.evaluate(()=>JSON.stringify(localStorage)))===before);
 await page.goto(link);await page.getByText('Dieser Link ist ungültig oder abgelaufen.',{exact:false}).waitFor();
 check('Replayed invitation never opens initial password form',await page.getByRole('heading',{name:'Passwort festlegen',exact:true}).count()===0);
 const fresh=await browser.newPage();await fresh.goto(base+'/#error=access_denied&error_code=otp_expired&error_description=untrusted-content');
 await fresh.getByText('Dieser Link ist ungültig oder abgelaufen.',{exact:false}).waitFor();
 check('Invalid link displays generic error and strips callback details',!(new URL(fresh.url())).hash&&!(await fresh.locator('body').innerText()).includes('untrusted-content'));
}catch(error){results.push({test:'Invitation scenario completed',result:'FAIL'});console.log('FAIL Invitation scenario interrupted: '+error.name);}
finally{await browser.close();writeFileSync('auth-test-results/invitation-results.json',JSON.stringify({scope:'real local Auth and actual fib-session-context handler; synthetic membership table and test-only administrator fixture',results},null,2)+'\n');writeFileSync('auth-test-results/invitation-results.md','# Invitation acceptance tests\n\n'+results.map(r=>'- '+r.result+': '+r.test).join('\n')+'\n');}
if(results.some(r=>r.result==='FAIL'))process.exitCode=1;
