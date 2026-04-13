/* ============================================================
   IntelliSphere AI — script.js
   Personalized Career, Interview & Mental Wellness Guidance
   ============================================================ */

// ─────────────────────────────────────────────────────────────
// STATE
// ─────────────────────────────────────────────────────────────
const state = {
  resumeRole: 'software-engineer',
  skillRole: 'software-engineer',
  careerRole: 'software-engineer',
  interviewMode: 'analyze',       // 'analyze' | 'tips'
  careerChallenges: new Set(),
};

// ─────────────────────────────────────────────────────────────
// SKILL DATABASES PER ROLE
// ─────────────────────────────────────────────────────────────
const ROLE_SKILLS = {
  'software-engineer': {
    label: 'Software Engineer',
    required: ['Python', 'Java', 'JavaScript', 'Data Structures', 'Algorithms', 'Git', 'SQL', 'REST API', 'OOP', 'System Design', 'Linux', 'Debugging'],
    bonus: ['Docker', 'Kubernetes', 'CI/CD', 'Cloud (AWS/GCP/Azure)', 'TypeScript', 'Agile', 'Testing'],
  },
  'data-scientist': {
    label: 'Data Scientist',
    required: ['Python', 'Machine Learning', 'Statistics', 'SQL', 'Pandas', 'NumPy', 'Data Visualization', 'Feature Engineering', 'Model Evaluation'],
    bonus: ['Deep Learning', 'TensorFlow', 'PyTorch', 'Big Data', 'Spark', 'R', 'NLP', 'Computer Vision'],
  },
  'web-developer': {
    label: 'Web Developer',
    required: ['HTML', 'CSS', 'JavaScript', 'React', 'Git', 'REST API', 'Responsive Design', 'Node.js', 'SQL'],
    bonus: ['TypeScript', 'Next.js', 'Vue.js', 'GraphQL', 'Docker', 'Testing', 'Tailwind CSS', 'Web Performance'],
  },
  'ml-engineer': {
    label: 'ML Engineer',
    required: ['Python', 'Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch', 'MLOps', 'Docker', 'Python APIs', 'Data Pipelines', 'Cloud'],
    bonus: ['Kubernetes', 'Spark', 'NLP', 'Computer Vision', 'Model Optimization', 'Feature Stores'],
  },
  'devops': {
    label: 'DevOps Engineer',
    required: ['Linux', 'Docker', 'Kubernetes', 'CI/CD', 'Git', 'Cloud (AWS/GCP/Azure)', 'Shell Scripting', 'Monitoring', 'Networking'],
    bonus: ['Terraform', 'Ansible', 'Jenkins', 'Prometheus', 'Grafana', 'Security', 'Python'],
  },
  'product-manager': {
    label: 'Product Manager',
    required: ['Product Strategy', 'User Research', 'Roadmapping', 'Data Analysis', 'Communication', 'Agile/Scrum', 'Stakeholder Management', 'SQL Basics'],
    bonus: ['A/B Testing', 'Wireframing', 'Figma', 'Market Research', 'OKRs', 'Technical Writing'],
  },
};

// ─────────────────────────────────────────────────────────────
// INTERVIEW QUESTION DATABASE
// ─────────────────────────────────────────────────────────────
const QUESTION_TIPS = {
  'tell-me-about-yourself': 'Tip: Mention your background, key skills, and career goals in 1–2 minutes. Keep it professional and end with why you\'re excited about this role.',
  'strengths-weaknesses': 'Tip: Give a real strength with an example. For weakness, show self-awareness and list concrete improvement steps.',
  'why-this-company': 'Tip: Research the company and mention specific things you admire — products, culture, mission, or recent work.',
  'greatest-achievement': 'Tip: Use the STAR method — Situation, Task, Action, Result. Quantify results where possible.',
  'where-5-years': 'Tip: Be honest about growth ambitions and show alignment with the role and company direction.',
  'handle-pressure': 'Tip: Give a real example where you managed stress effectively. Show calmness, process, and positive outcome.',
  'teamwork': 'Tip: Highlight your specific role in the team, how you collaborated, and what the group achieved together.',
  'problem-solving': 'Tip: Walk through your thought process step-by-step. Emphasize logic, creativity, and measurable outcome.',
  'leadership': 'Tip: Even without a formal title, you can show leadership — organizing a study group, leading a project, mentoring a peer.',
  'failure': 'Tip: Be honest about the failure, take ownership, then pivot to what you learned and how you changed your approach.',
  'custom': 'Tip: Think about what the interviewer is trying to assess. Structure your answer with context, your actions, and the result.',
};

const QUESTION_EXPERT_TIPS = {
  'tell-me-about-yourself': {
    tips: [
      { icon: '🎯', text: 'Start with your current status — "I\'m a final-year CS student" or "I recently graduated from..."' },
      { icon: '📌', text: 'Mention 2-3 core skills or achievements that are directly relevant to the role.' },
      { icon: '🔗', text: 'Connect past experience to why you\'re excited about this opportunity.' },
      { icon: '⏱️', text: 'Keep it under 2 minutes — practiced, natural, not memorized robotic speech.' },
    ],
    example: `I'm a 3rd-year Computer Science student at XYZ University, with a strong background in Python and web development. Over the past year, I built two full-stack projects — a task management app and an ML-powered sentiment analyzer — both available on my GitHub. I'm especially passionate about backend systems and recently completed an internship at ABC Corp where I reduced API response time by 35%. I'm excited about this role because it combines my love for scalable systems with a team that values engineering excellence.`,
  },
  'strengths-weaknesses': {
    tips: [
      { icon: '💪', text: 'Choose a strength that\'s genuinely relevant to the role — and back it with a specific story.' },
      { icon: '🌱', text: 'Weakness should be real but not disqualifying. Show active steps you\'re taking to improve.' },
      { icon: '❌', text: 'Avoid clichés like "I work too hard" or "I\'m a perfectionist" — interviewers see through these.' },
      { icon: '📈', text: 'Frame the weakness as a learning journey, not a permanent flaw.' },
    ],
    example: `My biggest strength is breaking complex problems into manageable pieces — I used this at my internship to debug a critical memory leak that had blocked the team for two weeks. For weaknesses, I used to struggle with public speaking, which cost me confidence in team standups. I've since joined a Toastmasters club and now proactively volunteer to present in team meetings — it's made a real difference.`,
  },
  'greatest-achievement': {
    tips: [
      { icon: '⭐', text: 'Use the STAR framework: Situation → Task → Action → Result.' },
      { icon: '📊', text: 'Quantify results wherever possible. "50% faster", "saved 10 hours/week", "helped 200 users".' },
      { icon: '🧠', text: 'Pick an achievement that shows skills the role needs — technical or soft.' },
      { icon: '💬', text: 'End with what you learned or how it shaped you — this shows maturity.' },
    ],
    example: `In my second year, I built a college event management platform for our fest of 3000 students. I led a team of 4, managing both backend (Flask API) and coordinating UI with my teammate. The platform reduced registration time by 70% compared to the old Google Form approach, and we had zero downtime on event day. I learned how to handle high-pressure deadlines and the importance of testing before launch.`,
  },
  'handle-pressure': {
    tips: [
      { icon: '🧘', text: 'Give a specific real example — don\'t speak in hypotheticals.' },
      { icon: '📋', text: 'Show your process: how you prioritized, what you did first, how you kept calm.' },
      { icon: '✅', text: 'End with a positive result — what happened because of how you handled it?' },
      { icon: '🔄', text: 'Optionally share what you\'d do even better next time — shows self-awareness.' },
    ],
    example: `During our final project submission, our server crashed 6 hours before the deadline. Instead of panicking, I split responsibilities — I investigated the server issue while my teammate refactored the critical failing component. I set a 2-hour limit to fix the main issue, and if not, we'd switch to a demo fallback. We resolved the core bug in 90 minutes, submitted on time with full functionality. The key was staying calm and breaking the problem into clear recovery steps.`,
  },
  'teamwork': {
    tips: [
      { icon: '🤝', text: 'Be specific about YOUR role — not just the team\'s work.' },
      { icon: '🔁', text: 'Include a challenge the team faced and how collaboration resolved it.' },
      { icon: '📣', text: 'Show communication skills — how did you keep everyone aligned?' },
      { icon: '🏆', text: 'Close with the outcome — what did the team achieve together?' },
    ],
    example: `In a group project, our team of 5 had to build a real-time chat app in 3 weeks. I took on the backend and led our daily standups. Midway, we hit a disagreement on architecture — REST vs WebSockets. I organized a structured debate, presented pros and cons, and we chose WebSockets together. This shared ownership led to better execution. We delivered on time, scored 92%, and two teammates told me our structured check-ins made the difference.`,
  },
  'where-5-years': {
    tips: [
      { icon: '🎯', text: 'Align your 5-year vision with the company\'s direction — show you\'ve done research.' },
      { icon: '📈', text: 'Show a growth trajectory: from this role → building expertise → taking on more responsibility.' },
      { icon: '🧠', text: 'Be ambitious but realistic — avoid "CEO in 5 years" unless applying for a leadership program.' },
      { icon: '💡', text: 'Show you want to grow WITH the company, not just through it.' },
    ],
    example: `In 5 years, I see myself as a senior software engineer who specializes in distributed systems. My goal is to deepen my expertise in backend architecture over the next 2 years, then move into a tech lead role where I can mentor junior engineers while continuing to build. I'm particularly drawn to this company's microservices stack — it's exactly the environment where I want to grow.`,
  },
  'problem-solving': {
    tips: [
      { icon: '🔍', text: 'Show your thinking process — interviewers care about HOW you solve, not just that you did.' },
      { icon: '📐', text: 'Structure: identify the problem → analyze root cause → test solutions → implement → verify.' },
      { icon: '💡', text: 'Pick a technical or academic problem that showcases real problem-solving skill.' },
      { icon: '📊', text: 'Quantify the impact of your solution if possible.' },
    ],
    example: `In my ML project, our model's accuracy dropped unexpectedly during testing. I first ruled out data issues by checking distributions — those were fine. I then noticed overfitting on training data. I systematically experimented with dropout layers, reduced learning rate, and early stopping. After 4 iterations, accuracy improved from 72% to 88% on the test set. The key was treating it as a hypothesis-testing cycle rather than randomly trying fixes.`,
  },
  'leadership': {
    tips: [
      { icon: '👑', text: 'Leadership doesn\'t require a title. Show informal leadership — organizing, motivating, deciding.' },
      { icon: '🎯', text: 'Show how you helped others succeed, not just what you personally achieved.' },
      { icon: '⚡', text: 'Include a challenge you had to navigate — easy leadership moments don\'t tell a story.' },
      { icon: '🌱', text: 'How did the experience shape you as a leader?' },
    ],
    example: `During a hackathon, our team started losing direction after the 8th hour. I stepped in, called a 15-minute break, then facilitated a quick scope-trim session where we agreed to cut 3 features and focus on a polished core. The team rallied, we shipped on time, and we placed 2nd among 30 teams. That moment taught me that real leadership is about creating clarity under pressure, not giving orders.`,
  },
  'failure': {
    tips: [
      { icon: '💯', text: 'Be authentic — interviewers respect honest reflection far more than a polished deflection.' },
      { icon: '🔄', text: 'Show ownership. Don\'t blame teammates, circumstances, or bad luck.' },
      { icon: '📚', text: 'The "what you learned" section is the most important part of this answer.' },
      { icon: '✅', text: 'If possible, show how you applied that learning and succeeded afterward.' },
    ],
    example: `In my first internship, I underestimated a feature's complexity and told my manager it'd be done in 2 days — it took 5. I should have done a better technical breakdown before committing. The delay affected two other engineers who were waiting on my work. After that, I started using a checklist before giving estimates — breaking tasks into subtasks, identifying dependencies, and adding a 30% buffer. I've met every subsequent deadline since adopting that habit.`,
  },
  'why-this-company': {
    tips: [
      { icon: '🔍', text: 'Research the company deeply — recent news, products, engineering blog, Glassdoor culture.' },
      { icon: '🎯', text: 'Be specific — "You use Rust for systems" is better than "You\'re a great company".' },
      { icon: '🔗', text: 'Connect their work to your own interests and goals.' },
      { icon: '💡', text: 'Show you understand their mission and genuinely care about it.' },
    ],
    example: `I've been following your team's engineering blog for the past few months, specifically the post on your distributed database architecture. Your approach to consistent hashing resonated with the problems I've been exploring in my own side project. Beyond the technical culture, your focus on open-source contributions aligns with my values — I've contributed to two open-source libraries myself. I want to grow in an environment that values both engineering depth and knowledge sharing.`,
  },
  'custom': {
    tips: [
      { icon: '🎯', text: 'Identify what skill or quality the question is really testing.' },
      { icon: '📐', text: 'Structure your answer with context, your actions, and the result.' },
      { icon: '💬', text: 'Use specific examples — never speak in generalities.' },
      { icon: '⏱️', text: 'Keep your answer within 2 minutes for behavioral questions.' },
    ],
    example: `Think about the core competency being assessed. Then use a real experience: set the scene briefly, explain what YOU specifically did (not your team), and close with a clear result or learning. This structure — context, action, outcome — makes any answer strong.`,
  },
};

