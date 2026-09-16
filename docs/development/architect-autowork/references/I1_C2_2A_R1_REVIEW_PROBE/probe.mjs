import {fixture,open,AUTH} from './fixture.mjs';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
const f=await fixture(); f.suppressTimers=true;
f.backing.local[AUTH].credentials.accessTokenExpiresAt=new Date(f.clock.wall-1).toISOString();
f.fetch=async()=>new Response(JSON.stringify({error:{code:'BOOTSTRAP_UNAVAILABLE'}}),{status:503});
const call=await open(f);
let outcome;try{const r=await call('bootstrapWithPolicy',{detectedAi:{family:'chatgpt',surface:'web',variant:null}});outcome={source:r.source,freshness:r.freshness};}catch(e){outcome={error:e.code||e.message};}
const bytes=fs.readFileSync(new URL('./client.js',import.meta.url));
const result={case:'refresh503_must_not_be_bootstrap503',outcome,paths:f.network.map(r=>new URL(r.url).pathname),clientGitBlob:createHash('sha1').update(Buffer.concat([Buffer.from('blob '+bytes.length+'\0'),bytes])).digest('hex')};
fs.writeFileSync(new URL('./probe-result.json',import.meta.url),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result,null,2));
