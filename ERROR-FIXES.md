# Five routing failures and their fixes

Release 1.1 corrects the app's handling of all five known confident errors. The original classifier weights remain frozen. Shared evidence checks wrap its proposals and also protect the keyword fallback. Comparison views retain the raw proposals so that the effect of the safeguards is inspectable.

| Case | Original failure | Current behavior and mechanism |
| --- | --- | --- |
| `dt-2` — Neeche zyada likha hai matlab fraction zyada hai. | Numerator hint despite an explicit reference to the bottom number. | Denominator route. A clear bottom-number cue together with a larger-value claim takes precedence over a contradictory character-pattern proposal. |
| `ut-4` — कल lunch में क्या मिलेगा? | Denominator hint for unrelated text. | Clarification. Familiar character sequences are insufficient without supported maths-topic evidence. |
| `ut-5` — The top is smaller but the bottom is larger and I cannot decide. | Numerator hint despite explicit uncertainty. | Clarification. An expressed inability to decide is checked before selecting a specific teaching category. Mixed roles without a method also trigger clarification. |
| `ut-6` — मैं कभी अंश देखता हूँ कभी हर, अभी तय नहीं कर पा रहा। | Numerator hint for mixed reasoning and uncertainty. | Clarification. Hindi uncertainty cues and mixed numerator/denominator roles receive the same safeguards. |
| `ut-7` — I don't believe a larger denominator always means a larger fraction, but I have no method yet. | Treating a rejected belief as the learner's belief. | Clarification. The absence of a method triggers a follow-up. A separate negated-claim check also defers supported denial phrases, including cases without an uncertainty phrase. |

These rules operate on cue families across English, Hindi and common Romanized Hindi. They do not contain exact matches for these five sentences. Explicit exclusions in a complex sentence, unfamiliar transliterations, and unseen concepts can still be misunderstood.

## Verification

- Seventeen automated test groups pass: eleven core groups and six interface/session groups. See `docs/latest-test-run.txt` for the recorded run.
- All five original cases were entered through the normal app form and produced the intended visible route. Results are in `docs/error-routing-checks.json`.
- Both the model and the keyword fallback use the same evidence checks.
- Original test cases are now labeled as known regression cases.
- A 32-case challenge set was authored and frozen before implementation, excluded from training, and evaluated after the policy was frozen.
- Raw proposals, policy reasons, final routes, and fingerprints are retained in `dist/evaluation.json`.

| Measure | Known regression set | New authored challenge set |
| --- | --- | --- |
| Correct clear routes, model + checks | 15 / 16 | 15 / 16 |
| Correct uncertain deferrals | 8 / 8 | 16 / 16 |
| Confident wrong routes | 0 / 24 | 0 / 32 |
| Clear cases deferred | 1 / 16 | 1 / 16 |

The challenge set is same-author synthetic material. The observed zero error count is limited to these sets. Independent bilingual labeling, educator review, and classroom effectiveness remain unverified. A deferred clear explanation requires a follow-up or tutor selection. Raising the confidence threshold alone cannot resolve arbitrary semantic errors.

## Remaining known clarification cases

These are the two clear authored explanations that the checked model currently defers. They are not browser exceptions. The expected categories below are authored labels awaiting independent review.

| Case | Explanation | Authored category | Current result | Practical response |
| --- | --- | --- | --- | --- |
| `nt-0` — known regression set | The size of each part does not matter to me; I picked the one with more parts selected. | Numerator | Clarification; evidence was insufficient for a specific route. The keyword method also defers. | Ask what the top and bottom numbers mean. If the meaning is clear, a tutor can select the numerator teaching card. |
| `c12` — new authored challenge set | दोनों portions के starting wholes अलग आकार के थे। | Size of the whole | Clarification; the raw model proposed `reasoned`, and the evidence check rejected that unsupported category. The checked keyword method selects `whole`. | Ask whether the original wholes were equal. A tutor can select the whole-size card after reviewing the explanation. |