// ─────────────────────────────────────────────────────────────
// CAREER ROADMAP DATA
// ─────────────────────────────────────────────────────────────
const CAREER_ROADMAPS = {
  'software-engineer': {
    phases: [
      {
        month: 'Month 1–2', title: '🔧 Build Your Foundation',
        tasks: [
          'Master Python or Java fundamentals — complete at least one structured course (CS50, freeCodeCamp)',
          'Learn Data Structures: Arrays, Linked Lists, Stacks, Queues',
          'Practice 15–20 LeetCode Easy problems (focus: arrays, strings)',
          'Set up your GitHub — commit at least once every 2 days',
        ],
      },
      {
        month: 'Month 3–4', title: '📦 Core Skills Boost',
        tasks: [
          'Study Algorithms: Sorting, Searching, Recursion, Basic Graph Theory',
          'Build a simple REST API using Flask or Node.js — host it somewhere',
          'Learn Git branching, pull requests, and collaborative workflows',
          'Start a personal project — even a To-Do app is fine; finish it completely',
        ],
      },
      {
        month: 'Month 5–6', title: '💻 Project Building Mode',
        tasks: [
          'Ship 2 meaningful projects — include them in your portfolio with README files',
          'Learn SQL (Queries, Joins, Indexes) — complete SQLZoo or Mode Analytics',
          'Resume first draft — get feedback from a senior or peer',
          'Start solving LeetCode Medium problems (5/week minimum)',
        ],
      },
      {
        month: 'Month 7–8', title: '🚀 Interview Readiness',
        tasks: [
          'Do 50+ LeetCode problems total across Easy and Medium',
          'Practice STAR method for behavioral questions out loud',
          'Apply to internships/jobs — aim for 20+ applications',
          'Do mock interviews with friends or on Pramp / Interviewing.io',
        ],
      },
      {
        month: 'Month 9–12', title: '🏆 Land the Role',
        tasks: [
          'Continue applying — volume matters. Track rejections without discouragement',
          'Learn one industry tool: Docker, CI/CD, or AWS basics',
          'Build system design knowledge from ByteByteGo or System Design Primer',
          'Network on LinkedIn — comment, post, connect with alumni in your target companies',
        ],
      },
    ],
    quickWins: ['Create a GitHub profile README', 'Solve 1 LeetCode problem daily', 'Add a real project to GitHub this week'],
    resources: ['LeetCode', 'CS50 (Harvard Free)', 'System Design Primer (GitHub)', 'Pramp for mock interviews'],
  },
  'data-scientist': {
    phases: [
      {
        month: 'Month 1–2', title: '📊 Math & Python Foundations',
        tasks: [
          'Review core statistics: mean, median, std dev, distributions, hypothesis testing',
          'Learn Python: NumPy, Pandas basics — complete Kaggle Micro-Courses',
          'Understand linear algebra basics (vectors, matrices) — 3Blue1Brown on YouTube',
          'Complete one Kaggle Titanic/House Prices notebook to get started',
        ],
      },
      {
        month: 'Month 3–4', title: '🤖 Machine Learning Core',
        tasks: [
          'Complete Andrew Ng\'s ML course (Coursera) — take notes actively',
          'Implement Linear Regression, Decision Trees, and KNN from scratch in Python',
          'Learn Scikit-learn and build a complete ML pipeline on a real dataset',
          'Participate in one Kaggle competition — focus on learning, not ranking',
        ],
      },
      {
        month: 'Month 5–6', title: '📈 Portfolio Projects',
        tasks: [
          'Build 2 end-to-end data science projects — EDA, modeling, insights, visualization',
          'Learn SQL for data analysis (GROUP BY, window functions, CTEs)',
          'Create visualizations using Matplotlib, Seaborn, or Plotly',
          'Document everything on GitHub with clear READMEs and Jupyter Notebooks',
        ],
      },
      {
        month: 'Month 7–9', title: '🚀 Advanced & Specialization',
        tasks: [
          'Learn Deep Learning basics: Neural Nets, CNNs, RNNs using fast.ai or DeepLearning.AI',
          'Explore NLP basics: text preprocessing, TF-IDF, BERT fine-tuning',
          'Prepare for case study interviews — practice with Analytics Vidhya practice problems',
          'Apply for data analyst or junior data scientist roles and internships',
        ],
      },
    ],
    quickWins: ['Complete one Kaggle lesson today', 'Load a CSV file into Pandas and explore it', 'Install Anaconda and Jupyter Notebook'],
    resources: ['Kaggle Learn', 'Andrew Ng ML (Coursera)', 'fast.ai', 'Analytics Vidhya'],
  },
  'web-developer': {
    phases: [
      {
        month: 'Month 1–2', title: '🌐 HTML/CSS/JS Mastery',
        tasks: [
          'Complete freeCodeCamp Responsive Web Design Certification',
          'Build 3 static HTML/CSS websites (portfolio, landing page, mini-blog)',
          'Learn JavaScript fundamentals: variables, loops, functions, DOM manipulation',
          'Push everything to GitHub — get into the daily commit habit',
        ],
      },
      {
        month: 'Month 3–4', title: '⚛️ React + Backend Basics',
        tasks: [
          'Learn React: components, props, state, hooks, React Router',
          'Build a weather app or task manager using React with an external API',
          'Learn Node.js and Express: build a basic REST API with CRUD operations',
          'Understand SQL basics — connect your API to a database (PostgreSQL or SQLite)',
        ],
      },
      {
        month: 'Month 5–6', title: '🛠️ Full Stack Projects',
        tasks: [
          'Build a full-stack app (React frontend + Node.js/Express backend + database)',
          'Deploy on Vercel (frontend) and Render or Railway (backend) — make it live!',
          'Add authentication (JWT or session-based) to your project',
          'Learn Git workflow for teams: feature branches, PRs, code review process',
        ],
      },
      {
        month: 'Month 7–9', title: '💼 Job-Ready Portfolio',
        tasks: [
          'Polish your portfolio site — 3–4 projects with live links and GitHub',
          'Learn performance basics: Lighthouse scores, lazy loading, image optimization',
          'Apply to frontend/fullstack roles, internships, and freelance projects',
          'Practice 30+ LeetCode Easy/Medium JS problems for technical screenings',
        ],
      },
    ],
    quickWins: ['Deploy one page to GitHub Pages today', 'Build a JavaScript counter app', 'Complete one freeCodeCamp lesson right now'],
    resources: ['freeCodeCamp', 'The Odin Project', 'javascript.info', 'Scrimba React Course'],
  },
  'ml-engineer': {
    phases: [
      {
        month: 'Month 1–2', title: '🐍 Python & ML Core',
        tasks: [
          'Master Python: OOP, decorators, generators, virtual environments',
          'Build ML models using Scikit-learn — classification, regression, clustering',
          'Learn PyTorch basics: tensors, autograd, simple neural network',
          'Understand model evaluation: confusion matrix, ROC-AUC, cross-validation',
        ],
      },
      {
        month: 'Month 3–4', title: '🧠 Deep Learning & Pipelines',
        tasks: [
          'Train CNNs on image datasets, implement transfer learning with pretrained models',
          'Learn data pipelines: ingestion, cleaning, feature engineering, feature stores',
          'Understand MLOps concepts: experiment tracking (MLflow), model versioning',
          'Build a complete model training pipeline from raw data to prediction endpoint',
        ],
      },
      {
        month: 'Month 5–6', title: '☁️ Cloud & Deployment',
        tasks: [
          'Learn Docker: containerize your ML models, push to Docker Hub',
          'Deploy a model as a REST API using FastAPI or Flask + Docker',
          'Explore AWS SageMaker or Google Vertex AI free tier for managed ML',
          'Study CI/CD for ML — set up automated testing for your model pipeline',
        ],
      },
      {
        month: 'Month 7–9', title: '🚀 Production ML Skills',
        tasks: [
          'Build a portfolio project: train → evaluate → deploy → monitor a real model',
          'Learn Kubernetes basics for scaling ML services',
          'Practice ML system design questions from ByteByteGo or Chip Huyen\'s ML interview guide',
          'Apply for ML Engineer / Applied ML intern roles',
        ],
      },
    ],
    quickWins: ['Train your first sklearn model on Iris dataset today', 'Set up MLflow locally this week', 'Containerize one Python script with Docker'],
    resources: ['fast.ai', 'Chip Huyen ML Interview', 'MLflow docs', 'Full Stack Deep Learning'],
  },
  'devops': {
    phases: [
      {
        month: 'Month 1–2', title: '🐧 Linux & Git Mastery',
        tasks: [
          'Learn Linux command line: file system, permissions, processes, networking basics',
          'Master Git: branching, rebasing, merge conflicts, stash, cherry-pick',
          'Write Bash shell scripts for automating common tasks',
          'Set up a Linux VM or use WSL on Windows to practice daily',
        ],
      },
      {
        month: 'Month 3–4', title: '🐳 Docker & CI/CD',
        tasks: [
          'Learn Docker: build images, run containers, Docker Compose for multi-service apps',
          'Set up GitHub Actions: automate build, test, and deploy pipelines',
          'Explore Jenkins basics: pipeline-as-code, artifacts',
          'Practice deploying a simple web app using a full CI/CD pipeline',
        ],
      },
      {
        month: 'Month 5–6', title: '☁️ Cloud & Kubernetes',
        tasks: [
          'Learn AWS or GCP fundamentals: EC2/Compute, S3/Storage, IAM, VPC',
          'Complete KillerCoda or Play with Kubernetes tutorials for K8s basics',
          'Deploy a multi-container app to a cloud environment',
          'Learn Infrastructure as Code: Terraform basics to provision cloud resources',
        ],
      },
      {
        month: 'Month 7–9', title: '📡 Monitoring & SRE Skills',
        tasks: [
          'Set up Prometheus + Grafana to monitor your deployed app',
          'Learn concepts: SLOs, SLAs, SLIs, incident response, postmortems',
          'Practice for DevOps interviews: Linux troubleshooting, networking, system design',
          'Apply for DevOps/Cloud/Platform Engineer internships or entry-level roles',
        ],
      },
    ],
    quickWins: ['Install and run your first Docker container today', 'Create a GitHub Actions workflow for hello-world', 'Practice 10 Linux commands you don\'t usually use'],
    resources: ['KillerCoda (K8s labs)', 'AWS Free Tier', 'TechWorld with Nana on YouTube', 'Linux Foundation free courses'],
  },
  'product-manager': {
    phases: [
      {
        month: 'Month 1–2', title: '📚 PM Fundamentals',
        tasks: [
          'Read "Inspired" by Marty Cagan and "The Lean Startup" by Eric Ries',
          'Learn product frameworks: Jobs-to-be-Done, user story mapping, OKRs',
          'Practice user research: conduct 3 informal interviews with real users about a product you use',
          'Learn SQL basics — you\'ll need to query data to make informed decisions',
        ],
      },
      {
        month: 'Month 3–4', title: '🎨 Discovery & Design',
        tasks: [
          'Learn Figma: wireframes, prototypes, components. Create mockups for an app idea',
          'Study analytics tools: Google Analytics, Mixpanel concepts',
          'Define a PRD (Product Requirements Document) for a feature you\'d build',
          'Study A/B testing: hypothesis formation, statistical significance, interpretation',
        ],
      },
      {
        month: 'Month 5–6', title: '🚀 Build Your Portfolio',
        tasks: [
          'Do a product teardown analysis of 3 apps — feature analysis, UX critique, metrics you\'d track',
          'Build a case study: identify a problem, define user personas, design a solution, define success metrics',
          'Practice estimation: market sizing, DAU estimation questions (pm-exercises.com)',
          'Network with PMs on LinkedIn — ask for 15-minute informational calls',
        ],
      },
      {
        month: 'Month 7–9', title: '💼 Interview Preparation',
        tasks: [
          'Practice PM interview types: product design, analytical, behavioral, strategy, estimation',
          'Complete Product Alliance or Exponent PM interview prep courses',
          'Apply for APM (Associate PM) programs: Google APM, Microsoft PM, Uber RPM',
          'Build your personal brand: write one PM-focused LinkedIn article or Medium post',
        ],
      },
    ],
    quickWins: ['Write a user story for an app you use daily', 'Do a 10-minute product teardown of any app', 'Connect with one PM on LinkedIn today'],
    resources: ['Lenny\'s Newsletter', 'Exponent PM Course', 'pm-exercises.com', 'Product School YouTube'],
  },
};

