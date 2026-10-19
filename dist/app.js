import {curriculum,courseById,getLessons,allLessons} from './curriculum.js';
import {lessonByKey,lessons} from './lessons.js';
import {labByKey,labLessons} from './labs.js';

const app = document.querySelector('#app');
const KEY = 'ambertheory-bca-progress-v1';
const FEEDBACK = 'ambertheory-bca-feedback-v1';
const load = (k,fallback) => {try{return JSON.parse(localStorage.getItem(k))||fallback}catch{return fallback}};
const store = (k,v) => {try{localStorage.setItem(k,JSON.stringify(v))}catch{}};
let progress = load(KEY,{}), feedback = load(FEEDBACK,{});
let tab='theory', query='', sideClosed=false, mobileOpen=false, answers={}, revealed={}, runWorker=null, runTimer=null, step=0;
const esc = x => String(x ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt = x => esc(x).replace(/`([^`]+)`/g,'<code>$1</code>').replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>');
const path = (c,ui=0,ti=0) => `#/c/${c}/${ui}/${ti}`;
const grouped = (s,k) => curriculum.filter(c=>c.semester===s&&c.kind===k);
const count = c => getLessons(c).filter(l=>progress[l.id]).length;
const readyFor = l => (l.kind==='lab'?labByKey:lessonByKey)[`${l.courseId}|${l.name}`];
const tally = c => {const items=getLessons(c);return [count(c),items.length,items.filter(x=>readyFor(x)).length]};
const semLabel = s => `Semester ${s===3?'III':s===4?'IV':s}`;

function layout(body,mode='home'){
  document.body.classList.toggle('sidebar-closed',sideClosed);
  app.innerHTML=`<div class="app-shell"><header class="topbar"><div class="topbar-inner">
    <a class="identity" href="#/" aria-label="BCA Learning home"><span class="monogram">AT</span><span class="brandname">AmberTheory<span>BCA Learning</span></span></a>
    <nav class="topnav" aria-label="Primary navigation"><a href="#/">Home</a><a href="#/semester/3">Semester III</a><a href="#/semester/4">Semester IV</a><a class="primary-link" href="https://ambertheory-home.onrender.com/#ventures">← AmberTheory</a></nav>
  </div></header>${body}</div>`;
}

function home(){
  const total=allLessons.length, ready=lessons.length+labLessons.length;
  layout(`<main class="home"><section class="hero"><div><div class="eyebrow"><span class="dot"></span> Bengaluru North University · SEP 2024</div>
    <h1>Understand more.<br><em>Memorise less.</em></h1><p class="lead">An illustrated BCA textbook that connects foundational theory with code, real applications, practical experiments and university examinations. Select your semester to explore the actual syllabus.</p>
    <div class="hero-actions"><a class="btn primary" href="#/semester/3">Explore Semester III <span aria-hidden="true">→</span></a><a class="btn" href="#/semester/4">Explore Semester IV</a></div></div>
    <div class="hero-art" aria-label="Illustration of source code and connected concepts"><span class="art-label">From concept to confidence</span>
      <div class="code-card"><div><i>// Think • trace • test</i></div><div><b>class</b> Learning {</div><div>&nbsp; curiosity = <b>true</b>;</div><div>&nbsp; practice() {</div><div>&nbsp; &nbsp; understand();</div><div>&nbsp; }</div><div>}</div>
      <div class="art-tag">Learn deeply <span>One topic at a time ↗</span></div></div></section>
    <section aria-labelledby="sem-title"><div class="section-head"><div><div class="eyebrow">Choose your path</div><h2 id="sem-title">Your semesters</h2></div><p class="muted smalltext">III and IV are mapped from the supplied university syllabus</p></div>
      <div class="semester-row">${Array.from({length:6},(_,i)=>{let s=i+1,active=s===3||s===4;return `<${active?'a':'button disabled'} class="semester ${active?'active':''}" ${active?`href="#/semester/${s}"`:'type="button" aria-disabled="true"'}><span class="num">${String(s).padStart(2,'0')}</span><span><span class="sem-label">Semester ${s}</span><br><span class="status">${active?'View subjects →':'Planned'}</span></span></${active?'a':'button'}>`}).join('')}</div>
    </section><aside class="info-bar"><p><strong>Honest content status:</strong> ${total} syllabus topics and practicals mapped. ${ready} authored lesson/lab experiences available to study now; remaining detailed chapters are in development.</p><a class="btn small" href="#/semester/3">Browse courses</a></aside>
    <footer class="foot">Based on the 19-page BNU Semester III–IV BCA SEP document (effective from AY 2024–25). Electives are alternative choices, not a requirement to study both. Progress is stored in this browser on this device.</footer></main>`);
}

