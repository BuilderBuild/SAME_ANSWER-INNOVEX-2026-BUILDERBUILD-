import { CATEGORIES, compareFractions, predict, keywordPredict, validateModel, validateContent, validateReport, teachingCategory } from './core.js';
import { experienceStrings, icon, engineFlow, renderHome, renderArchitecture, architecturePanel, judgeSteps } from './experience.js';

const byId = id => document.getElementById(id);
const strings = {
  practice:['Practice','अभ्यास'], method:['The approach','हमारा तरीका'], evidence:['Evidence','नतीजे'], reset:['Reset','नया सत्र'],
  eyebrow:['A LITTLE MORE UNDERSTANDING','थोड़ी और समझ'], headline:['Same answer.<br>Different thinking.','एक उत्तर।<br>अलग सोच।'],
  intro:['A fraction answer is the beginning. Tell us how you got there, and we’ll find a question worth asking next.','भिन्न का उत्तर बस शुरुआत है। बताएँ आपने कैसे सोचा, ताकि अगला सवाल आपकी समझ को आगे बढ़ाए।'],
  note:['Let’s talk about the “why.”','आइए, “क्यों” पर बात करें।'],workbook:['YOUR WORKBOOK','आपकी अभ्यास पुस्तिका'],fractions:['Making sense<br>of fractions','भिन्नों को<br>समझना'],level:['Comparing fractions · Class 6','भिन्नों की तुलना · कक्षा 6'],pace:['Take your time.<br>Your reasoning matters here.','आराम से सोचें।<br>यहाँ आपके तर्क की अहमियत है।'],
  think:['Think it through','सोचकर बताएँ'],explore:['Explore the idea','तर्क को समझें'],try:['Try a fresh pair','नया प्रश्न करें'],loading:['Loading your lesson…','प्रश्न खुल रहा है…'],
  privacy:['Your explanation stays in this browser. Reset clears the session.','आपकी व्याख्या इसी ब्राउज़र में रहती है। नया सत्र शुरू करने पर मिट जाती है।'],compare:['Compare methods ↗','तरीकों की तुलना ↗'],different:['ONE ANSWER, TWO STORIES','एक उत्तर, दो कहानियाँ'],exampleTitle:['What’s behind<br>“one eighth”?','“एक बटा आठ”<br>के पीछे क्या सोच है?'],exampleIntro:['Try these authored examples. Notice how the next question changes.','इन बनाए गए उदाहरणों को आज़माएँ। देखें कि अगला सवाल कैसे बदलता है।'],exampleA:['“Eight is bigger than six.”','“आठ, छह से बड़ा है।”'],exampleB:['“My roti was much bigger.”','“मेरी रोटी बहुत बड़ी थी।”'],tryExample:['Try this explanation ↗','यह व्याख्या आज़माएँ ↗'],uncertainExample:['What if I’m unsure? ↗','अगर मुझे पक्का पता न हो? ↗'],reviewNote:['A tutor can always choose another hint. This is an experimental learning tool.','शिक्षक कभी भी दूसरा संकेत चुन सकते हैं। यह सीखने का एक प्रायोगिक साधन है।'],footer:['Built for thoughtful practice · INNOVEX 2026 · PS 03','समझकर अभ्यास करने के लिए · INNOVEX 2026 · PS 03'],resultsFile:['Evaluation data ↗','मूल्यांकन के आँकड़े ↗'],compareHeading:['Two methods, one explanation','एक व्याख्या, दो तरीके'],tutorHeading:['Choose a teaching card','एक संकेत चुनें'],tutorIntro:['Use your judgment. An override changes this session only.','अपनी समझ से चुनें। यह बदलाव केवल इस सत्र के लिए है।'],
  question:['THE QUESTION','प्रश्न'],sameWholes:['Equal-sized wholes','बराबर आकार के पूरे'],questionTitle:['Which fraction is larger?','कौन-सी भिन्न बड़ी है?'],choose:['Choose your answer','अपना उत्तर चुनें'],left:['Left fraction','बाईं भिन्न'],right:['Right fraction','दाईं भिन्न'],equal:['They’re equal','दोनों बराबर'],reasonLabel:['How did you decide?','आपने कैसे तय किया?'],reasonNote:['English, हिंदी, or a little of both. One or two sentences is enough.','अंग्रेज़ी, हिंदी, या दोनों में लिखें। एक-दो वाक्य काफ़ी हैं।'],placeholder:['I think this because…','मुझे ऐसा लगता है क्योंकि…'],inputFoot:['Use an example, or explain it your own way.','उदाहरण आज़माएँ या अपना तर्क लिखें।'],characters:['characters','अक्षर'],find:['Find my next question','अगला सवाल दिखाएँ'],visual:['Show fraction bars','भिन्न की पट्टियाँ दिखाएँ'],hideVisual:['Hide fraction bars','पट्टियाँ छिपाएँ'],selectionError:['Choose left, right, or equal first.','पहले बायाँ, दायाँ, या बराबर चुनें।'],textError:['Add a short explanation, or try one of the examples.','छोटी-सी व्याख्या लिखें, या कोई उदाहरण आज़माएँ।'],lengthError:['Please keep the explanation within 300 characters.','कृपया 300 अक्षरों के अंदर लिखें।'],
  nextQuestion:['YOUR NEXT QUESTION','आपका अगला सवाल'],provisional:['This is a suggested teaching route. A tutor can change it.','यह सुझाया गया संकेत है। शिक्षक इसे बदल सकते हैं।'],yourWords:['Your explanation','आपकी व्याख्या'],changeHint:['Tutor · choose another hint','शिक्षक · दूसरा संकेत चुनें'],fresh:['Try a fresh pair','नया प्रश्न करें'],addDetail:['Add one more detail','एक बात और लिखें'],edit:['Edit my explanation','व्याख्या बदलें'],humanChoice:['Choose with a tutor','शिक्षक के साथ चुनें'],barNote:['Equal widths represent equal-sized wholes. Shaded segments show the fraction.','बराबर चौड़ाई का मतलब बराबर पूरे। रंगे हुए हिस्से भिन्न दिखाते हैं।'],
  transfer:['A FRESH PAIR','एक नया प्रश्न'],independent:['Try this one independently','इसे अपने आप हल करें'],transferNote:['Use what you explored. Submit your first answer before seeing any help.','जो समझा उसे लगाएँ। मदद देखने से पहले अपना पहला उत्तर दें।'],check:['Check my answer','उत्तर जाँचें'],back:['Back to the teaching card','संकेत पर वापस जाएँ'],correct:['You found the comparison.','आपने सही तुलना की।'],retry:['Let’s look at this pair together.','इस जोड़ी को साथ देखें।'],resultNote:['This records one practice response. It cannot establish lasting learning.','यह एक अभ्यास का उत्तर दर्ज करता है। इससे स्थायी सीख का निष्कर्ष नहीं निकलता।'],actual:['The exact comparison','सटीक तुलना'],firstAttempt:['Fresh-pair first attempt','नए प्रश्न का पहला उत्तर'],correctShort:['Correct','सही'],revisit:['Needs another look','फिर देखें'],route:['Teaching route','संकेत का रास्ता'],override:['Tutor selected','शिक्षक ने चुना'],modelLabel:["Model + evidence checks", "मॉडल और तर्क की जाँच"],keywordLabel:['Keywords + evidence checks','शब्द नियम और तर्क-जाँच'],nextLesson:['Next practice question','अगला अभ्यास'],again:['Start this question again','यह प्रश्न फिर शुरू करें'],
  modelReady:['Ready · explanations are processed on this device.','तैयार · आपकी व्याख्या इसी डिवाइस पर जाँची जाती है।'],modelFallback:['Text model unavailable · keyword fallback is active. You can still choose a card with a tutor.','पाठ मॉडल उपलब्ध नहीं · शब्दों के नियम सक्रिय हैं। शिक्षक के साथ संकेत चुन सकते हैं।'],fatal:['The question bank could not load. Check your connection, then reload the page.','प्रश्न नहीं खुल सके। कनेक्शन जाँचकर पेज दोबारा खोलें।'],sessionReset:['New session started.','नया सत्र शुरू हुआ।'],
  category_denominator:['Size of one piece','एक टुकड़े का आकार'],category_numerator:['Number and size of pieces','टुकड़ों की संख्या और आकार'],category_whole:['Size of the whole','पूरे का आकार'],category_reasoned:['Check and extend the method','तरीका जाँचें और आगे बढ़ाएँ'],category_uncertain:['Ask for clarification','और जानकारी पूछें'],category_conflict:['Reconcile answer and method','उत्तर और तरीके को मिलाएँ'],
  approachTitle:['Listen to the thinking.','सोच को सुनें।'],approachLead:['Two learners can choose the same answer for different reasons. A useful next question starts with that difference.','दो विद्यार्थी अलग कारणों से एक ही उत्तर चुन सकते हैं। अगला उपयोगी सवाल इसी अंतर से शुरू होता है।'],method1:['The maths is exact.','गणित सटीक है।'],method1Body:['Integer cross-multiplication checks fraction values. The language model never decides which number is larger.','पूर्णांकों के क्रॉस गुणा से भिन्नों का मान जाँचा जाता है। कौन-सी संख्या बड़ी है, यह भाषा मॉडल तय नहीं करता।'],method2:['The route is a suggestion.','संकेत एक सुझाव है।'],method2Body:["A character n-gram classifier proposes a category. Shared evidence checks look for uncertainty, negation, number roles, and topic cues before selecting a teaching card. A tutor can override the route.", "अक्षरों के छोटे समूहों पर सीखा मॉडल श्रेणी सुझाता है। संकेत चुनने से पहले अनिश्चितता, नकार, संख्याओं की भूमिका और विषय की जाँच होती है। शिक्षक संकेत बदल सकते हैं।"],method3:['The next attempt is separate.','अगला प्रयास अलग है।'],method3Body:['A new fraction pair records a first response before revealing help. This gives a practice observation, with no claim of lasting mastery.','मदद दिखाने से पहले नई भिन्नों की जोड़ी का पहला उत्तर दर्ज होता है। यह अभ्यास की जानकारी है, स्थायी सीख का दावा नहीं।'],scopeNote:['This prototype covers three fraction comparisons. All examples and hints are AI-assisted authored material. Bilingual peer review, educator review, and a pupil study are pending.','इस प्रोटोटाइप में भिन्नों की तुलना के तीन प्रश्न हैं। उदाहरण और संकेत AI की मदद से बनाए गए हैं। द्विभाषी साथी, शिक्षक और विद्यार्थियों के साथ जाँच अभी बाकी है।'],privacyNote:['No account, cloud inference, or response storage is required. Inputs stay in session memory. The web host receives ordinary request metadata. A refresh or Reset starts over.','खाता, क्लाउड पर व्याख्या की जाँच या उत्तरों का भंडारण ज़रूरी नहीं है। लिखी बातें सत्र की मेमोरी में रहती हैं। होस्ट को सामान्य अनुरोध की जानकारी मिलती है। रीफ़्रेश या नया सत्र फिर से शुरू करता है।'],
  evidenceTitle:['Make the claim inspectable.','दावे को जाँचकर देखें।'],evidenceLead:["Both methods use the same evidence checks and teaching cards. The original cases are now a known regression set. A separate authored challenge set was frozen before the fixes. Independent human validation remains pending.", "दोनों तरीकों पर समान तर्क-जाँच लागू है। पुराने उदाहरण अब ज्ञात पुनः जाँच का समूह हैं। अलग नए उदाहरण सुधार लागू करने से पहले तय किए गए। स्वतंत्र मानवीय जाँच अभी बाकी है।"],metric:['Measure','माप'],learned:["Model + checks", "मॉडल और जाँच"],keywords:["Keywords + checks", "शब्द नियम और जाँच"],clearMetric:['Clear explanations routed correctly','स्पष्ट व्याख्याओं का सही रास्ता'],uncertainMetric:['Uncertain explanations deferred','अस्पष्ट व्याख्याओं पर और जानकारी माँगी'],wrongMetric:['Confident wrong routes ↓','पक्के लेकिन गलत रास्ते ↓'],deferMetric:['Clear explanations deferred','स्पष्ट व्याख्याओं पर भी जानकारी माँगी'],tradeoff:['Read the trade-off','दोनों पहलू देखें'],tradeoffBody:["The safeguards use explicit language cues. They can defer useful explanations and miss unfamiliar wording. Zero confident errors on these authored sets cannot establish real-world reliability. Human review stays essential.", "तर्क-जाँच स्पष्ट भाषाई संकेतों पर आधारित है। उपयोगी व्याख्या पर भी और जानकारी माँगी जा सकती है, और अनजानी भाषा छूट सकती है। इन बनाए गए उदाहरणों में शून्य पक्की गलतियों से वास्तविक भरोसेमंदी तय नहीं होती। मानवीय जाँच ज़रूरी है।"],languages:['Results by language','भाषा के अनुसार नतीजे'],language:['Language','भाषा'],cases:["Inspect regression and challenge cases", "पुराने और नए जाँच उदाहरण देखें"],explanation:['Explanation','व्याख्या'],expected:['Authored label','बनाया गया लेबल'],json:['Download full results','पूरे नतीजे खोलें'],split:['Data split','आँकड़ों का बँटवारा'],train:['training','प्रशिक्षण'],dev:['development','विकास'],test:["known regression cases", "ज्ञात पुनः जाँच उदाहरण"],reviewPending:['Review status · Automated checks only. Human review and learner testing pending.','जाँच की स्थिति · अभी केवल स्वचालित जाँच। मानवीय समीक्षा और विद्यार्थियों के साथ परीक्षण बाकी हैं।'],noReport:['Evaluation report unavailable. Run the evaluation script and refresh.','मूल्यांकन उपलब्ध नहीं। मूल्यांकन स्क्रिप्ट चलाकर रीफ़्रेश करें।'],compareNote:['Both methods use the current explanation. Scores are model signals, not measures of understanding.','दोनों तरीके वर्तमान व्याख्या देखते हैं। मॉडल के अंक समझ का माप नहीं हैं।'],rawModelFile:['Raw classifier weights','मूल मॉडल के भार'],rawProposal:['Raw proposal','मूल सुझाव'],decisionCheck:['Evidence check','तर्क-जाँच'],regressionSet:['Original regression set','पुराने उदाहरणों की पुनः जाँच'],challengeSet:['New authored challenge set','नए बनाए गए जाँच उदाहरण'],rawErrors:['Original raw model confident mistakes','मूल मॉडल की पक्की गलतियाँ'],noAnalysis:['Submit an explanation to compare methods.','तरीकों की तुलना के लिए व्याख्या दें।'],sourceHint:['Teaching action','संकेत'],noCertainty:['The model can be wrong, including on unfamiliar or negated explanations.','अनजान या नकार वाले तर्क पर भी मॉडल गलत हो सकता है।']
};