// Challenge-specific guidance
const CHALLENGE_GUIDANCE = {
  'no-projects': { icon: '🔨', text: 'No projects yet? Start with ONE small project this week — even a todo app on GitHub counts. Ship it, then iterate.' },
  'no-internship': { icon: '💼', text: 'No internship? Contribute to open-source, freelance on Fiverr/Upwork, or build a high-quality side project. These all count as experience.' },
  'low-cgpa': { icon: '📉', text: 'Low CGPA doesn\'t define your career. Many top companies value projects and problem-solving over grades. Focus on a strong portfolio and DSA skills.' },
  'interview-fear': { icon: '😰', text: 'Interview fear fades with practice. Do 2 mock interviews this week using Pramp or with a friend. Record yourself answering questions aloud.' },
  'networking': { icon: '🤝', text: 'Start small: comment thoughtfully on 3 LinkedIn posts by people in your field this week. Send 1 personalized connection request with a brief note.' },
  'time': { icon: '⏰', text: 'Time is tight? Use the Eisenhower Matrix. Block 1 focused hour daily for skill-building. Consistency beats intensity — 7 hours/week beats 0 hours.' },
  'direction': { icon: '🧭', text: 'No clear direction? That\'s okay. Pick one path from your interests and commit to it for 90 days. Clarity comes from action, not more thinking.' },
  'skills-gap': { icon: '📚', text: 'Skill gap is a solved problem — every expert started at zero. Use the roadmap below to systematically close your gaps in priority order.' },
};

// ─────────────────────────────────────────────────────────────
// WELLNESS DATABASE
// ─────────────────────────────────────────────────────────────
const AFFIRMATIONS = {
  5: { emoji: '🌟', text: 'You are at your best — keep this momentum!', sub: 'Channel this energy into your most important goal today.' },
  4: { emoji: '😊', text: 'You\'re doing well — and that\'s worth celebrating.', sub: 'Small wins add up to big victories. Keep going.' },
  3: { emoji: '🌱', text: 'It\'s okay to just be okay. Growth happens here.', sub: 'You\'re stronger than your current feeling suggests.' },
  2: { emoji: '💜', text: 'Low days are temporary. You have survived every hard day so far.', sub: 'Give yourself permission to rest and recharge.' },
  1: { emoji: '🤝', text: 'Stress is a signal — not a sentence. You can handle this.', sub: 'Take one small step at a time. That\'s enough.' },
  0: { emoji: '🫂', text: 'You are not alone. Overwhelming feelings are valid, and they will pass.', sub: 'Please reach out to someone you trust if you need support.' },
};

const COPING_STRATEGIES = {
  exams: ['Break your study list into 25-min Pomodoro blocks', 'Write a brain dump — everything on your mind on paper first', 'Pick ONE chapter to review and start there (just start)', 'After every block, take a 5-min walk away from screens', 'Re-read your past successes to remind yourself you can do it'],
  career: ['Write down 3 things you\'re already good at professionally', 'Set ONE small career action for today (1 email, 1 job search)', 'Remember: careers are built over years, not days', 'Talk to someone who\'s a step ahead — their path will inspire you', 'Revisit your "why" — why do you want this career?'],
  social: ['Limit time on social media to 30 mins today', 'Call or text ONE real friend just to check in', 'Remember: most people\'s highlight reels aren\'t their full story', 'Practice saying "no" without guilt — boundaries are healthy', 'Join a club, hackathon, or student group to find your tribe'],
  finance: ['Track spending for just 3 days — awareness is powerful', 'Look into scholarships, grants, or part-time gigs at your college', 'Buy nothing today — enjoy free campus resources instead', 'Talk to your college\'s student financial aid office', 'Budget using 50/30/20 rule: needs, wants, savings'],
  family: ['Set a 30-min window to process feelings — then redirect your focus', 'Write a letter you don\'t send to express unspoken feelings', 'Talk to a college counselor for a neutral perspective', 'Remind yourself: you control your response, not others\' actions', 'Small acts of kindness — even for yourself — help heal'],
  lonely: ['Step out of your room — library, café, campus common area', 'Introduce yourself to one new person this week', 'Start a hobby-based group chat or online community', 'Volunteer — giving to others fills the loneliness gap', 'Check if your college runs mental health peer support groups'],
  confidence: ['Write 3 specific wins from your past week — no matter how small', 'Practice power poses for 2 minutes before something intimidating', 'Do ONE thing outside your comfort zone today', 'Stop comparing your Chapter 1 to someone else\'s Chapter 20', 'Read or listen to ONE inspiring student success story'],
  burnout: ['Take a full 24-hour break from studying — rest is productive', 'Identify what drained you most and create a boundary around it', 'Spend time in nature — a park walk resets your nervous system', 'Reconnect with something creative: draw, cook, play music', 'Sleep first. Decisions and studying come after rest'],
  focus: ['Clear your desk — physical clutter = mental clutter', 'Try the 2-minute rule: if it takes 2 mins, do it NOW', 'Use Forest or Focus@Will app for distraction-free sessions', 'Prioritize tasks with an Eisenhower Matrix (urgent vs important)', 'Close tabs, silence phone, use one tool at a time'],
  nothing: ['Maintain what\'s working — consistency is underrated', 'Use this clarity to set one new growth goal', 'Help a classmate who might be struggling', 'Reflect on what\'s brought you peace — double down on it', 'Start a gratitude journal — even one entry builds momentum'],
};

