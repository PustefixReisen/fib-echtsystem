import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import test from 'node:test';

const source = readFileSync(new URL('../apps/editorial-web/src/App.tsx', import.meta.url), 'utf8');
const functions = source.slice(source.indexOf('  async function ensureSecureProfileSession'), source.indexOf('  async function logout'))
  .replace(': Promise<boolean>', '').replaceAll('event: FormEvent', 'event');
function setup({level = 'aal2', error = null, throws = false} = {}) {
  const values = {newAccountEmail:' new@example.test ', accountEmail:'old@example.test', newPassword:'example-pass-123', confirmPassword:'example-pass-123', securitySaving:false, securityMessage:'', passwordRecovery:false};
  const calls = [];
  const ctx = {...values, refreshAuthState:async()=>{}, supabase:{auth:{mfa:{getAuthenticatorAssuranceLevel:async()=>({data:{currentLevel:level}, error})}, updateUser:async args=>{calls.push(args); if(throws) throw Error('network'); return {error};}}}};
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
