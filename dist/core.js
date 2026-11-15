export const CATEGORIES = ['denominator', 'numerator', 'whole', 'reasoned'];
export const ROUTING_VERSION = 2;

export function normalize(text) {
  return String(text).normalize('NFC').toLowerCase().replace(/\s+/gu, ' ').trim();
}

export function features(text) {
  const points = Array.from(normalize(text));
  const counts = new Map();
  for (const n of [2, 3, 4]) {
    for (let i = 0; i <= points.length - n; i++) {
      const token = points.slice(i, i + n).join('');
      counts.set(token, (counts.get(token) || 0) + 1);
    }
  }
  return counts;
}

export function compareFractions(a, b) {
  for (const pair of [a, b]) {
    if (!Array.isArray(pair) || pair.length !== 2 || !pair.every(Number.isSafeInteger) || pair[0] < 0 || pair[0] > 100 || pair[1] < 1 || pair[1] > 100) throw new Error('Invalid fraction');
  }
  const difference = a[0] * b[1] - b[0] * a[1];
  return difference > 0 ? 'left' : difference < 0 ? 'right' : 'equal';
}

export function validateModel(model) {
  if (model?.version !== 1 || JSON.stringify(model.classes) !== JSON.stringify(CATEGORIES) || !model.vocabulary || !model.weights || !Array.isArray(model.priors) || model.priors.length !== 4 || !model.priors.every(Number.isFinite)) throw new Error('Model version is incompatible');
  for (const label of CATEGORIES) {
    const row = model.weights[label];
    if (!Array.isArray(row) || row.length !== Object.keys(model.vocabulary).length || !row.every(Number.isFinite)) throw new Error('Model weights are incomplete');
  }
  const indexes = Object.values(model.vocabulary);
  if (!indexes.every(Number.isInteger) || indexes.length !== new Set(indexes).size || !indexes.every(v => v >= 0 && v < indexes.length)) throw new Error('Invalid vocabulary');
  if (!model.thresholds || !['coverage', 'margin'].every(k => Number.isFinite(model.thresholds[k]) && model.thresholds[k] >= 0 && model.thresholds[k] <= 1)) throw new Error('Invalid thresholds');
  return model;
}

export function rawPredict(text, model) {
  const clean = normalize(text);
  if (Array.from(clean).length < 8 || Array.from(clean).length > 300) return { category: 'uncertain', reason: 'length', coverage: 0, margin: 0 };
  const observed = features(clean);
  const total = [...observed.values()].reduce((sum, n) => sum + n, 0);
  let known = 0;
  const scores = [...model.priors];
  for (const [feature, count] of observed) {
    if (!Object.hasOwn(model.vocabulary, feature)) continue;
    known += count;
    const column = model.vocabulary[feature];
    CATEGORIES.forEach((label, i) => { scores[i] += count * model.weights[label][column]; });
  }
  const maximum = Math.max(...scores);
  const exponentials = scores.map(s => Math.exp(s - maximum));
  const sum = exponentials.reduce((a, b) => a + b, 0);
  const ranked = exponentials.map((value, i) => ({ category: CATEGORIES[i], score: value / sum })).sort((a, b) => b.score - a.score);
  const margin = ranked[0].score - ranked[1].score;
  const coverage = total ? known / total : 0;
  const category = coverage < model.thresholds.coverage || margin < model.thresholds.margin ? 'uncertain' : ranked[0].category;
  return { category, reason: category === 'uncertain' ? 'evidence' : 'matched', coverage, margin };
}

const TERMS = {
  denominator: ['eight', 'denominator', 'bottom number', 'more pieces', 'आठ', 'हर बड़ा', 'हर बड़ा', 'आठवां', 'aath', 'neeche', 'denominator bada'],
  numerator: ['numerator', 'top number', 'अंश', 'ऊपर', 'upar', 'teen bada', 'three is bigger'],
  whole: ['whole', 'roti', 'pizza', 'cake', 'रोटी', 'पूरा', 'आकार', 'badi', 'bada cake', 'different size'],
  reasoned: ['same denominator', 'common denominator', 'cross multiply', 'smaller pieces', 'छोटे टुकड़े', 'समान हर', 'बराबर हिस्से', 'chhote tukde', 'same size', 'equal parts']
};

export function rawKeywordPredict(text) {
  const clean = normalize(text);
  if (Array.from(clean).length < 8 || Array.from(clean).length > 300) return { category: 'uncertain', reason: 'length' };
  const scores = CATEGORIES.map(category => ({ category, score: TERMS[category].filter(term => clean.includes(term)).length })).sort((a, b) => b.score - a.score);
  return { category: scores[0].score > scores[1].score ? scores[0].category : 'uncertain', reason: 'keywords' };
}