const BREATHING_EXERCISES = [
  { name: '4-7-8 Breathing', steps: ['Inhale for 4 counts', 'Hold for 7 counts', 'Exhale slowly for 8 counts', 'Repeat 4 times'] },
  { name: 'Box Breathing', steps: ['Inhale for 4 counts', 'Hold for 4 counts', 'Exhale for 4 counts', 'Hold for 4 counts'] },
  { name: '5-5-5 Grounding', steps: ['Name 5 things you can see', 'Name 5 things you can touch', 'Name 5 things you can hear', 'Take one deep breath'] },
];

const MORNING_RITUALS = [
  'Drink a full glass of water before checking your phone',
  'Write 3 things you\'re grateful for (takes 2 minutes)',
  'Get 10 minutes of sunlight or fresh air',
  'Do 5 minutes of light stretching or yoga',
  'Set ONE intention for the day (just one)',
];

const SLEEP_TIPS = {
  low: ['Go to bed 30 mins earlier tonight — start the fix now', 'Avoid screens 1 hour before bed', 'Try a 20-min nap between 1-3 PM if possible', 'Use a phone grayscale mode at night to reduce stimulation'],
  ok: ['Your sleep is decent — aim to keep a fixed bedtime', 'Avoid caffeine after 3 PM for deeper sleep', 'Use a white noise app if you wake at night'],
  good: ['Great sleep is your superpower — protect it', 'Keep your sleep schedule consistent on weekends too', 'Your recovery and focus both improve with 7-8h of sleep'],
};

// ─────────────────────────────────────────────────────────────
// WELLNESS STATE
// ─────────────────────────────────────────────────────────────
const wellnessState = {
  mood: null, moodLabel: null,
  stress: 5, sleep: 7,
  situations: new Set(),
};

// ─────────────────────────────────────────────────────────────
// INIT
// ─────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  bindCharCounter('resumeText', 'resumeCharCount', false);
  bindCharCounter('interviewAnswer', 'interviewCharCount', true);

  window.addEventListener('scroll', () => {
    document.getElementById('header').classList.toggle('scrolled', window.scrollY > 20);
  });

  // Initialize tips panel with default question
  updateQuestion();
});

// ─────────────────────────────────────────────────────────────
// NAVIGATION
// ─────────────────────────────────────────────────────────────
function switchTab(name) {
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  document.getElementById('panel-' + name).classList.add('active');
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('tab-' + name).classList.add('active');
}

function scrollToTools() {
  document.getElementById('tools').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function toggleMenu() {
  document.getElementById('navLinks').classList.toggle('open');
}

// ─────────────────────────────────────────────────────────────
// ROLE CHIP SELECTOR
// ─────────────────────────────────────────────────────────────
function selectRole(el, context) {
  const parent = el.closest('.role-chips') || el.closest('[id$="Chips"]') || el.closest('[id$="GoalChips"]');
  const allChips = parent ? parent.querySelectorAll('.role-chip') : el.parentElement.querySelectorAll('.role-chip');
  allChips.forEach(c => c.classList.remove('active'));
  el.classList.add('active');
  if (context === 'resume') state.resumeRole = el.dataset.role;
  if (context === 'skill') state.skillRole = el.dataset.role;
  if (context === 'career') state.careerRole = el.dataset.role;
}

// ─────────────────────────────────────────────────────────────
// CHARACTER COUNTER
// ─────────────────────────────────────────────────────────────
function bindCharCounter(textareaId, counterId, showWords) {
  const ta = document.getElementById(textareaId);
  const counter = document.getElementById(counterId);
  if (!ta || !counter) return;
  ta.addEventListener('input', () => {
    const chars = ta.value.length;
    if (showWords) {
      const words = ta.value.trim() ? ta.value.trim().split(/\s+/).length : 0;
      counter.textContent = `${chars} characters | ${words} words`;
    } else {
      counter.textContent = `${chars} characters`;
    }
  });
}

// ─────────────────────────────────────────────────────────────
// INTERVIEW QUESTION TIPS
// ─────────────────────────────────────────────────────────────
function updateQuestion() {
  const sel = document.getElementById('interviewQuestion');
  const val = sel.value;
  document.getElementById('questionTipText').textContent = QUESTION_TIPS[val] || '';
  const customWrap = document.getElementById('customQuestionWrap');
  if (customWrap) customWrap.style.display = val === 'custom' ? 'block' : 'none';

  // Update tips panel if in tips mode
  if (state.interviewMode === 'tips') renderTipsPanel(val);
}

// ─────────────────────────────────────────────────────────────
// INTERVIEW MODE TOGGLE
// ─────────────────────────────────────────────────────────────
function setInterviewMode(mode) {
  state.interviewMode = mode;
  document.getElementById('mode-analyze').classList.toggle('active', mode === 'analyze');
  document.getElementById('mode-tips').classList.toggle('active', mode === 'tips');
  document.getElementById('analyzeModePanel').style.display = mode === 'analyze' ? 'block' : 'none';
  document.getElementById('tipsModePanel').style.display = mode === 'tips' ? 'block' : 'none';
  document.getElementById('interviewResult').style.display = 'none';

  if (mode === 'tips') {
    const q = document.getElementById('interviewQuestion').value;
    renderTipsPanel(q);
  }
}

function renderTipsPanel(question) {
  const data = QUESTION_EXPERT_TIPS[question] || QUESTION_EXPERT_TIPS['custom'];

  const tipsHTML = data.tips.map(t => `
    <div class="tip-item">
      <span class="tip-item-icon">${t.icon}</span>
      <span>${t.text}</span>
    </div>
  `).join('');

  document.getElementById('tipsContent').innerHTML = tipsHTML;
  document.getElementById('tipsExample').innerHTML = data.example;
}

// ─────────────────────────────────────────────────────────────
// BUTTON LOADING STATE
// ─────────────────────────────────────────────────────────────
function setLoading(btnId, loading) {
  const btn = document.getElementById(btnId);
  if (!btn) return;
  const text = btn.querySelector('.btn-text');
  const loader = btn.querySelector('.btn-loader');
  btn.disabled = loading;
  if (text) text.style.display = loading ? 'none' : 'flex';
  if (loader) loader.style.display = loading ? 'flex' : 'none';
}

function fakeDelay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────
function normalizeSkill(s) {
  return s.toLowerCase().replace(/[^a-z0-9#+.]/g, '');
}

function skillMatch(userSkill, requiredSkill) {
  const u = normalizeSkill(userSkill);
  const r = normalizeSkill(requiredSkill);
  return u.includes(r) || r.includes(u) || levenshtein(u, r) <= 2;
}

function levenshtein(a, b) {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  const matrix = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b[i - 1] === a[j - 1]) matrix[i][j] = matrix[i - 1][j - 1];
      else matrix[i][j] = 1 + Math.min(matrix[i - 1][j - 1], matrix[i][j - 1], matrix[i - 1][j]);
    }
  }
  return matrix[b.length][a.length];
}

function getScoreColor(score) {
  if (score >= 80) return { color: '#10B981', label: 'Excellent' };
  if (score >= 65) return { color: '#06B6D4', label: 'Good' };
  if (score >= 45) return { color: '#F59E0B', label: 'Average' };
  return { color: '#EF4444', label: 'Needs Work' };
}

function circleParams(score) {
  const r = 44;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  return { circ, dash, r };
}

function buildScoreCircle(score, color) {
  const { circ, dash, r } = circleParams(score);
  return `
  <div class="score-circle">
    <svg viewBox="0 0 110 110">
      <circle class="track" cx="55" cy="55" r="${r}"/>
      <circle class="fill" cx="55" cy="55" r="${r}"
        stroke="${color}"
        stroke-dasharray="${dash} ${circ}"
        stroke-dashoffset="0"
        style="stroke-dasharray:0 ${circ}"
        id="scoreCircleFill"/>
    </svg>
    <div class="score-label">
      <span class="score-number" style="color:${color}">${score}</span>
      <span class="score-unit">/ 100</span>
    </div>
  </div>`;
}

function animateCircle() {
  const el = document.getElementById('scoreCircleFill');
  if (!el) return;
  const total = parseFloat(el.getAttribute('stroke-dasharray').split(' ')[0]) || 0;
  const circ = 2 * Math.PI * 44;
  setTimeout(() => {
    el.style.strokeDasharray = `${total} ${circ}`;
    el.style.transition = 'stroke-dasharray 1.4s cubic-bezier(0.4, 0, 0.2, 1)';
  }, 80);
}