function subjectGroup(label,courses,extra=''){
  if(!courses.length)return '';
  return `<section class="subject-group"><div class="group-heading">${label}</div>${extra?`<p class="muted smalltext">${esc(extra)}</p>`:''}<div class="subject-list">${courses.map(c=>{
    const [done,total,ready]=tally(c),unavailable=!c.syllabusAvailable;
    return `<a class="subject-link" href="${unavailable?'#':'#/c/'+c.id+'/0/0'}" ${unavailable?'data-action="unavailable"':''}><div><div class="subject-name">${esc(c.title)}</div><p>${unavailable?'Listed by university · detailed syllabus not supplied':`${c.units.length} ${c.kind==='lab'?'sections':'units'} · ${total} mapped ${c.kind==='lab'?'experiments':'topics'} · ${ready} authored · ${done} completed`}</p></div><span class="pill ${c.kind==='lab'?'labs':unavailable?'draft':''}">${unavailable?'Awaiting syllabus':c.kind==='lab'?'Practical':c.elective?'Elective':'Theory'}</span><span class="subject-arrow">→</span></a>`;
  }).join('')}</div></section>`;
}

function semesterView(s){
  const k = s===3||s===4?s:3;
  layout(`<main class="subject-page"><div class="crumbs"><a href="#/">← BCA home</a><span> / </span><span>${semLabel(k)}</span></div>
    <div class="page-intro"><div class="eyebrow">BCA · ${semLabel(k)} </div><h1>Choose a subject</h1><p>Open a subject directly into its course contents. Explore individual topics or experiments from the left outline.</p></div>
    ${subjectGroup('Core theory',grouped(k,'theory'))}
    ${subjectGroup('Practical laboratory',grouped(k,'lab'),'Experiments stay in their own Lab Studio, separate from theory.')}
    ${subjectGroup('Discipline-specific elective · choose the prescribed option',curriculum.filter(c=>c.semester===k&&c.elective))}
    ${subjectGroup('Other curriculum components',grouped(k,'outline'),'The uploaded BCA syllabus lists these subjects but does not provide their detailed units.')}
    <div class="note gold"><p>For the 80-mark theory examination: Section A asks 10 of 12 two-mark questions; Section B asks 6 of 8 five-mark questions; Section C asks 3 of 4 ten-mark questions. This pattern comes from the supplied university document.</p></div>
    <footer class="foot">Each core subject lists the exact units and learning objectives. A topic is labelled ready only after a complete lesson has been authored; syllabus mapping alone is not a finished textbook explanation.</footer></main>`);
}

