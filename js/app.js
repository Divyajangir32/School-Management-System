/**
 * Green Valley Public School, Jalandhar
 * Core Application Shell, RBAC Navigation & URL Route Guard
 */

const App = {
  currentUser: null,

  // Comprehensive role-specific navigation menus
  getNavigationForRole(role) {
    const menus = {
      'Super Admin': [
        { label: 'Dashboard', href: 'dashboard.html', icon: 'dashboard' },
        { section: 'Academic Management' },
        { label: 'Students', href: 'students.html', icon: 'students' },
        { label: 'Teachers', href: 'teachers.html', icon: 'teachers' },
        { label: 'Classes & Sections', href: 'classes.html', icon: 'classes' },
        { label: 'Subjects Catalog', href: 'subjects.html', icon: 'subjects' },
        { label: 'Attendance', href: 'attendance.html', icon: 'attendance' },
        { label: 'Timetable', href: 'timetable.html', icon: 'timetable' },
        { section: 'Exams & Performance' },
        { label: 'Exams Schedule', href: 'exams.html', icon: 'exams' },
        { label: 'Enter Marks', href: 'marks.html', icon: 'marks' },
        { label: 'Results & Report Cards', href: 'results.html', icon: 'results' },
        { label: 'Assignments', href: 'assignments.html', icon: 'assignments' },
        { section: 'School Operations & Finance' },
        { label: 'Fee Management', href: 'fees.html', icon: 'fees' },
        { label: 'Library Management', href: 'library.html', icon: 'library' },
        { label: 'Notices & Circulars', href: 'announcements.html', icon: 'announcements' },
        { label: 'Reports & Export', href: 'reports.html', icon: 'reports' },
        { section: 'System & Security' },
        { label: 'User Accounts', href: 'users.html', icon: 'users' },
        { label: 'Security Audit Logs', href: 'audit-logs.html', icon: 'audit' },
        { label: 'System Settings', href: 'settings.html', icon: 'settings' },
        { label: 'My Profile', href: 'profile.html', icon: 'profile' }
      ],

      'Admin': [
        { label: 'Dashboard', href: 'dashboard.html', icon: 'dashboard' },
        { section: 'Academic Management' },
        { label: 'Students', href: 'students.html', icon: 'students' },
        { label: 'Teachers', href: 'teachers.html', icon: 'teachers' },
        { label: 'Classes & Sections', href: 'classes.html', icon: 'classes' },
        { label: 'Subjects Catalog', href: 'subjects.html', icon: 'subjects' },
        { label: 'Attendance', href: 'attendance.html', icon: 'attendance' },
        { label: 'Timetable', href: 'timetable.html', icon: 'timetable' },
        { section: 'Exams & Performance' },
        { label: 'Exams Schedule', href: 'exams.html', icon: 'exams' },
        { label: 'Enter Marks', href: 'marks.html', icon: 'marks' },
        { label: 'Results & Report Cards', href: 'results.html', icon: 'results' },
        { label: 'Assignments', href: 'assignments.html', icon: 'assignments' },
        { section: 'School Operations' },
        { label: 'Fee Management', href: 'fees.html', icon: 'fees' },
        { label: 'Library Management', href: 'library.html', icon: 'library' },
        { label: 'Notices & Circulars', href: 'announcements.html', icon: 'announcements' },
        { label: 'Reports & Export', href: 'reports.html', icon: 'reports' },
        { label: 'User Accounts', href: 'users.html', icon: 'users' },
        { label: 'School Settings', href: 'settings.html', icon: 'settings' },
        { label: 'My Profile', href: 'profile.html', icon: 'profile' }
      ],

      'Principal': [
        { label: 'Dashboard', href: 'dashboard.html', icon: 'dashboard' },
        { section: 'Academic Supervision' },
        { label: 'Students Directory', href: 'students.html', icon: 'students' },
        { label: 'Faculty Directory', href: 'teachers.html', icon: 'teachers' },
        { label: 'Classes & Sections', href: 'classes.html', icon: 'classes' },
        { label: 'Curriculum Subjects', href: 'subjects.html', icon: 'subjects' },
        { label: 'School Attendance', href: 'attendance.html', icon: 'attendance' },
        { label: 'Weekly Timetable', href: 'timetable.html', icon: 'timetable' },
        { section: 'Evaluations & Notices' },
        { label: 'Exams Schedule', href: 'exams.html', icon: 'exams' },
        { label: 'Results & Report Cards', href: 'results.html', icon: 'results' },
        { label: 'Fee Summaries', href: 'fees.html', icon: 'fees' },
        { label: 'School Circulars', href: 'announcements.html', icon: 'announcements' },
        { label: 'School Reports', href: 'reports.html', icon: 'reports' },
        { label: 'Security Audit Logs', href: 'audit-logs.html', icon: 'audit' },
        { label: 'My Profile', href: 'profile.html', icon: 'profile' }
      ],

      'Teacher': [
        { label: 'Dashboard', href: 'dashboard.html', icon: 'dashboard' },
        { section: 'My Classroom' },
        { label: 'My Students', href: 'students.html', icon: 'students' },
        { label: 'Class Attendance', href: 'attendance.html', icon: 'attendance' },
        { label: 'Enter Exam Marks', href: 'marks.html', icon: 'marks' },
        { label: 'Course Assignments', href: 'assignments.html', icon: 'assignments' },
        { label: 'My Timetable', href: 'timetable.html', icon: 'timetable' },
        { label: 'Exam Date Sheets', href: 'exams.html', icon: 'exams' },
        { label: 'Student Results', href: 'results.html', icon: 'results' },
        { label: 'School Notices', href: 'announcements.html', icon: 'announcements' },
        { label: 'My Profile', href: 'profile.html', icon: 'profile' }
      ],

      'Student': [
        { label: 'Dashboard', href: 'dashboard.html', icon: 'dashboard' },
        { section: 'My Academics' },
        { label: 'My Attendance', href: 'attendance.html', icon: 'attendance' },
        { label: 'My Results & Card', href: 'results.html', icon: 'results' },
        { label: 'My Assignments', href: 'assignments.html', icon: 'assignments' },
        { label: 'Exam Schedule', href: 'exams.html', icon: 'exams' },
        { label: 'Class Timetable', href: 'timetable.html', icon: 'timetable' },
        { label: 'Fee Status', href: 'fees.html', icon: 'fees' },
        { label: 'Library Catalog', href: 'library.html', icon: 'library' },
        { label: 'School Circulars', href: 'announcements.html', icon: 'announcements' },
        { label: 'My Profile', href: 'profile.html', icon: 'profile' }
      ],

      'Parent': [
        { label: 'Dashboard', href: 'dashboard.html', icon: 'dashboard' },
        { section: 'Ward Information' },
        { label: 'Child Profile', href: 'students.html', icon: 'students' },
        { label: 'Attendance Record', href: 'attendance.html', icon: 'attendance' },
        { label: 'Report Cards', href: 'results.html', icon: 'results' },
        { label: 'Homework & Tasks', href: 'assignments.html', icon: 'assignments' },
        { label: 'Weekly Timetable', href: 'timetable.html', icon: 'timetable' },
        { label: 'Fees & Receipts', href: 'fees.html', icon: 'fees' },
        { label: 'School Circulars', href: 'announcements.html', icon: 'announcements' },
        { label: 'My Profile', href: 'profile.html', icon: 'profile' }
      ],

      'Accountant': [
        { label: 'Dashboard', href: 'dashboard.html', icon: 'dashboard' },
        { section: 'Finance & Accounts' },
        { label: 'Fee Collection', href: 'fees.html', icon: 'fees' },
        { label: 'Students Ledger', href: 'students.html', icon: 'students' },
        { label: 'Financial Reports', href: 'reports.html', icon: 'reports' },
        { label: 'Notices & Circulars', href: 'announcements.html', icon: 'announcements' },
        { label: 'My Profile', href: 'profile.html', icon: 'profile' }
      ],

      'Librarian': [
        { label: 'Dashboard', href: 'dashboard.html', icon: 'dashboard' },
        { section: 'Library Management' },
        { label: 'Books & Inventory', href: 'library.html', icon: 'library' },
        { label: 'Students Directory', href: 'students.html', icon: 'students' },
        { label: 'Library Reports', href: 'reports.html', icon: 'reports' },
        { label: 'School Notices', href: 'announcements.html', icon: 'announcements' },
        { label: 'My Profile', href: 'profile.html', icon: 'profile' }
      ],

      'Receptionist': [
        { label: 'Dashboard', href: 'dashboard.html', icon: 'dashboard' },
        { section: 'Front Desk & Admissions' },
        { label: 'New Admissions', href: 'students.html', icon: 'students' },
        { label: 'Class Roster', href: 'classes.html', icon: 'classes' },
        { label: 'Class Timetable', href: 'timetable.html', icon: 'timetable' },
        { label: 'School Notices', href: 'announcements.html', icon: 'announcements' },
        { label: 'Basic Reports', href: 'reports.html', icon: 'reports' },
        { label: 'My Profile', href: 'profile.html', icon: 'profile' }
      ]
    };

    return menus[role] || menus['Student'];
  },

  // SVGs for navigation
  icons: {
    dashboard: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>',
    students: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>',
    teachers: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>',
    classes: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>',
    subjects: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>',
    attendance: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>',
    timetable: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>',
    exams: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>',
    marks: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>',
    results: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>',
    assignments: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>',
    fees: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/></svg>',
    library: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"/></svg>',
    announcements: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"/></svg>',
    reports: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>',
    users: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>',
    audit: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>',
    settings: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>',
    profile: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>'
  },

  // Initialize Page Shell & Enforce URL Route Security
  init(pageTitle = 'Dashboard') {
    this.currentUser = Auth.requireAuth();
    if (!this.currentUser) return;

    // DIRECT URL GUARD: Check if the user is authorized for this page
    const currentPage = window.location.pathname.split('/').pop() || 'dashboard.html';
    if (!Permissions.canAccessPage(this.currentUser, currentPage)) {
      console.warn(`403 Access Denied: User '${this.currentUser.email}' with role '${this.currentUser.role}' attempted to access '${currentPage}'`);
      window.location.href = '403.html';
      return;
    }

    this.renderSidebar();
    this.renderTopbar(pageTitle);
    this.setupEventListeners();
    this.startLiveClock();
  },

  // Render Role-Tailored Navigation Sidebar
  renderSidebar() {
    const sidebarEl = document.getElementById('app-sidebar');
    if (!sidebarEl) return;

    const currentPath = window.location.pathname.split('/').pop() || 'dashboard.html';
    const navItems = this.getNavigationForRole(this.currentUser.role);

    let navHtml = `
      <div class="sidebar-brand">
        <img src="../assets/images/logo.svg" alt="GVPS Crest" class="sidebar-logo">
        <div class="brand-info">
          <h2>Green Valley</h2>
          <span>Public School, Jalandhar</span>
        </div>
      </div>
      <div class="sidebar-nav">
    `;

    for (const item of navItems) {
      if (item.section) {
        navHtml += `<div class="nav-section-title">${item.section}</div>`;
      } else {
        const isActive = currentPath === item.href ? 'active' : '';
        const iconSvg = this.icons[item.icon] || '';
        navHtml += `
          <a href="${item.href}" class="nav-link ${isActive}">
            ${iconSvg}
            <span>${item.label}</span>
          </a>
        `;
      }
    }

    navHtml += `
      </div>
      <div class="sidebar-footer">
        <a href="profile.html" style="text-decoration: none; color: inherit; display: block;">
          <div class="sidebar-user">
            <div class="sidebar-user-avatar">
              ${this.currentUser.name.charAt(0)}
            </div>
            <div class="sidebar-user-info">
              <div class="sidebar-user-name">${this.currentUser.name}</div>
              <span class="sidebar-user-role">${this.currentUser.role}</span>
            </div>
          </div>
        </a>
      </div>
    `;

    sidebarEl.innerHTML = navHtml;
  },

  // Render Top Header with Child Selector for Parents & Role Badge
  renderTopbar(pageTitle) {
    const topbarEl = document.getElementById('app-topbar');
    if (!topbarEl) return;

    // Build Child Switcher if user is Parent
    let childSwitcherHtml = '';
    if (this.currentUser.role === 'Parent' && this.currentUser.childIds && this.currentUser.childIds.length > 1) {
      childSwitcherHtml = `
        <div style="display: flex; align-items: center; gap: 8px; background: #ecfdf5; padding: 4px 12px; border-radius: var(--radius-full); border: 1px solid #a7f3d0; font-size: 0.82rem;">
          <strong>Select Ward:</strong>
          <select id="parent-child-switcher" style="background: transparent; border: none; font-weight: 700; color: #047857; cursor: pointer; outline: none;" onchange="Auth.setActiveChild(this.value)">
            ${this.currentUser.childIds.map(cid => `
              <option value="${cid}" ${cid === this.currentUser.activeChildId ? 'selected' : ''}>
                ${cid === 'STU-2025-001' ? 'Arshdeep Singh (10-A)' : 'Harpreet Singh (10-B)'}
              </option>
            `).join('')}
          </select>
        </div>
      `;
    }

    topbarEl.innerHTML = `
      <div class="topbar-left">
        <button class="menu-toggle-btn" id="menu-toggle" aria-label="Toggle Navigation">
          <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
        </button>
        <div>
          <div class="topbar-title">${pageTitle}</div>
          <div class="topbar-breadcrumb">Green Valley Public School &bull; Urban Estate Phase II, Jalandhar</div>
        </div>
      </div>

      <div class="topbar-right">
        ${childSwitcherHtml}

        <div class="school-time-badge" id="ist-clock-badge">
          <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6l4 2"/></svg>
          <span id="ist-time-text">Loading IST...</span>
        </div>

        <div class="topbar-actions">
          <span class="badge ${this.currentUser.role === 'Super Admin' ? 'badge-danger' : (this.currentUser.role === 'Admin' ? 'badge-warning' : (this.currentUser.role === 'Principal' ? 'badge-primary' : 'badge-info'))}">${this.currentUser.role}</span>
          <button class="btn btn-secondary btn-sm" id="logout-btn" title="Sign Out">
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
            <span>Logout</span>
          </button>
        </div>
      </div>
    `;
  },

  // Setup Global Events
  setupEventListeners() {
    const toggleBtn = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('app-sidebar');
    const backdrop = document.getElementById('sidebar-backdrop');
    const logoutBtn = document.getElementById('logout-btn');

    if (toggleBtn && sidebar && backdrop) {
      toggleBtn.addEventListener('click', () => {
        sidebar.classList.toggle('mobile-open');
        backdrop.classList.toggle('active');
      });

      backdrop.addEventListener('click', () => {
        sidebar.classList.remove('mobile-open');
        backdrop.classList.remove('active');
      });
    }

    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to sign out?')) {
          Auth.logout();
        }
      });
    }
  },

  // Live IST Clock
  startLiveClock() {
    const updateTime = () => {
      const el = document.getElementById('ist-time-text');
      if (!el) return;
      const now = new Date();
      const options = {
        timeZone: 'Asia/Kolkata',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      };
      el.textContent = `${now.toLocaleDateString('en-IN', options)} IST`;
    };
    updateTime();
    setInterval(updateTime, 1000);
  }
};

window.App = App;