// ─────────────────────────────────────────────────────────────
// RESUME ANALYZER
// ─────────────────────────────────────────────────────────────
async function analyzeResume() {
  const text = document.getElementById('resumeText').value.trim();
  if (!text || text.length < 30) {
    shakeElement('resumeText');
    showToast('Please paste at least a few lines of your resume!', 'warn');
    return;
  }

  setLoading('resumeBtn', true);
  await fakeDelay(1600);
  setLoading('resumeBtn', false);

  const role = state.resumeRole;
  const db = ROLE_SKILLS[role];
  const lowerText = text.toLowerCase();

  const foundRequired = db.required.filter(s => lowerText.includes(s.toLowerCase()) || lowerText.includes(normalizeSkill(s)));
  const foundBonus = db.bonus.filter(s => lowerText.includes(s.toLowerCase()));
  const missing = db.required.filter(s => !foundRequired.includes(s));

  const baseScore = Math.round((foundRequired.length / db.required.length) * 70);
  const bonusScore = Math.min(15, foundBonus.length * 3);
  const lengthScore = Math.min(15, Math.floor(text.length / 80));
  const rawScore = Math.min(100, baseScore + bonusScore + lengthScore);
  const noise = Math.floor(Math.random() * 5) - 2;
  const score = Math.max(5, Math.min(100, rawScore + noise));

  const { color, label } = getScoreColor(score);

  const summaryTexts = {
    'Excellent': `Outstanding resume for ${db.label}! Strong skill coverage and real depth.`,
    'Good': `Solid resume for ${db.label}. A few targeted tweaks will boost your chances significantly.`,
    'Average': `Your resume shows potential for ${db.label}, but several key skills need to be highlighted or added.`,
    'Needs Work': `Your resume needs improvement for ${db.label} roles. Build the missing skills and reflect them clearly.`,
  };

  const html = `
  <div class="score-banner">
    ${buildScoreCircle(score, color)}
    <div class="score-info">
      <div class="score-grade" style="color:${color}">${label} — ${score}/100</div>
      <div class="score-summary">${summaryTexts[label]}</div>
    </div>
  </div>

  ${foundRequired.length > 0 ? `
  <div class="result-section">
    <div class="result-section-title">
      <span class="dot dot-green"></span>
      ✅ Matched Skills (${foundRequired.length}/${db.required.length} required)
    </div>
    <div class="skill-tags">
      ${foundRequired.map(s => `<div class="skill-tag tag-found">✓ ${s}</div>`).join('')}
      ${foundBonus.map(s => `<div class="skill-tag tag-tip">⭐ ${s}</div>`).join('')}
    </div>
  </div>` : ''}

  ${missing.length > 0 ? `
  <div class="result-section">
    <div class="result-section-title">
      <span class="dot dot-red"></span>
      ❌ Missing Required Skills (${missing.length})
    </div>
    <div class="skill-tags">
      ${missing.map(s => `<div class="skill-tag tag-missing">✗ ${s}</div>`).join('')}
    </div>
  </div>` : ''}

  <div class="result-section">
    <div class="result-section-title">
      <span class="dot dot-purple"></span>
      💡 Personalized Recommendations
    </div>
    <div class="feedback-list">
      ${missing.length > 0 ? `<div class="feedback-item negative"><span class="feedback-icon">🚨</span><span>Add the missing skills to your resume — especially <strong>${missing.slice(0, 3).join(', ')}</strong>. Consider adding them to a Skills section or weaving them into project descriptions.</span></div>` : '<div class="feedback-item positive"><span class="feedback-icon">🏆</span><span>All core required skills are present. Great work!</span></div>'}
      ${text.length < 300 ? `<div class="feedback-item negative"><span class="feedback-icon">📋</span><span>Resume appears too short. Add more detail about your projects, experience, and achievements.</span></div>` : ''}
      ${!lowerText.includes('project') && !lowerText.includes('built') ? '<div class="feedback-item info"><span class="feedback-icon">🔨</span><span>Include a "Projects" section — recruiters love seeing what you\'ve actually built. Link to GitHub.</span></div>' : ''}
      ${!lowerText.includes('internship') && !lowerText.includes('experience') && !lowerText.includes('worked') ? '<div class="feedback-item info"><span class="feedback-icon">💼</span><span>Add work experience or internship details — even personal or volunteer experience counts.</span></div>' : ''}
      ${foundBonus.length === 0 ? `<div class="feedback-item info"><span class="feedback-icon">⭐</span><span>Consider adding bonus skills like ${db.bonus.slice(0, 3).join(', ')} to stand out from other candidates.</span></div>` : `<div class="feedback-item positive"><span class="feedback-icon">⭐</span><span>Great — you have ${foundBonus.length} bonus/advanced skills that differentiate you!</span></div>`}
      <div class="feedback-item info"><span class="feedback-icon">📝</span><span>Use strong action verbs: "Built", "Developed", "Led", "Optimized", "Reduced" — they make bullet points punch harder.</span></div>
      <div class="feedback-item info"><span class="feedback-icon">🔢</span><span>Quantify wherever you can — "reduced load time by 40%", "served 200+ users", "led a team of 4".</span></div>
    </div>
  </div>

  <div class="result-section">
    <div class="result-section-title">
      <span class="dot dot-cyan"></span>
      🎯 Next Step
    </div>
    <div class="feedback-list">
      <div class="feedback-item info"><span class="feedback-icon">💡</span><span>Use the <strong>Career Roadmap</strong> tab to get a personalized month-by-month plan to close your skill gaps for ${db.label}.</span></div>
      <div class="feedback-item info"><span class="feedback-icon">🎙️</span><span>Use the <strong>Interview Coach</strong> tab to prepare your answers while your resume is being reviewed by companies.</span></div>
    </div>
  </div>
  `;

  const resultEl = document.getElementById('resumeResult');
  resultEl.innerHTML = html;
  resultEl.style.display = 'block';
  resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  animateCircle();
}

// ─────────────────────────────────────────────────────────────
// CAREER ROADMAP GENERATOR
// ─────────────────────────────────────────────────────────────
function toggleChallenge(el) {
  const tag = el.dataset.tag;
  if (el.classList.contains('active')) {
    el.classList.remove('active');
    state.careerChallenges.delete(tag);
  } else {
    el.classList.add('active');
    state.careerChallenges.add(tag);
  }
}

async function generateCareerRoadmap() {
  const name = document.getElementById('careerName').value.trim();
  const year = document.getElementById('careerYear').value;
  const role = state.careerRole;
  const skills = document.getElementById('careerSkillsInput').value.trim();
  const challenges = [...state.careerChallenges];

  setLoading('careerBtn', true);
  await fakeDelay(2000);
  setLoading('careerBtn', false);

  const db = ROLE_SKILLS[role];
  const rdm = CAREER_ROADMAPS[role];

  // Check existing skills
  const userSkills = skills ? skills.split(',').map(s => s.trim()).filter(Boolean) : [];
  const matched = db.required.filter(req => userSkills.some(us => skillMatch(us, req)));
  const missing = db.required.filter(req => !matched.includes(req));
  const readiness = Math.round((matched.length / db.required.length) * 100);

  const greeting = name ? `${name}, here's your personalized roadmap` : `Here's your personalized roadmap`;

  const yearMessages = {
    '1st': 'You have time on your side. Use it to build strong foundations.',
    '2nd': 'Good timing — now is when habits that compound over 2 years start forming.',
    '3rd': 'You\'re in the critical zone. Focused effort now pays off at placement time.',
    'final': 'Final year means urgency. Focus on applications, projects, and interviews NOW.',
    'grad': 'As a recent graduate, differentiate yourself with strong projects and consistency.',
  };

  const challengeGuidanceHTML = challenges.length > 0 ? `
  <div class="result-section">
    <div class="result-section-title">
      <span class="dot dot-orange"></span>
      🎯 Your Challenge Action Plan
    </div>
    <div class="feedback-list">
      ${challenges.map(c => {
    const g = CHALLENGE_GUIDANCE[c];
    return g ? `<div class="feedback-item warning"><span class="feedback-icon">${g.icon}</span><span>${g.text}</span></div>` : '';
  }).join('')}
    </div>
  </div>` : '';

  const html = `
  <!-- Personalized Header -->
  <div class="career-roadmap-header">
    <div class="career-roadmap-name">${greeting}</div>
    <div class="career-roadmap-sub">
      Goal: <strong>${db.label}</strong> · Year: <strong>${year}</strong> · ${yearMessages[year] || ''}
    </div>
  </div>

  <!-- Career Stats -->
  <div class="career-stats-row">
    <div class="career-stat-card">
      <div class="career-stat-label">Skill Readiness</div>
      <div class="career-stat-value">${readiness}%</div>
    </div>
    <div class="career-stat-card">
      <div class="career-stat-label">Skills Matched</div>
      <div class="career-stat-value">${matched.length}/${db.required.length}</div>
    </div>
    <div class="career-stat-card">
      <div class="career-stat-label">To Close</div>
      <div class="career-stat-value">${missing.length} Skills</div>
    </div>
    <div class="career-stat-card">
      <div class="career-stat-label">Roadmap</div>
      <div class="career-stat-value" style="font-size:14px;">${rdm.phases.length * 2} Months</div>
    </div>
  </div>

  ${matched.length > 0 ? `
  <div class="result-section">
    <div class="result-section-title"><span class="dot dot-green"></span>✅ Skills You Already Have</div>
    <div class="skill-tags">
      ${matched.map(s => `<div class="skill-tag tag-found">✓ ${s}</div>`).join('')}
    </div>
  </div>` : ''}

  ${missing.length > 0 ? `
  <div class="result-section">
    <div class="result-section-title"><span class="dot dot-red"></span>🎯 Skills to Build</div>
    <div class="skill-tags">
      ${missing.map(s => `<div class="skill-tag tag-missing">→ ${s}</div>`).join('')}
    </div>
  </div>` : ''}

  ${challengeGuidanceHTML}

  <!-- Timeline Roadmap -->
  <div class="result-section">
    <div class="result-section-title">
      <span class="dot dot-orange"></span>
      🗺️ Your Month-by-Month Action Roadmap
    </div>
    <div class="timeline">
      ${rdm.phases.map((phase, i) => `
      <div class="timeline-item">
        <div class="timeline-month">${phase.month}</div>
        <div class="timeline-card">
          <div class="timeline-card-title">${phase.title}</div>
          <div class="timeline-tasks">
            ${phase.tasks.map(t => `<div class="timeline-task"><div class="timeline-task-dot"></div><span>${t}</span></div>`).join('')}
          </div>
        </div>
      </div>`).join('')}
    </div>
  </div>

  <!-- Quick Wins -->
  <div class="result-section">
    <div class="result-section-title">
      <span class="dot dot-green"></span>
      ⚡ Quick Wins — Start THIS Week
    </div>
    <div class="feedback-list">
      ${rdm.quickWins.map(w => `<div class="feedback-item positive"><span class="feedback-icon">🏃</span><span>${w}</span></div>`).join('')}
    </div>
  </div>

  <!-- Resources -->
  <div class="result-section">
    <div class="result-section-title">
      <span class="dot dot-purple"></span>
      📚 Recommended Resources
    </div>
    <div class="skill-tags">
      ${rdm.resources.map(r => `<div class="skill-tag tag-tip">📖 ${r}</div>`).join('')}
    </div>
  </div>

  <div class="result-section">
    <div class="result-section-title"><span class="dot dot-cyan"></span>💡 Next Steps</div>
    <div class="feedback-list">
      <div class="feedback-item info"><span class="feedback-icon">🎙️</span><span>Now practice interview questions for <strong>${db.label}</strong> in the <strong>Interview Coach</strong> tab.</span></div>
      <div class="feedback-item info"><span class="feedback-icon">📊</span><span>Check your detailed skill gap analysis in the <strong>Skill Gap</strong> tab.</span></div>
      <div class="feedback-item info"><span class="feedback-icon">💜</span><span>Feeling overwhelmed by the roadmap? Visit the <strong>Wellness</strong> tab for a personalized check-in.</span></div>
    </div>
  </div>
  `;

  const resultEl = document.getElementById('careerResult');
  resultEl.innerHTML = html;
  resultEl.style.display = 'block';
  resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  showToast('Your personalized roadmap is ready! 🚀', 'success');
}