function viewCourse(id,ui,ti){
  const c=courseById[id];if(!c){location.hash='#/';return}
  if(!c.syllabusAvailable){semesterView(c.semester);return}
  const lessonsForCourse=getLessons(c), found=lessonsForCourse.find(x=>x.unit===ui&&x.index===ti), current=found||lessonsForCourse[0];
  if(!current){semesterView(c.semester);return}
  const idx=lessonsForCourse.findIndex(x=>x.id===current.id), authored=readyFor(current);
  const sidebar=`<aside class="sidebar ${mobileOpen?'mobile-open':''}" aria-label="Course contents"><div class="side-top">
    <a class="backline" href="#/semester/${c.semester}">← All semester subjects</a><div class="side-title">${esc(c.title)}</div><div class="subtitle">Course contents · ${tally(c)[0]} of ${tally(c)[1]} completed</div>
    <div class="progress-row" style="margin-top:9px"><span style="width:${tally(c)[1]?100*tally(c)[0]/tally(c)[1]:0}%"></span></div>
    <input class="course-search" id="course-search" aria-label="Filter course topics" placeholder="Find a topic..." value="${esc(query)}" /></div>
    <div class="side-content" id="outline">${c.units.map((u,i)=>{
      const matches=u.topics.map((t,j)=>({t,j})).filter(x=>!query||x.t.toLowerCase().includes(query.toLowerCase())||u.name.toLowerCase().includes(query.toLowerCase()));
      return matches.length?`<div class="unit-label">${esc(u.name)}</div>${matches.map(({t,j})=>{
        let a=getLessons(c).find(l=>l.unit===i&&l.index===j),ready=!!readyFor(a);
        return `<a class="topic-link ${ready?'ready':''} ${progress[a.id]?'complete':''} ${a.id===current.id?'selected':''}" href="${path(c.id,i,j)}"><span class="mark"></span><span>${esc(t)}</span></a>`;
      }).join('')}`:''
    }).join('')}</div></aside>`;
  const status=authored?'Authored · faculty review pending':'Syllabus mapped · lesson pending';
  const reader=`<main class="main-content"><div class="reader-toolbar"><div class="crumbs compact"><button class="btn small floating-toggle" data-action="mobile-menu" aria-label="Open course contents">☰ Contents</button><a href="#/semester/${c.semester}">${semLabel(c.semester)}</a><span>›</span><span>${esc(c.title)}</span></div>
    <div class="toolbar-right"><button class="btn small" data-action="toggle-side">${sideClosed?'☰ Show outline':'☷ Hide outline'}</button></div></div>
    <header class="lesson-heading"><div class="kicker">${esc(current.unitName)} · ${c.kind==='lab'?'Experiment':'Topic'} ${current.index+1}</div><h1>${esc(current.name)}</h1>
      <div class="lesson-meta"><span class="pill ${authored?'':'draft'}">${status}</span><span class="pill">${c.kind==='lab'?'Lab Studio':'Textbook'}</span><span class="muted smalltext">${c.hours} contact hours / course</span></div>
    </header>${authored?(c.kind==='lab'?renderLab(current,authored):renderTheory(current,authored)):renderPending(current,c)}
    <div class="lesson-footer"><a class="btn" ${idx>0?`href="${path(c.id,lessonsForCourse[idx-1].unit,lessonsForCourse[idx-1].index)}"`:'href="#/semester/'+c.semester+'"'}>← ${idx>0?'Previous topic':'Subjects'}</a>
       <button class="btn ${progress[current.id]?'':'primary'}" data-action="complete" data-lesson="${current.id}" ${authored?'':'disabled title="The lesson is not authored yet"'}>${progress[current.id]?'✓ Marked complete':'✓ Mark as learned'}</button>
       ${idx+1<lessonsForCourse.length?`<a class="btn primary" href="${path(c.id,lessonsForCourse[idx+1].unit,lessonsForCourse[idx+1].index)}">Next topic →</a>`:`<a class="btn" href="#/semester/${c.semester}">Subject list →</a>`}</div>
       <div class="feedback"><span class="muted smalltext">Was this explanation useful?</span><button class="btn small" data-action="feedback" data-rating="yes" data-lesson="${current.id}">Yes</button><button class="btn small" data-action="feedback" data-rating="no" data-lesson="${current.id}">Needs improvement</button><span class="muted smalltext" id="feedback-status">${feedback[current.id]?'Feedback stored on this device':''}</span></div>
       <footer class="foot">Academic content is a learning aid; verify against your college instructor and the current prescribed syllabus. No user account is required. Local progress will not sync between devices.</footer></main>`;
  layout(`<div class="course-layout">${sidebar}${reader}</div>`,'reader');
  if(mobileOpen) app.querySelector('.sidebar.mobile-open')?.setAttribute('aria-modal','true');
}

function renderPending(lesson,c){
  return `<section class="placeholder"><div class="status-icon">◇</div><div class="kicker">Curriculum mapping complete</div><h2>Full lesson is being prepared</h2>
    <p><strong>${esc(lesson.name)}</strong> is explicitly listed in ${esc(lesson.unitName)} of the university syllabus. The topic has a place in the course outline, but the full textbook explanation, subject-specific diagram, worked example, verified MCQs and 2/5/10-mark answers have not yet passed authoring. We are not presenting generic filler as completed learning material.</p>
    <p>Use the sidebar to select another topic. Authored topics are marked with a mint dot. ${c.kind==='lab'?'For practicals, complete runnable/reference programs are added individually after validation.':''}</p>
    <a class="btn" href="#/semester/${c.semester}">Back to subjects</a></section>`;
}

