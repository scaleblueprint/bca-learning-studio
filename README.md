# AmberTheory BCA Learning (Semester III–IV)

A separate, dependency-free student app created from the Bengaluru North University State Education Policy (SEP 2024) BCA third- and fourth-semester syllabus, effective AY 2024–25 onward. Designed to publish as its own static site in the **AmberTheory2** Render workspace.

## Curriculum source and boundaries

- The supplied 19-page PDF defines curriculum structure, 4-unit core theory syllabi, 3-unit elective syllabi, and four practical lab lists.
- The app maps the named units, major subtopics and every listed practical exercise in the attached Computer Applications syllabus. The syllabus also lists English III/IV, Language III/IV and Constitutional Moral Values II, but does **not** give their detailed topics. Those remain visible as `Awaiting syllabus`.
- Third-semester elective alternatives: Internet of Things **or** Cloud Computing; fourth-semester alternatives: Fundamentals of Data Science **or** Machine Learning. Both choices are browseable so students can select the one their college prescribes.
- University theory exam: Section A 10 of 12 × 2 marks; B 6 of 8 × 5; C 3 of 4 × 10. Core theory assessment is 80 SEE + 20 IA; most practicals 40 SEE + 10 IA.

## User experience

1. Semester selection → subject list → subject opens directly to a topic (no redundant intro page).
2. Collapsible, searchable course outline, exact unit/topic hierarchy, Previous/Next, return to semester and AmberTheory.
3. Authored theory pages: strong explanation, concept-specific SVG, worked trace, relevant industry connection, 5 author-checked MCQs and original model questions for 2/5/10 marks with supporting study notes. Full, academically reviewed model solutions are still a rollout requirement.
4. Dedicated labs: aim, requirements, procedure, source, expected/actual output guidance, debug, viva and lab-record structure.
5. Local browser progress and feedback, without login. Progress does not sync across browsers/devices.
6. Python examples execute using Pyodide loaded in a disposable Web Worker (with timeout). SQL examples run in in-browser SQLite via sql.js. Internet is needed the first time those runtimes are loaded. Java programs are explicitly **JDK reference**, with real compilation instructions; neither a browser JVM nor a simulated Java output is offered. Oracle PL/SQL likewise requires an Oracle-compatible runtime.

## Content status — do not misrepresent

`dist/curriculum.js` defines the complete syllabus mapping. `dist/lessons.js` and `dist/labs.js` define individually authored lesson experiences. Everything else is labelled `Lesson pending`; no generic topic-template is passed off as a finished textbook lesson. The app is an **initial working release / pilot**, not yet student-ready across every topic. Later authoring can add further entries without changing navigation or exposing placeholder prompts to students.

## Local development / release

```sh
npm test
npm start
```

Open `http://localhost:4173`. No npm install or framework build is needed. Render static site settings:

- Build command: `echo 'Prebuilt static files'`
- Publish directory: `dist`
- Branch: `main`

The Git repository must be created and connected to Render first. The existing Engineering, Diploma, German and BCA applications are not modified by this project.

## Required before a full student rollout

- Author and independently academic-review every remaining topic, its diagrams, worked examples and exam solutions.
- Author the remaining lab programs; run Java in a current JDK and Oracle-specific PL/SQL in Oracle-compatible tooling.
- Include authentic licensed real-world equipment photos when a lesson discusses actual hardware.
- Validate curriculum mapping with faculty, especially dated legacy Java applet material (historical only in modern browsers), and collect real student feedback.
- Complete mobile, accessibility and cross-device/browser testing; add durable server-side progress only if student accounts become a requirement.
