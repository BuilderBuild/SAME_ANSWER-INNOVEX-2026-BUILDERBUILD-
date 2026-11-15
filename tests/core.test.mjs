import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { compareFractions, predict, rawPredict, keywordPredict, normalize, validateContent, validateModel, validateReport, teachingCategory } from '../dist/core.js';

const load = async name => JSON.parse(await fs.readFile(new URL(`../${name}`, import.meta.url), 'utf8'));
const model = validateModel(await load('dist/model.json'));
const content = validateContent(await load('dist/content.json'));

test('exact arithmetic agrees with exhaustive supported fraction pairs', () => {
  for (let a = 0; a <= 12; a++) for (let b = 1; b <= 12; b++) for (let c = 0; c <= 12; c++) for (let d = 1; d <= 12; d++) {
    const difference = BigInt(a) * BigInt(d) - BigInt(c) * BigInt(b);
    assert.equal(compareFractions([a,b], [c,d]), difference > 0n ? 'left' : difference < 0n ? 'right' : 'equal');
  }
  assert.throws(() => compareFractions([1,0], [1,2]));
  assert.throws(() => compareFractions([1.5,3], [1,2]));
  assert.throws(() => compareFractions([1,101], [1,2]));
});

test('Python and JS agree on Unicode and model export for every example', async () => {
  const references = await load('data/python-predictions.json');
  for (const row of references) assert.equal(rawPredict(row.text, model).category, row.category, row.text);
});

test('all five previously confident errors have appropriate teaching routes', async () => {
  const baseline = await load('data/baseline-evaluation.json');
  const errors = baseline.rows.filter(row => row.model !== 'uncertain' && row.model !== row.expected);
  assert.equal(errors.length, 5);
  for (const row of errors) assert.equal(predict(row.text, model).category, row.expected, row.id);
});

test('shared evidence checks protect the keyword fallback as well', () => {
  for (const text of ['कल lunch में क्या मिलेगा?', 'My cousin is eight years old.', 'The top is smaller but the bottom is larger and I cannot decide.', 'मैं कभी अंश देखता हूँ कभी हर, अभी तय नहीं कर पा रहा।', "I don't believe a larger denominator always means a larger fraction, but I have no method yet."]) {
    assert.equal(predict(text, model).category, 'uncertain', text);
    assert.equal(keywordPredict(text).category, 'uncertain', text);
  }
  assert.equal(predict('NEECHE zyada likha hai matlab fraction zyada hai.', model).category, 'denominator');
  assert.equal(predict('Upar zyada hai isliye fraction bada hai.', model).category, 'numerator');
});

test('the signature explanations produce different teaching routes', () => {
  assert.equal(predict('I picked one eighth because eight is bigger than six.', model).category, 'denominator');
  assert.equal(predict('My eighth comes from a much bigger roti than your sixth.', model).category, 'whole');
  assert.equal(compareFractions([1,8], [1,6]), 'right');
});

test('empty, oversized and unfamiliar inputs can abstain', () => {
  for (const text of ['', 'हाँ', 'x'.repeat(301), '🦒🦒🦒🦒🦒🦒🦒🦒']) assert.equal(predict(text, model).category, 'uncertain');
  assert.equal(keywordPredict('hello there').category, 'uncertain');
  assert.equal(normalize('  यहाँ   आठ है  '), 'यहाँ आठ है');
});

test('correct-sounding reasoning cannot override exact maths', () => {
  assert.equal(teachingCategory('reasoned', 'left', content.questions[0]), 'conflict');
  assert.equal(teachingCategory('reasoned', 'right', content.questions[0]), 'reasoned');
});

test('incompatible content and model are rejected', () => {
  assert.throws(() => validateModel({ ...model, version: 99 }));
  assert.throws(() => validateContent({ ...content, hints: {} }));
  const broken = structuredClone(model);
  broken.weights.whole[0] = null;
  assert.throws(() => validateModel(broken));
});

test('original example families and normalized text are disjoint across splits', async () => {
  const data = await load('data/examples.json');
  const seen = new Set();
  for (const family of data.families) for (const [, text] of family.examples) {
    assert.ok(!seen.has(normalize(text)), 'Duplicate explanation');
    seen.add(normalize(text));
  }
});

test('published evidence matches the exact model and data files', async () => {
  const report = validateReport(await load('dist/evaluation.json'));
  for (const [path, key] of [['dist/model.json', 'modelSha256'], ['data/examples.json', 'datasetSha256'], ['dist/core.js', 'routingSha256'], ['data/challenge.json', 'challengeSha256']]) {
    const bytes = await fs.readFile(new URL(`../${path}`, import.meta.url));
    assert.equal(createHash('sha256').update(bytes).digest('hex'), report[key]);
  }
  assert.throws(() => validateReport({ version: 1, rows: [] }));
  assert.throws(() => validateReport({ ...report, challenge: null }));
  const invalidChallenge = structuredClone(report);
  invalidChallenge.challenge.rows[0].model = 'invented-category';
  assert.throws(() => validateReport(invalidChallenge));
});

test('frozen challenge cases have no confident wrong teaching routes', async () => {
  const challenge = await load('data/challenge.json');
  const original = await load('data/examples.json');
  const previous = new Set(original.families.flatMap(family => family.examples.map(([, text]) => normalize(text))));
  for (const row of challenge.cases) {
    assert.ok(!previous.has(normalize(row.text)), 'Challenge duplicates an original example');
    const proposal = predict(row.text, model).category;
    assert.ok(proposal === row.expected || proposal === 'uncertain', row.id);
    if (row.expected === 'uncertain') assert.equal(keywordPredict(row.text).category, 'uncertain', row.id);
  }
});