function containsPhrase(text, phrases) {
  return phrases.some(phrase => {
    const escaped = normalize(phrase).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp(`(?:^|[^\\p{L}\\p{M}\\p{N}])${escaped}(?=$|[^\\p{L}\\p{M}\\p{N}])`, 'u').test(text);
  });
}

// shortcut: cues cover the workbook's authored language, expand after independent language review.
export function applyRoutingChecks(text, proposal) {
  const clean = normalize(text);
  const defer = reason => ({ ...proposal, rawCategory: proposal.category, category: 'uncertain', reason });
  const route = category => ({ ...proposal, rawCategory: proposal.category, category, reason: 'explicit-number-role' });
  if (Array.from(clean).length < 8 || Array.from(clean).length > 300) return defer('length');

  const uncertainty = containsPhrase(clean, [
    'cannot decide', "can't decide", 'unsure', 'not sure', "don't know", 'do not know',
    'no method', 'need help', 'without thinking', 'नहीं पता', 'नहीं जानता', 'तय नहीं',
    'समझ नहीं आया', 'समझ नहीं आता', 'पक्का नहीं', 'निश्चित नहीं', 'तरीका नहीं',
    'nahi pata', 'nahin pata', 'nahi malum', 'nahi aata', 'not certain'
  ]);
  if (uncertainty) return defer('expressed-uncertainty');

  const rejectedClaim = containsPhrase(clean, [
    "don't believe", 'do not believe', "don't think", 'do not think', 'does not mean',
    "doesn't mean", 'not always', 'बड़ी नहीं', 'बड़ा नहीं', 'बड़ा नहीं', 'नहीं मानता',
    'नहीं मानती', 'ज़रूरी नहीं', 'जरूरी नहीं', 'यह मतलब नहीं',
    'nahi manta', 'nahi manti', 'nahi hoti', 'nahi hota', 'zaroori nahi'
  ]);
  if (rejectedClaim) return defer('negated-claim');

  const denominator = containsPhrase(clean, ['denominator', 'denominators', 'bottom', 'neeche', 'niche', 'नीचे']) ||
    (containsPhrase(clean, ['हर']) && !containsPhrase(clean, ['हर दिन', 'हर रोज', 'हर सुबह', 'हर शाम', 'हर बार']));
  const numerator = containsPhrase(clean, ['numerator', 'numerators', 'top', 'upar', 'ऊपर', 'अंश', 'अंशों']);
  const method = containsPhrase(clean, [
    'common denominator', 'same denominator', 'cross multiplication', 'cross multiply',
    'equal partitions', 'equal parts', 'smaller pieces', 'समान हर', 'हर समान',
    'बराबर हिस्सों', 'बराबर बँटवारा', 'छोटे टुकड़े', 'chhote tukde', 'same karke'
  ]);
  const whole = containsPhrase(clean, ['whole', 'wholes', 'roti', 'रोटी', 'रोटियों', 'रोटियाँ', 'pizza', 'pizzas', 'पिज़्ज़ा', 'cake', 'cakes', 'केक', 'bar', 'bars', 'पूरा', 'पूरे', 'poora']);
  const part = containsPhrase(clean, ['part', 'parts', 'partition', 'partitions', 'piece', 'pieces', 'portion', 'portions', 'share', 'shares', 'slice', 'slices', 'हिस्सा', 'हिस्से', 'भाग', 'टुकड़ा', 'टुकड़े', 'टुकड़ों', 'hissa', 'tukde', 'tukdo']);
  const larger = containsPhrase(clean, ['bigger', 'larger', 'higher', 'greater', 'more', 'bada', 'badi', 'bade', 'zyada', 'jyada', 'बड़ा', 'बड़ी', 'बड़ी', 'बड़ा', 'बड़े', 'ज्यादा', 'ज़्यादा', 'अधिक']);
  const fractionContext = containsPhrase(clean, ['fraction', 'fractions', 'भिन्न', 'भिन्नों', 'भिन्नें', 'eighth', 'sixth', 'आठवाँ', 'आठवां', 'छठा']) || /\d+\s*\/\s*\d+/u.test(clean);
  const size = containsPhrase(clean, ['size', 'sized', 'आकार']);
  const selected = containsPhrase(clean, ['selected', 'चुने', 'गिनती', 'ginti']);
  const wholeComparison = whole && containsPhrase(clean, ['whole', 'wholes', 'पूरा', 'पूरे', 'poora']) && (larger || size);
  if (!denominator && !numerator && !method && !fractionContext && !(whole && part) && !(part && (selected || size)) && !wholeComparison) return defer('no-maths-evidence');
  if (denominator && numerator && !method) return defer('mixed-number-roles');

  // A visible number-role cue outranks a contradictory character-pattern proposal.
  if (denominator && !numerator && !method && larger) return route('denominator');
  if (numerator && !denominator && !method && larger) return route('numerator');

  const supported = {
    denominator: denominator || (fractionContext && containsPhrase(clean, ['eight', 'आठ', 'aath', 'more pieces'])),
    numerator: numerator || (part && selected),
    whole,
    reasoned: method || (whole && part && containsPhrase(clean, ['equal', 'same', 'बराबर', 'समान', 'ek jaisi', 'ek jaise']))
  };
  if (proposal.category !== 'uncertain' && !supported[proposal.category]) return defer('unsupported-category');
  return { ...proposal, rawCategory: proposal.category };
}

