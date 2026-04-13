"""
IntelliSphere AI — Flask Backend (app.py)
==========================================
Endpoints:
  POST /api/analyze/resume      → Resume Analyzer
  POST /api/analyze/interview   → Interview Answer Analyzer
  POST /api/analyze/skill-gap   → Skill Gap Analyzer
  POST /api/analyze/wellness    → Wellness Analyzer

Run:
  pip install flask flask-cors
  python app.py
Server starts at http://localhost:5000
"""

from flask import Flask, jsonify, request
from flask_cors import CORS
import math, re, random

app = Flask(__name__)
CORS(app)  # allow requests from the frontend served on any port

# ══════════════════════════════════════════════════════════════
# ROLE SKILL DATABASE
# ══════════════════════════════════════════════════════════════
ROLE_SKILLS = {
    "software-engineer": {
        "label": "Software Engineer",
        "required": ["Python","Java","JavaScript","Data Structures","Algorithms","Git","SQL",
                     "REST API","OOP","System Design","Linux","Debugging"],
        "bonus":    ["Docker","Kubernetes","CI/CD","Cloud (AWS/GCP/Azure)","TypeScript",
                     "Agile","Testing"],
    },
    "data-scientist": {
        "label": "Data Scientist",
        "required": ["Python","Machine Learning","Statistics","SQL","Pandas","NumPy",
                     "Data Visualization","Feature Engineering","Model Evaluation"],
        "bonus":    ["Deep Learning","TensorFlow","PyTorch","Big Data","Spark","R",
                     "NLP","Computer Vision"],
    },
    "web-developer": {
        "label": "Web Developer",
        "required": ["HTML","CSS","JavaScript","React","Git","REST API",
                     "Responsive Design","Node.js","SQL"],
        "bonus":    ["TypeScript","Next.js","Vue.js","GraphQL","Docker","Testing",
                     "Tailwind CSS","Web Performance"],
    },
    "ml-engineer": {
        "label": "ML Engineer",
        "required": ["Python","Machine Learning","Deep Learning","TensorFlow","PyTorch",
                     "MLOps","Docker","Python APIs","Data Pipelines","Cloud"],
        "bonus":    ["Kubernetes","Spark","NLP","Computer Vision","Model Optimization",
                     "Feature Stores"],
    },
    "devops": {
        "label": "DevOps Engineer",
        "required": ["Linux","Docker","Kubernetes","CI/CD","Git","Cloud (AWS/GCP/Azure)",
                     "Shell Scripting","Monitoring","Networking"],
        "bonus":    ["Terraform","Ansible","Jenkins","Prometheus","Grafana","Security","Python"],
    },
    "product-manager": {
        "label": "Product Manager",
        "required": ["Product Strategy","User Research","Roadmapping","Data Analysis",
                     "Communication","Agile/Scrum","Stakeholder Management","SQL Basics"],
        "bonus":    ["A/B Testing","Wireframing","Figma","Market Research","OKRs",
                     "Technical Writing"],
    },
}

RESOURCES = {
    "Python": "freeCodeCamp, Codecademy, CS50P (Harvard)",
    "JavaScript": "javascript.info, Eloquent JavaScript (free)",
    "React": "React official docs, Scrimba React course",
    "Machine Learning": "Andrew Ng ML course (Coursera), Fast.ai",
    "SQL": "SQLZoo, Mode Analytics SQL Tutorial",
    "Docker": "Docker Get Started guide, FreeCodeCamp Docker",
    "Git": "Git official docs, learngitbranching.js.org",
    "Linux": "Linux Foundation free courses, OverTheWire",
    "System Design": "System Design Primer (GitHub), ByteByteGo",
    "Data Structures": "LeetCode, GeeksforGeeks, CS Dojo YouTube",
    "Algorithms": "LeetCode, AlgoExpert, CLRS book",
    "Kubernetes": "KillerCoda, Kubernetes official docs",
    "CI/CD": "GitHub Actions docs, Jenkins tutorials",
    "REST API": "MDN Web Docs, Postman Learning Center",
    "Pandas": "Pandas official docs, Kaggle micro-courses",
    "NumPy": "NumPy quickstart guide, CS231n notes",
    "TensorFlow": "TensorFlow.org tutorials, DeepLearning.AI",
    "PyTorch": "PyTorch tutorials, fast.ai deep learning",
    "Node.js": "Node.js official docs, Academind on YouTube",
    "TypeScript": "TypeScript Handbook, Matt Pocock tutorials",
}

