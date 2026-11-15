# Verification record

Verified on 15 November 2026 using the local Node server and the in-app Chromium browser. This record describes the built prototype.

## Automated verification

Run `npm test` for seventeen test groups (eleven core checks and six experience checks).

- Exact fraction comparisons across 24,336 bounded pairs, checked against BigInt reference arithmetic.
- Invalid denominators and unsupported inputs rejected.
- Python and JavaScript raw-classifier decisions agree on every original authored example.
- The two signature explanations choose different routes.
- Short, excessive and unfamiliar symbol inputs can defer.
- Reasoning categories cannot override the numeric answer.
- Malformed model/content rejected.
- Duplicate authored explanations rejected.
- Evaluation hashes match the exact model and dataset bytes.

The original raw classifier had five confident errors on 24 authored test cases. Those cases are now a known regression set. Release 1.1 adds shared evidence checks while preserving the classifier weights. Current results are 15/16 clear routes correct, 8/8 uncertain cases deferred, zero confident wrong routes and one clear deferral. On a separate 32-case authored challenge set frozen before implementation, results are 15/16 clear routes correct, 16/16 uncertain cases deferred, zero confident wrong routes and one clear deferral. These sets require independent human validation.

## Browser checks completed

- Desktop practice layout, hint view and fraction bars.
- Mobile layout at a 390-pixel viewport, including Hindi rendering. Preview saved in `docs/mobile-hi.jpg`.
- Both authored signature examples and their distinct follow-up questions.
- Fresh-pair first answer submitted and exact comparison displayed.
- Language switching preserves the active session and learner text.
- Empty answer submission displays a validation error.
- A typed HTML/script-like string is displayed literally, with no image element created in the quote.
- Comparison dialog opens and closes.
- Tutor card selection overrides the suggestion and is labeled as tutor-selected.
- Uncertain input requests clarification. Repeated uncertainty offers a usable teaching-card path and fresh practice.
- Reset returns to the original question with an empty explanation.
- Removing `model.json` temporarily activates the explicitly labeled keyword fallback. The model was restored.
- Removing `content.json` temporarily shows a reload message. Restoring the file and reloading recovers the full app.
- Evidence view shows counts, language breakdowns, individual cases and JSON links.
- Browser console check after recovery returned no error/warning entries.

`docs/desktop.jpg` shows a completed teaching-card screen. Source inspection confirms same-origin assets, text-safe insertion of learner input, no remote inference endpoint and no response storage. A full network trace and external penetration test were not performed.

## Release 1.1 checks

- All five original failures were typed into the app and produced the intended visible hint or clarification.
- Both comparison cards expose the raw proposal, evidence-check reason and final route.
- The Evidence view separates the original 24 regression cases and 32 new challenge cases.
- Regression tests cover the original failures, keyword fallback protection, fresh challenge cases, and report/model/policy/data fingerprints.
- The 32 new cases were authored before the safeguard implementation and were excluded from training.
- The live UI checks are recorded in `docs/error-routing-checks.json`.

## Publication status

The package is prepared for direct upload to an entrant-owned GitHub repository. It includes a root entry page, `.nojekyll`, relative app assets, and a publishing guide. Remote repository creation and publication remain in the entrant's account. The local project also retains ignored preview metadata, excluded from the GitHub upload package.

## Remaining validation

- Independent bilingual review of wording and labels.
- Educator review of teaching responses.
- Representative learner explanations, including more negation and unknown concepts.
- Delayed unaided learning assessment with appropriate permissions.
- GitHub Actions execution in an actual entrant-owned repository.
- Signed-out access checks on a published judge URL.

The application is an experimental teaching aid with known model errors. Human review remains necessary.

## Premium interface verification — 15 November 2026

The redesign preserves the evaluated core, model, dataset and content files. The new automated experience tests verify escaped preview text, release-derived metrics, distinct architecture IDs, bilingual examples using real checked routing, seven tour steps totaling 180 suggested seconds, complete tour-session restoration, reversible samples, completed-attempt protection, labeled missing-model fallback, and missing-content recovery. The small session harness complements browser checks; it does not simulate a real browser layout.

Browser checks used the local Chromium preview at the default desktop size, 390 × 844 mobile, and 740 × 360 landscape. Verified: both themes; Hindi display; empty-input validation; different A/B preview questions; workspace navigation; model and keyword comparison dialog; tutor override; independent first attempt and exact result; collapsible sidebar; all seven tour steps; original text, answer and language restored on tour exit; sample return; fraction-bar shortcut; keyboard architecture selection; tour-heading focus; and a bounded tour panel on a short screen. No horizontal document overflow was observed at those tested sizes.

Screenshots: `docs/redesign-home.jpg`, `docs/redesign-workspace.jpg`, `docs/redesign-mobile-hi.jpg`, and `docs/redesign-light.jpg`. The final browser warning/error log is recorded in `docs/redesign-checks.json`. Reduced-motion handling is verified in the CSS; operating-system preference emulation was not performed. This is not a complete screen-reader or WCAG audit.

The requested web-font download could not be completed because automatic approval review reached its usage limit. The app therefore uses local font definitions and system fallbacks, preserving its same-origin policy and avoiding runtime font downloads. No new dependencies were added. No cloud account, database or remote inference path was introduced.
