import fs from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { predict, rawPredict, keywordPredict, rawKeywordPredict, validateModel, ROUTING_VERSION } from '../dist/core.js';

const root = new URL('../', import.meta.url);
const read = async name => fs.readFile(new URL(name, root), 'utf8');
const datasetText = await read('data/examples.json');
const challengeText = await read('data/challenge.json');
const modelText = await read('dist/model.json');
const routingText = await read('dist/core.js');
const baseline = JSON.parse(await read('data/baseline-evaluation.json'));
const model = validateModel(JSON.parse(modelText));
const dataset = JSON.parse(datasetText);
const challenge = JSON.parse(challengeText);
const regression = dataset.families.filter(f => f.split === 'test').flatMap(f => f.examples.map(([language, text], i) => ({ id: f.id + '-' + i, family: f.id, expected: f.label, language, text })));

function evaluate(cases) {
  return cases.map(row => {
    const learned = predict(row.text, model);
    const keyword = keywordPredict(row.text);
    return {
      ...row,
      model: learned.category,
      keyword: keyword.category,
      rawModel: rawPredict(row.text, model).category,
      rawKeyword: rawKeywordPredict(row.text).category,
      modelReason: learned.reason,
      keywordReason: keyword.reason
    };
  });
}

function summary(rows, method) {
  const clear = rows.filter(row => row.expected !== 'uncertain');
  const unclear = rows.filter(row => row.expected === 'uncertain');
  return {
    clearTotal: clear.length,
    correctClear: clear.filter(row => row[method] === row.expected).length,
    uncertainTotal: unclear.length,
    correctUncertain: unclear.filter(row => row[method] === 'uncertain').length,
    confidentWrong: rows.filter(row => row[method] !== 'uncertain' && row[method] !== row.expected).length,
    deferredClear: clear.filter(row => row[method] === 'uncertain').length,
    languages: Object.fromEntries([...new Set(rows.map(row => row.language))].map(language => {
      const subset = rows.filter(row => row.language === language);
      return [language, { total: subset.length, correct: subset.filter(row => row[method] === row.expected).length }];
    }))
  };
}

const rows = evaluate(regression);
const freshRows = evaluate(challenge.cases);
const hash = text => createHash('sha256').update(text).digest('hex');
const originalErrors = baseline.rows.filter(row => row.model !== 'uncertain' && row.model !== row.expected);
const report = {
  version: 1,
  routingVersion: ROUTING_VERSION,
  datasetSha256: hash(datasetText),
  modelSha256: hash(modelText),
  routingSha256: hash(routingText),
  challengeSha256: hash(challengeText),
  provenance: dataset.provenance,
  evaluationScope: 'Original test cases are now known regression cases. Fresh cases were authored before implementing the safeguards, excluded from training, and evaluated after the policy was frozen. Same-author synthetic cases require independent validation.',
  reviewStatus: 'Automated checks only. Bilingual peer and educator review pending. No learner trial.',
  splitCounts: Object.fromEntries(['train', 'dev', 'test'].map(split => [split, dataset.families.filter(f => f.split === split).reduce((n, f) => n + f.examples.length, 0)])),
  model: summary(rows, 'model'),
  keyword: summary(rows, 'keyword'),
  originalBaseline: { model: baseline.model, keyword: baseline.keyword },
  knownErrors: originalErrors.map(row => ({ id: row.id, before: row.model, after: rows.find(current => current.id === row.id).model, expected: row.expected })),
  challenge: {
    provenance: challenge.provenance,
    model: summary(freshRows, 'model'),
    keyword: summary(freshRows, 'keyword'),
    rawModel: summary(freshRows, 'rawModel'),
    rawKeyword: summary(freshRows, 'rawKeyword'),
    rows: freshRows
  },
  rows
};
await fs.writeFile(new URL('dist/evaluation.json', root), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({ regression: { model: report.model, keyword: report.keyword }, knownErrors: report.knownErrors, fresh: { model: report.challenge.model, keyword: report.challenge.keyword } }, null, 2));
