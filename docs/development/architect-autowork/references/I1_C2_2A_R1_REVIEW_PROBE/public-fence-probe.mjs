import {fixture,open,AUTH} from './fixture.mjs';
import fs from 'node:fs';
const f=await fixture();f.suppressTimers=true;
let calls=0,arm=false,scheduled=false,newer;
f.fetch=async()=>++calls===1?new Response(JSON.stringify({error:{code:'BOOTSTRAP_UNAVAILABLE'}}),{status:503}):new Promise(()=>{});
const call=await open(f);f.clock.wall+=100;let mono=f.clock.mono+100;
Object.defineProperty(f.clock,'mono',{get(){if(arm&&!scheduled){scheduled=true;queueMicrotask(()=>{newer=call('bootstrap',{detectedAi:{family:'chatgpt',surface:'web',variant:null}});newer.catch(()=>{});});}return mono;}});
f.writeHook=async()=>{arm=true;};
let outcome;try{const r=await call('bootstrapWithPolicy',{detectedAi:{family:'chatgpt',surface:'web',variant:null}});outcome={source:r.source};}catch(e){outcome={error:e.code||e.message};}
const result={case:'final_public_cache_fence',outcome,scheduled,calls,authPresent:Boolean(f.backing.local[AUTH])};
console.log(JSON.stringify(result,null,2));fs.writeFileSync(new URL('./public-fence-result.json',import.meta.url),JSON.stringify(result,null,2)+'\n');