# ══════════════════════════════════════════════════════════════
# WELLNESS DATABASE
# ══════════════════════════════════════════════════════════════
AFFIRMATIONS = {
    5: {"emoji": "🌟", "text": "You are at your best — keep this momentum!", "sub": "Channel this energy into your goals today."},
    4: {"emoji": "😊", "text": "You're doing well — and that's worth celebrating.", "sub": "Small wins add up to big victories."},
    3: {"emoji": "🌱", "text": "It's okay to just be okay. Growth happens here.", "sub": "You're stronger than your current feeling."},
    2: {"emoji": "💜", "text": "Low days are temporary. You have survived every hard day so far.", "sub": "Give yourself permission to rest and recharge."},
    1: {"emoji": "🤝", "text": "Stress is a signal — not a sentence. You can handle this.", "sub": "Take one small step at a time. That's enough."},
    0: {"emoji": "🫂", "text": "You are not alone. Overwhelming feelings are valid, and they will pass.", "sub": "Please reach out to someone you trust if you need support."},
}

COPING_STRATEGIES = {
    "exams":      ["Break your study list into 25-min Pomodoro blocks","Write a brain dump — everything on your mind on paper","Pick ONE chapter to review and start there"],
    "career":     ["Write down 3 things you're already good at professionally","Set ONE small career action for today","Remember: careers are built over years, not days"],
    "social":     ["Limit time on social media to 30 mins today","Call or text ONE real friend just to check in","Practice saying 'no' without guilt — boundaries are healthy"],
    "finance":    ["Track spending for just 3 days — awareness is powerful","Look into scholarships, grants, or part-time gigs","Budget using 50/30/20 rule: needs, wants, savings"],
    "family":     ["Set a 30-min window to process feelings — then redirect your focus","Write a letter you don't send to express unspoken feelings","Remind yourself: you control your response, not others' actions"],
    "lonely":     ["Step out of your room — library, café, campus common area","Introduce yourself to one new person this week","Volunteer — giving to others fills the loneliness gap"],
    "confidence": ["Write 3 specific wins from your past week — no matter how small","Practice power poses for 2 minutes before something intimidating","Do ONE thing outside your comfort zone today"],
    "burnout":    ["Take a full 24-hour break from studying — rest is productive","Identify what drained you most and create a boundary around it","Spend time in nature — a park walk resets your nervous system"],
    "focus":      ["Clear your desk — physical clutter = mental clutter","Try the 2-minute rule: if it takes 2 mins, do it NOW","Prioritize tasks with an Eisenhower Matrix"],
    "nothing":    ["Maintain what's working — consistency is underrated","Use this clarity to set one new growth goal","Reflect on what's brought you peace — double down on it"],
}

MORNING_RITUALS = [
    "Drink a full glass of water before checking your phone",
    "Write 3 things you're grateful for (takes 2 minutes)",
    "Get 10 minutes of sunlight or fresh air",
    "Do 5 minutes of light stretching or yoga",
    "Set ONE intention for the day (just one)",
]

BREATHING_EXERCISES = [
    {"name": "4-7-8 Breathing",  "steps": ["Inhale for 4 counts","Hold for 7 counts","Exhale slowly for 8 counts","Repeat 4 times"]},
    {"name": "Box Breathing",    "steps": ["Inhale for 4 counts","Hold for 4 counts","Exhale for 4 counts","Hold for 4 counts"]},
    {"name": "5-5-5 Grounding", "steps": ["Name 5 things you can see","Name 5 things you can touch","Name 5 things you can hear","Take one deep breath"]},
]

SLEEP_TIPS = {
    "low":  ["Go to bed 30 mins earlier tonight — start the fix now","Avoid screens 1 hour before bed","Try a 20-min nap between 1-3 PM if possible"],
    "ok":   ["Your sleep is decent — aim to keep a fixed bedtime","Avoid caffeine after 3 PM for deeper sleep","Use a white noise app if you wake at night"],
    "good": ["Great sleep is your superpower — protect it","Keep your sleep schedule consistent on weekends too","Your recovery and focus both improve with 7-8h of sleep"],
}

