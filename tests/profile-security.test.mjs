import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import test from 'node:test';

const source = readFileSync(new URL('../apps/editorial-web/src/App.tsx', import.meta.url), 'utf8');
const functions = source.slice(source.indexOf('  async function ensureSecureProfileSession'), source.indexOf('  async function logout'))
  .replace(': Promise<boolean>', '').replaceAll('event: FormEvent', 'event');
function setup({level = 'aal2', error = null, throws = false} = {}) {
  const values = {newAccountEmail:' new@example.test ', accountEmail:'old@example.test', newPassword:'example-pass-123', confirmPassword:'example-pass-123', securitySaving:false, securityMessage:'', passwordRecovery:false, recoverySending:false, email:'user@example.test', message:''};
  const calls = [];
  const ctx = {...values, refreshAuthState:async()=>{}, supabase:{auth:{mfa:{getAuthenticatorAssuranceLevel:async()=>({data:{currentLevel:level}, error})}, updateUser:async args=>{calls.push(args); if(throws) throw Error('network'); return {error};}}}};
  ctx.window={location:{origin:'http://127.0.0.1:4173',pathname:'/'}};
  ctx.supabase.auth.resetPasswordForEmail=async(email,options)=>{calls.push({email,options});if(throws)throw Error('network');return {error};};
  for(const key of Object.keys(values)) ctx['set'+key[0].toUpperCase()+key.slice(1)] = value => { ctx[key] = value; };
  vm.createContext(ctx);
  vm.runInContext(functions,ctx);
  return {ctx,calls,event:{preventDefault(){}}};
}
test('AAL1 blocks both credential updates',async()=>{const {ctx,calls,event}=setup({level:'aal1'});await ctx.updateEmail(event);await ctx.updatePassword(event);assert.equal(calls.length,0);});
test('AAL errors fail closed',async()=>{const {ctx,calls,event}=setup({error:{message:'invalid'}});await ctx.updatePassword(event);assert.equal(calls.length,0);});
test('email is trimmed and success clears request',async()=>{const {ctx,calls,event}=setup();await ctx.updateEmail(event);assert.equal(calls[0].email,'new@example.test');assert.equal(ctx.newAccountEmail,'');assert.equal(ctx.accountEmail,'old@example.test');});
test('unchanged email does not call Auth',async()=>{const {ctx,calls,event}=setup();ctx.newAccountEmail=ctx.accountEmail;await ctx.updateEmail(event);assert.equal(calls.length,0);});
test('short and mismatching passwords do not call Auth',async()=>{const {ctx,calls,event}=setup();ctx.newPassword='short';await ctx.updatePassword(event);ctx.newPassword='example-pass-123';ctx.confirmPassword='different-pass';await ctx.updatePassword(event);assert.equal(calls.length,0);});
test('password success clears both inputs',async()=>{const {ctx,calls,event}=setup();await ctx.updatePassword(event);assert.equal(calls[0].password,'example-pass-123');assert.equal(ctx.newPassword,'');assert.equal(ctx.confirmPassword,'');assert.equal(ctx.securitySaving,false);});
test('Auth rejection clears password and resets busy',async()=>{const {ctx,event}=setup();ctx.supabase.auth.updateUser=async()=>({error:{message:'reject'}});await ctx.updatePassword(event);assert.equal(ctx.newPassword,'');assert.equal(ctx.securitySaving,false);});
test('thrown password request clears secrets and resets busy',async()=>{const {ctx,event}=setup({throws:true});await ctx.updatePassword(event).catch(()=>{});assert.equal(ctx.newPassword,'');assert.equal(ctx.confirmPassword,'');assert.equal(ctx.securitySaving,false);});
test('thrown email request resets busy',async()=>{const {ctx,event}=setup({throws:true});await ctx.updateEmail(event).catch(()=>{});assert.equal(ctx.securitySaving,false);});
test('busy state blocks a second security action',async()=>{const {ctx,calls,event}=setup();ctx.securitySaving=true;await ctx.updateEmail(event);await ctx.updatePassword(event);assert.equal(calls.length,0);});
test('thrown MFA lookup fails closed and clears password',async()=>{const {ctx,calls,event}=setup();ctx.supabase.auth.mfa.getAuthenticatorAssuranceLevel=async()=>{throw Error('network');};await ctx.updatePassword(event);assert.equal(calls.length,0);assert.equal(ctx.newPassword,'');assert.equal(ctx.securitySaving,false);});
test('MFA rejection clears password and resets busy',async()=>{const {ctx,event}=setup({level:'aal1'});await ctx.updatePassword(event);assert.equal(ctx.newPassword,'');assert.equal(ctx.confirmPassword,'');assert.equal(ctx.securitySaving,false);});
test('recovery uses application callback and clears busy',async()=>{const {ctx,calls}=setup();await ctx.requestPasswordRecovery();assert.equal(calls[0].options.redirectTo,'http://127.0.0.1:4173/');assert.equal(ctx.recoverySending,false);});
test('recovery response does not disclose account existence',async()=>{const valid=setup(),unknown=setup({error:{message:'not found'}});await valid.ctx.requestPasswordRecovery();await unknown.ctx.requestPasswordRecovery();assert.equal(valid.ctx.message,unknown.ctx.message);});
test('thrown recovery request resets busy and reports connection failure',async()=>{const {ctx}=setup({throws:true});await ctx.requestPasswordRecovery();assert.equal(ctx.recoverySending,false);assert.match(ctx.message,/Verbindung/);});
test('empty or busy recovery request does not call Auth',async()=>{const {ctx,calls}=setup();ctx.email=' ';await ctx.requestPasswordRecovery();ctx.email='user@example.test';ctx.recoverySending=true;await ctx.requestPasswordRecovery();assert.equal(calls.length,0);});

