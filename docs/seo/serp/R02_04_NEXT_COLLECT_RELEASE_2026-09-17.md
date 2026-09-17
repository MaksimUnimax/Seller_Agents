# R02 next collect release after second timing guard

Date: 2026-09-17.  
Status: **ONE FURTHER COLLECT RELEASED**.

Evidence basis:

- first R02 collect: local `NO_DUE_OPERATIONS`, no provider call;
- second R02 collect: local `NO_DUE_OPERATIONS`, no provider call;
- second raw envelope persisted losslessly and remote-read back;
- second analysis remote-read back;
- accepted operation remains `sprg1vmblbk160ogsha3`;
- state remains `WAITING=1`, `polls_started=0`, `revision=2`.

Exactly one further bounded collect is authorized:

```text
SEARCH_ASYNC_BATCH_API_V1 {"action":"collectN","jobId":"octoport-serp-r02-20260917","count":1}
```

No new start, no submit, no export and no R03 action is authorized until the returned collect envelope is persisted and remotely read back.
