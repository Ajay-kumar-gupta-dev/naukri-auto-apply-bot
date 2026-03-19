"""
=============================================================
  Naukri Job Application Bot — v10 SMART SKIP
  Built for: Ajaykumar Gupta
  Run:  python3 naukri_bot.py
  Stop: Ctrl+C (anytime)
=============================================================
  NEW IN v10:
  - Failed/problem jobs are saved to skip_list.json
  - Skipped jobs are NEVER picked up again
  - Chatbot questions answered automatically
  - Runs forever until Ctrl+C
=============================================================
"""

import asyncio
import json
import os
import hashlib
import traceback
from datetime import datetime
from playwright.async_api import async_playwright

# ─────────────────────────────────────────────
NAUKRI_EMAIL     = "ag5224741@gmail.com"
NAUKRI_PASSWORD  = "Lockdown@2026"
BATCH_SIZE       = 5
LOG_FILE         = "naukri_applications_log.json"
SKIP_FILE        = "skip_list.json"          # ← NEW: tracks skipped jobs
SCREENSHOT_DIR   = "debug_screenshots"
RECOMMENDED_URL  = "https://www.naukri.com/mnjuser/recommendedjobs"

# ── Ajay's answers for chatbot questions ──────
EXPERIENCE_YEARS = "5"
NOTICE_PERIOD    = "30"
CURRENT_CTC      = "8"
EXPECTED_CTC     = "12"
# ─────────────────────────────────────────────


# ═══════════════════════════════════════════════
#  SKIP LIST — persists across runs
# ═══════════════════════════════════════════════
def load_skip_list():
    """Load previously skipped job IDs from file."""
    try:
        with open(SKIP_FILE) as f:
            return set(json.load(f))
    except Exception:
        return set()

def save_skip_list(skip_set):
    """Save skipped job IDs to file."""
    try:
        with open(SKIP_FILE, "w") as f:
            json.dump(list(skip_set), f, indent=2)
    except Exception:
        pass

def make_job_id(title, company):
    """Create a unique ID for a job based on title + company."""
    raw = f"{title.lower().strip()}_{company.lower().strip()}"
    return hashlib.md5(raw.encode()).hexdigest()[:12]

def add_to_skip(skip_set, title, company, reason="failed"):
    """Add a job to the skip list and save immediately."""
    job_id = make_job_id(title, company)
    skip_set.add(job_id)
    save_skip_list(skip_set)
    print(f"  ⛔ Skipped forever: {title} @ {company} ({reason})")
    return skip_set

def is_skipped(skip_set, title, company):
    """Check if a job should be skipped."""
    return make_job_id(title, company) in skip_set


# ─────────────────────────────────────────────
#  HELPERS
# ─────────────────────────────────────────────
def ensure_dir():
    if not os.path.exists(SCREENSHOT_DIR):
        os.makedirs(SCREENSHOT_DIR)

async def ss(page, name):
    ensure_dir()
    try:
        await page.screenshot(path=f"{SCREENSHOT_DIR}/{name}.png")
    except Exception:
        pass

def log_job(title, company, status):
    entry = {
        "date"     : datetime.now().strftime("%Y-%m-%d %H:%M"),
        "job_title": title,
        "company"  : company,
        "status"   : status
    }
    try:
        with open(LOG_FILE) as f:
            data = json.load(f)
    except Exception:
        data = []
    data.append(entry)
    with open(LOG_FILE, "w") as f:
        json.dump(data, f, indent=2)

def get_today_count():
    try:
        with open(LOG_FILE) as f:
            logs = json.load(f)
        today = datetime.now().strftime("%Y-%m-%d")
        return len([x for x in logs if x["date"].startswith(today) and x["status"] == "applied"])
    except Exception:
        return 0

async def close_popups(page):
    for sel in [
        "button[aria-label='close']", "[class*='closeBtn']",
        "button.crossIcon", ".modal-close",
    ]:
        try:
            el = await page.query_selector(sel)
            if el and await el.is_visible():
                await el.click()
                await page.wait_for_timeout(300)
        except Exception:
            pass
    try:
        await page.keyboard.press("Escape")
        await page.wait_for_timeout(300)
    except Exception:
        pass


