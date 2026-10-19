// Source: Bengaluru North University, BCA SEP (2024), Semesters III and IV, supplied 19-page PDF.
// Catalog and syllabus coverage are deliberately separate from authored, reviewable lessons.
const parts = (text) => text.split("|").map(x => x.trim()).filter(Boolean);
const unit = (name, topics) => ({ name, topics: parts(topics) });
const course = (id, semester, title, units, options={}) => ({
  id, semester, title, units, kind: options.kind || "theory", elective: !!options.elective,
  hours: options.hours ?? 60, see: options.see ?? 80, ia: options.ia ?? 20,
  description: options.description || "", syllabusAvailable: options.syllabusAvailable !== false
});
const lab = (id, semester, title, a, b) => course(id, semester, title,
  [unit("Section A",a), unit("Section B",b)], {kind:"lab",see:40,ia:10});

export const curriculum = [
  course("java",3,"Object-Oriented Concepts using Java",[
    unit("Unit I · Java foundations", "Java history and features|Java compared with C|Java, Internet and the Web|Java environment and support systems|Structure and execution of a Java program|JVM and command-line arguments|Java tokens, constants and variables|Primitive data types and scope|Type conversion and default values|Operators and expressions|Arithmetic precedence and mathematical functions|if and switch branching|while, do-while and for loops|Jump and labelled loops"),
    unit("Unit II · Object-oriented design", "Classes, objects and members|Methods and constructors|Method overloading|Static members and nested methods|Inheritance and its types|Method overriding|final, abstract classes and visibility|One-dimensional and two-dimensional arrays|Strings and vectors|Wrapper classes"),
    unit("Unit III · Reuse and reliability", "Interfaces and implementation|Extending interfaces|Packages and Java API|Creating and importing packages|Hiding and accessing classes|Threads and their life cycle|Thread and Runnable patterns|Thread priority and synchronization|Exceptions, multiple catch and finally|Throwing custom exceptions and debugging"),
    unit("Unit IV · Graphics and file I/O", "Legacy Java applets and life cycle|Applet HTML integration (historical)|Graphics class and drawing shapes|Loops for graphs and charts|Streams and I/O classes|Byte and character streams|File class and file exceptions|Read and write text and binary data|Buffering and interactive input")
  ]),
  course("dbms",3,"Database Management Systems",[
    unit("Unit I · Database thinking", "Database and database approach|Users and advantages of a DBMS|Data models, schemas and architecture|Data independence and DBMS interfaces|ER model: entities and sets|Attributes, keys and domains|Relationships, cardinality and participation|Weak entities and ER diagrams"),
    unit("Unit II · Relations and SQL", "Relational model and relation properties|Domains, keys and integrity constraints|Primary keys, foreign keys and NULL|SQL data types|DDL, DML, DCL and TCL|Aggregate functions and GROUP BY|Nested queries and views"),
    unit("Unit III · Query logic and design", "Relational algebra selection and projection|Set operations and joins|Update anomalies and decomposition|Functional dependencies|First, second and third normal forms|Boyce-Codd normal form|PL/SQL syntax and data types|PL/SQL conditions and loops|PL/SQL exceptions and cursors|PL/SQL functions and packages"),
    unit("Unit IV · Transaction safety", "Transactions and read/write operations|Single-user and multi-user systems|Lost updates and dirty reads|Transaction states and failures|ACID properties|Lock-based concurrency control|Timestamp ordering|Deadlock and starvation")
  ]),
  course("algorithms",3,"Design and Analysis of Algorithms",[
    unit("Unit I · Measuring algorithms", "What is an algorithm?|Algorithmic problem-solving framework|Input size and running-time units|Orders of growth|Best, average and worst cases|Big-O, Omega and Theta notation|Efficiency classes|Analysis of non-recursive algorithms|Analysis of recursive algorithms"),
    unit("Unit II · Direct exploration", "Brute-force approach|Selection sort|Bubble sort|Sequential search|Exhaustive travelling salesperson|Exhaustive knapsack|Depth-first search|Breadth-first search"),
    unit("Unit III · Divide and conquer", "Decrease-and-conquer strategy|Insertion sort|Topological sorting|Divide-and-conquer strategy|Merge sort|Quick sort|Binary search|Binary-tree traversal"),
    unit("Unit IV · Optimization and limits", "Greedy technique|Prim's minimum spanning tree|Kruskal's minimum spanning tree|Dijkstra's shortest path|Lower-bound arguments|Decision trees|P, NP and NP-complete problems|Numerical algorithm challenges")
  ]),
  lab("java-lab",3,"Java Programming Lab",
    "Factorial from command-line arguments|Prime numbers between limits|Sort numbers and handle exceptions|String operations|Areas using methods|Constructor overloading|Student report applet (historical)|Bonus using overriding|Moving ball animation (legacy applet)|Mouse and keyboard events",
    "switch statement|Fibonacci numbers|Matrix multiplication|Sort an array of strings|Classes and objects|Multiple inheritance through interfaces|Multithreading|Sum with applet input (historical)|Draw a human face (legacy applet)|Bar chart (legacy applet)"),
  lab("dbms-lab",3,"DBMS Lab",
    "Single-line SQL and grouping|DDL commands|DML commands|DCL and TCL commands|Nested queries|SQL joins",
    "SQL views|Table locks|PL/SQL exceptions|PL/SQL cursors|PL/SQL functions|PL/SQL packages"),
  course("iot",3,"Internet of Things",[
    unit("Unit I · Connected things","IoT features and characteristics|IoT architecture|Cloud role in IoT|Home and city applications|Energy, retail and logistics IoT|Agriculture and health applications|Industrial IoT|Legal challenges, ethics and environment"),
    unit("Unit II · Sense and act","Sensors and their properties|Sensor resolution and classes|Common sensor types|Actuator types|Sensor-to-actuator control loop"),
    unit("Unit III · Application development","Application framework|Device integration|Data acquisition and integration|Local and cloud data storage|Device authentication and authorization")
  ],{elective:true,hours:30,see:40,ia:10}),
  course("cloud",3,"Cloud Computing",[
    unit("Unit I · Cloud foundations","Cloud computing introduction|Reasons to move to cloud|Types of cloud|How cloud computing works"),
    unit("Unit II · Cloud architecture","Cloud technologies and architecture|Cloud modelling and design|Virtualization foundations|Grid, cloud and virtualization|Virtualization in cloud computing"),
    unit("Unit III · Storage and security","Cloud data storage|Cloud storage across LAN and WAN|Cloud service models|Cloud computing at work|Cloud security and applications")
  ],{elective:true,hours:30,see:40,ia:10}),
  course("python",4,"Python Programming",[
    unit("Unit I · Python foundations","Python features and execution|Identifiers, keywords and variables|Comments, indentation and suites|Input, output and imports|Operators and type conversion|Numbers and strings|Lists, tuples, sets and dictionaries|if, elif and else|for, while, range, break and continue"),
    unit("Unit II · Functions and strings","Types of errors and exceptions|try, except and finally|Defining and calling functions|Positional, default and keyword arguments|Return values and command-line arguments|Recursion, scope and lifetime|String indexing and slicing|Formatting, escaping and string methods"),
    unit("Unit III · Files and objects","File types and file paths|Create, open, read, write and close|Python classes and objects|Constructor and multiple objects|Passing and returning objects|Single, multiple and multilevel inheritance|Encapsulation and private attributes|Polymorphism and operator overloading"),
    unit("Unit IV · Applied Python","Tkinter windows and widgets|pack, grid and place layouts|SQLite connection and CRUD|NumPy arrays and operations|Pandas Series and DataFrames|Import CSV and Excel data|DataFrame operations|Matplotlib line and bar charts|Histograms and pie charts")
  ]),
  course("ai",4,"Artificial Intelligence & Applications",[
    unit("Unit I · Intelligent agents","Meaning and foundations of AI|History and future of AI|Agent and environment|Task environments and PEAS|Reflex and model-based agents|Goal-based and utility-based agents"),
    unit("Unit II · Search","Problem-solving agents|States, actions and goal tests|Breadth-first and depth-first search|Uniform-cost search|Depth-limited and iterative deepening|Bidirectional search|Heuristic functions|Greedy best-first and A* search|AO* search"),
    unit("Unit III · Knowledge and reasoning","Knowledge-based agents|Wumpus World|Propositional logic|Theorem proving and model checking|Agents using propositional logic|First-order logic syntax and semantics|Unification and lifting|Forward and backward chaining"),
    unit("Unit IV · Learning machines","Forms of machine learning|Supervised learning|Decision trees|Linear regression and classification|Artificial neural networks|Support vector machines")
  ]),
  course("networks",4,"Computer Networks",[
    unit("Unit I · From signals to networks","Computer networks and uses|Network hardware and software|OSI layers|TCP/IP layers|Guided transmission media|Wireless transmission|Communication satellites|Digital modulation and multiplexing"),
    unit("Unit II · Reliable link","Framing and error detection|Error correction|Simplex and stop-and-wait|Noisy-channel stop-and-wait|Sliding window and one-bit protocol|Go-Back-N and Selective Repeat|ALOHA and CSMA|CSMA/CD and CSMA/CA|Wireless LAN and link switching"),
    unit("Unit III · Getting packets there","Network-layer design|Shortest-path routing|Flooding and hierarchical routing|Broadcast and multicast|Distance-vector routing|Congestion control|Quality of service|Internetworking and Internet network layer"),
    unit("Unit IV · Services at the edge","Transport services|Transport protocol elements|Connection management|TCP versus UDP|DNS|SNMP|Electronic mail|The World Wide Web and HTTP|Streaming audio and video")
  ]),
  lab("python-lab",4,"Python Programming Lab",
    "Display a message|Arithmetic, logical and bitwise operators|Calculator|Conditional statements|While and for loops|List operations|Tuple operations|Set operations|Dictionary operations|Mathematical built-ins",
    "String built-ins|User-defined functions|Overloading and overriding patterns|Inheritance patterns|Custom exception|Tkinter GUI|Line and bar charts|Histogram and pie chart|NumPy arrays|Pandas from Excel"),
  lab("ai-lab",4,"Artificial Intelligence Lab using Python",
    "Machine-learning libraries|Breadth-first search|Depth-first search|A* search|AO* search|Tic-tac-toe|8-puzzle|Water jug",
    "Travelling salesperson|Monkey and banana|Alpha-beta pruning|8-queens|Missionaries and cannibals|Hill climbing|Forward chaining|First-order predicate logic exercises"),
  course("datascience",4,"Fundamentals of Data Science",[
    unit("Unit I · Data mining","Data mining and KDD|DBMS versus data mining|Data mining techniques|Problems and challenges|Data mining applications"),
    unit("Unit II · Data preparation","Data warehouses|Multidimensional model|Data cleaning|Integration and transformation|Reduction and discretization"),
    unit("Unit III · Pattern discovery","Frequent itemsets|Apriori algorithm|FP-growth algorithm|Association rules")
  ],{elective:true,hours:30,see:40,ia:10}),
  course("ml",4,"Machine Learning",[
    unit("Unit I · Learning from examples","What is machine learning?|Designing a learning system|Hypotheses and version space|Inductive bias|Accuracy, precision and recall|Sensitivity, specificity, ROC and AUC"),
    unit("Unit II · Supervised methods","Decision trees and ID3|Overfitting and remedies|k-nearest neighbours|Linear support vector machines|Perceptrons|Multilayer networks and backpropagation"),
    unit("Unit III · Probabilistic learning","Bayes theorem|Bayesian concept learning|Maximum likelihood|Bayes-optimal and naive Bayes classifiers|Expectation maximization and Gaussian mixtures|Hidden Markov models")
  ],{elective:true,hours:30,see:40,ia:10}),
  course("english-3",3,"English III",[],{kind:"outline",syllabusAvailable:false}),
  course("language-3",3,"Language III",[],{kind:"outline",syllabusAvailable:false}),
  course("english-4",4,"English IV",[],{kind:"outline",syllabusAvailable:false}),
  course("language-4",4,"Language IV",[],{kind:"outline",syllabusAvailable:false}),
  course("values",4,"Constitutional Moral Values II",[],{kind:"outline",syllabusAvailable:false,see:40,ia:10,hours:30})
];

export const courseById = Object.fromEntries(curriculum.map(c=>[c.id,c]));
export const getLessons = c => c.units.flatMap((u, ui) => u.topics.map((name,ti)=>({id:`${c.id}:${ui}:${ti}`,courseId:c.id,unit:ui,index:ti,name,unitName:u.name,kind:c.kind})));
export const allLessons = curriculum.flatMap(getLessons);
