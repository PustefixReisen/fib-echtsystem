import {chromium} from 'playwright';
import {checkPasswordVisibility} from './password-visibility.mjs';
import {readFileSync,writeFileSync} from 'node:fs';
import {createHmac,randomBytes} from 'node:crypto';
import path from 'node:path';
const fixture=JSON.parse(readFileSync(path.join(process.env.RUNNER_TEMP,'fib-auth-browser.json'),'utf8'));
const results=[];
function check(name,ok){results.push({test:name,result:ok?'PASS':'FAIL'});console.log((ok?'PASS ':'FAIL ')+name);}
function totp(secret){
  const alphabet='ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  const bits=[...secret.replace(/=+$/,'')].map(c=>alphabet.indexOf(c).toString(2).padStart(5,'0')).join('');
  const key=Buffer.from(bits.match(/.{8}/g).map(b=>parseInt(b,2)));
  const counter=Buffer.alloc(8);counter.writeBigUInt64BE(BigInt(Math.floor(Date.now()/30000)));
  const digest=createHmac('sha1',key).update(counter).digest(),offset=digest[19]&15;
  return ((digest.readUInt32BE(offset)&0x7fffffff)%1000000).toString().padStart(6,'0');
}
async function recoveryLink(address){
  for(let n=0;n<40;n++){
    const list=await (await fetch('http://127.0.0.1:54324/api/v1/messages')).json();
    for(const item of list.messages??[]){
      if(!(item.To??[]).some(to=>to.Address===address))continue;
      const mail=await(await fetch('http://127.0.0.1:54324/api/v1/message/'+item.ID)).json();
      const text=((mail.HTML??'')+'\n'+(mail.Text??'')).replaceAll('&amp;','&');
      for(const candidate of text.match(/https?:\/\/[^\s<>"']+/g)??[]){
        const url=new URL(candidate);
        if(url.hostname==='127.0.0.1'&&url.port==='54321'&&url.searchParams.get('type')==='recovery')return candidate;
      }
    }
    await new Promise(resolve=>setTimeout(resolve,500));
  }
  throw Error('Captured recovery email missing');
}
const browser=await chromium.launch();
let phase='initialization';
let recoveryMfaStatus=null;
let diagnosticPage;
try{
  const page=await browser.newPage({viewport:{width:1280,height:900}});
  diagnosticPage=page;
  await page.route('**/*',route=>new URL(route.request().url()).hostname==='127.0.0.1'?route.continue():route.abort());
  await page.goto('http://127.0.0.1:4173');
  await checkPasswordVisibility(page, ['Passwort'], check, 'Login');
  check('Recovery request entry is available when signed out',await page.getByRole('button',{name:/Passwort vergessen|Passwort zurücksetzen|Passwort wiederherstellen/i}).count()>0);
  await page.getByLabel('E-Mail',{exact:true}).fill(fixture.email);
  await page.getByLabel('Passwort',{exact:true}).fill(fixture.password);
  await page.getByRole('button',{name:'Anmelden',exact:true}).click();
  await page.getByRole('button',{name:'MFA bestätigen'}).waitFor();
  check('Real browser login requires MFA before profile',await page.getByRole('button',{name:'Mein Profil öffnen'}).count()===0);
  await new Promise(resolve=>setTimeout(resolve,31000-(Date.now()%30000)));
  await page.locator('input[autocomplete="one-time-code"]').fill(totp(fixture.secret));
  await page.getByRole('button',{name:'MFA bestätigen'}).click();
  await page.getByRole('button',{name:'Mein Profil öffnen'}).click();
  await page.getByRole('heading',{name:'Mein Profil',exact:true}).waitFor();
  check('Profile loads after actual TOTP verification',true);
  await checkPasswordVisibility(page, ['Neues Passwort', 'Neues Passwort wiederholen'], check, 'Profile');
  let mutations=0;
  page.on('request',req=>{if(req.method()==='PUT'&&req.url().endsWith('/auth/v1/user'))mutations++;});
  const newPass=page.getByLabel('Neues Passwort',{exact:true});
  const repeat=page.getByLabel('Neues Passwort wiederholen',{exact:true});
  await newPass.fill('Synthetic-password-123');await repeat.fill('Different-password-123');
  await page.getByRole('button',{name:'Passwort ändern',exact:true}).click();
  await page.getByText('Bitte ein Passwort mit mindestens 12 Zeichen eingeben und identisch wiederholen.').waitFor();
  check('Password mismatch does not call Auth',mutations===0);
  await page.getByRole('button',{name:'Zurück',exact:true}).click();
  await page.getByRole('button',{name:'Mein Profil öffnen'}).click();
  check('Leaving profile clears both password fields',!(await newPass.inputValue())&&!(await repeat.inputValue()));
  const replacement=randomBytes(24).toString('base64url');
  await newPass.fill(replacement);await repeat.fill(replacement);
  await page.getByRole('button',{name:'Passwort ändern',exact:true}).click();
  await page.getByText('Passwort aktualisiert.',{exact:false}).waitFor();
  check('Browser completes actual password change and clears inputs',!(await newPass.inputValue())&&!(await repeat.inputValue()));
  const address='fib-ui-'+randomBytes(5).toString('hex')+'@example.test';
  await page.getByLabel('Neue E-Mail-Adresse').fill(address);
  await page.getByRole('button',{name:'E-Mail-Änderung anfordern'}).click();
  await page.getByText('Änderung angefordert.',{exact:false}).waitFor();
  check('Browser requests actual email change without premature activation',await page.getByText(fixture.email,{exact:false}).count()>0&&!(await page.getByLabel('Neue E-Mail-Adresse').inputValue()));
  await page.setViewportSize({width:390,height:844});
  await page.waitForFunction(()=>document.querySelector('.side-nav').getBoundingClientRect().right<=0);
  await page.evaluate(()=>window.scrollTo(0,0));
  check('Profile fits mobile width with navigation closed',await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth&&document.querySelector('.side-nav').getBoundingClientRect().right<=0));
  await page.screenshot({path:'auth-test-results/profile-mobile.png',fullPage:true,animations:'disabled'});
  await page.getByRole('button',{name:'Navigation öffnen oder schließen'}).click();
  await page.getByRole('button',{name:'Abmelden',exact:true}).click();
  await page.getByRole('button',{name:'Anmelden',exact:true}).waitFor();
  check('Signout returns to login and hides profile',await page.getByRole('heading',{name:'Mein Profil',exact:true}).count()===0);
  await page.getByLabel('E-Mail',{exact:true}).fill(fixture.email);
  await page.getByRole('button',{name:'Passwort vergessen?',exact:true}).click();
  await page.getByText('Wenn die Adresse registriert ist',{exact:false}).waitFor();
  check('Recovery request gives a non-enumerating response',true);
  await page.goto(await recoveryLink(fixture.email));
  await page.getByRole('button',{name:'MFA bestätigen'}).waitFor();
  check('Recovery link in browser still requires MFA',await page.getByRole('heading',{name:'Mein Profil',exact:true}).count()===0);
  phase='recovery MFA';
  page.on('response',response=>{if(new URL(response.url()).pathname.endsWith('/verify'))recoveryMfaStatus=response.status();});
  await new Promise(resolve=>setTimeout(resolve,31000-(Date.now()%30000)));
  await page.locator('input[autocomplete="one-time-code"]').fill(totp(fixture.secret));
  await page.getByRole('button',{name:'MFA bestätigen'}).click();
  phase='recovery form after MFA';
  await page.getByText('Deine Wiederherstellung ist mit MFA bestätigt.',{exact:false}).waitFor();
  await checkPasswordVisibility(page, ['Neues Passwort', 'Neues Passwort wiederholen'], check, 'Recovery');
  const recoveredPassword=randomBytes(24).toString('base64url');
  await newPass.fill(recoveredPassword);await repeat.fill(recoveredPassword);
  await page.getByRole('button',{name:'Passwort ändern',exact:true}).click();
  await page.getByText('Passwort aktualisiert.',{exact:false}).waitFor();
  check('Browser recovery completes through MFA and profile password form',!(await newPass.inputValue())&&!(await repeat.inputValue()));
  const oldLogin=await fetch('http://127.0.0.1:9999/token?grant_type=password',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({email:fixture.email,password:replacement})});
  const newLogin=await fetch('http://127.0.0.1:9999/token?grant_type=password',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({email:fixture.email,password:recoveredPassword})});
  check('Browser-reset password replaces previous password',oldLogin.status===400&&newLogin.status===200);
}catch(error){
  check('Browser scenario completed',false);
  // Allowlisted state only: never output a page dump, URL, input, or Auth payload.
  console.log('Browser scenario interrupted: '+error.name+'; phase='+phase+'; MFA HTTP='+recoveryMfaStatus);
  if(diagnosticPage)console.log('Recovery state: '+JSON.stringify({
    mfaPrompt:await diagnosticPage.getByRole('button',{name:'MFA bestätigen'}).count(),
    rejectedCode:await diagnosticPage.getByText('Der MFA-Code konnte nicht bestätigt werden. Bitte einen aktuellen Code verwenden.',{exact:true}).count(),
    profile:await diagnosticPage.getByRole('heading',{name:'Mein Profil',exact:true}).count(),
    recoveryNotice:await diagnosticPage.getByText('Deine Wiederherstellung ist mit MFA bestätigt.',{exact:false}).count(),
  }));
}
finally{
  await browser.close();
  writeFileSync('auth-test-results/browser-results.json',JSON.stringify({scope:'real isolated Auth; synthetic FIB data services',results},null,2)+'\n');
  writeFileSync('auth-test-results/browser-results.md','# Browser Auth tests\n\n'+results.map(r=>'- '+r.result+': '+r.test).join('\n')+'\n');
}
if(results.some(r=>r.result==='FAIL'))process.exitCode=1;
