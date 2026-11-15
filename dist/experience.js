export const experienceStrings = {
  product: ['Product', 'उत्पाद'],
  technology: ['Technology', 'तकनीक'],
  impact: ['Evidence', 'नतीजे'],
  dashboard: ['Workspace', 'अभ्यास'],
  judgeMode: ['Judge Mode ↗', 'जज मोड ↗'],
  statusContext: ['HINDI + ENGLISH · FRACTIONS', 'हिंदी + अंग्रेज़ी · भिन्नें'],
  workspaceEyebrow: ['YOUR LEARNING WORKSPACE', 'आपका अभ्यास क्षेत्र'],
  workspaceTitle: ['A clearer path through fractions.', 'भिन्नों को समझने का स्पष्ट रास्ता।'],
  workspaceIntro: ['Bring your reasoning. Explore a different next question.', 'अपना तर्क बताएँ। अपनी सोच के अनुसार अगला सवाल पाएँ।'],
  learningSpace: ['Learning space', 'सीखने का क्षेत्र'],
  overview: ['Overview', 'परिचय'],
  tutorNav: ['Reasoning tutor', 'तर्क का अभ्यास'],
  resultsNav: ['Evaluation', 'मूल्यांकन'],
  architectureNav: ['Architecture', 'प्रणाली'],
  practicePath: ['PRACTICE PATH', 'अभ्यास का रास्ता']
};

export function escapeHTML(text) {
  return String(text).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
}

export function icon(name) {
  const paths = {
    spark: 'M12 3l2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3Z',
    layers: 'm3 7 9-5 9 5-9 5-9-5Zm0 5 9 5 9-5M3 17l9 5 9-5',
    language: 'M4 5h12M10 3v2M6 8c1 4 4 6 8 8M14 5c-1 6-4 9-9 12m10 4 4-10 4 10m-6-4h4',
    shield: 'M12 3 4 6v6c0 4 4 7 8 9 4-2 8-5 8-9V6l-8-3Zm-4 9 3 3 5-6',
    chart: 'M4 3v17h17M8 15v-4m5 4V7m5 8V4',
    flow: 'M4 4h6v6H4V4Zm10 10h6v6h-6v-6Zm-7-4v7h7m3-3V7h-7',
    arrow: 'M5 12h14m-6-6 6 6-6 6',
    cursor: 'm5 3 14 10-7 1-3 7-4-18Z',
    check: 'm5 12 4 4L19 6',
    book: 'M3 4h7l2 2 2-2h7v15h-7l-2 2-2-2H3V4Zm9 2v15',
    code: 'm8 6-6 6 6 6m8-12 6 6-6 6m-3-15-2 18',
    circle: 'M21 12a9 9 0 1 1-9-9m9 0-9 9m5-9h4v4'
  };
  return `<svg class='icon' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round' aria-hidden='true'><path d='${paths[name] || paths.spark}'/></svg>`;
}

export function engineFlow(language, stage, uncertain = false) {
  const copy = (en, hi) => language === 'hi' ? hi : en;
  const labels = [copy('Explanation', 'व्याख्या'), copy('Model proposal', 'मॉडल सुझाव'), copy('Evidence checks', 'तर्क की जाँच'), copy('Teaching card', 'संकेत'), copy('Fresh attempt', 'नया प्रयास')];
  return `<ol class='engine-flow ${uncertain ? 'is-paused' : ''}' aria-label='${copy('Actual tutoring workflow', 'अभ्यास का वास्तविक क्रम')}'>${labels.map((label, i) => `<li class='${i < stage ? 'complete' : ''} ${i === stage ? 'current' : ''}' ${i === stage ? "aria-current='step'" : ''}><span class='flow-point' aria-hidden='true'>${i < stage ? '✓' : i + 1}</span><span>${label}</span></li>`).join('')}</ol>`;
}