function tabs(items){
  if(!items.includes(tab))tab=items[0];
  return `<nav class="content-tabs" aria-label="Lesson sections">${items.map(t=>`<button data-action="tab" data-tab="${t}" class="${tab===t?'current':''}" aria-current="${tab===t?'page':'false'}">${({theory:'Theory',diagram:'Diagram & example',practice:'Try it',industry:'Industry',quiz:'MCQs',exam:'Exam preparation',lab:'Experiment',code:'Code & run',viva:'Viva & checks'})[t]}</button>`).join('')}</nav>`;
}
function para(s){return `<p>${fmt(s)}</p>`}

function renderTheory(l,d){
  const section=tab;
  let body='';
  if(section==='theory')body=`<article class="reader-card"><div class="kicker">What are we learning?</div><h2>${esc(d.question)}</h2>${para(d.opening)}
    ${d.theory.map(([title,text])=>`<h3>${esc(title)}</h3>${para(text)}`).join('')}
    <div class="note"><p><strong>Design intuition:</strong> Ask what information moves, what rule governs it, and what assumptions must hold. Trace the smallest example before increasing complexity.</p></div></article>`;
  if(section==='diagram')body=`<article class="reader-card"><div class="kicker">Textbook visual</div><h2>See the concept work</h2>${renderDiagram(d.diagram)}<p>Use the labelled elements to match each step to the explanation in the Theory tab. A diagram describes the concept; it is not a photo of real equipment.</p></article>
    <article class="reader-card"><h2>Guided worked example</h2><p><strong>${esc(d.worked.task)}</strong></p><ol class="step-list">${d.worked.steps.map(s=>`<li>${fmt(s)}</li>`).join('')}</ol><div class="note"><p><strong>Result:</strong> ${fmt(d.worked.answer)}</p></div></article>`;
  if(section==='practice')body=`<article class="reader-card"><div class="kicker">Try it yourself</div><h2>Predict → test → explain</h2><p>${esc(d.worked.task)}</p><div class="note gold"><p>Write your prediction first. Then read or run the reference example according to the language shown.</p></div>
    ${codePanel(d.code,d.language,`${l.course}:code`,true)}<div class="inline-actions"><button class="btn" data-action="reveal" data-id="${l.course}:${l.title}">Compare with worked solution</button></div>${revealed[`${l.course}:${l.title}`]?`<div class="note"><p>${fmt(d.worked.answer)}</p></div>`:''}</article>`;
  if(section==='industry')body=`<article class="reader-card"><div class="kicker">Where this appears in the world</div><h2>From college to workplace</h2>${para(d.industry)}<div class="note gold"><p>Look for the same underlying principle in a real system: identify the input, processing steps, output and possible failure.</p></div></article>`;
  if(section==='quiz')body=`<div class="reader-card"><div class="kicker">5 four-option questions · explained answers</div><h2>Check your understanding</h2><p>Choose one option per question. Each response includes an explanation so you can learn from a mistake.</p></div>${d.quiz.map((q,i)=>question(l,q,i)).join('')}`;
  if(section==='exam')body=`<article class="reader-card"><div class="kicker">University exam preparation</div><h2>2, 5 and 10-mark practice</h2><p>The following are original model questions aligned to the syllabus, not claimed to be previous-year university questions.</p>
    ${d.exam.map((q,i)=>`<div class="exam-item"><h3>${[2,5,10][i]} marks · ${['Remember and define','Explain with a diagram/example','Develop and justify'][i]}</h3><p>${esc(q)}</p><button class="btn small" data-action="exam" data-id="${l.course}:${l.title}:${i}">${revealed[`${l.course}:${l.title}:${i}`]?'Hide study notes':'Show study notes'}</button>
    ${revealed[`${l.course}:${l.title}:${i}`]?`<div class="note"><p>${i===0?fmt(d.theory[0][1]):i===1?fmt(d.theory.slice(0,2).map(x=>x[1]).join(' ')):fmt(d.theory.map(x=>x[1]).join(' ')+' Worked example: '+d.worked.steps.join(' ')+' Result: '+d.worked.answer)}</p></div>`:''}</div>`).join('')}</article>`;
  return tabs(['theory','diagram','practice','industry','quiz','exam'])+body;
}

function question(l,q,i){
  let key=`${l.course}:${l.title}:${i}`,val=answers[key];
  return `<section class="quiz-card"><h3>${i+1}. ${esc(q[0])}</h3><div class="quiz-options">${q[1].map((o,j)=>`<button class="quiz-option ${val===j?(j===q[2]?'correct':'wrong'):''}" data-action="answer" data-key="${esc(key)}" data-index="${j}" aria-pressed="${val===j}"><strong>${String.fromCharCode(65+j)}.</strong> ${esc(o)}</button>`).join('')}</div>${val!==undefined?`<div class="quiz-explain"><strong>${val===q[2]?'Correct.':'Review.'}</strong> ${esc(q[3])}</div>`:''}</section>`;
}