Object.assign(strings, experienceStrings);
let language = 'en';
let view = 'home';
let content;
let model;
let report;
let loadedModelHash;
let questionIndex = 0;
let state = newSession();
let heroScenario = 'denominator';
let judge = null;
let sampleSaved = null;
const examples = {
  denominator: { en: 'I picked one eighth because eight is bigger than six.', hi: 'मैंने एक बटा आठ चुना क्योंकि हर बड़ा है इसलिए भिन्न बड़ी है।' },
  whole: { en: 'My eighth comes from a much bigger roti than your sixth.', hi: 'मेरा आठवाँ भाग आपकी रोटी से बहुत बड़ी रोटी का है।' },
  uncertain: { en: 'I am not sure.', hi: 'मुझे नहीं पता।' }
};
const copy = (en, hi) => language === 'hi' ? hi : en;
function newSession() { return { stage: 'think', answer: '', draft: '', analysis: null, clarifications: 0, bars: false, override: false, transferAnswer: '', transferDraft: '', result: null }; }
function t(key) { return strings[key]?.[language === 'hi' ? 1 : 0] || key; }
function label(category) { return t('category_' + category); }
function escape(text) { return String(text).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;'); }
function fraction(pair) { return `<span class="fraction" aria-label="${pair[0]} / ${pair[1]}"><span class="top">${pair[0]}</span><span class="bottom">${pair[1]}</span></span>`; }
function pairMarkup(question) { return `<div class="fractions-pair">${fraction(question.left)}<span class="fraction-or" aria-hidden="true">${language === 'hi' ? 'या' : 'or'}</span>${fraction(question.right)}</div>`; }
function categoryForModel(text) { return model ? predict(text, model) : keywordPredict(text); }
function setStatus(message, error = false) { byId('status').textContent = message; byId('status').classList.toggle('error', error); }

function translatePage() {
  document.documentElement.lang = language;
  const accessibleNames = [['.skip-link','Skip to content','सामग्री पर जाएँ'],['.nav','Main navigation','मुख्य नेविगेशन'],['.language','Display language','प्रदर्शन की भाषा'],['.steps','Lesson progress','अभ्यास की प्रगति'],['#lesson-sidebar','Learning workspace navigation','अभ्यास क्षेत्र का नेविगेशन'],['.workspace-nav','Workspace sections','अभ्यास क्षेत्र के हिस्से'],['.try-sidebar','Examples and live learning process','उदाहरण और सत्र का क्रम'],['#compare-dialog .close-dialog','Close comparison','तरीकों की तुलना बंद करें'],['#tutor-dialog .close-dialog','Close teaching cards','संकेत बंद करें']];
  accessibleNames.forEach(([selector,en,hi]) => {
    const element = document.querySelector(selector);
    element.setAttribute('aria-label', copy(en,hi));
    if (selector === '.skip-link') element.textContent = copy(en,hi);
  });
  document.querySelectorAll('[data-t]').forEach(element => { element.innerHTML = t(element.dataset.t); });
  document.querySelectorAll('[data-language]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.language === language)));
  document.querySelectorAll('.workspace-nav [data-view]').forEach(button => button.setAttribute('aria-label', button.textContent.trim()));
  byId('sidebar-toggle').setAttribute('aria-label', copy('Toggle learning sidebar', 'सीखने का साइडबार खोलें या बंद करें'));
}

function choices(value, name = 'answer') {
  return `<fieldset><legend>${t('choose')}</legend><div class="answer-choices">${['left', 'right', 'equal'].map(option => `<label class="answer-option"><input type="radio" name="${name}" value="${option}" ${value === option ? 'checked' : ''} required><span>${t(option)}</span></label>`).join('')}</div></fieldset>`;
}

function bars(question) {
  return `<div class="bars">${[question.left, question.right].map(pair => `<div class="bar-row"><span class="bar-caption">${pair[0]}/${pair[1]}</span><div class="fraction-bar" role="img" aria-label="${copy(`${pair[0]} of ${pair[1]} equal parts shaded`, `${pair[1]} बराबर भागों में से ${pair[0]} भाग रंगे हैं`)}">${Array.from({ length: pair[1] }, (_, i) => `<span class="fraction-segment ${i < pair[0] ? 'shaded' : ''}"></span>`).join('')}</div></div>`).join('')}<p class="bar-note">${t('barNote')}</p></div>`;
}

function renderQuestions() {
  byId('question-list').innerHTML = content.questions.map((question, i) => `<button class="question-button ${i === questionIndex ? 'active' : ''}" data-question="${i}" aria-label="${escape(question.name[language])}" ${i === questionIndex ? 'aria-current="step"' : ''}><span class="question-number">${i + 1}</span><span class="question-title-label">${escape(question.name[language])}</span></button>`).join('');
}

function renderLesson() {
  if (!content) return;
  const question = content.questions[questionIndex];
  const step = state.stage === 'think' ? 1 : state.stage === 'explore' ? 2 : 3;
  for (let i = 1; i <= 3; i++) {
    const element = byId('step-' + i);
    element.classList.toggle('current', i === step);
    element.classList.toggle('done', i < step);
    if (i === step) element.setAttribute('aria-current', 'step'); else element.removeAttribute('aria-current');
  }
  byId('compare').disabled = !state.analysis;
  renderWorkspaceState();
  if (state.stage === 'think') {
    byId('lesson-card').innerHTML = `<div class="card-top"><p class="eyebrow">${t('question')}</p><span class="tag">${t('sameWholes')}</span></div><h2 class="question-title">${t('questionTitle')}</h2><p class="question-context">${escape(question.context[language])}</p>${pairMarkup(question)}<form id="reason-form" novalidate>${choices(state.answer)}<label class="input-label" for="reason">${t('reasonLabel')}<span class="input-note">${t('reasonNote')}</span></label><textarea id="reason" class="reason-input" maxlength="300" rows="3" placeholder="${t('placeholder')}" aria-describedby="reason-counter input-error"></textarea><div class="input-footer"><span>${t('inputFoot')}</span><span id="reason-counter"></span></div><p id="input-error" class="form-error" role="alert" hidden></p><div class="button-row"><button type="button" class="text-button" data-action="bars">${t(state.bars ? 'hideVisual' : 'visual')}</button><button class="primary-button" type="submit">${t('find')} <span aria-hidden="true">→</span></button></div></form>${state.bars ? bars(question) : ''}`;
    byId('reason').value = state.draft;
    updateCounter();
  } else if (state.stage === 'explore') {
    const hint = content.hints[state.analysis.teaching][language];
    const canClarify = state.analysis.teaching === 'uncertain' && state.clarifications < 1;
    byId('lesson-card').innerHTML = `<div class="card-top"><p class="eyebrow">${t('nextQuestion')}</p><span class="tag">${state.override ? t('override') : model ? t('modelLabel') : t('keywordLabel')}</span></div><blockquote class="learner-quote" id="learner-quote"></blockquote><p class="hint-kicker">${label(state.analysis.teaching)}</p><h2 class="hint-title">${escape(hint.title)}</h2><p class="hint-question">${escape(hint.question)}</p><p class="hint-body">${escape(hint.body)}</p><button class="text-button" data-action="bars">${t(state.bars ? 'hideVisual' : 'visual')}</button>${state.bars ? bars(question) : ''}<p class="provisional">${t('provisional')}</p><div class="button-row"><button class="text-button" data-action="tutor">${t('changeHint')}</button><button class="primary-button" data-action="${canClarify ? 'clarify' : 'fresh'}">${t(canClarify ? 'addDetail' : 'fresh')} <span aria-hidden="true">→</span></button></div><button class="text-button" data-action="edit">${t('edit')}</button>`;
    byId('learner-quote').textContent = state.draft;
  } else if (state.stage === 'transfer') {
    byId('lesson-card').innerHTML = `<div class="card-top"><p class="eyebrow">${t('transfer')}</p><span class="tag">${t('sameWholes')}</span></div><h2 class="question-title">${t('independent')}</h2><p class="question-context">${escape(question.transfer.context[language])}</p>${pairMarkup(question.transfer)}<form id="transfer-form" novalidate>${choices(state.transferAnswer, 'transfer-answer')}<label class="input-label" for="transfer-reason">${t('reasonLabel')}<span class="input-note">${t('transferNote')}</span></label><textarea id="transfer-reason" class="reason-input" rows="2" maxlength="300" placeholder="${t('placeholder')}"></textarea><p id="input-error" class="form-error" role="alert" hidden></p><div class="button-row"><button type="button" class="text-button" data-action="back">${t('back')}</button><button type="submit" class="primary-button coral">${t('check')} <span aria-hidden="true">→</span></button></div></form>`;
    byId('transfer-reason').value = state.transferDraft;
  } else {
    const correct = state.result.answer === compareFractions(question.transfer.left, question.transfer.right);
    const symbol = { left: '>', right: '<', equal: '=' }[compareFractions(question.transfer.left, question.transfer.right)];
    byId('lesson-card').innerHTML = `<p class="eyebrow">${t('transfer')}</p><div class="result-mark ${correct ? '' : 'retry'}" aria-hidden="true">${correct ? '✓' : '↻'}</div><h2 class="hint-title">${t(correct ? 'correct' : 'retry')}</h2><p class="hint-body">${t('actual')}</p><div class="fractions-pair">${fraction(question.transfer.left)}<span class="fraction-or">${symbol}</span>${fraction(question.transfer.right)}</div>${bars(question.transfer)}<div class="result-facts"><div class="result-fact"><span>${t('firstAttempt')}</span><strong>${t(correct ? 'correctShort' : 'revisit')}</strong></div><div class="result-fact"><span>${t('route')}</span><strong>${state.override ? t('override') : label(state.analysis.teaching)}</strong></div></div><blockquote class="learner-quote" id="transfer-quote"></blockquote><p class="provisional">${t('resultNote')}</p><div class="button-row"><button class="text-button" data-action="again">${t('again')}</button><button class="primary-button" data-action="next">${t('nextLesson')} <span aria-hidden="true">→</span></button></div>`;
    byId('transfer-quote').textContent = state.result.explanation;
  }
}

function updateCounter() {
  const element = byId('reason-counter');
  if (element) element.textContent = `${Array.from(state.draft).length}/300 ${t('characters')}`;
}

function renderMethod() {
  byId('method-view').innerHTML = `<p class="eyebrow">SAME ANSWER · PS 03</p><h1 id="method-heading">${t('approachTitle')}</h1><p class="information-lead">${t('approachLead')}</p><div class="method-grid">${[1,2,3].map((n) => `<article class="method-card"><p class="eyebrow">${t(['','think','explore','try'][n])}</p><h2>${t('method' + n)}</h2><p>${t('method' + n + 'Body')}</p></article>`).join('')}</div><div class="information-note"><p>${t('scopeNote')}</p><p>${t('privacyNote')}</p></div><button class="primary-button" data-go="practice">${t('practice')} <span aria-hidden="true">→</span></button>`;
  byId('method-view').insertAdjacentHTML('beforeend', `<section id="method-architecture" class="home-section">${renderArchitecture(language)}</section><section class="information-note" id="future-validation"><p class="eyebrow">${copy('NEXT: VALIDATE WITH PEOPLE', 'अगला कदम: लोगों के साथ जाँच')}</p><h2>${copy('A useful prototype. A careful next step.', 'उपयोगी प्रोटोटाइप। सोच-समझकर अगला कदम।')}</h2><p>${copy('Educator review, independent bilingual checks, representative learner explanations, and delayed unaided assessments come before claims of learning impact. More topics need their own authored content and evaluation.', 'सीख के असर का दावा करने से पहले शिक्षक समीक्षा, स्वतंत्र द्विभाषी जाँच, विद्यार्थियों की वास्तविक व्याख्याएँ और बाद में बिना मदद के परीक्षण चाहिए। नए विषयों की अपनी सामग्री और जाँच चाहिए।')}</p></section>`);
}

function renderEvidence() {
  const container = byId('evidence-view');
  if (!report) {
    container.innerHTML = `<h1 id="evidence-heading">${t('evidenceTitle')}</h1><p>${t('noReport')}</p>`;
    return;
  }
  const allCases = [...report.rows, ...report.challenge.rows];
  const metrics = [
    ['clearMetric', 'correctClear', 'clearTotal'],
    ['uncertainMetric', 'correctUncertain', 'uncertainTotal'],
    ['wrongMetric', 'confidentWrong'],
    ['deferMetric', 'deferredClear']
  ];
  function metricTable(results) {
    return `<div class="data-table-wrap"><table class="data-table">
      <thead><tr><th scope="col">${t('metric')}</th><th scope="col">${t('learned')}</th><th scope="col">${t('keywords')}</th></tr></thead>
      <tbody>${metrics.map(([name, key, total]) => `<tr>
        <th scope="row">${t(name)}</th>
        <td>${results.model[key]}${total ? ' / ' + results.model[total] : ''}</td>
        <td>${results.keyword[key]}${total ? ' / ' + results.keyword[total] : ''}</td>
      </tr>`).join('')}</tbody>
    </table></div>`;
  }
  container.innerHTML = `
    <p class="eyebrow">SAME ANSWER · EVALUATION</p>
    <h1 id="evidence-heading">${t('evidenceTitle')}</h1>
    <p class="information-lead">${t('evidenceLead')}</p>
    <p class="evaluation-caption">${t('split')} · ${report.splitCounts.train} ${t('train')} / ${report.splitCounts.dev} ${t('dev')} / ${report.rows.length} ${t('test')}</p>
    <h2 class="data-heading">${t('regressionSet')} · ${report.rows.length}</h2>
    ${metricTable(report)}
    <h2 class="data-heading">${t('challengeSet')} · ${report.challenge.rows.length}</h2>
    ${metricTable(report.challenge)}
    <p class="evaluation-caption">${t('rawErrors')} · ${report.originalBaseline.model.confidentWrong} / ${report.rows.length}</p>
    <div class="information-note"><strong>${t('tradeoff')}</strong><p>${t('tradeoffBody')}</p><p>${t('reviewPending')}</p></div>
    <h2 class="data-heading">${t('languages')} · ${t('challengeSet')}</h2>
    <div class="data-table-wrap"><table class="data-table">
      <thead><tr><th>${t('language')}</th><th>${t('learned')}</th><th>${t('keywords')}</th></tr></thead>
      <tbody>${Object.entries(report.challenge.model.languages).map(([name, values]) => `<tr>
        <th scope="row">${escape(name)}</th><td>${values.correct} / ${values.total}</td>
        <td>${report.challenge.keyword.languages[name].correct} / ${values.total}</td>
      </tr>`).join('')}</tbody>
    </table></div>
    <details class="case-details"><summary>${t('cases')} (${allCases.length})</summary>
      <div class="data-table-wrap"><table class="data-table">
        <thead><tr><th>${t('explanation')}</th><th>${t('expected')}</th><th>${t('learned')}</th><th>${t('keywords')}</th></tr></thead>
        <tbody>${allCases.map(row => `<tr>
          <td>${escape(row.text || '∅')}<br><span class="muted">${escape(row.id)} · ${escape(row.language)}</span></td>
          <td>${label(row.expected)}</td>
          <td class="${row.model === row.expected ? 'good' : 'wrong'}">${label(row.model)}<br><span class="muted">${t('rawProposal')} · ${label(row.rawModel)}</span></td>
          <td class="${row.keyword === row.expected ? 'good' : 'wrong'}">${label(row.keyword)}<br><span class="muted">${t('rawProposal')} · ${label(row.rawKeyword)}</span></td>
        </tr>`).join('')}</tbody>
      </table></div>
    </details>
    <div class="evidence-links"><a href="./evaluation.json">${t('json')} ↗</a><a href="./model.json">${t('rawModelFile')} JSON ↗</a></div>
    <p class="evaluation-caption">SHA-256 · model ${escape(report.modelSha256.slice(0,12))} · routing ${escape(report.routingSha256.slice(0,12))}</p>`;
}

function renderAll() {
  translatePage();
  renderLanding();
  renderMethod(); renderEvidence();
  if (content) { renderQuestions(); renderLesson(); }
  if (content) setStatus(t(model ? 'modelReady' : 'modelFallback'), !model);
  updateThemeButton();
  renderJudge();
}

function setView(next) {
  const previous = view;
  view = ['home','practice','method','evidence'].includes(next) ? next : 'home';
  ['home','practice','method','evidence'].forEach(name => { byId(name + '-view').hidden = name !== view; });
  document.querySelectorAll('[data-view]').forEach(button => {
    const active = button.dataset.view === view;
    button.classList.toggle('active', active);
    if (active) button.setAttribute('aria-current', 'page'); else button.removeAttribute('aria-current');
  });
  if (location.hash !== '#' + view) history.pushState(null, '', '#' + view);
  if (view !== previous && !judge) {
    const heading = byId(view === 'practice' ? 'page-heading' : view === 'home' ? 'home-heading' : view + '-heading');
    if (heading) { heading.tabIndex = -1; heading.focus({ preventScroll: true }); }
    window.scrollTo({ top: 0, behavior: 'instant' });
  }
}

function startQuestion(index) {
  questionIndex = index;
  state = newSession();
  renderQuestions(); renderLesson();
}

function renderLanding() {
  let preview;
  if (content) {
    const text = examples[heroScenario][language];
    const result = categoryForModel(text);
    const route = teachingCategory(result.category, 'left', content.questions[0]);
    preview = { text, title: content.hints[route][language].title, question: content.hints[route][language].question, scenario: heroScenario, mode: copy(model ? 'LOCAL MODEL' : 'KEYWORD FALLBACK', model ? 'स्थानीय मॉडल' : 'शब्द नियम') };
  }
  byId('home-view').innerHTML = renderHome({ language, preview, report, questionCount: content?.questions.length || 0 });
}

function renderWorkspaceState() {
  const step = state.stage === 'think' ? 1 : state.stage === 'explore' ? 2 : 3;
  const stage = state.stage === 'think' ? 0 : state.stage === 'explore' ? 3 : 4;
  const uncertain = state.analysis?.teaching === 'uncertain';
  byId('workspace-summary').innerHTML = `<div class="session-stat"><span class="progress-ring progress-${step}" aria-hidden="true">${step}<small>/3</small></span><div><span class="stat-label">${copy('CURRENT SESSION', 'वर्तमान सत्र')}</span><strong>${t(['', 'think', 'explore', 'try'][step])}</strong></div></div><div class="session-stat"><span class="stat-icon">${icon('book')}</span><div><span class="stat-label">${copy('PRACTICE TOPIC', 'अभ्यास का विषय')}</span><strong>${escape(content.questions[questionIndex].name[language])}</strong></div></div><div class="session-stat"><span class="stat-icon">${icon('shield')}</span><div><span class="stat-label">${copy('TEACHING ROUTE', 'संकेत का रास्ता')}</span><strong>${state.override ? t('override') : state.analysis ? label(state.analysis.teaching) : copy('Waiting for your reasoning', 'आपके तर्क की प्रतीक्षा')}</strong></div></div>`;
  if (sampleSaved && !judge) byId('workspace-summary').insertAdjacentHTML('beforeend', '<div class="sample-notice"><span>' + copy('Authored sample · your previous session is saved temporarily.', 'बनाया गया उदाहरण · आपका पिछला सत्र अस्थायी रूप से सुरक्षित है।') + '</span><button class="text-button" data-restore-sample>' + copy('Return to my session ↗', 'मेरे सत्र पर लौटें ↗') + '</button></div>');
  byId('live-engine').innerHTML = `<p class="eyebrow">${copy('LIVE TRANSFORMATION', 'सत्र का क्रम')}</p><h2>${copy('From reasoning<br>to a next step.', 'तर्क से<br>अगले कदम तक।')}</h2>${engineFlow(language, stage, uncertain)}<p class="small muted">${judge ? copy('Authored demonstration · your previous session will be restored on exit.', 'बनाया गया प्रदर्शन · बाहर आने पर पुराना सत्र लौटेगा।') : uncertain ? copy('More detail is needed. This route is provisional.', 'और जानकारी चाहिए। यह संकेत बदला जा सकता है।') : copy('Tracks this session. It is not a measure of mastery.', 'इसी सत्र का क्रम। यह सीख की दक्षता का माप नहीं है।')}</p>`;
}

function runExample(scenario) {
  if (!examples[scenario]) return;
  if (!judge && !sampleSaved) sampleSaved = { state: structuredClone(state), questionIndex, language, view };
  startQuestion(0);
  state.answer = 'left';
  state.draft = examples[scenario][language];
  setView('practice');
  analyze();
}

function scrollToSection(id, focusId) {
  requestAnimationFrame(() => {
    const target = byId(id);
    if (!target) return;
    target.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
    const focusTarget = focusId ? byId(focusId) : target;
    focusTarget.tabIndex = -1;
    focusTarget.focus({ preventScroll: true });
  });
}

function updateThemeButton() {
  const light = document.documentElement.dataset.theme === 'light';
  byId('theme-toggle').textContent = light ? '☾' : '☼';
  byId('theme-toggle').setAttribute('aria-pressed', String(light));
  byId('theme-toggle').setAttribute('aria-label', copy(`Switch to ${light ? 'dark' : 'light'} mode`, light ? 'गहरी थीम चुनें' : 'हल्की थीम चुनें'));
  document.querySelector('meta[name="theme-color"]').content = light ? '#F5F7FC' : '#080D1C';
}

function renderJudge() {
  const panel = byId('judge-panel');
  panel.hidden = !judge;
  byId('judge-start').setAttribute('aria-pressed', String(Boolean(judge)));
  document.body.classList.toggle('judge-active', Boolean(judge));
  if (!judge) return;
  const steps = judgeSteps(language);
  const step = steps[judge.index];
  panel.innerHTML = `<div class="judge-top"><p class="eyebrow">${copy('GUIDED JUDGE TOUR', 'जज के लिए निर्देशित प्रदर्शन')} · ${judge.index + 1}/7</p><button class="icon-button" data-judge="exit" aria-label="${copy('Exit and restore my session', 'बाहर आएँ और सत्र वापस पाएँ')}">×</button></div><div class="judge-progress" aria-label="${copy('Tour progress', 'प्रदर्शन का क्रम')}">${steps.map((_, index) => `<span class="${index <= judge.index ? 'active' : ''}"></span>`).join('')}</div><h2 id="judge-heading">${step.title}</h2><p>${step.body}</p><div class="judge-bottom"><span class="small muted">~${step.seconds}s · ${copy('Authored demo', 'बनाया गया प्रदर्शन')}</span><div><button class="text-button" data-judge="back" ${judge.index === 0 ? 'disabled' : ''}>${copy('Back', 'पीछे')}</button><button class="primary-button" data-judge="next">${judge.index === steps.length - 1 ? copy('Finish & restore', 'पूरा करें और सत्र लौटाएँ') : copy('Next', 'अगला')} →</button></div></div>`;
}

function showJudgeStep(index) {
  judge.index = index;
  const step = judgeSteps(language)[index];
  if (index === 2) runExample('denominator');
  setView(step.view);
  renderJudge();
  scrollToSection(step.target || 'page-heading', 'judge-heading');
}

function startJudge() {
  if (!content || judge) return;
  judge = { index: 0, saved: { state: structuredClone(state), questionIndex, language, view } };
  state = newSession();
  questionIndex = 0;
  renderAll();
  showJudgeStep(0);
}

function exitJudge() {
  if (!judge) return;
  const saved = judge.saved;
  state = saved.state; questionIndex = saved.questionIndex; language = saved.language;
  judge = null;
  document.querySelectorAll('dialog[open]').forEach(dialog => dialog.close());
  renderAll(); setView(saved.view);
  byId('judge-start').focus({ preventScroll: true });
}

function selectArchitecture(button) {
  const widget = button.closest('.architecture-widget');
  widget.querySelectorAll('[role="tab"]').forEach(tab => {
    const selected = tab === button;
    tab.setAttribute('aria-selected', String(selected));
    tab.tabIndex = selected ? 0 : -1;
  });
  const panel = widget.querySelector('[data-architecture-panel]');
  panel.innerHTML = architecturePanel(language, button.dataset.architecture);
  panel.setAttribute('aria-labelledby', button.id);
}

function analyze() {
  const question = content.questions[questionIndex];
  const learned = categoryForModel(state.draft);
  const keyword = keywordPredict(state.draft);
  state.analysis = { learned, keyword, teaching: teachingCategory(learned.category, state.answer, question) };
  state.override = false;
  state.stage = 'explore';
  state.bars = false;
  renderLesson();
  focusHeading();
}

function focusHeading() { const heading = byId('lesson-card').querySelector('h2'); if (heading) { heading.tabIndex = -1; heading.focus({ preventScroll: true }); } }
function formError(message) { const element = byId('input-error'); element.textContent = message; element.hidden = false; }

function openComparison() {
  if (!state.analysis) return;
  const question = content.questions[questionIndex];
  byId('compare-body').innerHTML = `<blockquote class="learner-quote" id="comparison-quote"></blockquote><div class="comparison-grid">${[['modelLabel',state.analysis.learned],['keywordLabel',state.analysis.keyword]].map(([name,result]) => `<section class="comparison-card"><p class="eyebrow">${t(name)}${!model && name === 'modelLabel' ? ' · fallback' : ''}</p><h3>${label(result.category)}</h3><p>${t('rawProposal')} · ${label(result.rawCategory || result.category)}</p><p>${t('decisionCheck')} · ${escape(result.reason)}</p><p>${escape(content.hints[teachingCategory(result.category, state.answer, question)][language].question)}</p></section>`).join('')}</div><p class="provisional">${t('compareNote')}</p><p class="small muted">${t('noCertainty')}</p>`;
  byId('comparison-quote').textContent = state.draft;
  byId('compare-dialog').showModal();
}

function openTutor() {
  byId('tutor-cards').innerHTML = [...CATEGORIES, 'uncertain'].map(category => `<button class="tutor-card" data-card="${category}"><strong>${escape(content.hints[category][language].title)}</strong><span>${escape(content.hints[category][language].question)}</span></button>`).join('');
  byId('tutor-dialog').showModal();
}

document.addEventListener('input', event => {
  if (event.target.id === 'reason') { state.draft = event.target.value; updateCounter(); }
  if (event.target.id === 'transfer-reason') state.transferDraft = event.target.value;
});
document.addEventListener('change', event => {
  if (event.target.name === 'answer') state.answer = event.target.value;
  if (event.target.name === 'transfer-answer') state.transferAnswer = event.target.value;
});
document.addEventListener('submit', event => {
  if (!['reason-form','transfer-form'].includes(event.target.id)) return;
  event.preventDefault();
  if (!content) return;
  const isTransfer = event.target.id === 'transfer-form';
  if (state.stage !== (isTransfer ? 'transfer' : 'think')) return;
  const answer = isTransfer ? state.transferAnswer : state.answer;
  const text = (isTransfer ? state.transferDraft : state.draft).trim();
  if (!['left','right','equal'].includes(answer)) return formError(t('selectionError'));
  if (!text) return formError(t('textError'));
  if (Array.from(text).length > 300) return formError(t('lengthError'));
  if (isTransfer) {
    state.result = { answer, explanation: text };
    state.stage = 'done';
    renderLesson(); focusHeading();
  } else analyze();
});

document.addEventListener('click', event => {
  const button = event.target.closest('button, a.brand');
  if (!button) return;
  if (button.tagName === 'A') { event.preventDefault(); setView('home'); scrollToSection('home-heading'); return; }
  if (button.id === 'theme-toggle') {
    document.documentElement.dataset.theme = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
    try { localStorage.setItem('same-answer-theme', document.documentElement.dataset.theme); } catch { /* Theme still works when storage is unavailable. */ }
    updateThemeButton(); return;
  }
  if (button.id === 'sidebar-toggle') {
    const workspace = button.closest('.workspace');
    const collapsed = workspace.dataset.sidebarCollapsed !== 'true';
    workspace.dataset.sidebarCollapsed = String(collapsed);
    button.setAttribute('aria-expanded', String(!collapsed)); return;
  }
  if (button.dataset.architecture) { selectArchitecture(button); return; }
  if (button.id === 'judge-start') { if (judge) exitJudge(); else startJudge(); return; }
  if (button.dataset.judge) {
    if (!judge) return;
    if (button.dataset.judge === 'exit' || (button.dataset.judge === 'next' && judge.index === 6)) exitJudge();
    else showJudgeStep(judge.index + (button.dataset.judge === 'back' ? -1 : 1));
    return;
  }
  if (button.dataset.scroll) { setView('home'); scrollToSection(button.dataset.scroll); return; }
  if (button.dataset.preview) { heroScenario = button.dataset.preview; renderLanding(); byId('home-view').querySelector(`[data-preview="${heroScenario}"]`).focus({ preventScroll: true }); return; }
  if (button.dataset.language) { language = button.dataset.language; renderAll(); return; }
  if (button.dataset.view || button.dataset.go) { setView(button.dataset.view || button.dataset.go); return; }
  if (button.classList.contains('close-dialog')) { button.closest('dialog').close(); return; }
  if (!content) return;
  if (button.dataset.openExample) { runExample(button.dataset.openExample); return; }
  if (button.hasAttribute('data-bilingual-demo')) { language = 'hi'; renderAll(); setView('practice'); byId('reason')?.focus(); return; }
  if (button.hasAttribute('data-visual-demo')) { runExample('denominator'); state.bars = true; renderLesson(); scrollToSection('lesson-card'); return; }
  if (button.hasAttribute('data-tutor-demo')) { if (!state.analysis) runExample('denominator'); setView('practice'); openTutor(); return; }
  if (button.hasAttribute('data-fresh-demo')) { if (!state.analysis) runExample('denominator'); setView('practice'); if (!state.result) state.stage = 'transfer'; renderLesson(); focusHeading(); return; }
  if (button.hasAttribute('data-restore-sample') && sampleSaved && !judge) { const saved = sampleSaved; state = saved.state; questionIndex = saved.questionIndex; language = saved.language; sampleSaved = null; renderAll(); setView(saved.view); return; }
  if (button.id === 'reset') { if (!judge) sampleSaved = null; state = newSession(); setView('practice'); renderAll(); setStatus(t('sessionReset')); return; }
  if (button.dataset.question !== undefined) { startQuestion(Number(button.dataset.question)); return; }
  if (button.id === 'compare') { openComparison(); return; }
  if (button.dataset.example) {
    runExample(button.dataset.example);
    return;
  }
  if (button.dataset.card && state.analysis) {
    state.analysis.teaching = teachingCategory(button.dataset.card, state.answer, content.questions[questionIndex]);
    state.override = true; state.stage = 'explore';
    byId('tutor-dialog').close(); renderLesson(); focusHeading(); return;
  }
  switch (button.dataset.action) {
    case 'bars': state.bars = !state.bars; renderLesson(); break;
    case 'tutor': openTutor(); break;
    case 'clarify': state.clarifications += 1; state.stage = 'think'; renderLesson(); byId('reason').focus(); break;
    case 'edit': state.stage = 'think'; renderLesson(); byId('reason').focus(); break;
    case 'fresh': state.stage = 'transfer'; renderLesson(); focusHeading(); break;
    case 'back': state.stage = 'explore'; renderLesson(); focusHeading(); break;
    case 'again': startQuestion(questionIndex); break;
    case 'next': startQuestion((questionIndex + 1) % content.questions.length); break;
  }
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && judge && !document.querySelector('dialog[open]')) { event.preventDefault(); exitJudge(); return; }
  const tab = event.target.closest('[data-architecture]');
  if (!tab || !['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) return;
  event.preventDefault();
  const tabs = [...tab.closest('[role="tablist"]').querySelectorAll('[role="tab"]')];
  const index = tabs.indexOf(tab);
  const next = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
  selectArchitecture(tabs[next]); tabs[next].focus();
});
function syncRoute() {
  const route = location.hash.slice(1);
  if (['home','practice','method','evidence'].includes(route)) setView(route);
}
window.addEventListener('hashchange', syncRoute);
window.addEventListener('popstate', syncRoute);
try {
  const theme = localStorage.getItem('same-answer-theme');
  if (['light','dark'].includes(theme)) document.documentElement.dataset.theme = theme;
} catch { /* The default theme needs no storage. */ }
updateThemeButton();
setView(location.hash.slice(1));

async function loadJSON(file) {
  const response = await fetch(new URL(file, import.meta.url), { cache: 'no-store' });
  if (!response.ok) throw new Error(`Could not load ${file}`);
  const text = await response.text();
  if (file === './model.json' && crypto.subtle) {
    const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
    loadedModelHash = Array.from(new Uint8Array(hash), byte => byte.toString(16).padStart(2, '0')).join('');
  }
  return JSON.parse(text);
}

async function boot() {
  const [questionResult, modelResult, reportResult] = await Promise.allSettled([loadJSON('./content.json'), loadJSON('./model.json'), loadJSON('./evaluation.json')]);
  try {
    if (questionResult.status !== 'fulfilled') throw new Error('Content unavailable');
    content = validateContent(questionResult.value);
  } catch {
    setStatus(t('fatal'), true);
    byId('lesson-card').innerHTML = `<h2 class="question-title">${t('fatal')}</h2><button class="secondary-button" id="reload">Reload / दोबारा खोलें</button>`;
    byId('reload').addEventListener('click', () => location.reload());
    renderLanding(); renderMethod(); renderEvidence(); setView('practice'); return;
  }
  if (modelResult.status === 'fulfilled') {
    try { model = validateModel(modelResult.value); } catch { model = null; }
  }
  if (reportResult.status === 'fulfilled') {
    try {
      const candidate = validateReport(reportResult.value);
      if (model && loadedModelHash === candidate.modelSha256) report = candidate;
    } catch { report = null; }
  }
  renderAll();
}
boot();