export function renderHome({ language, preview, report, questionCount }) {
  const copy = (en, hi) => language === 'hi' ? hi : en;
  const sample = preview || { text: copy('The learning engine is opening…', 'अभ्यास प्रणाली खुल रही है…'), title: copy('Your next question', 'आपका अगला सवाल'), question: copy('A preview of the actual teaching route will appear here.', 'असली संकेत का पूर्वावलोकन यहाँ दिखेगा।'), scenario: 'denominator', mode: 'Loading' };
  const result = report?.challenge.model;
  const routeCorrect = result ? result.correctClear + result.correctUncertain : null;
  const routeTotal = report?.challenge.rows.length;
  return `
    <section class='hero-section' aria-labelledby='home-heading'>
      <div class='hero-aurora' aria-hidden='true'></div>
      <div class='hero-copy reveal'>
        <p class='eyebrow'><span class='eyebrow-line'></span>${copy('A DIFFERENT WAY TO UNDERSTAND', 'समझने का एक अलग तरीका')}</p>
        <h1 id='home-heading'>${copy('Learning,<br><span>Reengineered.</span>', 'सीखना,<br><span>नए नज़रिए से।</span>')}</h1>
        <p class='hero-lead'>${copy('One answer can hide a hundred ways of thinking.', 'एक उत्तर के पीछे सोचने के कई तरीके हो सकते हैं।')}</p>
        <p class='hero-description'>${copy('A Hindi–English fractions workspace that listens to your explanation, checks the evidence, and finds a thoughtful question to ask next.', 'हिंदी–अंग्रेज़ी में भिन्नों का अभ्यास। अपनी व्याख्या दें, तर्क को जाँचें और अपनी सोच के अनुसार अगला सवाल पाएँ।')}</p>
        <div class='hero-actions'><button class='primary-button' data-go='practice'>${copy('Experience the Transformation', 'अभ्यास का अनुभव लें')}${icon('arrow')}</button><button class='secondary-button' data-go='method'>${copy('Explore How It Works', 'काम करने का तरीका देखें')}${icon('flow')}</button></div>
        <div class='hero-facts'><span>${icon('shield')}${copy('Processed on your device', 'इसी डिवाइस पर जाँच')}</span><span>${icon('language')}${copy('English · हिंदी · Hinglish', 'अंग्रेज़ी · हिंदी · हिंग्लिश')}</span></div>
      </div>
      <div class='hero-product reveal'>
        <div class='product-topline'><span class='tiny-mark'>=</span><span>${copy('THE TRANSFORMATION ENGINE', 'सोच से अगले सवाल तक')}</span><span class='local-indicator'>${escapeHTML(sample.mode)}</span></div>
        <div class='network-map' aria-hidden='true'><div class='network-grid'></div><div class='network-track track-one'></div><div class='network-track track-two'></div><div class='network-track track-three'></div><div class='orbit orbit-one'></div><div class='orbit orbit-two'></div><div class='network-node input-node'>${icon('language')}<span>${copy('LEARNER INPUT', 'आपकी व्याख्या')}</span></div><div class='network-node core-node'><span class='core-glyph'>S<span>A</span></span><span>${copy('REASONING', 'तर्क')}</span></div><div class='network-node check-node'>${icon('shield')}<span>${copy('EVIDENCE', 'जाँच')}</span></div><div class='network-node output-node'>${icon('book')}<span>${copy('NEXT QUESTION', 'अगला सवाल')}</span></div><div class='floating-fraction fraction-one'>⅛</div><div class='floating-fraction fraction-two'>⅙</div></div>
        <div class='preview-content'>
          <div class='preview-label'><span class='live-point'></span>${copy('ACTUAL ROUTING PREVIEW', 'असली संकेत-जाँच का पूर्वावलोकन')}<span>${copy('Authored sample', 'बनाया गया उदाहरण')}</span></div>
          <div class='sample-switch' role='group' aria-label='${copy('Preview a different explanation', 'अलग व्याख्या देखें')}'><button data-preview='denominator' aria-pressed='${sample.scenario === 'denominator'}'>${copy('A · Bigger number', 'A · बड़ी संख्या')}</button><button data-preview='whole' aria-pressed='${sample.scenario === 'whole'}'>${copy('B · Bigger whole', 'B · बड़ा पूरा आकार')}</button></div>
          <blockquote class='preview-input'>${escapeHTML(sample.text)}</blockquote>
          <div class='preview-output'>${icon('spark')}<div><p>${escapeHTML(sample.title)}</p><span>${escapeHTML(sample.question)}</span></div></div>
          <button class='text-button preview-open' data-open-example='${sample.scenario}'>${copy('Open this in the tutor', 'शिक्षक वाले अभ्यास में खोलें')} ${icon('arrow')}</button>
        </div>
      </div>
    </section>
    <div class='capability-strip'><span>${copy('Built for understanding', 'समझने के लिए बनाया गया')}</span><span>${icon('code')}${copy('Browser-local AI', 'ब्राउज़र में AI')}</span><span>${icon('layers')}${questionCount || '—'} ${copy('fraction comparisons', 'भिन्नों के प्रश्न')}</span><span>${icon('chart')}${copy('Inspectable evaluation', 'जाँचने योग्य नतीजे')}</span><span>${icon('cursor')}${copy('Tutor in control', 'शिक्षक का नियंत्रण')}</span></div>
    <section id='problem-section' class='home-section problem-section' aria-labelledby='problem-heading'>
      <div class='section-heading'><div><p class='eyebrow'>${copy('THE PROBLEM WITH JUST AN ANSWER', 'केवल उत्तर देखने की कठिनाई')}</p><h2 id='problem-heading'>${copy('Same result.<br>A completely different reason.', 'एक जैसा उत्तर।<br>बिल्कुल अलग कारण।')}</h2></div><p>${copy('A quiz can tell you a response is wrong. Choosing the right follow-up starts with understanding the explanation.', 'क्विज़ उत्तर गलत बता सकती है। सही अगला सवाल पूछने के लिए विद्यार्थी की व्याख्या समझना ज़रूरी है।')}</p></div>
      <div class='problem-grid'>
        <article class='problem-card'>${icon('layers')}<h3>${copy('An answer hides the why.', 'उत्तर के पीछे का कारण।')}</h3><p>${copy('Choosing ⅛ might mean confusing the denominator, or imagining a larger original roti.', '⅛ चुनने का कारण हर के बारे में भ्रम या बड़ी मूल रोटी की कल्पना हो सकता है।')}</p><button class='text-button' data-open-example='whole'>${copy('See the difference', 'अंतर देखें')}${icon('arrow')}</button></article>
        <article class='problem-card'>${icon('language')}<h3>${copy('Thinking crosses languages.', 'सोच भाषा की सीमा पार करती है।')}</h3><p>${copy('Explanations mix Hindi and English. Explore the supported phrases with the same learning cards.', 'व्याख्या में हिंदी और अंग्रेज़ी मिल सकती हैं। समान संकेतों के साथ समर्थित वाक्य आज़माएँ।')}</p><button class='text-button' data-bilingual-demo>${copy('Open the Hindi workspace', 'हिंदी अभ्यास क्षेत्र खोलें')}${icon('arrow')}</button></article>
        <article class='problem-card'>${icon('shield')}<h3>${copy('Confidence needs a check.', 'भरोसे के साथ जाँच भी।')}</h3><p>${copy('When reasoning is uncertain, the next step can be another question. The tutor can always intervene.', 'अस्पष्ट तर्क पर एक और सवाल पूछा जा सकता है। शिक्षक कभी भी संकेत बदल सकते हैं।')}</p><button class='text-button' data-open-example='uncertain'>${copy('Explore clarification', 'स्पष्टीकरण देखें')}${icon('arrow')}</button></article>
      </div>
    </section>
    <section id='transformation-section' class='home-section transformation-section' aria-labelledby='transformation-heading'><div class='section-heading'><div><p class='eyebrow'>${copy('FROM RESPONSE TO NEXT STEP', 'जवाब से अगले कदम तक')}</p><h2 id='transformation-heading'>${copy('Intelligence with<br>a visible thought process.', 'एक प्रणाली जिसका<br>तरीका दिखाई देता है।')}</h2></div><p>${copy('Every teaching route has a trace. Follow the local model proposal, the evidence checks, and the card the learner actually receives.', 'हर संकेत का रास्ता देखा जा सकता है। मॉडल का सुझाव, तर्क की जाँच और चुना गया संकेत साथ देखें।')}</p></div>${engineFlow(language, 3)}<button class='text-button' data-go='method'>${copy('Look inside the engine', 'प्रणाली के अंदर देखें')}${icon('arrow')}</button></section>
    <section id='features-section' class='home-section' aria-labelledby='features-heading'>
      <div class='section-heading'><div><p class='eyebrow'>${copy('ONE CONNECTED LEARNING WORKSPACE', 'सीखने के लिए एक जुड़ा हुआ क्षेत्र')}</p><h2 id='features-heading'>${copy('Small details.<br>More thoughtful practice.', 'छोटी बारीकियाँ।<br>सोच-समझकर अभ्यास।')}</h2></div><p>${copy('Tools for the explanation, the visual, and the next attempt. Explore every part of the working product.', 'व्याख्या, चित्र और अगले प्रयास के साधन। काम करते उत्पाद का हर हिस्सा आज़माएँ।')}</p></div>
      <div class='bento-grid'>
        <article class='bento-card bento-tutor'>${icon('spark')}<p class='eyebrow'>${copy('REASONING TUTOR', 'तर्क का अभ्यास')}</p><h3>${copy('A different question<br>for a different idea.', 'अलग सोच के लिए<br>अलग अगला सवाल।')}</h3><p>${copy('Explain your comparison. Receive an authored diagnostic question, a hint, or a request for more detail.', 'तुलना कैसे की, बताएँ। फिर निदान का सवाल, संकेत या और जानकारी देने का अवसर पाएँ।')}</p><div class='mini-conversation'><span>${copy('Learner explanation', 'विद्यार्थी की व्याख्या')}</span><p>“${escapeHTML(sample.text)}”</p><span class='assistant-label'>${icon('spark')}${copy('Suggested next question', 'सुझाया गया अगला सवाल')}</span><p>${escapeHTML(sample.question)}</p></div><button class='text-button' data-go='practice'>${copy('Enter the workspace', 'अभ्यास खोलें')}${icon('arrow')}</button></article>
        <article class='bento-card bento-visual'>${icon('layers')}<h3>${copy('Make the maths visible.', 'गणित को देखकर समझें।')}</h3><p>${copy('Equal-sized fraction bars keep the whole consistent while the partition changes.', 'भिन्न की पट्टियों में पूरे का आकार समान रहता है और बँटवारा बदलता है।')}</p><div class='mini-bars' aria-label='1/8 and 1/6 of equal-sized wholes'><div><code>1/8</code><span class='mini-bar eighth'></span></div><div><code>1/6</code><span class='mini-bar sixth'></span></div></div><button class='text-button' data-visual-demo>${copy('Explore fraction bars', 'पट्टियाँ देखें')}${icon('arrow')}</button></article>
        <article class='bento-card bento-language'>${icon('language')}<h3>${copy('Your words belong here.', 'आपकी अपनी भाषा।')}</h3><p>${copy('English, Hindi, and common Hinglish patterns. Switch the interface without losing your current explanation.', 'अंग्रेज़ी, हिंदी और आम हिंग्लिश। भाषा बदलने पर आपकी व्याख्या बनी रहती है।')}</p><div class='language-visual'><span>EN</span><span>हिंदी</span><span>Hinglish</span></div><button class='text-button' data-bilingual-demo>${copy('Open the Hindi workspace', 'हिंदी अभ्यास क्षेत्र खोलें')}${icon('arrow')}</button></article>
        <article class='bento-card bento-human'>${icon('cursor')}<h3>${copy('The tutor has the final say.', 'अंतिम फैसला शिक्षक का।')}</h3><p>${copy('Inspect the route, choose another card, or ask for clarification. Every recommendation stays provisional.', 'रास्ता जाँचें, दूसरा संकेत चुनें या और जानकारी पूछें। हर सुझाव बदला जा सकता है।')}</p><button class='text-button' data-tutor-demo>${copy('Choose a teaching card', 'संकेत चुनें')}${icon('arrow')}</button></article>
        <article class='bento-card bento-check'>${icon('circle')}<h3>${copy('A fresh pair. A first attempt.', 'नया प्रश्न। अपना पहला प्रयास।')}</h3><p>${copy('Practice on different numbers before revealing the answer. Record the observation for this session.', 'उत्तर देखने से पहले नई संख्याओं पर अभ्यास करें। इस सत्र का प्रयास दर्ज करें।')}</p><button class='text-button' data-fresh-demo>${copy('Try independent practice', 'अपने आप अभ्यास करें')}${icon('arrow')}</button></article>
      </div>
    </section>
    <section id='impact-section' class='home-section impact-section' aria-labelledby='impact-heading'><div class='section-heading'><div><p class='eyebrow'>${copy('EVIDENCE BEFORE BIG CLAIMS', 'दावों से पहले प्रमाण')}</p><h2 id='impact-heading'>${copy('Built to be questioned.<br>Including by you.', 'इसकी जाँच कीजिए।<br>खुद भी।')}</h2></div><p>${copy('Measured on authored explanations. Independent language review, educator validation, and classroom learning outcomes are future work.', 'बनाई गई व्याख्याओं पर मापा गया। स्वतंत्र भाषा समीक्षा, शिक्षक समीक्षा और कक्षा में सीख के नतीजों की जाँच अभी बाकी है।')}</p></div><div class='impact-grid'><article><span class='metric-value'>${result ? `${result.correctClear}<small>/${result.clearTotal}</small>` : '—'}</span><h3>${copy('Clear routes selected correctly', 'स्पष्ट व्याख्याओं पर सही संकेत')}</h3><p>${copy('New authored challenge set', 'नए बनाए गए जाँच उदाहरण')}</p></article><article><span class='metric-value'>${result ? `${result.correctUncertain}<small>/${result.uncertainTotal}</small>` : '—'}</span><h3>${copy('Uncertain cases deferred', 'अस्पष्ट मामलों में और सवाल')}</h3><p>${copy('One clear case also needed clarification', 'एक स्पष्ट मामले में भी और सवाल पूछा गया')}</p></article><article><span class='metric-value'>${result ? result.confidentWrong : '—'}</span><h3>${copy('Confident wrong routes observed', 'देखे गए पक्के गलत संकेत')}</h3><p>${copy('Limited to this 32-case authored set', 'केवल इन 32 बनाए गए उदाहरणों में')}</p></article></div><div class='impact-bottom'><span>${routeCorrect === null ? copy('Evaluation loading', 'मूल्यांकन खुल रहा है') : copy(`${routeCorrect} of ${routeTotal} final routing decisions match the authored labels.`, `${routeTotal} में से ${routeCorrect} अंतिम रास्ते बनाए गए लेबल से मिलते हैं।`)}</span><button class='secondary-button' data-go='evidence'>${copy('Inspect the full evaluation', 'पूरा मूल्यांकन देखें')}${icon('chart')}</button></div></section>
    <section id='home-architecture' class='home-section' aria-labelledby='architecture-home-heading'>${renderArchitecture(language, 'interface', 'home')}</section>
    <section class='closing-section'><div><p class='eyebrow'>${copy('START WITH A DIFFERENT QUESTION', 'एक अलग सवाल से शुरुआत करें')}</p><h2>${copy('Let the reasoning lead.', 'तर्क को आगे आने दें।')}</h2><p>${copy('Explore one explanation. Discover the next teaching step.', 'एक व्याख्या दें। अगला संकेत समझें।')}</p></div><button class='primary-button' data-go='practice'>${copy('Open your learning workspace', 'अपना अभ्यास क्षेत्र खोलें')}${icon('arrow')}</button></section>`;
}

