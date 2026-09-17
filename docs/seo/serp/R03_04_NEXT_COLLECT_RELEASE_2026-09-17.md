# R03 next collect release after second timing guard

Date: 2026-09-17.  
Status: **ONE FURTHER COLLECT RELEASED**.

Evidence basis:

- R03 start: PASS / persisted / readback;
- R03 submit: accepted once / persisted / readback;
- authoritative operation: `spr8vij9p1s7cijt2chi`;
- first R03 collect: local `NO_DUE_OPERATIONS`, no provider call;
- second R03 collect: local `NO_DUE_OPERATIONS`, no provider call;
- second not-due raw envelope persisted losslessly and remote-read back;
- second not-due analysis remote-read back;
- state remains `WAITING=1`, `polls_started=0`, `unresolved=1`, `revision=2`.

Exactly one further bounded collect is authorized:

```text
SEARCH_ASYNC_BATCH_API_V1 {"action":"collectN","jobId":"octoport-serp-r03-20260917","count":1}
```

No new start, no submit, no export and no R04 action is authorized until the returned collect envelope is persisted and remotely read back.
