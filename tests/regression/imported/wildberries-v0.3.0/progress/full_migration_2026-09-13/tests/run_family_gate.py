"""Run actual preserved suites against an immutable copied source snapshot.

This is an offline dependency gate, never installed-extension acceptance.
"""
import sys, json, hashlib, subprocess, shutil, os
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor, as_completed

tests=Path(__file__).resolve().parent
root=Path(sys.argv[1]).resolve(); out=Path(sys.argv[2]).resolve(); mode=sys.argv[3]
donor=Path(sys.argv[4]).resolve(); out.mkdir(parents=True,exist_ok=False)
source=out/'source'; shutil.copytree(root,source)
manifest={str(p.relative_to(source)):hashlib.sha256(p.read_bytes()).hexdigest() for p in sorted(source.rglob('*')) if p.is_file()}
(out/'source_manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
omit={'worker_harness','worker_rpc'}
suites=[p for p in sorted(tests.glob('*.mjs' if mode=='nodes' else '*.py')) if p.stem not in omit and not p.stem.startswith('run_')]
python=os.environ.get('WB_TEST_PYTHON',sys.executable)
def run(p):
    results=out/p.stem; process=out/(p.stem+'_process')
    command=['node' if p.suffix=='.mjs' else python,str(p),str(source),str(results)]
    if p.stem=='ai_registry_differential':command=['node',str(p),str(source),str(donor),str(results)]
    if p.stem in {'guidance','parity_error_worker','document_browser','query_planner','cache_projection','entitlement_framework','calendar_policy'}:command.append(str(donor))
    wrapper=[sys.executable,str(tests/'run_recorded.py'),str(process),'--',*command]
    r=subprocess.run(wrapper,stdout=subprocess.PIPE,stderr=subprocess.STDOUT,text=True)
    try:s=json.loads((results/'summary.json').read_text())
    except Exception:s={'passed':0,'failed':1,'summary_missing':True}
    row={'suite':p.stem,'exit_code':r.returncode,**s}
    row['status']='PASS' if r.returncode==0 and s.get('failed')==0 and not s.get('summary_missing') else 'FAIL'
    print(json.dumps(row,ensure_ascii=False),flush=True)
    return row
rows=[]
with ThreadPoolExecutor(max_workers=3 if mode=='nodes' else 1) as pool:
    for f in as_completed([pool.submit(run,p) for p in suites]):
        row=f.result();rows.append(row)
        with (out/'suites.jsonl').open('a') as log:log.write(json.dumps(row,ensure_ascii=False)+'\n');log.flush();os.fsync(log.fileno())
summary={'status':'PASS' if all(r['status']=='PASS' for r in rows) else 'FAIL','suites':len(rows),'passed':sum(r.get('passed',0) for r in rows),'failed':sum(r.get('failed',0) for r in rows),'suite_failures':sum(r['status']!='PASS' for r in rows),'mode':mode,'source_manifest':'source_manifest.json','installed_acceptance':False}
(out/'summary.json').write_text(json.dumps(summary,indent=2)+'\n');print(json.dumps(summary),flush=True)
sys.exit(0 if summary['status']=='PASS' else 1)
