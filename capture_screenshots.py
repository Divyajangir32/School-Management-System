"""
Green Valley Public School - School Management System
Screenshot Capture Script using Playwright
"""

import os
import sys
import time
from pathlib import Path

# Force UTF-8 output on Windows
if sys.stdout.encoding != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

try:
    from playwright.sync_api import sync_playwright
except ImportError:
    print("ERROR: Playwright not installed. Run: py -m pip install playwright && py -m playwright install chromium")
    exit(1)

BASE_URL = "http://localhost:8085"
SCREENSHOTS_DIR = Path(r"C:\Users\harry\Desktop\divya 2\screenshots")
ROLES_DIR = SCREENSHOTS_DIR / "roles"

# Ensure directories exist
SCREENSHOTS_DIR.mkdir(exist_ok=True)
ROLES_DIR.mkdir(exist_ok=True)

def save_screenshot(page, filename, directory=SCREENSHOTS_DIR):
    """Save screenshot to file."""
    path = directory / filename
    page.screenshot(path=str(path), full_page=True)
    print(f"  [OK] {path.name} ({path.stat().st_size//1024} KB)")
    return path

def login(page, email, password):
    """Login to the application."""
    page.goto(f"{BASE_URL}/html/login.html")
    page.wait_for_load_state("networkidle", timeout=10000)
    time.sleep(1)
    
    # Fill credentials
    email_field = page.locator("input[type='email'], input[name='email'], #email")
    if email_field.count() > 0:
        email_field.first.fill(email)
    
    pwd_field = page.locator("input[type='password'], input[name='password'], #password")
    if pwd_field.count() > 0:
        pwd_field.first.fill(password)
    
    # Submit form
    submit = page.locator("button[type='submit'], input[type='submit'], .btn-login, #loginBtn")
    if submit.count() > 0:
        submit.first.click()
    else:
        page.keyboard.press("Enter")
    
    time.sleep(3)

def navigate_and_screenshot(page, path, filename, directory=SCREENSHOTS_DIR, wait_time=2):
    """Navigate to a page and take screenshot."""
    try:
        page.goto(f"{BASE_URL}/html/{path}", timeout=15000)
        page.wait_for_load_state("networkidle", timeout=10000)
        time.sleep(wait_time)
        save_screenshot(page, filename, directory)
        return True
    except Exception as e:
        print(f"  [FAIL] {path}: {e}")
        return False


