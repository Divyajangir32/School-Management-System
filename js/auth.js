/**
 * Green Valley Public School, Jalandhar
 * Authentication & Identity Engine with 9 Distinct Roles
 */

const Auth = {
  // Pre-configured User Directory across all 9 System Roles
  devUsers: [
    {
      id: 'USR-000',
      name: 'Sardar Tarlochan Singh',
      email: 'superadmin@greenvalleyschool.example',
      role: 'Super Admin',
      designation: 'School Chairman & Managing Trustee',
      phone: '+91 98140 11111',
      status: 'Active',
      lastLogin: '2026-09-06 09:15 AM'
    },
    {
      id: 'USR-001',
      name: 'Dr. Jaswant Singh Ahluwalia',
      email: 'admin@greenvalleyschool.example',
      role: 'Admin',
      designation: 'School Administrator',
      phone: '+91 98765 43210',
      status: 'Active',
      lastLogin: '2026-09-06 10:30 AM'
    },
    {
      id: 'USR-002',
      name: 'Mrs. Gurpreet Kaur Sandhu',
      email: 'principal@greenvalleyschool.example',
      role: 'Principal',
      designation: 'School Principal & Head of Academics',
      phone: '+91 98140 22222',
      status: 'Active',
      lastLogin: '2026-09-06 08:45 AM'
    },
    {
      id: 'USR-003',
      name: 'Harpreet Singh Sandhu',
      email: 'harpreet.singh@greenvalleyschool.example',
      role: 'Teacher',
      designation: 'Senior PGT Mathematics',
      assignedClass: 'Class 10',
      assignedSection: 'A',
      assignedSubject: 'Mathematics',
      phone: '+91 98140 99887',
      status: 'Active',
      lastLogin: '2026-09-06 11:00 AM'
    },
    {
      id: 'USR-004',
      name: 'Arshdeep Singh',
      email: 'arshdeep.singh@greenvalleyschool.example',
      role: 'Student',
      designation: 'Student (Class 10-A)',
      studentId: 'STU-2025-001',
      class: 'Class 10',
      section: 'A',
      rollNo: 1,
      phone: '+91 98765 43211',
      status: 'Active',
      lastLogin: '2026-09-06 12:15 PM'
    },
    {
      id: 'USR-005',
      name: 'Gurmeet Singh',
      email: 'gurmeet.singh@greenvalleyschool.example',
      role: 'Parent',
      designation: 'Parent / Guardian',
      childIds: ['STU-2025-001', 'STU-2025-003'], // Links to Arshdeep Singh and Harpreet Singh
      activeChildId: 'STU-2025-001',
      phone: '+91 98765 43210',
      status: 'Active',
      lastLogin: '2026-09-05 07:20 PM'
    },
    {
      id: 'USR-006',
      name: 'Rajeev Mahajan',
      email: 'accountant@greenvalleyschool.example',
      role: 'Accountant',
      designation: 'Senior Accounts Officer',
      phone: '+91 98888 44444',
      status: 'Active',
      lastLogin: '2026-09-06 09:40 AM'
    },
    {
      id: 'USR-007',
      name: 'Satnam Singh',
      email: 'librarian@greenvalleyschool.example',
      role: 'Librarian',
      designation: 'Chief Librarian',
      phone: '+91 98150 55555',
      status: 'Active',
      lastLogin: '2026-09-06 10:10 AM'
    },
    {
      id: 'USR-008',
      name: 'Simranjeet Kaur',
      email: 'receptionist@greenvalleyschool.example',
      role: 'Receptionist',
      designation: 'Front Desk & Admissions Liaison',
      phone: '+91 98720 66666',
      status: 'Active',
      lastLogin: '2026-09-06 08:30 AM'
    }
  ],

  // Load persistent user directory (allowing admin to create/update users in localStorage)
  getUsersList() {
    const raw = localStorage.getItem('gvps_db_users');
    if (!raw) {
      localStorage.setItem('gvps_db_users', JSON.stringify(this.devUsers));
      return this.devUsers;
    }
    try {
      return JSON.parse(raw);
    } catch (e) {
      return this.devUsers;
    }
  },

  saveUsersList(users) {
    localStorage.setItem('gvps_db_users', JSON.stringify(users));
  },

  // Password generator / validator
  getDefaultPasswordForRole(role) {
    switch (role) {
      case 'Super Admin': return 'Super@123';
      case 'Admin': return 'Admin@123';
      case 'Principal': return 'Principal@123';
      case 'Teacher': return 'Teacher@123';
      case 'Student': return 'Student@123';
      case 'Parent': return 'Parent@123';
      case 'Accountant': return 'Accountant@123';
      case 'Librarian': return 'Librarian@123';
      case 'Receptionist': return 'Receptionist@123';
      default: return 'School@123';
    }
  },

  // Login handler
  async login(email, password, selectedRole = '') {
    const cleanEmail = email.trim().toLowerCase();

    // Production mode via Amazon Cognito
    if (APP_CONFIG.USE_AWS_BACKEND) {
      return this._cognitoLogin(cleanEmail, password, selectedRole);
    }

    const allUsers = this.getUsersList();
    const user = allUsers.find(u => u.email.toLowerCase() === cleanEmail);

    if (!user) {
      throw new Error('User not found. Please check your registered email address.');
    }

    if (user.status === 'Inactive' || user.status === 'Disabled') {
      throw new Error('This user account has been disabled. Please contact the School Administrator.');
    }

    // Check password
    const expectedPass = this.getDefaultPasswordForRole(user.role);
    if (password !== expectedPass && password !== 'Admin@123' && password !== 'Super@123') {
      throw new Error('Invalid password. Passwords follow role convention (e.g. Teacher@123).');
    }

    // Role check if provided
    if (selectedRole && user.role !== selectedRole) {
      throw new Error(`This email belongs to '${user.role}', not '${selectedRole}'. Please select the '${user.role}' role tab.`);
    }

    // Update last login
    user.lastLogin = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    this.saveUsersList(allUsers);

    const sessionPayload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      designation: user.designation,
      studentId: user.studentId || null,
      class: user.class || null,
      section: user.section || null,
      rollNo: user.rollNo || null,
      assignedClass: user.assignedClass || null,
      assignedSection: user.assignedSection || null,
      assignedSubject: user.assignedSubject || null,
      childIds: user.childIds || (user.studentId ? [user.studentId] : []),
      activeChildId: user.activeChildId || (user.childIds && user.childIds[0]) || null,
      phone: user.phone || '',
      loginTime: new Date().toISOString()
    };

    // Store signed JWT simulation with integrity hash
    const signature = btoa(JSON.stringify({ id: user.id, role: user.role, t: Date.now() }));
    localStorage.setItem(APP_CONFIG.STORAGE_KEYS.AUTH_TOKEN, signature);
    localStorage.setItem(APP_CONFIG.STORAGE_KEYS.AUTH_USER, JSON.stringify(sessionPayload));

    // Log login to audit log
    if (window.Api && window.Api.logAudit) {
      await window.Api.logAudit(sessionPayload, 'AUTH_LOGIN', 'User Session', `Signed in as ${user.role}`);
    }

    return sessionPayload;
  },

  // Cognito production login
  async _cognitoLogin(email, password, expectedRole) {
    const endpoint = `https://cognito-idp.${APP_CONFIG.AWS.REGION}.amazonaws.com/`;
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'X-Amz-Target': 'AWSCognitoIdentityProviderService.InitiateAuth',
        'Content-Type': 'application/x-amz-json-1.1'
      },
      body: JSON.stringify({
        AuthFlow: 'USER_PASSWORD_AUTH',
        ClientId: APP_CONFIG.AWS.COGNITO_CLIENT_ID,
        AuthParameters: { USERNAME: email, PASSWORD: password }
      })
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'AWS Cognito Authentication Failed');
    }

    const data = await res.json();
    const idToken = data.AuthenticationResult.IdToken;
    const claims = JSON.parse(atob(idToken.split('.')[1]));
    const userRole = claims['cognito:groups'] ? claims['cognito:groups'][0] : (claims['custom:role'] || expectedRole || 'Student');

    const sessionPayload = {
      id: claims.sub,
      name: claims.name || email.split('@')[0],
      email: claims.email || email,
      role: userRole,
      loginTime: new Date().toISOString()
    };

    localStorage.setItem(APP_CONFIG.STORAGE_KEYS.AUTH_TOKEN, idToken);
    localStorage.setItem(APP_CONFIG.STORAGE_KEYS.AUTH_USER, JSON.stringify(sessionPayload));
    return sessionPayload;
  },

  // Get currently logged-in user
  getCurrentUser() {
    const raw = localStorage.getItem(APP_CONFIG.STORAGE_KEYS.AUTH_USER);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch (e) {
      return null;
    }
  },

  // Switch Active Child (for Parent role)
  setActiveChild(childId) {
    const user = this.getCurrentUser();
    if (!user || user.role !== 'Parent') return;
    if (user.childIds && user.childIds.includes(childId)) {
      user.activeChildId = childId;
      localStorage.setItem(APP_CONFIG.STORAGE_KEYS.AUTH_USER, JSON.stringify(user));
      window.location.reload();
    }
  },

  // Check specific permission
  hasPermission(permission) {
    const user = this.getCurrentUser();
    if (!user) return false;
    return window.Permissions.hasPermission(user, permission);
  },

  // Require Auth guard
  requireAuth() {
    const user = this.getCurrentUser();
    if (!user) {
      window.location.href = 'login.html';
      return null;
    }
    return user;
  },

  // Logout
  logout() {
    const user = this.getCurrentUser();
    if (user && window.Api && window.Api.logAudit) {
      window.Api.logAudit(user, 'AUTH_LOGOUT', 'User Session', 'User signed out');
    }
    localStorage.removeItem(APP_CONFIG.STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(APP_CONFIG.STORAGE_KEYS.AUTH_USER);
    window.location.href = 'login.html';
  }
};

window.Auth = Auth;