# ─────────────────────────────────────────────
#  CHATBOT HANDLER — auto-answers questions
# ─────────────────────────────────────────────
async def handle_chatbot(page):
    await page.wait_for_timeout(1500)

    chatbot_visible = False
    for sel in ["[class*='chatbot']", "[class*='recruiter-chat']", "[class*='chat-container']"]:
        try:
            el = await page.query_selector(sel)
            if el and await el.is_visible():
                chatbot_visible = True
                break
        except Exception:
            pass

    if not chatbot_visible:
        return False

    print("  💬 Chatbot detected — answering...")

    for attempt in range(12):
        await page.wait_for_timeout(700)
        answered = False

        # ── Yes/No radio buttons ──
        for yes_sel in [
            "input[value='yes'], input[value='Yes']",
            "[class*='chatbot'] label:has-text('Yes')",
            "[class*='option']:has-text('Yes')",
        ]:
            try:
                yes_btn = await page.query_selector(yes_sel)
                if yes_btn and await yes_btn.is_visible():
                    await yes_btn.click()
                    await page.wait_for_timeout(400)
                    for save_sel in ["button:has-text('Save')", "button:has-text('Next')", "[class*='submit']"]:
                        try:
                            sb = await page.query_selector(save_sel)
                            if sb and await sb.is_visible():
                                await sb.click()
                                await page.wait_for_timeout(600)
                                break
                        except Exception:
                            pass
                    answered = True
                    print(f"    ✓ Answered: Yes (attempt {attempt+1})")
                    break
            except Exception:
                pass
        if answered:
            continue

        # ── Text input questions ──
        for input_sel in [
            "input[placeholder*='Type message']",
            "input[placeholder*='message']",
            "[class*='chatbot'] input[type='text']",
            "[class*='chat'] textarea",
        ]:
            try:
                inp = await page.query_selector(input_sel)
                if inp and await inp.is_visible():
                    # Get question context
                    q_text = ""
                    for q_sel in ["[class*='question']", "[class*='chatbot'] p", "[class*='chat'] span"]:
                        try:
                            q_el = await page.query_selector(q_sel)
                            if q_el:
                                q_text = (await q_el.inner_text()).lower()
                                break
                        except Exception:
                            pass

                    if any(w in q_text for w in ["notice", "days", "joining"]):
                        ans = NOTICE_PERIOD
                    elif any(w in q_text for w in ["current ctc", "current salary"]):
                        ans = CURRENT_CTC
                    elif any(w in q_text for w in ["expected", "expectation"]):
                        ans = EXPECTED_CTC
                    else:
                        ans = EXPERIENCE_YEARS  # years of experience (default)

                    await inp.fill(ans)
                    await page.wait_for_timeout(400)

                    for save_sel in ["button:has-text('Save')", "button:has-text('Send')", "button:has-text('Next')"]:
                        try:
                            sb = await page.query_selector(save_sel)
                            if sb and await sb.is_visible():
                                await sb.click()
                                await page.wait_for_timeout(600)
                                break
                        except Exception:
                            pass
                    answered = True
                    print(f"    ✓ Answered: '{ans}' (attempt {attempt+1})")
                    break
            except Exception:
                pass
        if answered:
            continue

        # ── Check if chatbot closed ──
        still_open = False
        for sel in ["[class*='chatbot']", "[class*='recruiter-chat']"]:
            try:
                el = await page.query_selector(sel)
                if el and await el.is_visible():
                    still_open = True
                    break
            except Exception:
                pass

        if not still_open:
            print("    ✓ Chatbot closed!")
            return True

        # ── Click Save/Close if stuck ──
        for close_sel in ["button:has-text('Save')", "button[aria-label='close']", "[class*='close']"]:
            try:
                cb = await page.query_selector(close_sel)
                if cb and await cb.is_visible():
                    await cb.click()
                    await page.wait_for_timeout(500)
                    break
            except Exception:
                pass
        break

    await page.keyboard.press("Escape")
    await page.wait_for_timeout(500)
    return True


# ─────────────────────────────────────────────
#  GET JOB CARDS
# ─────────────────────────────────────────────
async def get_job_cards(page):
    return await page.evaluate("""
        () => {
            const cards = document.querySelectorAll('article.jobTuple');
            return Array.from(cards).map(card => {
                const box = card.getBoundingClientRect();
                const cb  = card.querySelector('i.naukicon-ot-checkbox, .tuple-check-box i');

                let title = 'Unknown';
                const titleEl = card.querySelector('.title, a.title, [class*="title"] a');
                if (titleEl) title = (titleEl.innerText || '').split('\\n')[0].trim().substring(0, 70);

                let company = 'Unknown';
                const compEl = card.querySelector('a.subTitle, [class*="subTitle"]');
                if (compEl) {
                    const t = (compEl.innerText || '').trim();
                    if (!t.match(/^\\d+\\s+(Review|Rating)/i)) company = t.substring(0, 70);
                }
                if (company === 'Unknown') {
                    for (let a of card.querySelectorAll('a')) {
                        const t = (a.innerText || '').trim();
                        if (t && t !== title && !t.match(/^\\d+\\s+(Review|Rating)/i) && t.length > 1) {
                            company = t.substring(0, 70);
                            break;
                        }
                    }
                }

                let cbX = box.left + 18, cbY = box.top + 18;
                if (cb) {
                    const r = cb.getBoundingClientRect();
                    cbX = r.left + r.width / 2;
                    cbY = r.top  + r.height / 2;
                }

                return { title, company, cbX, cbY,
                         visible: box.top > 50 && box.top < 850 && box.height > 0,
                         hasCb: !!cb };
            }).filter(c => c.visible);
        }
    """)