// ─────────────────────────────────────────────────────────────
// INTERVIEW ANSWER ANALYZER
// ─────────────────────────────────────────────────────────────
async function analyzeInterview() {
  const answer = document.getElementById('interviewAnswer').value.trim();
  if (!answer || answer.length < 20) {
    shakeElement('interviewAnswer');
    showToast('Please write a proper interview answer first!', 'warn');
    return;
  }

  setLoading('interviewBtn', true);
  await fakeDelay(1800);
  setLoading('interviewBtn', false);

  const words = answer.trim().split(/\s+/).length;
  const sentences = answer.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
  const awps = words / Math.max(1, sentences);
  const question = document.getElementById('interviewQuestion').value;

  const lengthScore = calcLengthScore(words);
  const clarityScore = calcClarityScore(answer, awps);
  const depthScore = calcDepthScore(answer, words);
  const structureScore = calcStructureScore(answer);
  const relevanceScore = calcRelevanceScore(answer, question);

  const overall = Math.min(100, Math.round(
    (lengthScore * 0.20) + (clarityScore * 0.25) + (depthScore * 0.25) + (structureScore * 0.15) + (relevanceScore * 0.15)
  ));

  const { color, label } = getScoreColor(overall);

  const summaryMap = {
    'Excellent': 'Outstanding answer! You demonstrated strong communication, depth, and clear structure.',
    'Good': 'Good answer with solid content. A few focused improvements will make it excellent.',
    'Average': 'Decent answer but needs more detail, specific examples, or clearer structure.',
    'Needs Work': 'Your answer is too brief or lacks key elements. Expand it and include a real example.',
  };

  const feedbackItems = buildInterviewFeedback(words, answer, awps, question, {
    lengthScore, clarityScore, depthScore, structureScore, relevanceScore,
  });

  const html = `
  <div class="score-banner">
    ${buildScoreCircle(overall, color)}
    <div class="score-info">
      <div class="score-grade" style="color:${color}">${label} Answer — ${overall}/100</div>
      <div class="score-summary">${summaryMap[label]}</div>
    </div>
  </div>

  <div class="result-section">
    <div class="result-section-title">
      <span class="dot dot-cyan"></span>
      📊 Score Breakdown
    </div>
    <div class="metric-grid">
      ${metricBar('Length & Detail', lengthScore, '#06B6D4')}
      ${metricBar('Clarity', clarityScore, '#A78BFA')}
      ${metricBar('Depth & Examples', depthScore, '#10B981')}
      ${metricBar('Structure (STAR)', structureScore, '#F59E0B')}
    </div>
  </div>

  <div class="result-section">
    <div class="result-section-title">
      <span class="dot dot-purple"></span>
      💬 Personalized Feedback
    </div>
    <div class="feedback-list">
      ${feedbackItems}
    </div>
  </div>

  <div class="result-section">
    <div class="result-section-title">
      <span class="dot dot-green"></span>
      📈 Quick Stats
    </div>
    <div class="skill-tags">
      <div class="skill-tag tag-found">📝 ${words} words</div>
      <div class="skill-tag tag-found">💬 ${sentences} sentences</div>
      <div class="skill-tag ${words >= 60 ? 'tag-found' : 'tag-missing'}">${words >= 60 ? '✓' : '✗'} Detail Level</div>
      <div class="skill-tag ${hasExample(answer) ? 'tag-found' : 'tag-missing'}">${hasExample(answer) ? '✓ Has Example' : '✗ No Example'}</div>
      <div class="skill-tag ${hasNumbers(answer) ? 'tag-found' : 'tag-tip'}">${hasNumbers(answer) ? '✓ Has Numbers' : '⭐ Add Numbers'}</div>
    </div>
  </div>

  <div class="result-section">
    <div class="result-section-title"><span class="dot dot-cyan"></span>💡 Want Model Answers?</div>
    <div class="feedback-list">
      <div class="feedback-item info"><span class="feedback-icon">💡</span><span>Switch to <strong>Get Answer Tips</strong> mode above to see expert guidance and a model answer structure for this question.</span></div>
    </div>
  </div>
  `;

  const resultEl = document.getElementById('interviewResult');
  resultEl.innerHTML = html;
  resultEl.style.display = 'block';
  resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  animateCircle();
}

function calcLengthScore(words) {
  if (words < 20) return 15;
  if (words < 40) return 35;
  if (words < 60) return 55;
  if (words < 100) return 70;
  if (words < 200) return 88;
  if (words <= 350) return 95;
  return 75;
}

function calcClarityScore(text, avgWPS) {
  let score = 70;
  if (avgWPS > 30) score -= 20;
  else if (avgWPS < 8) score -= 10;
  if (/\b(um|uh|like|you know)\b/gi.test(text)) score -= 10;
  const sentences = text.split(/[.!?]+/).filter(s => s.trim());
  const hasVariety = new Set(sentences.map(s => s.trim()[0]?.toLowerCase())).size > 2;
  if (hasVariety) score += 15;
  return Math.max(10, Math.min(100, score));
}

function calcDepthScore(text, words) {
  let score = 40;
  if (hasExample(text)) score += 25;
  if (hasNumbers(text)) score += 15;
  if (/result|outcome|impact|achieved|improved|increased|reduced|led|built|created/i.test(text)) score += 15;
  if (words > 80) score += 10;
  return Math.min(100, score);
}

function calcStructureScore(text) {
  let score = 50;
  if (/situation|context|background|when|while|during/i.test(text)) score += 15;
  if (/i (did|decided|took|created|built|implemented|worked|came up|chose)/i.test(text)) score += 20;
  if (/result|outcome|ended|finally|achieved|successfully|learned/i.test(text)) score += 15;
  return Math.min(100, score);
}

function calcRelevanceScore(text, question) {
  const keywords = {
    'tell-me-about-yourself': ['background', 'experience', 'skills', 'goal', 'career', 'passionate'],
    'strengths-weaknesses': ['strength', 'weakness', 'improve', 'working on', 'challenge'],
    'why-this-company': ['company', 'role', 'mission', 'product', 'team', 'excited'],
    'greatest-achievement': ['achieved', 'proud', 'result', 'built', 'led', 'impact'],
    'where-5-years': ['goal', 'grow', 'lead', 'skill', 'career', 'future', 'aspire'],
    'handle-pressure': ['deadline', 'stress', 'pressure', 'calm', 'prioritize', 'manage'],
    'teamwork': ['team', 'collaborate', 'together', 'communication', 'role', 'group'],
    'problem-solving': ['problem', 'solution', 'approach', 'analyzed', 'fixed', 'resolve'],
    'leadership': ['lead', 'mentor', 'organized', 'direction', 'team', 'decision', 'responsibility'],
    'failure': ['fail', 'mistake', 'learned', 'improved', 'next time', 'changed my approach'],
  };
  const kws = keywords[question] || [];
  const lower = text.toLowerCase();
  const hits = kws.filter(k => lower.includes(k)).length;
  return Math.min(100, 50 + (hits / Math.max(1, kws.length)) * 50);
}

function hasExample(text) {
  return /for example|for instance|once i|when i|in my|one time|i remember|specifically|case when|during my|at my/i.test(text);
}

function hasNumbers(text) {
  return /\b\d+\s*(%|percent|people|users|days|weeks|months|hours|projects|members|times)\b/i.test(text) || /\b\d{2,}\b/.test(text);
}

function metricBar(label, score, color) {
  return `
  <div class="metric-item">
    <div class="metric-label"><span>${label}</span><span>${score}%</span></div>
    <div class="metric-bar">
      <div class="metric-fill" style="width:${score}%; background:${color};"></div>
    </div>
  </div>`;
}

