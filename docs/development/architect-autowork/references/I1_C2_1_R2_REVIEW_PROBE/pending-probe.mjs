import {fixture,open,AUTH} from './fixture.mjs';
import fs from 'node:fs';
const f=await fixture(); f.suppressTimers=true;
let exchange=0;
f.fetch=async url=>{
 if(url.endsWith('/v1/device-authorizations'))return new Response(JSON.stringify({status:'pending',authorizationId:'66666666-6666-4666-8666-666666666666',deviceCode:'D'.repeat(43),userCode:'ABCD-EFGH',expiresAt:new Date(f.clock.wall+60000).toISOString()}),{status:201});
 if(url.endsWith('/v1/device-authorizations/token')){exchange++;return new Promise(()=>{});}
 throw Error('Unexpected request');
};
const a=await open(f);await a('localReset');await a('startActivation');await new Promise(r=>setImmediate(r));
const pending=structuredClone(f.backing.local[AUTH].pending);
const before={phase:pending.phase,hasAuthContext:Boolean(pending.authContext),credentialsNull:f.backing.local[AUTH].credentials===null,exchangeCalls:exchange};
const b=await open(f);await new Promise(r=>setImmediate(r));const status=await b('status');
const result={scope:'source VM, actual online start path with synthetic server; worker recreation at unchanged origin/context; no live provider',before,after:{pending:status.pending,exchangeCalls:exchange,lastError:status.lastError},expected:{pendingPreserved:true,exchangeResumed:true}};
fs.writeFileSync(new URL('./pending-result.json',import.meta.url),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result,null,2));