function codePanel(code,language,key,editable){
  const runnable=language==='python'||language==='sql',external=language==='java';
  return `<div class="code-header"><span>${esc(language.toUpperCase())} ${runnable?'· real browser runtime, loaded on demand':external?'· JDK reference (not runnable in this browser)':'· illustrative reference'}</span><button class="btn small" data-action="copy" data-key="${esc(key)}">Copy</button></div><div class="codebox">${editable?`<textarea aria-label="Editable ${esc(language)} source" data-editor="${esc(key)}" spellcheck="false">${esc(code)}</textarea>`:`<pre>${esc(code)}</pre>`}</div>
     ${runnable?`<div class="inline-actions"><button class="btn primary small" data-action="run" data-key="${esc(key)}" data-language="${language}">▶ Run ${esc(language)}</button><button class="btn small" data-action="reset-code" data-key="${esc(key)}">Reset</button><span class="muted smalltext">First run downloads an in-browser ${language==='python'?'Python':'SQLite'} engine.</span></div><div class="run-output" data-output="${esc(key)}" role="status">Output will appear here after Run.</div>`:`<div class="inline-actions"><button class="btn small" data-action="reset-code" data-key="${esc(key)}">Reset source</button><span class="muted smalltext">${external?'Compile and run with a real JDK. The page does not pretend to have a JVM.':'This example is explanatory and is not executable here.'}</span></div>`}`;
}

function renderLab(l,d){
  let body='';
  if(tab==='lab')body=`<article class="reader-card"><div class="kicker">Practical experiment</div><h2>Aim and apparatus</h2>${para(d.aim)}<div class="note"><p><strong>Requirements:</strong> ${esc(d.requirements)}</p></div><h3>Procedure</h3><ol class="step-list">${d.steps.map(s=>`<li>${fmt(s)}</li>`).join('')}</ol><h3>Observation and expected result</h3><div class="run-output">${esc(d.expected)}</div><p>Record the actual result separately. Compare the observation with the predicted result and note any difference.</p></article>`;
  if(tab==='code')body=`<article class="reader-card"><div class="kicker">Edit • run where supported • debug</div><h2>${esc(d.filename)}</h2><p>Edit the source and predict its output. A genuine browser runtime is provided for supported Python and SQLite exercises; Java requires a local JDK.</p>${codePanel(d.code,d.language,`${l.course}:code`,true)}</article>`;
  if(tab==='viva')body=`<article class="reader-card"><div class="kicker">Lab record and troubleshooting</div><h2>Viva preparation</h2><ol>${d.viva.map(x=>`<li>${esc(x)}</li>`).join('')}</ol><h3>If the result differs</h3><ul>${d.faults.map(x=>`<li>${fmt(x)}</li>`).join('')}</ul><div class="note gold"><p><strong>Record format:</strong> Aim → Requirements → Algorithm/steps → Source → Sample input → Predicted output → Observed output → Result → Viva notes. Keep the program and observed result in your own lab record.</p></div></article>`;
  return tabs(['lab','code','viva'])+body;
}