function buildInterviewFeedback(words, text, awps, question, scores) {
  const items = [];

  if (words < 40) {
    items.push({ type: 'negative', icon: '⚠️', msg: 'Your answer is too short. Aim for at least 80–150 words for a complete, credible response.' });
  } else if (words > 400) {
    items.push({ type: 'negative', icon: '✂️', msg: 'Your answer might be too long. Interviewers prefer concise answers — aim for under 2 minutes when spoken.' });
  } else {
    items.push({ type: 'positive', icon: '✅', msg: `Good length! Your ${words}-word answer fits comfortably within a 1-2 minute speaking window.` });
  }

  if (!hasExample(text)) {
    items.push({ type: 'negative', icon: '📌', msg: 'Missing a specific example! Add "For example, in my last project..." or "When I was at XYZ..." to make your answer much more credible.' });
  } else {
    items.push({ type: 'positive', icon: '🎯', msg: 'Great — you included a specific example, which makes your answer concrete and memorable.' });
  }

  if (!hasNumbers(text)) {
    items.push({ type: 'info', icon: '📊', msg: 'Quantify your impact — e.g., "improved performance by 40%", "managed a team of 5", "completed in 2 weeks". Numbers make answers unforgettable.' });
  } else {
    items.push({ type: 'positive', icon: '📈', msg: 'Excellent — you used numbers/data to back up your points. This is a strong interviewing habit.' });
  }

  if (scores.structureScore < 60) {
    items.push({ type: 'info', icon: '🔧', msg: 'Try the STAR method: Situation → Task → Action → Result. This framework gives your answer clear, professional structure.' });
  } else {
    items.push({ type: 'positive', icon: '🏗️', msg: 'Your answer has a good logical structure — this helps interviewers follow your story with ease.' });
  }

  if (awps > 28) {
    items.push({ type: 'info', icon: '✍️', msg: 'Your sentences are quite long. Break them up — shorter sentences are easier to follow in a spoken interview.' });
  }

  if (/\b(um|uh|like|you know)\b/gi.test(text)) {
    items.push({ type: 'negative', icon: '🗣️', msg: 'Filler words detected ("um", "uh", "like"). In a real interview, these reduce credibility. Practice your answer aloud to remove them.' });
  }

  if (!/result|outcome|achieved|improved/i.test(text)) {
    items.push({ type: 'info', icon: '🏁', msg: 'End your answer with the outcome or result. What happened? What did you learn? This is the strongest closing for any interview answer.' });
  }

  return items.map(i => `
    <div class="feedback-item ${i.type}">
      <span class="feedback-icon">${i.icon}</span>
      <span>${i.msg}</span>
    </div>`).join('');
}

