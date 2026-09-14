from run_package_audit import audit
from pathlib import Path
import sys,json,shutil,tempfile,os
root=Path(sys.argv[1]).resolve();out=Path(sys.argv[2]).resolve();out.mkdir(parents=True,exist_ok=False)
rows=audit(root)
mutations=[('STALE-CONTROLLER','popup_runtime.js','/* stale */'),('REMOTE-CODE','popup.js',"eval('1');"),('VERSION-DRIFT','content_script.js',None),('PAGE-ACCESS','manifest.json',None),('PERMISSION-EXPANSION','manifest.json',None),('PROVIDER-REGISTRY-DRIFT','shared/wb_operations.js','\n/* unreviewed change */')]
for name,rel,extra in mutations:
 with tempfile.TemporaryDirectory(prefix='wb-package-negative-') as td:
  d=Path(td)/'source';shutil.copytree(root,d);p=d/rel
  if name=='STALE-CONTROLLER':p.write_text(extra)
  elif name=='VERSION-DRIFT':p.write_text(p.read_text().replace('const VERSION = "','const VERSION = "999.',1))
  elif name in ['PAGE-ACCESS','PERMISSION-EXPANSION']:
   m=json.loads(p.read_text())
   if name=='PAGE-ACCESS':m['externally_connectable']={'matches':['https://chatgpt.com/*']}
   else:m['permissions'].append('debugger')
   p.write_text(json.dumps(m))
  else:p.write_text(p.read_text()+extra)
  rejected=[r['id'] for r in audit(d) if r['status']=='FAIL'];rows.append({'id':'NEGATIVE:'+name,'status':'PASS' if rejected else 'FAIL','detail':{'rejected_by':rejected}})
(out/'results.jsonl').write_text(''.join(json.dumps(r)+'\n' for r in rows));summary={'passed':sum(r['status']=='PASS' for r in rows),'failed':sum(r['status']=='FAIL' for r in rows),'scope':'Canonical source security/dependency audit and six rejection controls; no provider calls'}
(out/'summary.json').write_text(json.dumps(summary,indent=2));print(summary,flush=True);sys.exit(bool(summary['failed']))
