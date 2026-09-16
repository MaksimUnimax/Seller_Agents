import {fixture,open,AUTH} from './fixture.mjs';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
const f=await fixture();f.suppressTimers=true;
f.fetch=async url=>url.endsWith('/v1/device-authorizations')?new Response(JSON.stringify({status:'pending',authorizationId:'66666666-6666-4666-8666-666666666666',deviceCode:'D'.repeat(43),userCode:'ABCD-EFGH',expiresAt:new Date(f.clock.wall+60000).toISOString()}),{status:201}):new Promise(()=>{});
const first=await open(f);await first('localReset');await first('startActivation');await new Promise(r=>setImmediate(r));
f.clock.wall=Date.parse(f.backing.local[AUTH].pending.expiresAt);f.clock.mono+=60000;
let writes=0;f.writeHook=async()=>{writes++;throw Error('PROBE_AUTH_SET_FAILED');};
let restoreError=null;try{await open(f);}catch(e){restoreError=e.message;}
const bytes=fs.readFileSync(new URL('./client.js',import.meta.url));
const result={scope:'independent source VM; real start path with synthetic exchange and failed auth set; removal available',restoreError,writeAttempts:writes,removeAttempts:f.removes||0,durablePendingRetained:Boolean(f.backing.local[AUTH]?.pending),clientGitBlob:createHash('sha1').update(Buffer.concat([Buffer.from('blob '+bytes.length+'\0'),bytes])).digest('hex')};
fs.writeFileSync(new URL('./storage-result.json',import.meta.url),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result,null,2));