// ─────────────────────────────────────────────────────────────
// SKILL GAP ANALYZER
// ─────────────────────────────────────────────────────────────
async function analyzeSkillGap() {
  const raw = document.getElementById('userSkills').value.trim();
  if (!raw || raw.length < 3) {
    shakeElement('userSkills');
    showToast('Please enter at least a few of your current skills!', 'warn');
    return;
  }

  setLoading('skillBtn', true);
  await fakeDelay(1500);
  setLoading('skillBtn', false);

  const role = state.skillRole;
  const db = ROLE_SKILLS[role];
  const userSkills = raw.split(/[,\n]+/).map(s => s.trim()).filter(Boolean);

  const matched = db.required.filter(req => userSkills.some(us => skillMatch(us, req)));
  const missing = db.required.filter(req => !matched.includes(req));
  const bonusMatched = db.bonus.filter(b => userSkills.some(us => skillMatch(us, b)));
  const bonusMissing = db.bonus.filter(b => !bonusMatched.includes(b));

  const score = Math.min(100, Math.round((matched.length / db.required.length) * 85) + Math.min(15, bonusMatched.length * 4));
  const { color, label } = getScoreColor(score);
  const coverPct = Math.round((matched.length / db.required.length) * 100);

  const roadmap = missing.slice(0, 6).map((skill, i) => ({
    skill,
    priority: i < 2 ? 'high' : i < 4 ? 'medium' : 'low',
    resource: getResource(skill),
  }));

  const html = `
  <div class="score-banner">
    ${buildScoreCircle(score, color)}
    <div class="score-info">
      <div class="score-grade" style="color:${color}">${label} Match — ${coverPct}% Skill Coverage</div>
      <div class="score-summary">
        You have <strong>${matched.length} of ${db.required.length}</strong> required skills for <strong>${db.label}</strong>.
        ${missing.length > 0 ? `You're missing ${missing.length} key skills.` : 'Full coverage of required skills — amazing!'}
      </div>
    </div>
  </div>

  <div class="result-section">
    <div class="result-section-title"><span class="dot dot-green"></span>✅ Skills You Have (${matched.length + bonusMatched.length} matched)</div>
    <div class="skill-tags">
      ${matched.map(s => `<div class="skill-tag tag-found">✓ ${s}</div>`).join('')}
      ${bonusMatched.map(s => `<div class="skill-tag tag-tip">⭐ ${s}</div>`).join('')}
      ${matched.length === 0 ? '<p style="color:var(--text-dim);font-size:13px;">None matched. Try spelling them differently or adding more skills.</p>' : ''}
    </div>
  </div>

  ${missing.length > 0 ? `
  <div class="result-section">
    <div class="result-section-title"><span class="dot dot-red"></span>❌ Missing Required Skills (${missing.length})</div>
    <div class="skill-tags">
      ${missing.map(s => `<div class="skill-tag tag-missing">✗ ${s}</div>`).join('')}
    </div>
  </div>` : ''}

  ${roadmap.length > 0 ? `
  <div class="result-section">
    <div class="result-section-title"><span class="dot dot-yellow"></span>🗺️ Priority Learning Roadmap</div>
    ${roadmap.map(r => `
    <div class="roadmap-item">
      <div class="roadmap-priority priority-${r.priority === 'high' ? 'high' : r.priority === 'medium' ? 'med' : 'low'}">
        ${r.priority.toUpperCase()}
      </div>
      <div class="roadmap-info">
        <div class="roadmap-skill">${r.skill}</div>
        <div class="roadmap-resource">📚 ${r.resource}</div>
      </div>
    </div>`).join('')}
  </div>` : ''}

  ${bonusMissing.length > 0 ? `
  <div class="result-section">
    <div class="result-section-title"><span class="dot dot-cyan"></span>⭐ Bonus Skills to Stand Out</div>
    <div class="skill-tags">
      ${bonusMissing.slice(0, 6).map(s => `<div class="skill-tag tag-tip">+ ${s}</div>`).join('')}
    </div>
  </div>` : ''}

  <div class="result-section">
    <div class="result-section-title"><span class="dot dot-purple"></span>🎯 Recommended Next Steps</div>
    <div class="feedback-list">
      <div class="feedback-item info"><span class="feedback-icon">🗺️</span><span>Head to the <strong>Career Roadmap</strong> tab to get a complete month-by-month plan to close these gaps for ${db.label}.</span></div>
      <div class="feedback-item info"><span class="feedback-icon">📄</span><span>Once you've built these skills, reflect them in your resume and re-run the <strong>Resume Analyzer</strong>.</span></div>
    </div>
  </div>
  `;

  const resultEl = document.getElementById('skillResult');
  resultEl.innerHTML = html;
  resultEl.style.display = 'block';
  resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  animateCircle();
}

function getResource(skill) {
  const resources = {
    'Python': 'freeCodeCamp, Codecademy, CS50P (Harvard)',
    'JavaScript': 'javascript.info, Eloquent JavaScript (free)',
    'React': 'React official docs, Scrimba React course',
    'Machine Learning': 'Andrew Ng ML course (Coursera), Fast.ai',
    'SQL': 'SQLZoo, Mode Analytics SQL Tutorial',
    'Docker': 'Docker Get Started guide, FreeCodeCamp Docker',
    'Git': 'Git official docs, learngitbranching.js.org',
    'Linux': 'Linux Foundation free courses, OverTheWire',
    'System Design': 'System Design Primer (GitHub), ByteByteGo',
    'Data Structures': 'LeetCode, GeeksforGeeks, CS Dojo YouTube',
    'Algorithms': 'LeetCode, AlgoExpert, CLRS book',
    'Kubernetes': 'KillerCoda, Kubernetes official docs',
    'CI/CD': 'GitHub Actions docs, Jenkins tutorials',
    'REST API': 'MDN Web Docs, Postman Learning Center',
    'Pandas': 'Pandas official docs, Kaggle micro-courses',
    'NumPy': 'NumPy quickstart guide, CS231n notes',
    'TensorFlow': 'TensorFlow.org tutorials, DeepLearning.AI',
    'PyTorch': 'PyTorch tutorials, fast.ai deep learning',
    'Node.js': 'Node.js official docs, Academind on YouTube',
    'TypeScript': 'TypeScript Handbook, Matt Pocock tutorials',
    'Cloud (AWS/GCP/Azure)': 'AWS Free Tier, Google Cloud Skills Boost, ACloudGuru',
    'MLOps': 'Full Stack Deep Learning, Made With ML by Goku Mohandas',
    'Monitoring': 'Prometheus + Grafana tutorials on YouTube, The DevOps Handbook',
    'Product Strategy': 'Lenny\'s Newsletter, Inspired by Marty Cagan',
    'User Research': 'Nielsen Norman Group articles, Just Enough Research (book)',
  };
  return resources[skill] || 'Search on Coursera, YouTube, or official documentation.';
}

// ─────────────────────────────────────────────────────────────
// WELLNESS FUNCTIONS
// ─────────────────────────────────────────────────────────────
function selectMood(el) {
  document.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  wellnessState.mood = parseInt(el.dataset.mood);
  wellnessState.moodLabel = el.dataset.label;
}

function updateStressLabel(val) {
  wellnessState.stress = parseInt(val);
  document.getElementById('stressDisplay').innerHTML = `Stress Level: <strong>${val}</strong> / 10`;
}

function selectSleep(el) {
  document.querySelectorAll('.sleep-chip').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
  wellnessState.sleep = parseInt(el.dataset.sleep);
}

function toggleSituation(el) {
  const tag = el.dataset.tag;
  if (el.classList.contains('active')) {
    el.classList.remove('active');
    wellnessState.situations.delete(tag);
  } else {
    el.classList.add('active');
    wellnessState.situations.add(tag);
  }
}

// ─────────────────────────────────────────────────────────────
// WELLNESS ANALYZER
// ─────────────────────────────────────────────────────────────
async function analyzeWellness() {
  if (wellnessState.mood === null) {
    showToast('Please select how you\'re feeling (Step 1)!', 'warn');
    return;
  }

  setLoading('wellnessBtn', true);
  await fakeDelay(1700);
  setLoading('wellnessBtn', false);

  const mood = wellnessState.mood;
  const stress = wellnessState.stress;
  const sleep = wellnessState.sleep;
  const situations = [...wellnessState.situations];
  const goal = document.getElementById('wellnessGoal').value.trim();

  const aff = AFFIRMATIONS[mood];

  const moodScore = Math.round((mood / 5) * 40);
  const stressScore = Math.round(((10 - stress) / 10) * 35);
  const sleepScore = sleep >= 7 ? 25 : sleep >= 5 ? 15 : 5;
  const wellnessScore = Math.min(100, moodScore + stressScore + sleepScore);

  const { color: wColor } = getScoreColor(wellnessScore);

  const sleepCat = sleep >= 7 ? 'good' : sleep >= 5 ? 'ok' : 'low';
  const breathEx = BREATHING_EXERCISES[stress >= 7 ? 0 : stress >= 4 ? 1 : 2];

  const activeSituations = situations.length > 0 ? situations : ['nothing'];
  const copingPool = [];
  activeSituations.forEach(tag => {
    const tips = COPING_STRATEGIES[tag] || COPING_STRATEGIES['nothing'];
    tips.slice(0, 3).forEach(t => copingPool.push(t));
  });
  const uniqueCoping = [...new Set(copingPool)].slice(0, 6);

  const sitLabels = {
    exams: 'Exams/Deadlines', career: 'Career Anxiety', social: 'Social Pressure',
    finance: 'Financial Stress', family: 'Family Issues', lonely: 'Feeling Lonely',
    confidence: 'Low Confidence', burnout: 'Burnout', focus: 'Lack of Focus', nothing: 'General',
  };

  const emergencyNote = (mood === 0 || stress >= 9) ? `
    <div class="feedback-item wellness" style="margin-top:16px;">
      <span class="feedback-icon">🆘</span>
      <span><strong>Student Support Reminder:</strong> If you feel unable to cope, please reach out to your college counselling centre, a trusted adult, or a mental health helpline like iCall (India: 9152987821) or Vandrevala Foundation (1860-2662-345). You deserve real support.</span>
    </div>` : '';

  const html = `
  <!-- Affirmation -->
  <div class="affirmation-banner">
    <span class="affirmation-emoji">${aff.emoji}</span>
    <div class="affirmation-text">"${aff.text}"</div>
    <div class="affirmation-sub">${aff.sub}</div>
  </div>

  <!-- Wellness Score Row -->
  <div class="wellness-score-row">
    <div class="wellness-score-card">
      <div class="wsc-label">Wellness Score</div>
      <div class="wsc-value" style="color:${wColor}">${wellnessScore}<span style="font-size:13px;color:var(--text-dim)">/100</span></div>
    </div>
    <div class="wellness-score-card">
      <div class="wsc-label">Mood</div>
      <div class="wsc-value">${wellnessState.moodLabel}</div>
    </div>
    <div class="wellness-score-card">
      <div class="wsc-label">Stress</div>
      <div class="wsc-value" style="color:${stress >= 7 ? 'var(--red)' : stress >= 4 ? 'var(--yellow)' : 'var(--green)'}">${stress}/10</div>
    </div>
    <div class="wellness-score-card">
      <div class="wsc-label">Sleep</div>
      <div class="wsc-value" style="color:${sleepCat === 'good' ? 'var(--green)' : sleepCat === 'ok' ? 'var(--yellow)' : 'var(--red)'}">${sleep}h</div>
    </div>
  </div>

  <!-- Plan Cards -->
  <div class="wellness-plan-grid">
    <div class="wellness-plan-card">
      <div class="wpc-header"><span class="wpc-icon">🧘</span><span class="wpc-title">Personalized Coping Strategies</span></div>
      <ul class="wpc-list">
        ${uniqueCoping.map(tip => `<li>${tip}</li>`).join('')}
      </ul>
    </div>
    <div class="wellness-plan-card">
      <div class="wpc-header"><span class="wpc-icon">🫁</span><span class="wpc-title">${breathEx.name}</span></div>
      <ul class="wpc-list">
        ${breathEx.steps.map(s => `<li>${s}</li>`).join('')}
        <li style="margin-top:8px;color:var(--text-dim);font-size:12px;">Do this now — takes under 2 minutes ⏱️</li>
      </ul>
    </div>
    <div class="wellness-plan-card">
      <div class="wpc-header"><span class="wpc-icon">🌅</span><span class="wpc-title">Morning Micro-Rituals</span></div>
      <ul class="wpc-list">
        ${MORNING_RITUALS.map(r => `<li>${r}</li>`).join('')}
      </ul>
    </div>
    <div class="wellness-plan-card">
      <div class="wpc-header"><span class="wpc-icon">🌙</span><span class="wpc-title">Sleep Improvement Tips</span></div>
      <ul class="wpc-list">
        ${SLEEP_TIPS[sleepCat].map(t => `<li>${t}</li>`).join('')}
      </ul>
    </div>
  </div>

  ${situations.length > 0 ? `
  <div class="result-section">
    <div class="result-section-title">
      <span class="dot dot-pink"></span>
      🎯 Personalized For These Areas
    </div>
    <div class="skill-tags">
      ${situations.map(s => `<div class="skill-tag" style="background:rgba(251,113,133,0.1);border:1px solid rgba(251,113,133,0.25);color:#FDA4AF;">${sitLabels[s] || s}</div>`).join('')}
    </div>
  </div>` : ''}

  ${goal ? `
  <div class="result-section">
    <div class="result-section-title">
      <span class="dot dot-purple"></span>
      💬 Response to Your Goal
    </div>
    <div class="feedback-list">
      <div class="feedback-item wellness">
        <span class="feedback-icon">✍️</span>
        <span>You said: <em>"${goal.slice(0, 140)}${goal.length > 140 ? '...' : ''}"</em> — This is a valid and achievable goal. Start with one step from the coping strategies above. Progress over perfection.</span>
      </div>
      ${stress >= 6 ? '<div class="feedback-item info"><span class="feedback-icon">⏸️</span><span>High stress detected — give yourself permission to pause before pushing forward. Rest is not quitting; it\'s strategy.</span></div>' : ''}
      <div class="feedback-item positive"><span class="feedback-icon">🌱</span><span>The fact that you're aware of what you need is already a sign of emotional intelligence. Keep going.</span></div>
    </div>
  </div>` : ''}

  <!-- Key Insights -->
  <div class="result-section">
    <div class="result-section-title">
      <span class="dot dot-cyan"></span>
      💡 Key Wellness Insights
    </div>
    <div class="feedback-list">
      ${stress >= 8 ? '<div class="feedback-item negative"><span class="feedback-icon">⚠️</span><span>Your stress level is very high. Prioritize reducing your load today — cancel or defer one non-essential task right now.</span></div>' : ''}
      ${sleep < 5 ? '<div class="feedback-item negative"><span class="feedback-icon">😴</span><span>Sleep deprivation severely impacts memory, decision-making, and emotional regulation. Make sleep your #1 priority tonight.</span></div>' : ''}
      ${mood <= 1 ? '<div class="feedback-item wellness"><span class="feedback-icon">💜</span><span>Feeling low or overwhelmed is not weakness. It\'s information. Use the coping steps above and talk to someone you trust today.</span></div>' : ''}
      ${mood >= 4 ? '<div class="feedback-item positive"><span class="feedback-icon">🔥</span><span>Great mood! Use this positive energy to tackle your hardest, most important task first — you\'re well-positioned for it.</span></div>' : ''}
      <div class="feedback-item info"><span class="feedback-icon">📱</span><span>Limit doomscrolling — research shows a 30-minute social media limit measurably reduces anxiety in students.</span></div>
      <div class="feedback-item info"><span class="feedback-icon">🏃</span><span>Even a 10-minute walk boosts serotonin, reduces cortisol, and clears mental fog. Try it in the next hour.</span></div>
      <div class="feedback-item info"><span class="feedback-icon">🎙️</span><span>If career stress is weighing on you, use the <strong>Career Roadmap</strong> tab to create a clear plan — clarity reduces anxiety.</span></div>
      ${emergencyNote}
    </div>
  </div>
  `;

  const resultEl = document.getElementById('wellnessResult');
  resultEl.innerHTML = html;
  resultEl.style.display = 'block';
  resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ─────────────────────────────────────────────────────────────
// UI HELPERS
// ─────────────────────────────────────────────────────────────
function shakeElement(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.style.borderColor = '#EF4444';
  el.style.animation = 'none';
  el.offsetHeight;
  el.style.animation = 'shake 0.4s ease';
  setTimeout(() => { el.style.borderColor = ''; el.style.animation = ''; }, 600);

  if (!document.getElementById('shake-style')) {
    const style = document.createElement('style');
    style.id = 'shake-style';
    style.textContent = `@keyframes shake {
      0%, 100% { transform: translateX(0); }
      20%, 60% { transform: translateX(-6px); }
      40%, 80% { transform: translateX(6px); }
    }`;
    document.head.appendChild(style);
  }
}

function showToast(msg, type = 'info') {
  const existing = document.getElementById('toast');
  if (existing) existing.remove();

  const colors = { info: '#7C3AED', warn: '#F59E0B', error: '#EF4444', success: '#10B981' };
  const toast = document.createElement('div');
  toast.id = 'toast';
  toast.textContent = msg;
  Object.assign(toast.style, {
    position: 'fixed', bottom: '28px', left: '50%',
    transform: 'translateX(-50%) translateY(80px)',
    background: colors[type] || colors.info,
    color: '#fff', padding: '14px 24px',
    borderRadius: '12px', fontSize: '14px', fontWeight: '600',
    zIndex: '9999', boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
    transition: 'transform 0.35s ease, opacity 0.35s ease',
    opacity: '0', maxWidth: '90vw', textAlign: 'center',
    fontFamily: 'Inter, sans-serif',
  });
  document.body.appendChild(toast);
  requestAnimationFrame(() => {
    toast.style.transform = 'translateX(-50%) translateY(0)';
    toast.style.opacity = '1';
  });
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(80px)';
    setTimeout(() => toast.remove(), 400);
  }, 3500);
}
