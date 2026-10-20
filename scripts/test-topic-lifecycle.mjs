import test from 'node:test';
import assert from 'node:assert/strict';
import { decideTopicAction as decide } from '../supabase/functions/fib-topic-editor/lifecycle.mjs';

const base = { topicStatus:'draft', everPublished:false, hasActivePublication:false,
 approvedVersion:false, approvalEverPublished:false, approvalRevoked:false,
 unchangedContent:true, currencyCheckConfirmed:false, explicitConfirmation:false, body:'Sachtext' };
const check=(action,changes={})=>decide(action,{...base,...changes});
test('first approval activates a draft and can be revoked before publication',()=>{
 assert.deepEqual(check('approve'),{allowed:true,resultStatus:'active'});
 assert.deepEqual(check('revoke',{topicStatus:'active',approvedVersion:true}),{allowed:true,resultStatus:'draft'});
});
test('published approvals cannot be revoked; unapproved/revoked content cannot publish',()=>{
 assert.equal(check('revoke',{topicStatus:'active',approvedVersion:true,approvalEverPublished:true}).reason,'published_approval_immutable');
 assert.equal(check('publish',{topicStatus:'active'}).reason,'approval_required');
 assert.equal(check('publish',{topicStatus:'active',approvedVersion:true,approvalRevoked:true}).reason,'approval_required');
 assert.equal(check('publish',{topicStatus:'active',approvedVersion:true}).reason,'explicit_confirmation_required');
 assert.equal(check('publish',{topicStatus:'active',approvedVersion:true,explicitConfirmation:true}).allowed,true);
});
test('deferral and archival require explicit confirmation',()=>{
 assert.equal(check('defer',{topicStatus:'active'}).allowed,false);
 assert.equal(check('archive',{topicStatus:'active',explicitConfirmation:true}).resultStatus,'archived');
 assert.equal(check('defer',{topicStatus:'active',explicitConfirmation:true}).resultStatus,'deferred');
});
test('reactivation never publishes and requires currentness and new approval if edited',()=>{
 const props={topicStatus:'archived',explicitConfirmation:true,currencyCheckConfirmed:true};
 assert.equal(check('reactivate',props).resultStatus,'active');
 assert.equal(check('reactivate',{...props,unchangedContent:false,approvedVersion:true}).reason,'new_approval_required');
 assert.equal(check('reactivate',{...props,unchangedContent:false,newContentApproved:true}).allowed,true);
 assert.equal(check('reactivate',{topicStatus:'deferred',explicitConfirmation:true}).reason,'currency_check_required');
});
test('deletion only before first publication and without effective approval',()=>{
 assert.equal(check('delete',{everPublished:true,explicitConfirmation:true}).reason,'published_topic_cannot_be_deleted');
 assert.equal(check('delete',{approvedVersion:true,explicitConfirmation:true}).reason,'active_approval_blocks_delete');
 assert.equal(check('delete',{approvedVersion:true,approvalRevoked:true,explicitConfirmation:true}).allowed,true);
 assert.equal(check('delete',{explicitConfirmation:true}).resultStatus,'deleted');
});
test('invalid actions cannot bypass checks',()=>{
 assert.equal(check('something_else').reason,'unknown_action');
 assert.equal(check('approve',{body:'  '}).reason,'empty_contribution');
});