# ══════════════════════════════════════════════════════════════
# HELPER FUNCTIONS
# ══════════════════════════════════════════════════════════════
def normalize_skill(s: str) -> str:
    return re.sub(r"[^a-z0-9#+.]", "", s.lower())

def levenshtein(a: str, b: str) -> int:
    if a == b: return 0
    if not a: return len(b)
    if not b: return len(a)
    matrix = [[0] * (len(a) + 1) for _ in range(len(b) + 1)]
    for i in range(len(b) + 1): matrix[i][0] = i
    for j in range(len(a) + 1): matrix[0][j] = j
    for i in range(1, len(b) + 1):
        for j in range(1, len(a) + 1):
            if b[i-1] == a[j-1]:
                matrix[i][j] = matrix[i-1][j-1]
            else:
                matrix[i][j] = 1 + min(matrix[i-1][j-1], matrix[i][j-1], matrix[i-1][j])
    return matrix[len(b)][len(a)]

def skill_match(user_skill: str, required_skill: str) -> bool:
    u = normalize_skill(user_skill)
    r = normalize_skill(required_skill)
    return u in r or r in u or levenshtein(u, r) <= 2

def get_score_label(score: int) -> dict:
    if score >= 80: return {"color": "#10B981", "label": "Excellent"}
    if score >= 65: return {"color": "#06B6D4", "label": "Good"}
    if score >= 45: return {"color": "#F59E0B", "label": "Average"}
    return {"color": "#EF4444", "label": "Needs Work"}

def has_example(text: str) -> bool:
    pattern = r"for example|for instance|once i|when i|in my|one time|i remember|specifically|case when"
    return bool(re.search(pattern, text, re.IGNORECASE))

def has_numbers(text: str) -> bool:
    return bool(re.search(r"\b\d+\s*(%|percent|people|users|days|weeks|months|hours|projects|members|times)\b", text, re.IGNORECASE)) \
        or bool(re.search(r"\b\d{2,}\b", text))


# ══════════════════════════════════════════════════════════════
# ROUTES
# ══════════════════════════════════════════════════════════════

@app.route("/", methods=["GET"])
def index():
    return jsonify({"status": "ok", "message": "IntelliSphere AI backend is running 🚀"})


