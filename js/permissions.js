/**
 * Green Valley Public School, Jalandhar
 * Role-Based Access Control (RBAC) - Permission Model & Role Mapping
 */

const Permissions = {
  // All system roles
  ROLES: {
    SUPER_ADMIN: 'Super Admin',
    ADMIN: 'Admin',
    PRINCIPAL: 'Principal',
    TEACHER: 'Teacher',
    STUDENT: 'Student',
    PARENT: 'Parent',
    ACCOUNTANT: 'Accountant',
    LIBRARIAN: 'Librarian',
    RECEPTIONIST: 'Receptionist'
  },

  // Role -> Permission List mapping
  ROLE_PERMISSIONS: {
    'Super Admin': [
      '*' // Full global authority
    ],

    'Admin': [
      'dashboard.view',
      'students.view_all', 'students.create', 'students.update', 'students.delete',
      'teachers.view', 'teachers.manage',
      'classes.view', 'classes.manage',
      'subjects.view', 'subjects.manage',
      'attendance.view_all', 'attendance.mark',
      'exams.view', 'exams.manage',
      'marks.view_all', 'marks.enter', 'marks.manage_all', 'marks.publish',
      'results.view', 'results.publish',
      'assignments.view', 'assignments.manage',
      'announcements.view', 'announcements.create', 'announcements.manage',
      'fees.view_all', 'fees.collect', 'fees.manage',
      'timetable.view', 'timetable.manage',
      'library.view', 'library.manage',
      'reports.view', 'reports.export',
      'users.view', 'users.manage',
      'audit.view',
      'settings.school'
      // Note: Admin cannot modify Super Admin or system-level infrastructure
    ],

    'Principal': [
      'dashboard.view',
      'students.view_all',
      'teachers.view',
      'classes.view',
      'subjects.view',
      'attendance.view_all',
      'exams.view',
      'marks.view_all', 'marks.publish',
      'results.view', 'results.publish',
      'assignments.view',
      'announcements.view', 'announcements.create',
      'fees.view_all',
      'timetable.view',
      'library.view',
      'reports.view', 'reports.export',
      'audit.view'
    ],

    'Teacher': [
      'dashboard.view',
      'students.view_assigned',
      'teachers.view_limited',
      'classes.view_assigned',
      'subjects.view',
      'attendance.view_assigned', 'attendance.mark_assigned',
      'exams.view_assigned',
      'marks.view_assigned', 'marks.enter_assigned',
      'results.view_assigned',
      'assignments.view', 'assignments.create_own', 'assignments.manage_own',
      'timetable.view',
      'announcements.view',
      'profile.view', 'profile.update_limited'
    ],

    'Student': [
      'dashboard.view',
      'students.view_own',
      'attendance.view_own',
      'exams.view_own',
      'marks.view_own',
      'results.view_own',
      'assignments.view_own', 'assignments.submit',
      'timetable.view_own',
      'announcements.view',
      'fees.view_own',
      'library.view_own',
      'profile.view', 'profile.update_limited'
    ],

    'Parent': [
      'dashboard.view',
      'students.view_child',
      'attendance.view_child',
      'exams.view_child',
      'marks.view_child',
      'results.view_child',
      'assignments.view_child',
      'timetable.view_child',
      'announcements.view',
      'fees.view_child',
      'library.view_child',
      'profile.view', 'profile.update_limited'
    ],

    'Accountant': [
      'dashboard.view',
      'students.view_financial',
      'fees.view_all', 'fees.collect', 'fees.manage', 'fees.receipts',
      'reports.finance', 'reports.export',
      'announcements.view',
      'profile.view'
    ],

    'Librarian': [
      'dashboard.view',
      'students.view_basic',
      'library.view', 'library.manage', 'library.issue', 'library.return', 'library.fines',
      'reports.library', 'reports.export',
      'announcements.view',
      'profile.view'
    ],

    'Receptionist': [
      'dashboard.view',
      'students.view_basic', 'students.create_enquiry', 'students.create',
      'classes.view',
      'announcements.view',
      'timetable.view',
      'reports.basic',
      'profile.view'
    ]
  },

  // Page URL -> Required Permissions (at least one must match)
  PAGE_PERMISSIONS: {
    'dashboard.html': ['dashboard.view'],
    'profile.html': ['profile.view'],
    'students.html': ['students.view_all', 'students.view_assigned', 'students.view_financial', 'students.view_basic', 'students.view_own', 'students.view_child'],
    'teachers.html': ['teachers.view', 'teachers.manage', 'teachers.view_limited'],
    'classes.html': ['classes.view', 'classes.manage', 'classes.view_assigned'],
    'subjects.html': ['subjects.view', 'subjects.manage'],
    'attendance.html': ['attendance.view_all', 'attendance.mark', 'attendance.view_assigned', 'attendance.mark_assigned', 'attendance.view_own', 'attendance.view_child'],
    'exams.html': ['exams.view', 'exams.manage', 'exams.view_assigned', 'exams.view_own', 'exams.view_child'],
    'marks.html': ['marks.view_all', 'marks.enter', 'marks.manage_all', 'marks.enter_assigned', 'marks.view_assigned'],
    'results.html': ['results.view', 'results.publish', 'results.view_assigned', 'results.view_own', 'results.view_child'],
    'assignments.html': ['assignments.view', 'assignments.manage', 'assignments.create_own', 'assignments.view_own', 'assignments.view_child'],
    'announcements.html': ['announcements.view'],
    'fees.html': ['fees.view_all', 'fees.collect', 'fees.manage', 'fees.view_own', 'fees.view_child'],
    'timetable.html': ['timetable.view', 'timetable.manage', 'timetable.view_own', 'timetable.view_child'],
    'library.html': ['library.view', 'library.manage', 'library.view_own', 'library.view_child'],
    'reports.html': ['reports.view', 'reports.export', 'reports.finance', 'reports.library', 'reports.basic'],
    'users.html': ['users.view', 'users.manage'],
    'audit-logs.html': ['audit.view'],
    'settings.html': ['settings.school', 'settings.system']
  },

  // Check if a user has a specific permission (supports hasPermission(permission) or hasPermission(user, permission))
  hasPermission(userOrPerm, maybePerm) {
    let user, permission;
    if (maybePerm !== undefined) {
      user = userOrPerm;
      permission = maybePerm;
    } else {
      user = (typeof Auth !== 'undefined' && Auth.getCurrentUser) ? Auth.getCurrentUser() : null;
      permission = userOrPerm;
    }
    if (!user || !user.role) return false;
    const userRole = user.role;
    const permissions = this.ROLE_PERMISSIONS[userRole] || [];
    if (permissions.includes('*')) return true;
    return permissions.includes(permission);
  },

  // Check if a user has access to a page file path (supports canAccessPage(pagePath) or canAccessPage(user, pagePath))
  canAccessPage(userOrPath, maybePath) {
    let user, pagePath;
    if (maybePath !== undefined) {
      user = userOrPath;
      pagePath = maybePath;
    } else {
      user = (typeof Auth !== 'undefined' && Auth.getCurrentUser) ? Auth.getCurrentUser() : null;
      pagePath = userOrPath || window.location.pathname;
    }
    if (!user) return false;
    const pageName = pagePath.split('/').pop().split('?')[0] || 'dashboard.html';

    // Public pages
    if (['index.html', 'login.html', '403.html'].includes(pageName)) {
      return true;
    }

    const required = this.PAGE_PERMISSIONS[pageName];
    if (!required) return true; // Unspecified pages allowed by default if authenticated

    const userRole = user.role;
    const permissions = this.ROLE_PERMISSIONS[userRole] || [];
    if (permissions.includes('*')) return true;

    return required.some(p => permissions.includes(p));
  }
};

window.Permissions = Permissions;