const architecture = {
  interface: { icon: 'cursor', label: ['Interface', 'इंटरफ़ेस'], file: 'HTML · CSS · JavaScript', title: ['One workspace, on your device.', 'एक अभ्यास क्षेत्र, इसी डिवाइस पर।'], body: ['The browser holds the current explanation, selected answer, teaching card and first fresh-pair response in session memory. Navigation and theme changes preserve that session.', 'ब्राउज़र व्याख्या, चुना उत्तर, संकेत और नए प्रश्न का पहला प्रयास सत्र की मेमोरी में रखता है। नेविगेशन और थीम बदलने पर सत्र बना रहता है।'] },
  model: { icon: 'spark', label: ['Local model', 'स्थानीय मॉडल'], file: 'model.json · Naive Bayes', title: ['A proposal from familiar patterns.', 'पहचाने हुए पैटर्न से सुझाव।'], body: ['A frozen character n-gram classifier proposes one of four teaching categories. Its scores are signals for routing. The comparison view exposes the raw proposal.', 'अक्षरों के छोटे समूहों पर सीखा स्थिर मॉडल चार श्रेणियों में सुझाव देता है। उसके अंक संकेत चुनने के लिए हैं। तुलना में मूल सुझाव दिखता है।'] },
  checks: { icon: 'shield', label: ['Evidence checks', 'तर्क की जाँच'], file: 'core.js · shared routing rules', title: ['A deliberate pause before the hint.', 'संकेत से पहले सोच-समझकर जाँच।'], body: ['Shared checks look for topic cues, uncertainty, negated claims and number roles. They can correct a conflicting proposal or ask for clarification. Both methods use the same checks.', 'समान जाँच विषय, अनिश्चितता, नकार और संख्याओं की भूमिका देखती है। विरोधी सुझाव सुधारा या और जानकारी पूछी जा सकती है। दोनों तरीकों पर यही जाँच लगती है।'] },
  maths: { icon: 'layers', label: ['Exact maths', 'सटीक गणित'], file: 'core.js · integer arithmetic', title: ['The comparison has a separate check.', 'तुलना की अपनी अलग जाँच।'], body: ['Integer cross-multiplication determines the correct numerical relationship. Equal-width fraction bars illustrate the authored question. A text classification never changes that arithmetic.', 'पूर्णांकों का क्रॉस गुणा सही संख्यात्मक संबंध तय करता है। बराबर चौड़ाई की पट्टियाँ प्रश्न दिखाती हैं। पाठ की श्रेणी उस गणना को नहीं बदलती।'] },
  content: { icon: 'book', label: ['Teaching content', 'सीखने की सामग्री'], file: 'content.json · evaluation.json', title: ['Authored cards and inspectable results.', 'बनाए गए संकेत और जाँचने योग्य नतीजे।'], body: ['Versioned Hindi–English JSON contains the three exercises, fresh pairs and hints. The evaluation is built from a known regression set and a separate authored challenge set, with matching release fingerprints.', 'हिंदी–अंग्रेज़ी JSON में तीन अभ्यास, नए प्रश्न और संकेत हैं। मूल्यांकन में ज्ञात पुराने उदाहरण और अलग नए बनाए गए उदाहरण हैं, साथ में फ़ाइलों के मिलते पहचान-चिह्न हैं।'] }
};