# ── 1. RESUME ANALYZER ──────────────────────────────────────
@app.route("/api/analyze/resume", methods=["POST"])
def analyze_resume():
    data = request.get_json(force=True)
    text: str = data.get("text", "").strip()
    role: str = data.get("role", "software-engineer")

    if not text or len(text) < 30:
        return jsonify({"error": "Resume text is too short. Please provide at least a few lines."}), 400

    db = ROLE_SKILLS.get(role, ROLE_SKILLS["software-engineer"])
    lower_text = text.lower()

    found_required = [s for s in db["required"] if s.lower() in lower_text or normalize_skill(s) in lower_text]
    found_bonus    = [s for s in db["bonus"]    if s.lower() in lower_text]
    missing        = [s for s in db["required"] if s not in found_required]

    base_score   = round((len(found_required) / len(db["required"])) * 70)
    bonus_score  = min(15, len(found_bonus) * 3)
    length_score = min(15, len(text) // 80)
    raw_score    = min(100, base_score + bonus_score + length_score)
    noise        = random.randint(-2, 2)
    score        = max(5, min(100, raw_score + noise))

    info = get_score_label(score)

    summary_texts = {
        "Excellent": f"Outstanding resume for {db['label']}! You have strong coverage of required skills.",
        "Good":      f"Solid resume for {db['label']}. A few tweaks will significantly boost your chances.",
        "Average":   f"Your resume shows potential for {db['label']}, but several key skills are missing.",
        "Needs Work":f"Your resume needs improvement for {db['label']} roles. Focus on building the missing skills first.",
    }

    recommendations = []
    if missing:
        recommendations.append({"type": "negative", "icon": "🚨", "msg": f"Add the missing skills to your resume — especially {', '.join(missing[:3])}."})
    else:
        recommendations.append({"type": "positive", "icon": "🏆", "msg": "All core required skills are present. Great work!"})
    if len(text) < 300:
        recommendations.append({"type": "negative", "icon": "📋", "msg": "Resume appears too short. Add more detail about projects, experience, and achievements."})
    if "project" not in lower_text and "built" not in lower_text:
        recommendations.append({"type": "info", "icon": "🔨", "msg": "Include a 'Projects' section — recruiters love seeing what you've built."})
    if not any(w in lower_text for w in ["internship", "experience", "worked"]):
        recommendations.append({"type": "info", "icon": "💼", "msg": "Add work experience or internship details — even personal or volunteer experience counts."})
    if not found_bonus:
        recommendations.append({"type": "info", "icon": "⭐", "msg": f"Consider adding bonus skills like {', '.join(db['bonus'][:3])} to stand out."})
    else:
        recommendations.append({"type": "positive", "icon": "⭐", "msg": f"Great — you have {len(found_bonus)} bonus/advanced skills that help you stand out!"})
    recommendations.append({"type": "info", "icon": "📝", "msg": "Use action verbs like 'Built', 'Developed', 'Led', 'Designed' to make bullet points stronger."})

    return jsonify({
        "score": score,
        "label": info["label"],
        "color": info["color"],
        "summary": summary_texts[info["label"]],
        "found_required": found_required,
        "found_bonus": found_bonus,
        "missing_required": missing,
        "recommendations": recommendations,
        "role_label": db["label"],
    })


# ── 2. INTERVIEW ANSWER ANALYZER ────────────────────────────
@app.route("/api/analyze/interview", methods=["POST"])
def analyze_interview():
    data = request.get_json(force=True)
    answer: str   = data.get("answer", "").strip()
    question: str = data.get("question", "custom")

    if not answer or len(answer) < 20:
        return jsonify({"error": "Please write a proper interview answer first!"}), 400

    words     = answer.split()
    word_count = len(words)
    sentences = [s.strip() for s in re.split(r"[.!?]+", answer) if s.strip()]
    awps      = word_count / max(1, len(sentences))  # avg words per sentence

    # Scoring sub-dimensions
    def length_score(w):
        if w < 20:  return 15
        if w < 40:  return 35
        if w < 60:  return 55
        if w < 100: return 70
        if w < 200: return 88
        if w <= 350: return 95
        return 75

    def clarity_score(text, avg_wps):
        s = 70
        if avg_wps > 30: s -= 20
        elif avg_wps < 8: s -= 10
        if re.search(r"\b(um|uh|like|you know)\b", text, re.IGNORECASE): s -= 10
        starts = {sen[0].lower() for sen in sentences if sen}
        if len(starts) > 2: s += 15
        return max(10, min(100, s))

    def depth_score(text, w):
        s = 40
        if has_example(text): s += 25
        if has_numbers(text): s += 15
        if re.search(r"result|outcome|impact|achieved|improved|increased|reduced|led|built|created", text, re.IGNORECASE): s += 15
        if w > 80: s += 10
        return min(100, s)

    def structure_score(text):
        s = 50
        if re.search(r"situation|context|background|when|while|during", text, re.IGNORECASE): s += 15
        if re.search(r"i (did|decided|took|created|built|implemented|worked|came up|chose)", text, re.IGNORECASE): s += 20
        if re.search(r"result|outcome|ended|finally|achieved|successfully|learned", text, re.IGNORECASE): s += 15
        return min(100, s)

    RELEVANCE_KEYWORDS = {
        "tell-me-about-yourself": ["background","experience","skills","interests","goal","career","passionate"],
        "strengths-weaknesses":   ["strength","weakness","improve","working on","challenge"],
        "why-this-company":       ["company","role","mission","product","team","align","excited"],
        "greatest-achievement":   ["achieved","proud","result","built","led","impact"],
        "where-5-years":          ["goal","grow","lead","skill","career","future","aspire"],
        "handle-pressure":        ["deadline","stress","pressure","calm","prioritize","manage"],
        "teamwork":               ["team","collaborate","together","communication","role","group"],
        "problem-solving":        ["problem","solution","approach","analyzed","fixed","resolve"],
    }
    kws  = RELEVANCE_KEYWORDS.get(question, [])
    hits = sum(1 for k in kws if k in answer.lower())
    relevance = min(100, 50 + (hits / max(1, len(kws))) * 50)

    ls = length_score(word_count)
    cs = clarity_score(answer, awps)
    ds = depth_score(answer, word_count)
    ss = structure_score(answer)

    overall = min(100, round(ls*0.20 + cs*0.25 + ds*0.25 + ss*0.15 + relevance*0.15))
    info = get_score_label(overall)

    # Build feedback items
    feedback = []
    if word_count < 40:
        feedback.append({"type":"negative","icon":"⚠️","msg":"Your answer is too short. Aim for at least 80–150 words."})
    elif word_count > 400:
        feedback.append({"type":"negative","icon":"✂️","msg":"Your answer might be too long. Interviewers prefer concise answers under 2 minutes."})
    else:
        feedback.append({"type":"positive","icon":"✅","msg":f"Good length! Your {word_count}-word answer fits within a comfortable speaking time."})

    if not has_example(answer):
        feedback.append({"type":"negative","icon":"📌","msg":"Missing a specific example! Use 'For example, when I…' or 'In my last project…' to be concrete."})
    else:
        feedback.append({"type":"positive","icon":"🎯","msg":"Great — you included a specific example, which makes your answer much more credible."})

    if not has_numbers(answer):
        feedback.append({"type":"info","icon":"📊","msg":"Try to quantify your impact — e.g., 'improved performance by 40%', 'managed a team of 5'."})
    else:
        feedback.append({"type":"positive","icon":"📈","msg":"Excellent — you used numbers/data to back up your points!"})

    if ss < 60:
        feedback.append({"type":"info","icon":"🔧","msg":"Use the STAR method: Situation → Task → Action → Result. It gives your answer clear structure."})
    else:
        feedback.append({"type":"positive","icon":"🏗️","msg":"Your answer has a good logical structure — this helps interviewers follow along easily."})

    if awps > 28:
        feedback.append({"type":"info","icon":"✍️","msg":"Your sentences are quite long. Try breaking them up for easier listening in a spoken interview."})

    if re.search(r"\b(um|uh|like|you know)\b", answer, re.IGNORECASE):
        feedback.append({"type":"negative","icon":"🗣️","msg":"Remove filler words like 'um', 'uh', 'like' — they reduce credibility in interviews."})

    if not re.search(r"result|outcome|achieved|improved", answer, re.IGNORECASE):
        feedback.append({"type":"info","icon":"🏁","msg":"End with the outcome/result of your story. What happened? What did you learn?"})

    return jsonify({
        "overall": overall,
        "label":   info["label"],
        "color":   info["color"],
        "scores": {
            "length":    ls,
            "clarity":   cs,
            "depth":     ds,
            "structure": ss,
            "relevance": int(relevance),
        },
        "stats": {
            "words": word_count,
            "sentences": len(sentences),
            "has_example": has_example(answer),
            "has_numbers": has_numbers(answer),
        },
        "feedback": feedback,
    })


# ── 3. SKILL GAP ANALYZER ───────────────────────────────────
@app.route("/api/analyze/skill-gap", methods=["POST"])
def analyze_skill_gap():
    data = request.get_json(force=True)
    raw: str  = data.get("skills", "").strip()
    role: str = data.get("role", "software-engineer")

    if not raw or len(raw) < 3:
        return jsonify({"error": "Please enter at least a few of your current skills."}), 400

    db = ROLE_SKILLS.get(role, ROLE_SKILLS["software-engineer"])
    user_skills = [s.strip() for s in re.split(r"[,\n]+", raw) if s.strip()]

    matched      = [req for req in db["required"] if any(skill_match(us, req) for us in user_skills)]
    missing      = [req for req in db["required"] if req not in matched]
    bonus_matched = [b for b in db["bonus"] if any(skill_match(us, b) for us in user_skills)]
    bonus_missing = [b for b in db["bonus"] if b not in bonus_matched]

    score     = min(100, round((len(matched) / len(db["required"])) * 85) + min(15, len(bonus_matched) * 4))
    cover_pct = round((len(matched) / len(db["required"])) * 100)
    info      = get_score_label(score)

    priorities = ["high", "high", "medium", "medium", "low", "low"]
    roadmap = [
        {
            "skill":    skill,
            "priority": priorities[i] if i < len(priorities) else "low",
            "resource": RESOURCES.get(skill, "Search on Coursera, YouTube, or official documentation."),
        }
        for i, skill in enumerate(missing[:6])
    ]

    return jsonify({
        "score":          score,
        "cover_pct":      cover_pct,
        "label":          info["label"],
        "color":          info["color"],
        "matched":        matched,
        "missing":        missing,
        "bonus_matched":  bonus_matched,
        "bonus_missing":  bonus_missing[:6],
        "roadmap":        roadmap,
        "role_label":     db["label"],
        "required_total": len(db["required"]),
    })


# ── 4. WELLNESS ANALYZER ────────────────────────────────────
@app.route("/api/analyze/wellness", methods=["POST"])
def analyze_wellness():
    data = request.get_json(force=True)
    mood:       int  = int(data.get("mood", -1))
    stress:     int  = int(data.get("stress", 5))
    sleep:      int  = int(data.get("sleep", 7))
    situations: list = data.get("situations", [])
    goal:       str  = data.get("goal", "").strip()

    if mood < 0 or mood > 5:
        return jsonify({"error": "Please select how you're feeling (mood 0–5)."}), 400

    mood_score    = round((mood / 5) * 40)
    stress_score  = round(((10 - stress) / 10) * 35)
    sleep_score   = 25 if sleep >= 7 else (15 if sleep >= 5 else 5)
    wellness_score = min(100, mood_score + stress_score + sleep_score)
    info = get_score_label(wellness_score)

    sleep_cat = "good" if sleep >= 7 else ("ok" if sleep >= 5 else "low")
    breath_idx = 0 if stress >= 7 else (1 if stress >= 4 else 2)
    breath_ex  = BREATHING_EXERCISES[breath_idx]

    active_situations = situations if situations else ["nothing"]
    coping_pool = []
    for tag in active_situations:
        coping_pool.extend(COPING_STRATEGIES.get(tag, COPING_STRATEGIES["nothing"])[:3])
    unique_coping = list(dict.fromkeys(coping_pool))[:6]  # deduplicate, keep order

    aff = AFFIRMATIONS.get(mood, AFFIRMATIONS[3])

    insights = []
    if stress >= 8:
        insights.append({"type":"negative","icon":"⚠️","msg":"Your stress level is very high. Prioritize reducing your load today — cancel or defer one non-essential task."})
    if sleep < 5:
        insights.append({"type":"negative","icon":"😴","msg":"Sleep deprivation severely impacts memory, decision-making, and emotional regulation. Tonight, make sleep your #1 priority."})
    if mood <= 1:
        insights.append({"type":"wellness","icon":"💜","msg":"Feeling low or stressed is not weakness. It's information. Use the coping steps above and talk to someone today."})
    if mood >= 4:
        insights.append({"type":"positive","icon":"🔥","msg":"Great mood! Use this positive state to tackle your hardest task first — you're well-positioned for it."})
    insights.append({"type":"info","icon":"📱","msg":"Limit doomscrolling — research shows 30-min social media limits measurably reduce anxiety in students."})
    insights.append({"type":"info","icon":"🏃","msg":"Even a 10-minute walk boosts serotonin, reduces cortisol and clears mental fog. Try it today."})

    show_emergency = mood == 0 or stress >= 9
    if show_emergency:
        insights.append({
            "type":"emergency","icon":"🆘",
            "msg":"Student Support Reminder: If you feel unable to cope, please reach out to your college counselling centre, a trusted adult, or iCall (India: 9152987821) or Vandrevala Foundation (1860-2662-345)."
        })

    goal_response = None
    if goal:
        goal_response = {
            "goal": goal[:120] + ("..." if len(goal) > 120 else ""),
            "high_stress": stress >= 6,
        }

    return jsonify({
        "wellness_score":  wellness_score,
        "label":           info["label"],
        "color":           info["color"],
        "affirmation":     aff,
        "coping":          unique_coping,
        "breathing":       breath_ex,
        "morning_rituals": MORNING_RITUALS,
        "sleep_tips":      SLEEP_TIPS[sleep_cat],
        "insights":        insights,
        "goal_response":   goal_response,
        "stats": {
            "mood":   mood,
            "stress": stress,
            "sleep":  sleep,
        },
    })


# ══════════════════════════════════════════════════════════════
# ENTRY POINT
# ══════════════════════════════════════════════════════════════
if __name__ == "__main__":
    print("🚀  IntelliSphere AI Flask backend starting on http://localhost:5000")
    app.run(debug=True, host="0.0.0.0", port=5000)
