const refine = (value, context) => {
    if (value.completedAt < value.startedAt) {
      context.addIssue({
        code: "custom",
        path: ["completedAt"],
        message: "completedAt must not precede startedAt",
      });
    }
    if (
      value.browserRuntime.family !== value.suite.scope.browserFamily ||
      value.browserRuntime.browserVersion !== value.suite.scope.browserVersion
    ) {
      context.addIssue({
        code: "custom",
        path: ["browserRuntime"],
        message: "runtime metadata does not match Health scope",
      });
    }
};
const cases = [
 ['valid-offset-order','2026-09-16T10:00:00+05:00','2026-09-16T06:00:00Z',true],
 ['invalid-offset-order','2026-09-16T06:00:00Z','2026-09-16T10:00:00+05:00',false],
 ['valid-fraction-order','2026-09-16T06:00:00Z','2026-09-16T06:00:00.100Z',true],
 ['invalid-fraction-order','2026-09-16T06:00:00.100Z','2026-09-16T06:00:00Z',false],
 ['equal-instant-offset','2026-09-16T10:00:00+05:00','2026-09-16T05:00:00Z',true],
 ['existing-utc-forward','2026-09-16T06:00:00.000Z','2026-09-16T06:00:01.000Z',true],
];
const results=cases.map(([name,startedAt,completedAt,expected])=>{
 const issues=[];
 refine({startedAt,completedAt,browserRuntime:{family:'chrome',browserVersion:'120.0.0.0'},suite:{scope:{browserFamily:'chrome',browserVersion:'120.0.0.0'}}},{addIssue:i=>issues.push(i)});
 return {name,startedAt,completedAt,deltaMs:Date.parse(completedAt)-Date.parse(startedAt),expectedAccepted:expected,actualAccepted:issues.length===0,issues};
});
console.log(JSON.stringify({head:'d8f5157696d137750176d1aa44aedf9c2116404e',scope:'verbatim context superRefine callback; not full Zod/mapper/DB execution',results},null,2));
