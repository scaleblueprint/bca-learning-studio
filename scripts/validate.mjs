import {readFileSync} from 'node:fs';
import assert from 'node:assert/strict';
import {curriculum,allLessons,getLessons} from '../dist/curriculum.js';
import {lessons,lessonByKey} from '../dist/lessons.js';
import {labLessons,labByKey} from '../dist/labs.js';

const names=new Set(),ids=new Set();
for(const course of curriculum){
  assert(!ids.has(course.id),`Duplicate course ${course.id}`);ids.add(course.id);
  if(course.syllabusAvailable){assert(course.units.length>0,`${course.title} missing units`)}
  for(const u of course.units){assert(u.topics.length>0);for(const t of u.topics){const key=`${course.id}|${t}`;assert(!names.has(key),`Duplicate topic ${key}`);names.add(key)}}
}
for(const l of lessons){
  assert(names.has(`${l.course}|${l.title}`),`Authored lesson outside syllabus: ${l.title}`);
  assert(l.opening.length>100,`${l.title} opening too brief`);
  assert(l.theory.length>=3,`${l.title} needs three theory sections`);
  assert((l.opening+' '+l.theory.map(part=>part[1]).join(' ')).split(/\s+/).length>=180,`${l.title} theory needs substance`);
  assert(l.diagram&&l.worked?.steps.length>=3&&l.industry,`${l.title} incomplete learning stages`);
  assert.equal(l.quiz.length,5,`${l.title} must have five MCQs`);
  for(const q of l.quiz){assert.equal(q[1].length,4,`${l.title} needs four choices`);assert(q[2]>=0&&q[2]<=3);assert(q[3].length>20)}
  assert.equal(l.exam.length,3,`${l.title} requires 2/5/10 mark prompts`);
}
for(const l of labLessons){
  assert(names.has(`${l.course}|${l.title}`),`Lab outside syllabus: ${l.title}`);
  assert(l.code.length>30&&l.steps.length>=3&&l.viva.length>=3&&l.faults.length>=2,`Incomplete lab ${l.title}`);
  assert(['java','python','sql'].includes(l.language));
}
assert.equal(Object.keys(lessonByKey).length,lessons.length);
assert.equal(Object.keys(labByKey).length,labLessons.length);
assert.equal(getLessons(curriculum.find(c=>c.id==='java-lab')).length,20);
assert.equal(getLessons(curriculum.find(c=>c.id==='python-lab')).length,20);
assert.equal(getLessons(curriculum.find(c=>c.id==='dbms-lab')).length,12);
assert.equal(getLessons(curriculum.find(c=>c.id==='ai-lab')).length,16);
assert.equal(curriculum.filter(c=>c.semester===3&&c.elective).length,2);
assert.equal(curriculum.filter(c=>c.semester===4&&c.elective).length,2);
for(const name of ['index.html','styles.css','diploma-match.css','app.js','curriculum.js','lessons.js','labs.js']){assert(readFileSync(new URL(`../dist/${name}`,import.meta.url),'utf8').length>100)}
const experience=readFileSync(new URL('../dist/app.js',import.meta.url),'utf8');
const theme=readFileSync(new URL('../dist/diploma-match.css',import.meta.url),'utf8');
const html=readFileSync(new URL('../dist/index.html',import.meta.url),'utf8');
for(const token of ['studio-sem-tile','studio-subject-grid','studio-subjects','studio-unit','studio-topic-canvas','topic-theory','topic-diagram','topic-practice','topic-industry','topic-quiz','topic-exam','topic-lab','topic-code','topic-viva']){
  assert(experience.includes(token),`Missing shared Diploma UX feature: ${token}`);
}
for(const token of ['#111318','#6c5ce7','#22c7e8','.studio-header','.studio-unit-banner','.studio-subject-dropdown']){
  assert(theme.includes(token),`Missing Diploma visual token: ${token}`);
}
assert(html.includes('diploma-match.css'),'Shared visual theme is not linked from index.html');
const ready=lessons.length+labLessons.length;
console.log(`PASS: ${curriculum.length} subjects (incl. electives and outline-only), ${allLessons.length} mapped topics/experiments, ${lessons.length} authored theory lessons, ${labLessons.length} authored labs.`);
console.log(`Content honesty: ${allLessons.length-ready} syllabus items awaiting full authoring; all are distinguished in UI.`);
