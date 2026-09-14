import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {webcrypto, createHash} from 'node:crypto';

// Diagnostic reproduction for the exact frozen source; it asserts the known gap.
const root=process.argv[2];
if(!root) throw new Error('Usage: node probe-wb-retention.mjs <WB-runtime-directory>');
const file=root+'/shared/artifact_store.js';
const source=fs.readFileSync(file,'utf8');
assert.equal(createHash('sha256').update(source).digest('hex'), '3a0ca403e4a77f3ec179a9c1bb5160a2d41348d16bd28ec710418bfd549c42f0', 'Unexpected source; this reproduction is pinned to WB 0.3.0');
if(!globalThis.crypto)globalThis.crypto=webcrypto;
vm.runInThisContext(source,{filename:file});
let at=1700000000000;
const records=new Map();
const backend={get:async ref=>records.get(ref),put:async r=>records.set(r.ref,r),remove:async ref=>records.delete(ref),all:async()=>[...records.values()]};
const owner={conversation_key:'fixture:conversation',binding_id:'fixture-binding',binding_revision:1,account_scope:'a'.repeat(64)};
const store=WBArtifactStore.create({backend,now:()=>at,uuid:()=> '00000000-0000-4000-8000-000000000001'});
const d=await store.put(new TextEncoder().encode('synthetic retention probe'),owner,{name:'fixture.txt',mime:'text/plain'});
const ttl=d.expires_at-at;
assert.equal(ttl,86400000);
at+=3600001;
assert.equal((await store.read(d.ref,owner)).filename,'fixture.txt');
const result={source_commit:'006af2724aafdf6589c16881c1ed06eb01cca281',source_path:'tooling/llm-api-bridges/wildberries/extension/shared/artifact_store.js',source_sha256:createHash('sha256').update(source).digest('hex'),probe:'unchanged WBArtifactStore.create default; in-memory storage backend, synthetic clock and payload',observed_default_ttl_ms:ttl,read_after_3600001_ms:'SUCCEEDED',required_target_max_ttl_ms:3600000,verdict:'CONFIRMED_TARGET_REQUIREMENT_GAP',runtime_modifications:0,provider_calls:0,scope:'Proves default module lifetime; production caller review separately confirms original-file, quarantine and generated-text callers omit expiresAt. Not installed UI acceptance.'};
console.log(JSON.stringify(result,null,2));
