import {chromium} from 'playwright';
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
const browser=await chromium.launch();
try{
  const page=await browser.newPage({viewport:{width:1280,height:900}});
  await page.route('**/*',route=>new URL(route.request().url()).hostname==='127.0.0.1'?route.continue():route.abort());
  await page.goto('http://127.0.0.1:4173');
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
  check('Profile fits mobile width',await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth));
  await page.screenshot({path:'auth-test-results/profile-mobile.png',fullPage:true});
  await page.getByRole('button',{name:'Navigation öffnen oder schließen'}).click();
  await page.getByRole('button',{name:'Abmelden',exact:true}).click();
  await page.getByRole('button',{name:'Anmelden',exact:true}).waitFor();
  check('Signout returns to login and hides profile',await page.getByRole('heading',{name:'Mein Profil',exact:true}).count()===0);
}catch(error){check('Browser scenario completed',false);console.log('Browser scenario interrupted: '+error.name);}
finally{
  await browser.close();
  writeFileSync('auth-test-results/browser-results.json',JSON.stringify({scope:'real isolated Auth; synthetic FIB data services',results},null,2)+'\n');
  writeFileSync('auth-test-results/browser-results.md','# Browser Auth tests\n\n'+results.map(r=>'- '+r.result+': '+r.test).join('\n')+'\n');
}
if(results.some(r=>r.result==='FAIL'))process.exitCode=1;