function invitationSetup({mismatch=false,wrongUser=false,verifiedInvite=true,reject=false,network=false}={}) {
  const calls=[];
  const ctx={invitationMode:true,invitationUserId:'invited-user',invitationBusy:{current:false},initialPassword:'long-initial-password',initialPasswordConfirm:mismatch?'different-password':'long-initial-password',invitationPasswordPending:true,invitationSaving:false,message:'',
    refreshAuthState:async()=>{},rememberInvitationPassword:id=>calls.push({remember:id}),
    supabase:{auth:{getUser:async()=>{if(network)throw Error('offline');return {data:{user:{id:wrongUser?'other-user':'invited-user',invited_at:verifiedInvite?'2026-10-12':undefined}},error:null};},updateUser:async body=>{calls.push(body);return {error:reject?{message:'reject'}:null};}}}};
  for(const key of ['initialPassword','initialPasswordConfirm','invitationPasswordPending','invitationSaving','message'])ctx['set'+key[0].toUpperCase()+key.slice(1)]=value=>{ctx[key]=value;};
  vm.createContext(ctx);vm.runInContext(functions,ctx);return {ctx,calls,event:{preventDefault(){}}};
}
test('invitation refuses a changed account identity',async()=>{const {ctx,calls,event}=invitationSetup({wrongUser:true});await ctx.setInvitationPassword(event);assert.equal(calls.length,0);assert.equal(ctx.initialPassword,'');assert.equal(ctx.invitationSaving,false);});
test('invitation requires a server-confirmed invited account',async()=>{const {ctx,calls,event}=invitationSetup({verifiedInvite:false});await ctx.setInvitationPassword(event);assert.equal(calls.length,0);assert.equal(ctx.invitationPasswordPending,true);});
test('first password mismatch cannot advance onboarding',async()=>{const {ctx,calls,event}=invitationSetup({mismatch:true});await ctx.setInvitationPassword(event);assert.equal(calls.length,0);assert.equal(ctx.invitationPasswordPending,true);});
test('rejected first password cannot mark setup complete',async()=>{const {ctx,calls,event}=invitationSetup({reject:true});await ctx.setInvitationPassword(event);assert.equal(calls.length,1);assert.equal(ctx.invitationPasswordPending,true);assert.equal(ctx.initialPassword,'');assert.equal(ctx.initialPasswordConfirm,'');assert.equal(ctx.invitationBusy.current,false);});
test('invitation network failure clears secrets and releases busy guard',async()=>{const {ctx,event}=invitationSetup({network:true});await ctx.setInvitationPassword(event);assert.equal(ctx.initialPassword,'');assert.equal(ctx.initialPasswordConfirm,'');assert.equal(ctx.invitationSaving,false);assert.equal(ctx.invitationBusy.current,false);});
test('invitation success records only user-bound navigation progress',async()=>{const {ctx,calls,event}=invitationSetup();await ctx.setInvitationPassword(event);assert.equal(calls[0].password,'long-initial-password');assert.equal(calls[1].remember,'invited-user');assert.equal(ctx.invitationPasswordPending,false);assert.equal(ctx.initialPassword,'');});
test('invitation concurrent submissions perform one password update',async()=>{const {ctx,calls,event}=invitationSetup();await Promise.all([ctx.setInvitationPassword(event),ctx.setInvitationPassword(event)]);assert.equal(calls.filter(c=>'password' in c).length,1);});