These are the observed clear-case deferrals in the two authored sets, not a complete list of explanations the model may misunderstand. The raw classifier remains frozen and still has weaknesses; the safeguards correct or defer its final teaching decisions. A learner can sometimes resolve a deferral by adding detail. Persistent ambiguity or an inappropriate hint needs tutor judgment.

## Interface issues addressed during the redesign

| Issue | Implemented handling | Verification location |
| --- | --- | --- |
| Fresh-practice shortcut reopened a completed first attempt | Completed results remain completed; the shortcut does not rewrite them as an unassisted first attempt. | `tests/experience.test.mjs` |
| Fraction-bar shortcut showed no bars during independent practice | Opens a clearly labeled authored sample with bars and a return path. | Experience tests and browser checks |
| Samples replaced unfinished learner work | The first sample saves a temporary return point; Return to my session restores it. | Experience tests and browser checks |
| Hindi shortcut implied a new example but only switched the interface | Renamed Open the Hindi workspace; current learner work is retained. | Source review and bilingual browser check |
| Tour section scrolling took keyboard focus away from the tour | Scrolling and focus are coordinated; the current tour heading receives focus. | `docs/redesign-checks.json` |
| Tour panel could exceed a short screen | Viewport-bounded height and internal scrolling keep controls reachable. | 740 × 360 landscape browser check |
| All architecture tabs were initially keyboard tab stops | Only the selected tab is in the tab sequence; arrow keys change selection. | Source review and keyboard browser check |
| Some Hindi accessible names remained English | Navigation, progress, dialog controls and fraction-bar descriptions were translated. | Source review and Hindi browser check |

## Where the logs and evidence are

| File | What it contains |
| --- | --- |
| [`data/baseline-evaluation.json`](data/baseline-evaluation.json) | Preserved original evaluation, including the classifier failures before safeguards. |
| [`dist/evaluation.json`](dist/evaluation.json) | Case-by-case expected labels, raw model/keyword proposals, checked routes, decision reasons, aggregate results and release fingerprints. |
| [`docs/error-routing-checks.json`](docs/error-routing-checks.json) | Expected and visibly observed routes for all five original failures, with pass flags. |
| [`docs/redesign-checks.json`](docs/redesign-checks.json) | Interface checks, screen sizes, limitations, and captured browser warning/error entries. The final captured list is empty. |
| [`docs/latest-test-run.txt`](docs/latest-test-run.txt) | Actual automated-test output with run timestamp and exit status. |
| [`QA.md`](QA.md) | Test scope, manual browser verification and checks still pending. |

These are saved development and evaluation records. There is no continuous production error collector, learner-response log, or complete archive of development stack traces. An empty final browser log means no warnings or errors were captured in that checked run; it is not proof that every future browser session will be error-free.

## Work requiring human judgment or account ownership

| Item | Who should act | Required action or completion evidence |
| --- | --- | --- |
| Persistent clarification, conflicting methods, or an inappropriate hint | Tutor/teacher | Review the learner's meaning, ask a follow-up, and choose an appropriate card. Include `nt-0` and `c12` in review. A confident unfamiliar-input mistake may not be automatically detected. |
| English/Hindi/Hinglish wording and category labels | Independent bilingual reviewer and maths educator | Review translations, mathematical meaning, examples and every teaching card; record corrections and disagreements. The current authored labels are not independent ground truth. |
| Whether the tutor improves learning | Educator/research lead, with appropriate permissions | Design and conduct representative learner testing and a delayed unaided assessment. Software tests cannot establish this outcome. |
| Accessibility with real assistive tools and learning needs | Accessibility reviewer and representative users | Check keyboard and screen-reader behavior, zoom, readability and reduced-motion preferences. Automated and source checks provide partial coverage only. |
| Publication and final hackathon submission | Repository/account owner | Publish to the intended account, verify signed-out access and submit the actual links. The current ZIP is prepared locally. |

Further engineering checks can be performed by a developer: independent security review, formal performance measurement, other browsers/devices, hosted deployment checks and continued model evaluation. These are pending verification tasks, not confirmed defects. Model/content changes should retain provenance and be evaluated on fresh independently labeled data.

Adding licensed font assets later is an optional visual improvement, not a learner-facing failure requiring a teacher.

