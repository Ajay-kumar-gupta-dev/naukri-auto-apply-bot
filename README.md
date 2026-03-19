# 🤖 Naukri Auto Apply Bot

A Python + Playwright headless automation bot that applies to 100+ jobs daily on Naukri.com — fully automated, with smart filtering, recruiter chatbot handling, and application logging.

---

## 🚀 What it does

- **Auto login** with session persistence (no repeated OTP flow)
- **Searches jobs** by role, skills, location, and experience filters
- **Fills application forms** dynamically based on your profile
- **Answers recruiter chatbot questions** using your pre-configured profile data (notice period, experience, CTC etc.)
- **Skip list** — never applies to the same job twice across sessions
- **Application logger** — logs every application with timestamp, company, role, and status
- **Stats script** — daily summary of applications sent, skipped, and failed

---

## 🛠️ Tech Stack

| Tool | Purpose |
|------|---------|
| Python 3.x | Core language |
| Playwright | Headless browser automation |
| JSON | Skip list & config storage |
| Linux / macOS | Runtime environment |

---

## 📁 Project Structure

```
naukri-auto-apply-bot/
├── naukri_bot.py          # Main bot script
├── stats.py               # Application stats tracker
├── skip_list.json         # Tracks already-applied jobs (auto-generated)
├── applications.log       # Log of all applications (auto-generated)
├── .env.example           # Environment variable template
├── requirements.txt       # Python dependencies
└── README.md
```

---

## ⚙️ Setup & Installation

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/naukri-auto-apply-bot.git
cd naukri-auto-apply-bot
```

### 2. Install dependencies

```bash
pip install playwright
playwright install chromium
```

### 3. Configure your profile

Copy the example env file and fill in your details:

```bash
cp .env.example .env
```

Edit `.env`:

```
NAUKRI_EMAIL=your_email@gmail.com
NAUKRI_PASSWORD=your_password
NOTICE_PERIOD=30
CURRENT_CTC=your_ctc
EXPECTED_CTC=your_expected_ctc
TOTAL_EXPERIENCE=5
```

### 4. Set your job search preferences

Inside `naukri_bot.py`, update the search config at the top of the file:

```python
SEARCH_ROLES   = ["Software Engineer", "DevOps Engineer", "Full Stack Developer"]
SEARCH_SKILLS  = ["Python", "React", "Node.js", "AWS"]
LOCATION       = "Mumbai"
EXPERIENCE_MIN = 4
EXPERIENCE_MAX = 7
```

### 5. Run the bot

```bash
python3 naukri_bot.py
```

### 6. View your stats

```bash
python3 stats.py
```

---

## 📊 Sample Output

```
=============================
  Naukri Bot - Daily Stats
=============================
Date        : 2026-03-19
Applied     : 107
Skipped     : 34  (already applied / irrelevant)
Failed      : 3
Total so far: 1,240
=============================
```

---

## 🔒 Security

- All credentials are stored in `.env` — never committed to Git
- `.env`, `skip_list.json`, and `*.log` files are in `.gitignore`
- No personal data is hardcoded in the source code

---

## ⚠️ Disclaimer

This tool is built for personal use to streamline a job search. Use responsibly and in accordance with Naukri's terms of service. The author is not responsible for any account restrictions resulting from automated activity.

---

## 🙋 Author

**Ajaykumar Gupta**
- LinkedIn: [linkedin.com/in/ajaykumar-gupta-62a640286](https://linkedin.com/in/ajaykumar-gupta-62a640286)
- Portfolio: [crio.do/learn/portfolio/ag5224741](https://www.crio.do/learn/portfolio/ag5224741)

---

## ⭐ If this helped you

Give it a star on GitHub — it helps others find it too!
