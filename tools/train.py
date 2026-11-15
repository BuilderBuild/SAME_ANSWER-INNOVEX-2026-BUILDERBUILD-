"""Train and select abstention thresholds using only authored train/dev families."""
import json
import math
import re
import unicodedata
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CLASSES = ['denominator', 'numerator', 'whole', 'reasoned']


def normalize(text):
    return re.sub(r'\s+', ' ', unicodedata.normalize('NFC', text).lower()).strip()


def features(text):
    text = normalize(text)
    return Counter(text[i:i+n] for n in (2, 3, 4) for i in range(len(text)-n+1))


def rows():
    data = json.loads((ROOT / 'data/examples.json').read_text(encoding='utf-8'))
    seen = set()
    ids = set()
    output = []
    for family in data['families']:
        assert family['id'] not in ids, 'Duplicate family ID'
        ids.add(family['id'])
        assert family['split'] in ('train', 'dev', 'test')
        assert family['label'] in CLASSES + ['uncertain']
        for index, (language, text) in enumerate(family['examples']):
            key = normalize(text)
            assert key not in seen, 'Duplicate explanation across dataset'
            seen.add(key)
            output.append(dict(id=f"{family['id']}-{index}", family=family['id'], split=family['split'], label=family['label'], language=language, text=text))
    return output


def predict(text, model):
    clean = normalize(text)
    if len(clean) < 8 or len(clean) > 300:
        return 'uncertain'
    observed = features(clean)
    scores = list(model['priors'])
    known = 0
    for term, count in observed.items():
        if term not in model['vocabulary']:
            continue
        known += count
        column = model['vocabulary'][term]
        for i, label in enumerate(CLASSES):
            scores[i] += count * model['weights'][label][column]
    maximum = max(scores)
    exp = [math.exp(score-maximum) for score in scores]
    probabilities = sorted((score / sum(exp), label) for score, label in zip(exp, CLASSES))
    coverage = known / sum(observed.values()) if observed else 0
    margin = probabilities[-1][0] - probabilities[-2][0]
    if coverage < model['thresholds']['coverage'] or margin < model['thresholds']['margin']:
        return 'uncertain'
    return probabilities[-1][1]


def main():
    examples = rows()
    train = [r for r in examples if r['split'] == 'train']
    dev = [r for r in examples if r['split'] == 'dev']
    counts = {label: Counter() for label in CLASSES}
    documents = Counter()
    for row in train:
        counts[row['label']].update(features(row['text']))
        documents[row['label']] += 1
    vocabulary = {term: index for index, term in enumerate(sorted(set().union(*counts.values())))}
    weights = {}
    for label in CLASSES:
        total = sum(counts[label].values()) + len(vocabulary)
        weights[label] = [math.log((counts[label][term] + 1) / total) for term in vocabulary]
    model = dict(version=1, classes=CLASSES, vocabulary=vocabulary, weights=weights,
                 priors=[math.log(documents[label] / len(train)) for label in CLASSES],
                 thresholds=dict(coverage=0, margin=0),
                 training_count=len(train), development_count=len(dev),
                 provenance='Authored synthetic examples. No pupil data or educator validation.')
    candidates = []
    for coverage in [0.25, 0.35, 0.45, 0.55, 0.65, 0.75]:
        for margin in [0.0, 0.2, 0.5, 0.75, 0.9]:
            model['thresholds'] = dict(coverage=coverage, margin=margin)
            correct = wrong = 0
            for row in dev:
                result = predict(row['text'], model)
                correct += result == row['label']
                wrong += result != 'uncertain' and result != row['label']
            candidates.append((correct - 2 * wrong, correct, -coverage, -margin))
    _, _, negative_coverage, negative_margin = max(candidates)
    model['thresholds'] = dict(coverage=-negative_coverage, margin=-negative_margin)
    (ROOT / 'dist/model.json').write_text(json.dumps(model, ensure_ascii=False, separators=(',', ':')), encoding='utf-8')
    # Reference predictions catch Unicode/tokenization differences in the JS export.
    parity = [dict(text=r['text'], category=predict(r['text'], model)) for r in examples]
    (ROOT / 'data/python-predictions.json').write_text(json.dumps(parity, ensure_ascii=False, indent=2), encoding='utf-8')
    print(f"Trained on {len(train)} examples, selected thresholds on {len(dev)} development examples.")
    print(f"Vocabulary {len(vocabulary)}. Thresholds {model['thresholds']}. Test predictions are evaluated separately.")


if __name__ == '__main__':
    main()