function rect(x,y,w,h,txt,fill='#1f3b44',stroke='#609a91',size=15){return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="13" fill="${fill}" stroke="${stroke}" stroke-width="2"/><text x="${x+w/2}" y="${y+h/2+5}" text-anchor="middle" fill="#e3f9f5" font-size="${size}" font-weight="650">${esc(txt)}</text>`}
function line(x1,y1,x2,y2,color='#d2bc85'){return `<path d="M${x1} ${y1}L${x2} ${y2}" stroke="${color}" stroke-width="3" fill="none" marker-end="url(#arrow)"/>`}
function circ(x,y,label,color='#21534d'){return `<circle cx="${x}" cy="${y}" r="29" fill="${color}" stroke="#84d2bf" stroke-width="2"/><text x="${x}" y="${y+5}" text-anchor="middle" fill="#effffb" font-size="16" font-weight="800">${esc(label)}</text>`}
function renderDiagram(type){
  let p='';const r=rect,e=line,c=circ;
  if(type==='java')p=r(20,90,145,75,'Hello.java')+e(170,128,230,128)+r(235,90,145,75,'javac → .class')+e(385,128,445,128)+r(450,90,145,75,'JVM → output')+'<text x="305" y="208" text-anchor="middle" fill="#b3cbd0" font-size="14">Source → bytecode → runtime</text>';
  if(type==='object')p=r(185,24,235,75,'Class: Counter')+e(246,100,155,180)+e(360,100,455,180)+r(50,185,205,87,'Object A: value = 1')+r(355,185,205,87,'Object B: value = 0');
  if(type==='er')p=r(25,65,150,75,'STUDENT')+r(235,65,150,75,'ENROLLMENT')+r(445,65,150,75,'COURSE')+e(180,103,231,103)+e(390,103,441,103)+'<text x="205" y="90" fill="#eccf91" font-size="12">1:N</text><text x="407" y="90" fill="#eccf91" font-size="12">N:1</text><text x="303" y="200" text-anchor="middle" fill="#b9d6d6" font-size="14">Foreign keys: StudentID, CourseID</text>';
  if(type==='join')p=r(30,33,246,200,'', '#192e3c')+r(335,33,246,200,'','#192e3c')+'<text x="153" y="63" text-anchor="middle" fill="#88e6d0" font-size="16" font-weight="800">Customers</text><text x="457" y="63" text-anchor="middle" fill="#88e6d0" font-size="16" font-weight="800">Orders</text><text x="67" y="102" fill="#eaf5f5" font-size="14">1 · Asha</text><text x="67" y="143" fill="#eaf5f5" font-size="14">2 · Ravi</text><text x="366" y="102" fill="#eaf5f5" font-size="14">101 · customer 1</text><text x="366" y="143" fill="#eaf5f5" font-size="14">102 · customer 1</text>'+e(180,94,330,95)+e(180,94,330,135)+'<text x="304" y="279" text-anchor="middle" fill="#b9d6d6" font-size="13">INNER JOIN: 2 Asha rows · LEFT JOIN: Ravi + NULL</text>';
  if(type==='complexity')p='<path d="M65 20V250H575" stroke="#8bb4b4" stroke-width="2" fill="none"/><path d="M65 245L570 233" stroke="#7de6c6" stroke-width="3" fill="none"/><path d="M65 245L570 183" stroke="#e7c78b" stroke-width="3" fill="none"/><path d="M65 245Q335 236 570 39" stroke="#9cb8ff" stroke-width="4" fill="none"/><text x="474" y="225" fill="#7de6c6" font-size="14">log n</text><text x="481" y="174" fill="#e7c78b" font-size="14">n</text><text x="487" y="43" fill="#9cb8ff" font-size="14">n²</text><text x="300" y="279" fill="#a6bbc1" font-size="12">Input size n →</text>';
  if(type==='bfs')p=c(295,42,'A')+c(175,155,'B')+c(415,155,'C')+c(115,266,'D')+c(480,266,'E')+e(282,73,187,123)+e(309,73,403,123)+e(161,185,128,233)+e(429,185,466,234);
  if(type==='loop')p=r(210,10,200,56,'Start total=0')+e(310,68,310,93)+r(210,97,200,56,'Next number?')+e(310,155,310,180)+r(210,183,200,56,'Add to total')+'<path d="M410 208H518V125H413" stroke="#e3c78b" stroke-width="3" fill="none" marker-end="url(#arrow)"/><text x="460" y="194" fill="#ecce8f" font-size="12">repeat</text><text x="225" y="267" fill="#9fc5c8" font-size="13">When values finish: print result</text>';
  if(type==='function')p=r(16,106,175,73,'Parameters')+e(195,142,246,142)+r(250,90,175,105,'Function body')+e(429,142,478,142)+r(482,106,115,73,'Return');
  if(type==='astar')p=c(100,155,'S')+c(315,60,'A')+c(315,235,'B')+c(530,155,'G')+e(128,142,281,72)+e(128,169,282,222)+e(343,73,503,141)+e(343,222,504,171)+'<text x="315" y="24" text-anchor="middle" fill="#9adfce" font-size="13">g=5, h=2, f=7</text><text x="315" y="292" text-anchor="middle" fill="#eac68b" font-size="13">g=2, h=6, f=8</text>';
  if(type==='osi'){const labels=['7  Application','6  Presentation','5  Session','4  Transport','3  Network','2  Data Link','1  Physical'];p=labels.map((t,i)=>r(135,7+i*42,355,37,t,i%2?'#173c42':'#1b2d3b','#4e7e82',13)).join('')}
  if(type==='iot')p=r(15,103,180,80,'Soil sensor')+e(200,142,248,142)+r(255,103,160,80,'Controller')+e(421,142,469,142)+r(476,103,132,80,'Pump valve')+'<path d="M541 190V240H100V190" stroke="#9cbbff" stroke-width="3" fill="none" marker-end="url(#arrow)"/><text x="316" y="263" fill="#b3c9c9" font-size="13" text-anchor="middle">Feedback from updated environment</text>';
  if(type==='cloud')p=r(27,26,566,267,'','#1a2b33','#82c6b7')+'<text x="310" y="59" text-anchor="middle" fill="#efdbad" font-size="16" font-weight="800">Physical host · CPU / RAM / disk</text>'+r(89,78,447,58,'Hypervisor','#28534e')+r(65,168,150,89,'VM A')+r(235,168,150,89,'VM B')+r(405,168,150,89,'VM C');
  if(type==='apriori')p=r(28,34,563,64,'Frequent 1-itemsets')+e(308,103,308,134)+r(28,139,563,64,'Candidate 2-itemsets · prune')+e(308,209,308,234)+r(28,238,563,64,'Frequent itemsets → association rules');
  if(type==='matrix')p=r(72,33,230,113,'TP = 18','#27544e')+r(311,33,230,113,'FP = 2','#533b40')+r(72,156,230,113,'FN = 6','#533b40')+r(311,156,230,113,'TN = 74','#27544e')+'<text x="302" y="299" text-anchor="middle" fill="#b2d9d4" font-size="13">Precision = TP/(TP+FP) · Recall = TP/(TP+FN)</text>';
  return `<figure class="visual"><svg viewBox="0 0 620 315" role="img" aria-label="${esc(type)} concept diagram" xmlns="http://www.w3.org/2000/svg"><defs><marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill="#d2bc85"/></marker></defs>${p}</svg><figcaption>Concept diagram · labels reflect the worked explanation above</figcaption></figure>`;
}

function render(){
  const parts=decodeURIComponent(location.hash||'#/').slice(2).split('/').filter(Boolean);
  document.title=(parts[0]==='c'&&courseById[parts[1]]?`${courseById[parts[1]].title} · `:'')+'BCA Learning · AmberTheory';
  if(parts[0]==='semester'){tab='theory';query='';mobileOpen=false;semesterView(Number(parts[1]));return}
  if(parts[0]==='c'){viewCourse(parts[1],Number(parts[2]||0),Number(parts[3]||0));return}
  home();
}

function getCode(key){const t=app.querySelector(`[data-editor="${CSS.escape(key)}"]`);return t?.value??''}
function sourceFor(key){const [course]=key.split(':');if(key.endsWith(':code')){
  const cur=parseRouteLesson();const d=cur&&readyFor(cur);return d?.code??'';
}return ''}
function parseRouteLesson(){const p=(location.hash||'').slice(2).split('/');return p[0]==='c'?getLessons(courseById[p[1]]||{units:[]})?.find(x=>x.unit===Number(p[2])&&x.index===Number(p[3])):null}
async function runPython(code,out){
  if(runWorker){runWorker.terminate();runWorker=null}if(runTimer)clearTimeout(runTimer);
  const cdn='https://cdn.jsdelivr.net/pyodide/v0.28.3/full/';
  const workerSource=`let engine; self.onmessage=async(e)=>{try{if(!engine){importScripts('${cdn}pyodide.js');engine=await loadPyodide({indexURL:'${cdn}'});}let chunks=[];engine.setStdout({batched:s=>chunks.push(s)});engine.setStderr({batched:s=>chunks.push(s)});await engine.runPythonAsync(e.data.code);self.postMessage({ok:true,text:chunks.join('\\n')||'(completed with no printed output)'});}catch(err){self.postMessage({ok:false,text:String(err)});}};`;
  const url=URL.createObjectURL(new Blob([workerSource],{type:'text/javascript'}));
  const w=new Worker(url);URL.revokeObjectURL(url);runWorker=w;
  out.textContent='Loading real Python runtime and executing...';
  runTimer=setTimeout(()=>{if(runWorker===w){w.terminate();runWorker=null;out.textContent='Stopped after 35 seconds. Check for an infinite loop, or confirm the runtime CDN is reachable.'}},35000);
  w.onmessage=e=>{if(runWorker===w){clearTimeout(runTimer);out.textContent=e.data.text;w.terminate();runWorker=null}};
  w.onerror=e=>{if(runWorker===w){clearTimeout(runTimer);out.textContent='Python runtime could not load or run. Check connectivity; try a local Python 3 installation. '+(e.message||'');w.terminate();runWorker=null}};
  w.postMessage({code});
}
let sqlEngine;
async function runSql(code,out){
  out.textContent='Loading SQLite engine...';
  try{
    if(!window.initSqlJs){await new Promise((resolve,reject)=>{let s=document.createElement('script');s.src='https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.13.0/sql-wasm.js';s.onload=resolve;s.onerror=()=>reject(new Error('SQLite engine could not be downloaded'));document.head.append(s)})}
    if(!sqlEngine)sqlEngine=await window.initSqlJs({locateFile:file=>`https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.13.0/${file}`});
    let db=new sqlEngine.Database();let result=db.exec(code);out.textContent=result.length?result.map(t=>[t.columns.join(' | '),...t.values.map(row=>row.map(v=>v===null?'NULL':String(v)).join(' | '))].join('\n')).join('\n\n'):'Statements executed; no result rows.';db.close();
  }catch(e){out.textContent='SQLite execution error: '+e.message+'\nNote: PL/SQL/Oracle-only syntax requires its own database.'}
}

app.addEventListener('click',async(e)=>{
  let el=e.target.closest('[data-action]');if(!el)return;let action=el.dataset.action;
  if(action==='unavailable'){e.preventDefault();return}
  if(action==='mobile-menu'){mobileOpen=!mobileOpen;render();return}
  if(action==='toggle-side'){sideClosed=!sideClosed;mobileOpen=false;render();return}
  if(action==='tab'){tab=el.dataset.tab;render();return}
  if(action==='complete'){if(el.disabled)return;progress[el.dataset.lesson]=!progress[el.dataset.lesson];store(KEY,progress);render();return}
  if(action==='feedback'){feedback[el.dataset.lesson]=el.dataset.rating;store(FEEDBACK,feedback);document.querySelector('#feedback-status').textContent='Feedback stored on this device';return}
  if(action==='answer'){answers[el.dataset.key]=Number(el.dataset.index);render();return}
  if(action==='reveal'||action==='exam'){revealed[el.dataset.id]=!revealed[el.dataset.id];render();return}
  if(action==='copy'){const val=getCode(el.dataset.key)||sourceFor(el.dataset.key);try{await navigator.clipboard.writeText(val);el.textContent='Copied ✓'}catch{el.textContent='Select text to copy'}return}
  if(action==='reset-code'){let t=app.querySelector(`[data-editor="${CSS.escape(el.dataset.key)}"]`);if(t)t.value=sourceFor(el.dataset.key);return}
  if(action==='run'){let code=getCode(el.dataset.key),out=app.querySelector(`[data-output="${CSS.escape(el.dataset.key)}"]`);if(!out)return;if(el.dataset.language==='python')await runPython(code,out);else if(el.dataset.language==='sql')await runSql(code,out);return}
});
app.addEventListener('input',e=>{
  if(e.target?.id==='course-search'){
    query=e.target.value;
    const c=parseRouteLesson();if(!c)return;
    const course=courseById[c.courseId];
    const outline=document.querySelector('#outline');
    if(outline){outline.querySelectorAll('.topic-link').forEach(a=>a.hidden=!a.textContent.toLowerCase().includes(query.toLowerCase())&&!a.previousElementSibling?.classList.contains('unit-label'));}
    // Re-render on a short pause so the unit headings and match list remain accurate.
    clearTimeout(window.searchTimeout);window.searchTimeout=setTimeout(()=>{const focused=document.activeElement?.id==='course-search';let pos=e.target.selectionStart;render();if(focused){let t=document.querySelector('#course-search');t?.focus();t?.setSelectionRange(pos,pos)}},180);
  }
});
window.addEventListener('hashchange',()=>{tab='theory';query='';answers={};revealed={};mobileOpen=false;if(runWorker){runWorker.terminate();runWorker=null}render();window.scrollTo({top:0,behavior:'instant'})});
render();
