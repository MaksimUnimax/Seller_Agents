"""Static package/dependency/security audit; complements executable behavior gates."""
import json,re,hashlib,subprocess,sys,os
from pathlib import Path
HERE=Path(__file__).resolve().parents[1]
def audit(root):
 root=Path(root).resolve();rows=[]
 def check(id,ok,detail=None):rows.append({'id':id,'status':'PASS' if ok else 'FAIL','detail':detail})
 expected=json.loads((HERE/'PRODUCTION_FILE_LIST.json').read_text())['files'];actual=sorted(p.relative_to(root).as_posix() for p in root.rglob('*') if p.is_file())
 check('EXACT-CANONICAL-FILE-LIST',actual==expected,{'unexpected':sorted(set(actual)-set(expected)),'missing':sorted(set(expected)-set(actual))});check('NO-SYMLINKS',not any(p.is_symlink() for p in root.rglob('*')))
 if actual!=expected:return rows
 manifest=json.loads((root/'manifest.json').read_text());base=json.loads((HERE/'RECOVERED_SOURCE_MANIFEST.json').read_text())
 check('MV3-MANIFEST',manifest['manifest_version']==3)
 baseline=json.loads((HERE/'tests/fixtures/wb024_manifest.json').read_text())
 check('PERMISSIONS-BASELINE',manifest['permissions']==baseline['permissions']);check('HOSTS-BASELINE',manifest['host_permissions']==baseline['host_permissions']);check('CONTENT-ORIGINS-BASELINE',[c['matches'] for c in manifest['content_scripts']]==[c['matches'] for c in baseline['content_scripts']])
 check('NO-PAGE-SECRET-BRIDGE',not manifest.get('externally_connectable') and not manifest.get('web_accessible_resources'))
 check('NO-REMOTE-CSP',not manifest.get('content_security_policy') or manifest['content_security_policy']=={"extension_pages":"script-src 'self'; object-src 'self'"})
 version=manifest['version'];check('SEMVER',bool(re.fullmatch(r'\d+\.\d+\.\d+',version)))
 versions={'service_worker.js':r'const VERSION = "([^"]+)"','content_script.js':r'const VERSION = "([^"]+)"','shared/wb_contract.js':r'VERSION="([^"]+)"','shared/runtime_names.js':r'version: "([^"]+)"','popup.html':r'id="versionBadge">v([^<]+)','shared/wb_guidance.js':r'RUNTIME\?\.version \|\| "([^"]+)"'}
 for name,pattern in versions.items():
  v=re.search(pattern,(root/name).read_text());check('VERSION:'+name,v is not None and v[1]==version)
 for name in actual:
  text=(root/name).read_text()
  check('NO-REMOTE-CODE:'+name,not re.search(r'\beval\s*\(|new\s+Function\s*\(|onMessageExternal|api-seller\.ozon\.ru|api-performance\.ozon\.ru|https?://[^\s"\']+\.js["\']',text))
  check('NO-EMBEDDED-CREDENTIAL:'+name,not re.search(r'eyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{15,}|-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----',text))
  if name.endswith('.js'):
   r=subprocess.run(['node','--check',str(root/name)],capture_output=True,text=True);check('SYNTAX:'+name,r.returncode==0,r.stderr or None)
 # Traverse only declared local executable/stylesheet dependencies. A stale
 # unreferenced controller or dynamic/remote import fails this closure check.
 seeds=['manifest.json',manifest['background']['service_worker'],manifest['action']['default_popup']]+[x for c in manifest['content_scripts'] for x in c['js']]
 graph={};visited=set();queue=list(seeds)
 while queue:
  name=queue.pop()
  if name in visited:continue
  visited.add(name);text=(root/name).read_text();refs=[]
  if name.endswith('.html'):refs+=re.findall(r'<(?:script|link)[^>]+(?:src|href)="([^"#]+)"',text)
  for call in re.findall(r'importScripts\(([^)]*)\)',text):
   args=re.findall(r'["\']([^"\']+)["\']',call);check('STATIC-IMPORT:'+name, bool(args) and re.sub(r'["\'][^"\']+["\']|[,\s]','',call)=='');refs+=args
  for ref in refs:check('LOCAL-DEPENDENCY:'+name+':'+ref,ref in expected)
  graph[name]=refs;queue.extend(x for x in refs if x in expected)
 check('NO-UNREACHABLE-PACKAGED-FILES',visited==set(expected),sorted(set(expected)-visited))
 for name in ['shared/wb_credentials.js','shared/wb_operations.js']:
  check('PROVIDER-AUTHORITY-BYTES:'+name,(root/name).read_bytes()==(HERE/'tests/fixtures/wb024_provider'/name).read_bytes())
 old=(HERE/'tests/fixtures/wb024_provider/shared/wb_contract.js').read_text();new=(root/'shared/wb_contract.js').read_text()
 check('CONTRACT-ONLY-VERSION-DELTA',re.sub(r'VERSION="[^"\n]+"','VERSION="VERSION"',old)==re.sub(r'VERSION="[^"\n]+"','VERSION="VERSION"',new))
 return rows
if __name__=='__main__':
 root=Path(sys.argv[1]);out=Path(sys.argv[2]);out.mkdir(parents=True,exist_ok=False);rows=audit(root)
 (out/'results.jsonl').write_text(''.join(json.dumps(r)+'\n' for r in rows));summary={'passed':sum(r['status']=='PASS' for r in rows),'failed':sum(r['status']=='FAIL' for r in rows),'scope':'Exact production file graph, syntax, versions, manifest, static security plus preserved provider authority; behavioral gates separate'}
 (out/'summary.json').write_text(json.dumps(summary,indent=2));print(summary);print([r for r in rows if r['status']=='FAIL']);sys.exit(bool(summary['failed']))