export function architecturePanel(language, key) {
  const node = architecture[key] || architecture.interface;
  const index = language === 'hi' ? 1 : 0;
  return `<div class='architecture-panel-icon'>${icon(node.icon)}</div><div><code>${node.file}</code><h3>${node.title[index]}</h3><p>${node.body[index]}</p></div>`;
}

export function renderArchitecture(language, selected = 'interface', scope = 'method') {
  const copy = (en, hi) => language === 'hi' ? hi : en;
  return `<div class='section-heading'><div><p class='eyebrow'>${copy('OPEN THE SYSTEM', 'प्रणाली को समझें')}</p><h2 id='architecture-${scope}-heading'>${copy('Local by design.<br>Visible by choice.', 'स्थानीय प्रसंस्करण।<br>खुलकर दिखता तरीका।')}</h2></div><p>${copy('Explore the working components. Inference and session state live in the browser. Versioned files supply the model, teaching cards, and evaluation.', 'काम करने वाले हिस्से देखें। जाँच और सत्र की स्थिति ब्राउज़र में हैं। संस्करण वाली फ़ाइलें मॉडल, संकेत और मूल्यांकन देती हैं।')}</p></div><div class='architecture-widget'><div class='architecture-tabs' role='tablist' aria-label='${copy('System components', 'प्रणाली के हिस्से')}'>${Object.entries(architecture).map(([key,node]) => `<button role='tab' id='${scope}-tab-${key}' data-architecture='${key}' tabindex='${key === selected ? 0 : -1}' aria-selected='${key === selected}' aria-controls='${scope}-architecture-panel'>${icon(node.icon)}<span>${node.label[language === 'hi' ? 1 : 0]}</span></button>`).join('')}</div><div class='architecture-panel' role='tabpanel' tabindex='0' id='${scope}-architecture-panel' data-architecture-panel aria-labelledby='${scope}-tab-${selected}'>${architecturePanel(language, selected)}</div></div>`;
}