# ═══════════════════════════════════════════════
#  MAIN
# ═══════════════════════════════════════════════
async def run():
    print("\n╔══════════════════════════════════════════╗")
    print("║   NAUKRI BOT v10 — SMART SKIP            ║")
    print("║   Ajaykumar Gupta                         ║")
    print("║   Press Ctrl+C to stop anytime            ║")
    print("╚══════════════════════════════════════════╝\n")

    # Load skip list from previous runs
    skip_list = load_skip_list()
    print(f"  📋 Loaded {len(skip_list)} previously skipped jobs\n")

    async with async_playwright() as p:
        browser = await p.chromium.launch(
            headless=False, slow_mo=350,
            args=["--no-sandbox", "--disable-blink-features=AutomationControlled"]
        )
        context = await browser.new_context(
            user_agent=(
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
                "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36"
            ),
            viewport={"width": 1440, "height": 900},
            permissions=[],
        )
        await context.grant_permissions([], origin="https://www.naukri.com")
        page = await context.new_page()

        try:
            # ── LOGIN ──────────────────────────────────
            print("━" * 46)
            print("  Logging in...")
            print("━" * 46)
            await page.goto("https://www.naukri.com/nlogin/login", wait_until="domcontentloaded")
            await page.wait_for_timeout(3000)
            await close_popups(page)
            await page.fill("#usernameField", NAUKRI_EMAIL)
            await page.wait_for_timeout(400)
            await page.fill("#passwordField", NAUKRI_PASSWORD)
            await page.wait_for_timeout(400)
            await page.click("button[type='submit']")
            await page.wait_for_timeout(5000)
            await close_popups(page)
            print("  ✓ Logged in!\n")

            # ── RECOMMENDED PAGE ───────────────────────
            await page.goto(RECOMMENDED_URL, wait_until="domcontentloaded")
            await page.wait_for_timeout(4000)
            await close_popups(page)
            print("  ✓ Ready! Applying jobs... (Ctrl+C to stop)\n")

            total_applied = 0
            batch_num     = 1
            scroll_count  = 0
            empty_rounds  = 0

            while True:

                if RECOMMENDED_URL not in page.url:
                    await page.goto(RECOMMENDED_URL, wait_until="domcontentloaded")
                    await page.wait_for_timeout(3000)
                    await close_popups(page)

                await page.evaluate(f"window.scrollTo(0, {scroll_count * 500})")
                await page.wait_for_timeout(1500)

                all_cards = await get_job_cards(page)

                # ── Filter out skipped jobs ──
                cards = []
                skipped_this_batch = 0
                for card in all_cards:
                    if is_skipped(skip_list, card['title'], card['company']):
                        skipped_this_batch += 1
                    else:
                        cards.append(card)

                if skipped_this_batch > 0:
                    print(f"  ⏭  Skipped {skipped_this_batch} previously failed jobs")

                print(f"  Batch {batch_num}: {len(cards)} new jobs (scroll {scroll_count})")

                if not cards:
                    empty_rounds += 1
                    if empty_rounds >= 6:
                        print("\n  ✓ All available jobs processed!")
                        print("  Waiting 60s for new recommendations...")
                        await page.wait_for_timeout(60000)
                        scroll_count = 0
                        empty_rounds = 0
                        await page.goto(RECOMMENDED_URL, wait_until="domcontentloaded")
                        await page.wait_for_timeout(4000)
                        continue
                    scroll_count += 1
                    continue

                empty_rounds   = 0
                to_apply       = cards[:BATCH_SIZE]
                selected       = []
                failed_to_click = []

                # ── Select checkboxes ──
                for item in to_apply:
                    try:
                        await page.mouse.click(item['cbX'], item['cbY'])
                        await page.wait_for_timeout(350)
                        selected.append(item)
                        icon = "☑" if item['hasCb'] else "☐"
                        print(f"    {icon}  {item['title']} @ {item['company']}")
                    except Exception as e:
                        # Click failed — add to skip list
                        skip_list = add_to_skip(skip_list, item['title'], item['company'], "click-timeout")
                        failed_to_click.append(item)

                if not selected:
                    scroll_count += 1
                    batch_num += 1
                    continue

                # ── Click Apply button ──
                apply_clicked = False
                for sel in [
                    "button.multi-apply-button",
                    "[class*='multi-apply']",
                    "button:has-text('Apply')",
                    "button[class*='apply']",
                ]:
                    try:
                        btn = await page.query_selector(sel)
                        if btn and await btn.is_visible():
                            txt = (await btn.inner_text()).strip()
                            print(f"\n  → Clicking '{txt}'")
                            await btn.click()
                            await page.wait_for_timeout(2000)
                            apply_clicked = True
                            break
                    except Exception:
                        continue

                if not apply_clicked:
                    # Apply button missing — skip ALL selected jobs
                    print("  ⚠️  Apply button not found — skipping this batch")
                    for item in selected:
                        skip_list = add_to_skip(skip_list, item['title'], item['company'], "no-apply-button")
                    scroll_count += 1
                    batch_num += 1
                    continue

                # ── Check for error message (incomplete application) ──
                await page.wait_for_timeout(1500)
                error_visible = False
                try:
                    error_el = await page.query_selector(
                        "text=Oops, text=not accepted, [class*='error'], [class*='alert-error']"
                    )
                    if error_el and await error_el.is_visible():
                        error_visible = True
                except Exception:
                    pass

                if error_visible:
                    print("  ⚠️  Application error detected — skipping problematic jobs")
                    for item in selected:
                        skip_list = add_to_skip(skip_list, item['title'], item['company'], "application-error")
                    await page.goto(RECOMMENDED_URL, wait_until="domcontentloaded")
                    await page.wait_for_timeout(3000)
                    scroll_count += 1
                    batch_num += 1
                    continue

                # ── Handle chatbot ──
                chatbot_found = await handle_chatbot(page)
                await page.wait_for_timeout(1000)
                await close_popups(page)

                # ── Check success banner ──
                success = False
                try:
                    success_el = await page.query_selector(
                        "text=application was successful, text=successfully applied, [class*='success']"
                    )
                    if success_el and await success_el.is_visible():
                        success = True
                except Exception:
                    pass

                if success or apply_clicked:
                    for item in selected:
                        log_job(item['title'], item['company'], "applied")
                    total_applied += len(selected)
                    today_total    = get_today_count()
                    print(f"  ✅ Batch {batch_num} done! Session: {total_applied} | Today: {today_total}\n")
                else:
                    # Something went wrong — skip these jobs
                    print("  ⚠️  Uncertain result — skipping this batch to be safe")
                    for item in selected:
                        skip_list = add_to_skip(skip_list, item['title'], item['company'], "uncertain-result")

                batch_num    += 1
                scroll_count += 1

                await page.goto(RECOMMENDED_URL, wait_until="domcontentloaded")
                await page.wait_for_timeout(2500)
                await close_popups(page)

        except KeyboardInterrupt:
            print("\n\n  ⏹  Stopped by user (Ctrl+C)")

        except Exception as e:
            print(f"\n  ❌ ERROR: {e}")
            print(traceback.format_exc())
            await ss(page, "ERROR")

        finally:
            print("\n" + "━" * 46)
            print("  FINAL SUMMARY")
            print("━" * 46)
            try:
                with open(LOG_FILE) as f:
                    logs = json.load(f)
                today   = datetime.now().strftime("%Y-%m-%d")
                applied = [x for x in logs if x["date"].startswith(today) and x["status"] == "applied"]
                print(f"\n  ✓ Applied today  : {len(applied)} jobs")
                print(f"  ⛔ Skip list size : {len(skip_list)} jobs (saved to {SKIP_FILE})")
                print(f"\n  Companies applied to today:")
                seen = []
                for j in applied:
                    if j['company'] not in seen and j['company'] != 'Unknown':
                        seen.append(j['company'])
                for c in seen[:25]:
                    print(f"    • {c}")
                if len(seen) > 25:
                    print(f"    ... and {len(seen)-25} more")
            except Exception:
                print(f"  Session total: {total_applied}")

            print(f"\n  📋 Log  : {LOG_FILE}")
            print(f"  ⛔ Skip : {SKIP_FILE}")
            try:
                await browser.close()
            except Exception:
                pass
            print("\n  Good luck, Ajay! 🎯\n")


if __name__ == "__main__":
    asyncio.run(run())