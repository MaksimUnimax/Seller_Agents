"""Persist a test process incrementally. Does not manufacture assertion totals."""
from pathlib import Path
import datetime
import json
import os
import subprocess
import sys
import threading

out = Path(sys.argv[1]).resolve()
out.mkdir(parents=True, exist_ok=False)
command = sys.argv[2:]
if command[:1] == ['--']:
    command = command[1:]
record = {'command': command, 'cwd': os.getcwd(),
          'started_at': datetime.datetime.now(datetime.timezone.utc).isoformat(),
          'browser_path': os.environ.get('WB_TEST_CHROMIUM'), 'status': 'RUNNING'}
(out / 'process.json').write_text(json.dumps(record, indent=2) + '\n')
process = subprocess.Popen(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE,
                           text=True, bufsize=1)

def drain(stream, name, target):
    with (out / name).open('w') as file:
        for line in stream:
            file.write(line)
            file.flush()
            os.fsync(file.fileno())
            target.write(line)
            target.flush()

threads = [threading.Thread(target=drain, args=(process.stdout, 'stdout.txt', sys.stdout)),
           threading.Thread(target=drain, args=(process.stderr, 'stderr.txt', sys.stderr))]
for thread in threads:
    thread.start()
code = process.wait()
for thread in threads:
    thread.join()
record.update(status='FINISHED', exit_code=code,
              finished_at=datetime.datetime.now(datetime.timezone.utc).isoformat())
(out / 'process.json').write_text(json.dumps(record, indent=2) + '\n')
sys.exit(code)