export function predict(text, model) {
  return applyRoutingChecks(text, rawPredict(text, model));
}

export function keywordPredict(text) {
  return applyRoutingChecks(text, rawKeywordPredict(text));
}

export function validateContent(content) {
  if (content?.version !== 1 || !Array.isArray(content.questions) || content.questions.length < 3) throw new Error('Question bank is incomplete');
  const ids = new Set();
  for (const question of content.questions) {
    if (typeof question.id !== 'string' || !question.id || ids.has(question.id)) throw new Error('Duplicate or invalid question');
    ids.add(question.id);
    if (!question.name?.en || !question.name?.hi || !question.transfer) throw new Error('Missing question metadata');
    for (const item of [question, question.transfer]) {
      compareFractions(item.left, item.right);
      if ([item.left, item.right].some(([numerator, denominator]) => numerator > denominator || denominator > 12)) throw new Error('Unsupported workbook fraction');
      if (!item.context?.en || !item.context?.hi) throw new Error('Missing question translation');
    }
  }
  for (const label of [...CATEGORIES, 'uncertain', 'conflict']) {
    for (const language of ['en', 'hi']) {
      if (!content.hints?.[label]?.[language]?.title || !content.hints[label][language].question || !content.hints[label][language].body) throw new Error('Missing hint translation');
    }
  }
  return content;
}

export function teachingCategory(category, answer, question) {
  if (category === 'reasoned' && answer !== compareFractions(question.left, question.right)) return 'conflict';
  return category;
}

export function validateReport(report) {
  if (report?.version !== 1 || report.routingVersion !== ROUTING_VERSION || !Array.isArray(report.rows) || !report.splitCounts || !/^[a-f0-9]{64}$/.test(report.modelSha256 || '') || !/^[a-f0-9]{64}$/.test(report.datasetSha256 || '')) throw new Error('Evaluation report is incomplete');
  if (!['train', 'dev', 'test'].every(key => Number.isInteger(report.splitCounts[key]) && report.splitCounts[key] > 0) || report.rows.length !== report.splitCounts.test) throw new Error('Invalid evaluation split');
  if (!Number.isInteger(report.originalBaseline?.model?.confidentWrong) || !Array.isArray(report.challenge?.rows) || !/^[a-f0-9]{64}$/.test(report.routingSha256 || '') || !/^[a-f0-9]{64}$/.test(report.challengeSha256 || '')) throw new Error('Missing routing comparison');
  for (const results of [report, report.challenge]) {
    for (const method of ['model', 'keyword']) {
      const summary = results[method];
      if (!summary?.languages || !['clearTotal','correctClear','uncertainTotal','correctUncertain','confidentWrong','deferredClear'].every(key => Number.isInteger(summary[key]) && summary[key] >= 0)) throw new Error('Invalid evaluation metrics');
      if (summary.clearTotal + summary.uncertainTotal !== results.rows.length || summary.correctClear > summary.clearTotal || summary.correctUncertain > summary.uncertainTotal) throw new Error('Mismatched evaluation denominator');
    }
    for (const [language, summary] of Object.entries(results.model.languages)) {
      const baseline = results.keyword.languages[language];
      if (!baseline || ![summary, baseline].every(row => Number.isInteger(row.total) && Number.isInteger(row.correct) && row.correct >= 0 && row.correct <= row.total) || baseline.total !== summary.total) throw new Error('Invalid language results');
    }
    for (const row of results.rows) {
      if (typeof row.text !== 'string' || typeof row.id !== 'string' || typeof row.language !== 'string' || ![row.expected, row.model, row.keyword, row.rawModel, row.rawKeyword].every(label => [...CATEGORIES, 'uncertain'].includes(label))) throw new Error('Invalid evaluation case');
    }
  }
  return report;
}
