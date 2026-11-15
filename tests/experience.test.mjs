import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';
import * as core from '../dist/core.js';
import * as experience from '../dist/experience.js';

const load = async name => JSON.parse(await fs.readFile(new URL('../dist/' + name, import.meta.url), 'utf8'));
const content = await load('content.json');
const model = await load('model.json');
const report = await load('evaluation.json');

test('landing evidence uses the release report and escapes learner-like preview text', () => {
  const html = experience.renderHome({ language: 'en', report, questionCount: 3, preview: { text: '<img src=x onerror=alert(1)>', title: '<script>', question: 'A & B', scenario: 'whole', mode: 'LOCAL MODEL' } });
  assert.ok(html.includes('15<small>/16</small>'));
  assert.ok(html.includes('31 of 32'));
  assert.ok(html.includes('Independent language review'));
  assert.ok(html.includes('&lt;img'));
  assert.ok(!html.includes('<img'));
  assert.ok(html.includes('&lt;script&gt;'));
  const unavailable = experience.renderHome({ language: 'hi', questionCount: 3 });
  assert.ok(!unavailable.includes('15<small>'));
  assert.ok(unavailable.includes('हिंदी'));
});

test('architecture scopes are distinct and the workflow identifies one real stage', () => {
  const home = experience.renderArchitecture('en', 'model', 'home');
  const method = experience.renderArchitecture('hi', 'checks', 'method');
  assert.ok(home.includes("id='home-architecture-panel'"));
  assert.ok(method.includes("id='method-architecture-panel'"));
  assert.equal((experience.engineFlow('en', 3, true).match(/aria-current/g) || []).length, 1);
  assert.ok(experience.engineFlow('hi', 3, true).includes('is-paused'));
  for (const language of ['en', 'hi']) {
    const steps = experience.judgeSteps(language);
    assert.equal(steps.length, 7);
    assert.equal(steps.reduce((total, step) => total + step.seconds, 0), 180);
    assert.ok(steps.every(step => ['home', 'practice', 'method', 'evidence'].includes(step.view)));
  }
});

// The browser checks cover real DOM behavior; this small harness checks session restoration exactly.
async function appHarness() {
  const elements = new Map();
  const element = id => {
    if (!elements.has(id)) elements.set(id, {
      innerHTML: '', textContent: '', hidden: false, dataset: {}, classList: { toggle() {} },
      attributes: {}, setAttribute(key, value) { this.attributes[key] = value; }, removeAttribute(key) { delete this.attributes[key]; },
      querySelector() { return { focus() {} }; }, insertAdjacentHTML(_, html) { this.innerHTML += html; }, focus() {}, scrollIntoView() {}, addEventListener() {}
    });
    return elements.get(id);
  };
  const events = {};
  const context = vm.createContext({ ...core, ...experience, console, structuredClone, URL, crypto: {},
    document: { getElementById: element, querySelectorAll: () => [], querySelector: () => element('meta'), documentElement: { dataset: {} }, body: { classList: { toggle() {} } }, addEventListener(type, handler) { events[type] = handler; } },
    window: { addEventListener() {}, scrollTo() {} }, location: { hash: '#practice' }, history: { pushState() {} },
    localStorage: { getItem() { return null; } }, requestAnimationFrame() {}, matchMedia: () => ({ matches: true })
  });
  const source = (await fs.readFile(new URL('../dist/app.js', import.meta.url), 'utf8')).replace(/^import .*;\r?\n/gm, '').replaceAll('import.meta.url', "'http://localhost/app.js'").replace(/\bboot\(\);\s*$/, '');
  vm.runInContext(source, context);
  context.fixture = { content, model, report };
  vm.runInContext('content = fixture.content; model = fixture.model; report = fixture.report;', context);
  return { run: code => vm.runInContext(code, context), events, element };
}

test('Judge Mode restores full learner state, language, question and route after the seven-step demo', async () => {
  const app = await appHarness();
  app.run("language='hi'; view='practice'; questionIndex=1; state={...newSession(),draft:'मेरे अपने शब्द',answer:'right',bars:true};");
  const before = app.run('JSON.stringify({state,language,questionIndex,view})');
  app.run('startJudge();');
  for (let index = 1; index < 7; index++) app.run(`showJudgeStep(${index});`);
  app.run("state.draft='changed demo only'; language='en'; exitJudge();");
  assert.equal(app.run('JSON.stringify({state,language,questionIndex,view})'), before);
  assert.equal(app.run('judge'), null);
  assert.equal(app.element('judge-panel').hidden, true);
});

test('hero preview and navigation leave responses intact; examples use real checked routing', async () => {
  const app = await appHarness();
  app.run("state.draft='My own unfinished explanation'; state.answer='equal'; renderLanding(); setView('home'); setView('practice');");
  assert.equal(app.run('state.draft'), 'My own unfinished explanation');
  assert.equal(app.run('state.answer'), 'equal');
  app.run("runExample('denominator');");
  assert.equal(app.run('state.analysis.teaching'), 'denominator');
  app.run("runExample('whole');");
  assert.equal(app.run('state.analysis.teaching'), 'whole');
  app.run("runExample('uncertain');");
  assert.equal(app.run('state.analysis.teaching'), 'uncertain');
  app.run("language='hi'; runExample('denominator');");
  assert.equal(app.run('state.analysis.teaching'), 'denominator');
  app.run("runExample('whole');");
  assert.equal(app.run('state.analysis.teaching'), 'whole');
  app.run("startJudge(); exitJudge(); startJudge(); exitJudge();");
  assert.equal(app.run('judge'), null);
});

test('authored samples can restore unfinished work and a completed first attempt cannot be reopened by the shortcut', async () => {
  const app = await appHarness();
  app.run("state.draft='Keep my explanation'; state.answer='right'; runExample('whole');");
  const click = attributes => app.events.click({ target: { closest: () => ({ dataset: attributes, id: '', hasAttribute: key => key in attributes, classList: { contains: () => false } }) } });
  click({ 'data-restore-sample': '' });
  assert.equal(app.run('state.draft'), 'Keep my explanation');
  assert.equal(app.run('state.answer'), 'right');
  app.run("runExample('denominator'); state.stage='done'; state.result={answer:'right',explanation:'My first attempt'};");
  click({ 'data-fresh-demo': '' });
  assert.equal(app.run('state.stage'), 'done');
  assert.equal(app.run('state.result.explanation'), 'My first attempt');
  click({ 'data-visual-demo': '' });
  assert.equal(app.run('state.stage'), 'explore');
  assert.equal(app.run('state.bars'), true);
});

test('missing model uses the labeled fallback and missing content shows recovery', async () => {
  const app = await appHarness();
  app.run("model=undefined; report=undefined; fetch = async url => ({ok:!url.pathname.endsWith('model.json'),text:async()=>JSON.stringify(url.pathname.endsWith('content.json') ? fixture.content : fixture.report)});");
  await app.run('boot()');
  assert.equal(app.run('Boolean(model)'), false);
  assert.ok(app.element('home-view').innerHTML.includes('KEYWORD FALLBACK'));
  assert.equal(app.run('report'), undefined);
  const missing = await appHarness();
  missing.run('content=undefined; fetch = async () => ({ok:false});');
  await missing.run('boot()');
  assert.ok(missing.element('lesson-card').innerHTML.includes('id="reload"'));
  assert.equal(missing.run('view'), 'practice');
});
