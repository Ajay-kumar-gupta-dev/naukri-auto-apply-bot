# 🤖 Naukri Auto Apply Bot — v10 SMART SKIP

A Python + Playwright headless automation bot that applies to 100+ jobs daily on Naukri.com — fully automated, with smart skip logic, recruiter chatbot handling, and persistent application logging.

> Built by [Ajaykumar Gupta](https://linkedin.com/in/ajaykumar-gupta-62a640286)

---

## ✨ Features

- ✅ **Auto login** to Naukri.com with session handling
- ✅ **Batch applies** to recommended jobs (5 per batch)
- ✅ **Smart skip list** — failed/applied jobs saved to `skip_list.json`, never picked up again across runs
- ✅ **Recruiter chatbot handler** — auto-answers notice period, CTC, experience questions
- ✅ **Error detection** — skips jobs that throw application errors
- ✅ **Application logger** — every application saved to `naukri_applications_log.json`
- ✅ **Daily stats** — session count + today's total shown in terminal
- ✅ **Debug screenshots** — saved automatically on errors
- ✅ **Runs forever** until you press `Ctrl+C`

---

## 🛠️ Tech Stack

| Tool | Purpose |
|------|---------|
| Python 3.x | Core language |
| Playwright (async) | Headless browser automation |
| python-dotenv | Secure credential loading from `.env` |
| JSON | Skip list & application log storage |

---

## 📁 Project Structure

```
naukri-auto-apply-bot/
├── naukri_bot.py                 # Main bot script
├── stats.py                      # Application stats tracker
├── requirements.txt              # Python dependencies
├── .env.example                  # Credential template (copy to .env)
├── .gitignore                    # Keeps .env and logs off GitHub
├── skip_list.json                # Auto-generated: tracks skipped jobs
├── naukri_applications_log.json  # Auto-generated: all application records
└── debug_screenshots/            # Auto-generated: error screenshots
```

---

## 🚀 How to Run — Step by Step

### ✅ Prerequisites

Before running the bot, make sure you have the following installed on your system:

- **Python 3.8 or above**
  Check by running:
  ```bash
  python3 --version
  ```
  If not installed, download from [python.org](https://www.python.org/downloads/)

- **pip** (comes with Python)
  Check by running:
  ```bash
  pip --version
  ```

---

### Step 1 — Clone or Download the Project

**Option A — Clone via Git:**
```bash
git clone https://github.com/YOUR_USERNAME/naukri-auto-apply-bot.git
cd naukri-auto-apply-bot
```

**Option B — Download ZIP:**
- Click the green **Code** button on GitHub → **Download ZIP**
- Extract the folder and open Terminal inside it

---

### Step 2 — Install Python Dependencies

```bash
pip install -r requirements.txt
```

This installs:
- `playwright` — browser automation
- `python-dotenv` — loads your `.env` credentials securely

---

### Step 3 — Install the Chromium Browser

Playwright needs its own browser to run. Install it with:

```bash
playwright install chromium
```

> ⚠️ This is a one-time step. It downloads a ~150MB Chromium binary — make sure you have internet and space.

---

### Step 4 — Set Up Your Credentials

The bot reads all personal details from a `.env` file. This file is **never pushed to GitHub** (it's in `.gitignore`).

**Create your `.env` file:**
```bash
cp .env.example .env
```

**Open the `.env` file** in any text editor and fill in your details:

```env
# Your Naukri login
NAUKRI_EMAIL=your_email@gmail.com
NAUKRI_PASSWORD=your_naukri_password

# Your profile details (used to answer recruiter chatbot questions)
NOTICE_PERIOD=30          # How many days notice period (e.g. 30, 60, 90)
CURRENT_CTC=8             # Your current CTC in LPA (e.g. 8 means 8 LPA)
EXPECTED_CTC=12           # Your expected CTC in LPA
TOTAL_EXPERIENCE=5        # Total years of experience (e.g. 5)
```

> 💡 **Tip:** Use the exact same email and password you use to log into Naukri.com manually.

---

### Step 5 — (Optional) Update Your Naukri Profile First

Before running the bot, make sure your Naukri profile is **100% complete** and your **resume is up to date**. The bot applies using your existing Naukri profile — an incomplete profile means fewer callbacks.

**Recommended Naukri profile settings:**
- Upload an updated resume
- Set your preferred job roles and locations
- Set your expected salary range
- Enable "Open to opportunities" status

> The bot applies to your **Recommended Jobs** section on Naukri, which is personalised based on your profile.

---

### Step 6 — Run the Bot

```bash
python3 naukri_bot.py
```

The bot will:
1. Open a Chrome browser window (you will see it)
2. Log in to Naukri automatically
3. Navigate to your Recommended Jobs page
4. Start selecting and applying to jobs in batches of 5
5. Answer any recruiter chatbot questions automatically
6. Log every application to `naukri_applications_log.json`
7. Save failed/problematic jobs to `skip_list.json`
8. Keep running until you press `Ctrl+C`

---

### Step 7 — Check Your Stats

After running, see how many jobs were applied to:

```bash
python3 stats.py
```

**Sample output:**
```
==================================================
   Naukri Bot — Application Stats
==================================================
   Today (2026-03-19)  : 107 applications
   All time total      : 1,240 applications
   Skip list size      : 143 jobs
==================================================

   Daily breakdown:
   2026-03-19  →  107 applied
   2026-03-18  →  98 applied
   2026-03-17  →  112 applied
```

---

### Step 8 — Stop the Bot

Press `Ctrl+C` in the terminal at any time to stop. The bot will:
- Print a final summary
- Save the skip list
- Close the browser cleanly

---

## ⚙️ Configuration Options

You can tweak these settings inside `naukri_bot.py` at the top of the file:

| Variable | Default | Description |
|---|---|---|
| `BATCH_SIZE` | `5` | How many jobs to select per batch |
| `HEADLESS` | `False` | Set `True` to run browser invisibly in background |
| `RECOMMENDED_URL` | Naukri recommended jobs page | The page the bot applies from |

---

## 🤖 How the Chatbot Handler Works

When a recruiter has set up screening chatbot questions, the bot auto-detects and answers them:

| Question keyword | Answer used |
|---|---|
| notice / days / joining | `NOTICE_PERIOD` from `.env` |
| current ctc / current salary | `CURRENT_CTC` from `.env` |
| expected / expectation | `EXPECTED_CTC` from `.env` |
| yes/no questions | Automatically clicks **Yes** |
| anything else | `TOTAL_EXPERIENCE` from `.env` |

---

## ❓ Troubleshooting

**Bot not logging in?**
- Double check `NAUKRI_EMAIL` and `NAUKRI_PASSWORD` in your `.env` file
- Try logging in manually on Naukri first to confirm credentials work
- Check if Naukri is asking for OTP — complete it once manually, then rerun

**`playwright install` fails?**
```bash
pip install playwright --upgrade
playwright install chromium
```

**`ModuleNotFoundError: No module named 'dotenv'`?**
```bash
pip install python-dotenv
```

**Bot keeps skipping all jobs?**
- Delete `skip_list.json` to reset the skip list and start fresh
- This is normal if you've already applied to most recommended jobs

**Browser opens but nothing happens?**
- Your Naukri recommended jobs page might be empty
- Log in manually and check if you have recommended jobs showing

---

## 🔒 Security Notes

- Your `.env` file is **never uploaded to GitHub** — it's in `.gitignore`
- `skip_list.json` and `naukri_applications_log.json` are also excluded from Git
- Never share your `.env` file with anyone
- Never hardcode your email/password directly in `naukri_bot.py`

---

## ⚠️ Disclaimer

This tool is built for personal use to streamline a job search. Use responsibly and in accordance with Naukri's terms of service. The author is not responsible for any account restrictions resulting from automated activity.

---

## 👤 Author

**Ajaykumar Gupta** — Software Engineer & DevOps Professional, Mumbai

- 🔗 LinkedIn: [linkedin.com/in/ajaykumar-gupta-62a640286](https://linkedin.com/in/ajaykumar-gupta-62a640286)
- 💼 Portfolio: [crio.do/learn/portfolio/ag5224741](https://www.crio.do/learn/portfolio/ag5224741)
- 💻 GitHub: [github.com/YOUR_USERNAME](https://github.com/Ajay-kumar-gupta-dev/naukri-auto-apply-bot)

---

## ⭐ If this helped you

Give it a star on GitHub — it helps others find it too!