def main():
    print("=" * 60)
    print("School Management System - Screenshot Capture")
    print("=" * 60)
    
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, args=["--no-sandbox"])
        context = browser.new_context(
            viewport={"width": 1920, "height": 1080},
            device_scale_factor=1
        )
        page = context.new_page()
        
        # ---- SECTION 1: Public Pages ----
        print("\n[1/5] Capturing public pages...")
        
        page.goto(f"{BASE_URL}/html/index.html")
        page.wait_for_load_state("networkidle", timeout=10000)
        time.sleep(2)
        save_screenshot(page, "01_landing_page.png")
        
        page.goto(f"{BASE_URL}/html/login.html")
        page.wait_for_load_state("networkidle", timeout=10000)
        time.sleep(1)
        save_screenshot(page, "02_login_page.png")
        
        # Fill login form for visual
        try:
            page.locator("input[type='email'], #email").first.fill("admin@greenvalleyschool.example")
            page.locator("input[type='password'], #password").first.fill("Admin@123")
            save_screenshot(page, "03_login_filled.png")
        except:
            pass
        
        # ---- SECTION 2: Admin Login + Core Modules ----
        print("\n[2/5] Capturing admin dashboard and core modules...")
        
        login(page, "admin@greenvalleyschool.example", "Admin@123")
        
        # Check current URL after login
        current_url = page.url
        print(f"  After login, URL: {current_url}")
        save_screenshot(page, "04_admin_dashboard.png")
        
        # Core module pages
        modules = [
            ("students.html", "05_students.png"),
            ("teachers.html", "06_teachers.png"),
            ("classes.html", "07_classes.png"),
            ("subjects.html", "08_subjects.png"),
            ("attendance.html", "09_attendance.png"),
            ("exams.html", "10_exams.png"),
            ("marks.html", "11_marks.png"),
            ("results.html", "12_results.png"),
            ("assignments.html", "13_assignments.png"),
            ("announcements.html", "14_announcements.png"),
            ("fees.html", "15_fees.png"),
            ("timetable.html", "16_timetable.png"),
            ("reports.html", "17_reports.png"),
            ("library.html", "18_library.png"),
            ("users.html", "19_user_management.png"),
            ("settings.html", "20_settings.png"),
            ("profile.html", "21_profile.png"),
            ("audit-logs.html", "22_audit_logs.png"),
        ]
        
        for html_file, screenshot_name in modules:
            navigate_and_screenshot(page, html_file, screenshot_name)
        
        # ---- SECTION 3: 403 Access Denied Page ----
        print("\n[3/5] Capturing access denied page...")
        navigate_and_screenshot(page, "403.html", "23_access_denied.png")
        
        # ---- SECTION 4: Role-specific views ----
        print("\n[4/5] Capturing role-specific dashboard views...")
        
        role_accounts = [
            ("superadmin@greenvalleyschool.example", "Super@123",        "super_admin"),
            ("admin@greenvalleyschool.example",      "Admin@123",        "admin"),
            ("principal@greenvalleyschool.example",  "Principal@123",    "principal"),
            ("harpreet.singh@greenvalleyschool.example", "Teacher@123",  "teacher"),
            ("arshdeep.singh@greenvalleyschool.example", "Student@123",  "student"),
            ("gurmeet.singh@greenvalleyschool.example",  "Parent@123",   "parent"),
            ("accountant@greenvalleyschool.example", "Accountant@123",   "accountant"),
            ("librarian@greenvalleyschool.example",  "Librarian@123",    "librarian"),
            ("receptionist@greenvalleyschool.example","Receptionist@123","receptionist"),
        ]
        
        # First logout as admin
        try:
            logout = page.locator(".logout-btn, #logoutBtn, [data-action='logout'], a[href*='logout']")
            if logout.count() > 0:
                logout.first.click()
                time.sleep(2)
        except:
            pass
        
        for email, password, role_name in role_accounts:
            print(f"\n  Role: {role_name}")
            try:
                login(page, email, password)
                current_url = page.url
                print(f"    URL after login: {current_url}")
                save_screenshot(page, f"{role_name}_dashboard.png", ROLES_DIR)
                
                # Try to logout for next role
                try:
                    logout = page.locator(".logout-btn, #logoutBtn, [data-action='logout'], a[href*='logout'], button:has-text('Logout'), button:has-text('Sign Out')")
                    if logout.count() > 0:
                        logout.first.click()
                        time.sleep(2)
                    else:
                        # Clear localStorage/sessionStorage to simulate logout
                        page.evaluate("localStorage.clear(); sessionStorage.clear();")
                        page.goto(f"{BASE_URL}/html/login.html")
                        time.sleep(1)
                except:
                    page.evaluate("localStorage.clear(); sessionStorage.clear();")
                    page.goto(f"{BASE_URL}/html/login.html")
                    time.sleep(1)
            except Exception as e:
                print(f"    [FAIL] {role_name}: {e}")
                page.evaluate("localStorage.clear(); sessionStorage.clear();")
                page.goto(f"{BASE_URL}/html/login.html")
                time.sleep(1)
        
        # ---- SECTION 5: RBAC - Access Denied Scenario ----
        print("\n[5/5] Capturing RBAC access denied scenario...")
        try:
            # Login as student and try to access admin-only users page
            login(page, "arshdeep.singh@greenvalleyschool.example", "Student@123")
            page.goto(f"{BASE_URL}/html/users.html")
            time.sleep(2)
            save_screenshot(page, "rbac_access_denied_student.png", ROLES_DIR)
        except Exception as e:
            print(f"  [FAIL] RBAC scenario: {e}")
        
        browser.close()
    
    print("\n" + "=" * 60)
    print("Screenshot capture complete!")
    print(f"Core screenshots: {SCREENSHOTS_DIR}")
    print(f"Role screenshots: {ROLES_DIR}")
    print("\nFiles saved:")
    
    all_files = list(SCREENSHOTS_DIR.glob("*.png")) + list(ROLES_DIR.glob("*.png"))
    for f in sorted(all_files):
        size_kb = f.stat().st_size / 1024
        print(f"  {f.name} ({size_kb:.0f} KB)")
    
    print(f"\nTotal: {len(all_files)} screenshots")


if __name__ == "__main__":
    main()