export function judgeSteps(language) {
  const copy = (en, hi) => language === 'hi' ? hi : en;
  return [
    { title: copy('The same answer can hide different thinking.', 'एक उत्तर के पीछे अलग सोच हो सकती है।'), body: copy('Two learners choose ⅛. One compares the digits; the other imagines a larger roti. Choosing a helpful next question requires their explanation.', 'दो विद्यार्थी ⅛ चुनते हैं। एक अंक देखता है, दूसरा बड़ी रोटी सोचता है। अगला उपयोगी सवाल चुनने के लिए व्याख्या चाहिए।'), seconds: 20, view: 'home', target: 'problem-section' },
    { title: copy('Trace a real teaching decision.', 'असली संकेत का रास्ता देखें।'), body: copy('Switch between the two authored preview explanations. The displayed next question comes from the same model and evidence checks as the working tutor.', 'दो बनाए गए उदाहरण बदलकर देखें। अगला सवाल उसी मॉडल और जाँच से आता है जो शिक्षक वाले अभ्यास में काम करते हैं।'), seconds: 20, view: 'home', target: 'home-heading' },
    { title: copy('Try the actual tutor.', 'काम करता अभ्यास आज़माएँ।'), body: copy('The first sample is open. Try the bigger-roti example, type your own explanation, or use tutor override. These are clearly authored demonstrations.', 'पहला उदाहरण खुला है। बड़ी रोटी वाला उदाहरण, अपनी व्याख्या या शिक्षक का संकेत आज़माएँ। ये बनाए गए प्रदर्शन उदाहरण हैं।'), seconds: 45, view: 'practice' },
    { title: copy('Follow the transformation.', 'बदलाव का क्रम देखें।'), body: copy('The live workflow follows the session stage. Compare methods exposes raw proposals and checked routes. An uncertain explanation pauses for clarification.', 'क्रम सत्र की स्थिति के साथ बदलता है। तुलना में मूल और जाँचे रास्ते दिखते हैं। अस्पष्ट व्याख्या पर और सवाल आता है।'), seconds: 25, view: 'practice' },
    { title: copy('Inspect the architecture.', 'प्रणाली के हिस्से देखें।'), body: copy('Select a component below. Exact maths, the frozen local classifier, shared checks and bilingual JSON work together in the browser.', 'कोई हिस्सा चुनें। सटीक गणित, स्थानीय मॉडल, समान जाँच और द्विभाषी JSON ब्राउज़र में साथ काम करते हैं।'), seconds: 20, view: 'method', target: 'method-architecture' },
    { title: copy('Question the evidence.', 'नतीजों को परखें।'), body: copy('Inspect 24 known regression cases and 32 new authored challenge cases. There is one clear-case deferral in each set. Human and classroom validation remain pending.', '24 ज्ञात पुराने और 32 नए बनाए गए उदाहरण देखें। हर समूह में एक स्पष्ट मामले पर भी और सवाल आया। मानवीय और कक्षा में जाँच अभी बाकी है।'), seconds: 30, view: 'evidence' },
    { title: copy('The next step is independent validation.', 'अगला कदम स्वतंत्र जाँच है।'), body: copy('Future work is educator-reviewed content, representative learner explanations and a delayed unaided assessment. More topics and languages require their own content and validation.', 'आगे शिक्षक समीक्षा, विद्यार्थियों की वास्तविक व्याख्याएँ और बाद में बिना मदद का परीक्षण चाहिए। नए विषय और भाषाओं की अपनी सामग्री और जाँच चाहिए।'), seconds: 20, view: 'method', target: 'future-validation' }
  ];
}
