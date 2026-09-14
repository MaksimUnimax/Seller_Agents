import path from 'node:path';
import assert from 'node:assert/strict';
import {boot, reporter, pendingKey, workKey, identity} from './worker_harness.mjs';
const root=path.resolve(process.argv[2]),log=reporter(process.argv[3]);
const message=(w,type,extra={})=>({type,...w.data[pendingKey],identity:w.state.identity,runtime_generation:w.state.generation,actor_id:'actor-1',...extra});
const call=(w,type,extra={})=>w.call(message(w,type,extra),w.content());
const commit=w=>call(w,'WB_WORK_START_COMMIT_REQUEST',{baseline_user_turn_ids:[],assistant_baseline_ids:[]});
async function test(name,fn){await log.test(name,async()=>{const w=boot(root,{wbmb_seller_token:'SYNTHETIC-ACCOUNT-A'});try{assert.equal((await w.start()).accepted,true);await w.settle();await fn(w);assert.equal(w.counts.provider,0)}finally{w.dispose()}})}
await test('ACCOUNT_CHANGE_BEFORE_START_COMMIT_FENCES_CLICK',async w=>{w.data.wbmb_seller_token='SYNTHETIC-ACCOUNT-B';const r=await commit(w);assert.equal(r.ok,false);assert.notEqual(r.click_allowed,true)});
await test('ACCOUNT_CHANGE_AFTER_START_COMMIT_FENCES_ACTIVATION',async w=>{assert.equal((await commit(w)).click_allowed,true);w.data.wbmb_seller_token='SYNTHETIC-ACCOUNT-B';const r=await call(w,'WB_WORK_START_SEND_OUTCOME',{click_event_observed:true,composer_empty:true,user_turn_id:'user-new'});assert.equal(r.ok,false);assert.notEqual(w.data[workKey]?.state,'active_visible');assert.equal(w.counts.promptDispatch,1)});
await test('ACCOUNT_CHANGE_RECOVERY_DOES_NOT_ADOPT_OLD_INTENT',async w=>{await commit(w);w.data.wbmb_seller_token='SYNTHETIC-ACCOUNT-B';const r=await call(w,'WB_WORK_START_RECOVER');assert.equal(r.ok,false);assert.notEqual(w.data[pendingKey].send_outcome,'sent_acknowledged')});
await test('NEW_CHAT_EXPLICIT_START_RETIRES_OLD_INTENT_WITHOUT_REPLAY',async w=>{await commit(w);const old=structuredClone(w.data[pendingKey]);w.state.identity={...identity,conversation_id:'22222222-2222-2222-2222-222222222222'};const r=await w.start();assert.equal(r.accepted,true,JSON.stringify(r));await w.settle();assert.notEqual(w.data[pendingKey].intent_id,old.intent_id);const history=w.data['wb_work_start_history_v1:'+old.intent_id];assert.equal(history?.send_outcome,old.send_outcome);assert.equal(history?.automatic_retry,false);assert.equal(w.counts.promptDispatch,2)});
await test('START_SEMANTIC_STORAGE_ORDER_IS_IRRELEVANT',async w=>{w.state.reorderReads=true;assert.equal((await commit(w)).click_allowed,true)});
log.finish({scope:'Actual worker, mocked storage and DOM proof; zero real provider calls'});
