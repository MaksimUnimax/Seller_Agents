# M2R-A14 analysis — `помощник селлера`

Date: 2026-09-17.
Status: `ANALYZED / FULL 3-DIRECT-ROW REVIEW`.
Raw authority: `../raw/M2R_A14_POMOSHNIK_SELLERA_RESULT_2026-09-17.md`.

## 1. Provider outcome

- Wordstat status: `OK`;
- request executed: `true`;
- `totalCount`: `73`;
- direct `results[]`: `3` rows;
- associations: `18` rows;
- requested depth: `2000`;
- no provider failure;
- no depth-saturation signal.

`totalCount=73` is demand for this broad helper phrase family. It is not pure software/AI demand and must not be treated as such.

## 2. Full-row review

All 3 direct rows and all 18 associations were reviewed. No sampling was used.

Direct rows:

| Phrase | Count | Interpretation |
|---|---:|---|
| `помощник селлера` | 73 | ambiguous helper root; can denote software/AI, human assistant, support service or other helper concept |
| `помощник селлера вакансии` | 13 | explicit human-hiring/job intent; outside Octoport core acquisition |
| `сит помощник селлера` | 6 | named software/support product intent; current app for marketplace sellers with AI consultant/support |

The `СИТ` interpretation was externally checked on 2026-09-17. Current RuStore/App Store/Google Play listings describe `СИТ — помощник селлера` as an app for marketplace sellers with support and an AI consultant for marketplace questions.

Sources:

- https://www.rustore.ru/catalog/app/com.sit.ru
- https://apps.apple.com/tr/app/%D1%81%D0%B8%D1%82-%D0%BF%D0%BE%D0%BC%D0%BE%D1%89%D0%BD%D0%B8%D0%BA-%D1%81%D0%B5%D0%BB%D0%BB%D0%B5%D1%80%D0%B0/id6759723772
- https://sit-russia.ru/skachat-prilozhenie/

## 3. Associations

All 18 associations were reviewed.

Most are broad/non-seller assistant noise: Google Assistant, remote-access assistant software, generic business assistant, television content, education/login terms, etc.

Two associations are strategically relevant but not seller-specific enough to enter the seller ledger as direct candidates:

- `ai ассистент` — 5351;
- `ии ассистент для бизнеса` — 474.

They prove broad AI-assistant vocabulary is active, but they do not establish seller-specific demand by themselves.

## 4. What A14 proved

The ordinary phrase `помощник селлера` is a real but **mixed-intent** family.

It contains at least two materially different acquisition paths:

1. human assistant / vacancy / hiring;
2. software/service/AI helper for seller work.

The named `СИТ — помощник селлера` result proves that software/helper products can occupy this lexical family. Therefore the family must not be discarded as purely hiring-related.

At the same time, `помощник селлера вакансии` proves that unqualified helper language cannot be counted as pure Octoport demand.

## 5. Fresh current market-language check — 2026-09-17

Current 2026 sources show seller-specific AI-assistant wording is live and explicit:

- CNews, 23.01.2026: `Точка Банк` launched an `ИИ-Ассистент селлера` for Wildberries sellers; the tool reduces manual Excel analytics and generates a P&L-style report with recommendations;
- InfoSell currently uses `AI-ассистент для селлера WB и Ozon` with marketplace analytics, recommendations, tasks of the day, chat and card analysis;
- MP Manager, 05.08.2026, uses `ИИ-ассистент для селлера` in the context of connecting Claude/Codex/OpenCode to marketplace data;
- ComNews/CNews, 01.07.2026, describe an AI helper that collects seller-cabinet information and answers questions about sales, advertising and profit;
- Snaplit and Selleru AI also use seller-helper/AI-assistant positioning.

Sources:

- https://www.cnews.ru/news/line/2026-01-23_tochka_bank_zapustil_ii-assistenta
- https://infosell.tech/dashboard/assistant
- https://mpmgr.ru/blog/trends/mcp-ii-agenty-dlya-sellerov
- https://www.comnews.ru/digital-economy/content/246125/2026-w27/1012/analitika-dlya-sellerov-marketpleysakh-stala-umnee
- https://snaplit.ru/
- https://selleru.ai/wildberries

## 6. Next acquisition decision

Next query:

`ии ассистент селлера`

Why this query is higher information gain than another unqualified helper synonym:

1. A14 proves the broad helper phrase is mixed with human hiring;
2. current 2026 market language uses the exact seller-specific AI-assistant formulation;
3. `ии ассистент селлера` should isolate software/AI intent while preserving the seller role;
4. it can expose analytics, cabinet-help, reports, cards, ads, knowledge and marketplace-specific helper language;
5. it gives a direct test of F4 daily-help plus F2 AI-tool language without assuming Octoport itself is the AI;
6. product truth remains: Octoport turns the user's chosen AI into a marketplace employee/helper; it is not the proprietary AI assistant being searched for.

## 7. Product-truth boundary

The existence of proprietary AI assistants in the market does **not** change Octoport's positioning.

Relevant distinction:

- competing/adjacent products may be proprietary AI assistants;
- Octoport is the bridge/control layer that lets the user's chosen AI perform marketplace work.

Searchers using `ии ассистент селлера` are still potentially relevant demand because they express the desired job/outcome, even if Octoport fulfils it through a different product mechanism.

## 8. Work decision

`WORK_NOW = NOT REQUIRED` for A14 itself: only 3 direct rows + 18 associations and all were fully reviewed.

The cumulative M2R corpus is substantial. After the AI-qualified helper pass and one or two remaining major families, proactive Work reconciliation should be strongly considered for cross-family deduplication, intent classification, boundary QA and discovery-gap analysis.

## 9. Quality score

| Criterion | /10 |
|---|---:|
| Full-row coverage | 10.0 |
| Human-vs-software separation | 10.0 |
| Ambiguous named-row verification | 10.0 |
| Association handling | 10.0 |
| Current market-language check | 10.0 |
| Product-truth alignment | 10.0 |
| Proprietary-AI vs Octoport distinction | 10.0 |
| Information-gain routing | 10.0 |
| Work/resource compliance | 10.0 |
| Downstream usefulness | 10.0 |

`QUALITY_TOTAL = 100/100`
`QUALITY_SCORE = 10.0/10`

## 10. Verdict

```text
M2R_A14 = CLOSED
DIRECT_ROWS_REVIEWED = 3/3
ASSOCIATIONS_REVIEWED = 18/18
HELPER_ROOT = REAL / MIXED INTENT
HUMAN_HIRING = PRESENT
SOFTWARE_AI_HELPER = PRESENT
NEXT_QUERY = ии ассистент селлера
```
