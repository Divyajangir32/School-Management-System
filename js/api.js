/**
 * Green Valley Public School, Jalandhar
 * Unified API Layer with Enterprise Role-Based Access Control (RBAC) & Resource Authorization
 */

const Api = {
  // Initial library inventory
  initialBooks: [
    { id: 'BK-001', isbn: '978-8174508218', title: 'Mathematics Exemplar Problems - Class 10', author: 'NCERT New Delhi', category: 'Mathematics', totalCopies: 25, availableCopies: 18, location: 'Shelf M-02' },
    { id: 'BK-002', isbn: '978-8174505323', title: 'Aadhunik Punjabi Sahit Da Itihaas', author: 'Dr. Jaswinder Singh', category: 'Punjabi Literature', totalCopies: 15, availableCopies: 12, location: 'Shelf P-01' },
    { id: 'BK-003', isbn: '978-8174505675', title: 'Concepts of Physics (Vol 1 & 2)', author: 'Dr. H.C. Verma', category: 'Physics', totalCopies: 30, availableCopies: 22, location: 'Shelf S-04' },
    { id: 'BK-004', isbn: '978-8174505121', title: 'India and the Contemporary World - Class 10', author: 'NCERT Social Science', category: 'Social Science', totalCopies: 20, availableCopies: 15, location: 'Shelf H-03' },
    { id: 'BK-005', isbn: '978-9352834872', title: 'Computer Science with Python', author: 'Sumita Arora', category: 'Computer Science', totalCopies: 20, availableCopies: 16, location: 'Shelf C-01' }
  ],

  initialIssues: [
    { id: 'ISS-001', bookId: 'BK-001', bookTitle: 'Mathematics Exemplar Problems - Class 10', studentId: 'STU-2025-001', studentName: 'Arshdeep Singh', class: 'Class 10-A', issueDate: '2026-08-20', dueDate: '2026-09-05', returnDate: '', status: 'Overdue', fine: 20 },
    { id: 'ISS-002', bookId: 'BK-003', bookTitle: 'Concepts of Physics (Vol 1 & 2)', studentId: 'STU-2025-004', studentName: 'Simran Kaur', class: 'Class 11-A', issueDate: '2026-08-28', dueDate: '2026-09-12', returnDate: '', status: 'Issued', fine: 0 }
  ],

  initialAuditLogs: [
    { id: 'AUD-001', timestamp: '2026-09-06 08:30:15', actor: 'Simranjeet Kaur', role: 'Receptionist', action: 'ADMISSION_ENQUIRY', resource: 'Students', details: 'Registered new student enquiry for Class 6', status: 'SUCCESS' },
    { id: 'AUD-002', timestamp: '2026-09-06 09:15:22', actor: 'Rajeev Mahajan', role: 'Accountant', action: 'PAYMENT_COLLECTED', resource: 'Fees', details: 'Collected Tuition Fee ₹4,500 for Arshdeep Singh (GVPS-RCP-2025-1001)', status: 'SUCCESS' },
    { id: 'AUD-003', timestamp: '2026-09-06 10:00:41', actor: 'Harpreet Singh Sandhu', role: 'Teacher', action: 'MARKS_ENTRY', resource: 'Marks', details: 'Entered Mathematics marks for Class 10 Section A', status: 'SUCCESS' },
    { id: 'AUD-004', timestamp: '2026-09-06 10:30:12', actor: 'Dr. Jaswant Singh Ahluwalia', role: 'Admin', action: 'USER_ROLE_ASSIGN', resource: 'Users', details: 'Assigned Senior Teacher role to Harpreet Singh Sandhu', status: 'SUCCESS' }
  ],

  // Pre-seeded Punjabi / Jalandhar initial dataset
  initialData: {
    students: [
      { id: 'STU-2025-001', admissionNo: 'GVPS/2025/101', name: 'Arshdeep Singh', dob: '2008-05-14', gender: 'Male', phone: '9876543211', email: 'arshdeep.singh@greenvalleyschool.example', address: 'House No. 452, Urban Estate Phase II', city: 'Jalandhar', state: 'Punjab', pincode: '144022', class: 'Class 10', section: 'A', rollNo: 1, parentName: 'Gurmeet Singh', parentPhone: '9876543210', admissionDate: '2020-04-01', status: 'Active' },
      { id: 'STU-2025-002', admissionNo: 'GVPS/2025/102', name: 'Jasleen Kaur', dob: '2008-08-22', gender: 'Female', phone: '9876543212', email: 'jasleen.kaur@greenvalleyschool.example', address: '78-B, Model Town', city: 'Jalandhar', state: 'Punjab', pincode: '144003', class: 'Class 10', section: 'A', rollNo: 2, parentName: 'Sukhwinder Singh', parentPhone: '9814012345', admissionDate: '2021-04-05', status: 'Active' },
      { id: 'STU-2025-003', admissionNo: 'GVPS/2025/103', name: 'Harpreet Singh', dob: '2009-02-11', gender: 'Male', phone: '9876543213', email: 'harpreet.s@greenvalleyschool.example', address: '124, Rama Mandi, Hoshiarpur Road', city: 'Jalandhar', state: 'Punjab', pincode: '144005', class: 'Class 10', section: 'B', rollNo: 1, parentName: 'Gurmeet Singh', parentPhone: '9876543210', admissionDate: '2022-04-10', status: 'Active' },
      { id: 'STU-2025-004', admissionNo: 'GVPS/2025/104', name: 'Simran Kaur', dob: '2007-11-09', gender: 'Female', phone: '9876543214', email: 'simran.kaur@greenvalleyschool.example', address: '15, Defence Colony, Cantt Road', city: 'Jalandhar', state: 'Punjab', pincode: '144005', class: 'Class 11 - Science', section: 'A', rollNo: 1, parentName: 'Jaswant Singh', parentPhone: '9815598765', admissionDate: '2019-04-01', status: 'Active' },
      { id: 'STU-2025-005', admissionNo: 'GVPS/2025/105', name: 'Gurman Singh', dob: '2007-03-30', gender: 'Male', phone: '9876543215', email: 'gurman.s@greenvalleyschool.example', address: '228, Jalandhar Heights, 66 Feet Road', city: 'Jalandhar', state: 'Punjab', pincode: '144022', class: 'Class 11 - Science', section: 'A', rollNo: 2, parentName: 'Manjit Singh', parentPhone: '9878811223', admissionDate: '2020-04-02', status: 'Active' },
      { id: 'STU-2025-006', admissionNo: 'GVPS/2025/106', name: 'Navjot Singh', dob: '2007-09-17', gender: 'Male', phone: '9876543216', email: 'navjot.s@greenvalleyschool.example', address: 'Plot 45, Guru Gobind Singh Avenue', city: 'Jalandhar', state: 'Punjab', pincode: '144009', class: 'Class 12 - Commerce', section: 'A', rollNo: 1, parentName: 'Tarsem Singh', parentPhone: '9814422334', admissionDate: '2018-04-01', status: 'Active' },
      { id: 'STU-2025-007', admissionNo: 'GVPS/2025/107', name: 'Aarav Sharma', dob: '2010-06-15', gender: 'Male', phone: '9876543217', email: 'aarav.sharma@greenvalleyschool.example', address: '61, Master Tara Singh Nagar', city: 'Jalandhar', state: 'Punjab', pincode: '144001', class: 'Class 8', section: 'A', rollNo: 1, parentName: 'Rajesh Sharma', parentPhone: '9888833445', admissionDate: '2021-04-01', status: 'Active' },
      { id: 'STU-2025-008', admissionNo: 'GVPS/2025/108', name: 'Riya Kapoor', dob: '2010-01-28', gender: 'Female', phone: '9876543218', email: 'riya.kapoor@greenvalleyschool.example', address: '104, Lajpat Nagar, GT Road', city: 'Jalandhar', state: 'Punjab', pincode: '144001', class: 'Class 8', section: 'A', rollNo: 2, parentName: 'Sunil Kapoor', parentPhone: '9876065432', admissionDate: '2022-04-03', status: 'Active' }
    ],

    teachers: [
      { id: 'TEA-001', employeeId: 'GVPS-T01', name: 'Harpreet Singh Sandhu', phone: '9814099887', email: 'harpreet.singh@greenvalleyschool.example', qualification: 'M.Sc. Mathematics, B.Ed.', subject: 'Mathematics', assignedClass: 'Class 10', joiningDate: '2018-07-15', address: '310, Urban Estate Phase I, Jalandhar', status: 'Active' },
      { id: 'TEA-002', employeeId: 'GVPS-T02', name: 'Manpreet Kaur Dhillon', phone: '9872011223', email: 'manpreet.kaur@greenvalleyschool.example', qualification: 'M.A. Punjabi, M.Phil, B.Ed.', subject: 'Punjabi', assignedClass: 'Class 9', joiningDate: '2019-04-01', address: '45, Chhoti Baradari, Jalandhar', status: 'Active' },
      { id: 'TEA-003', employeeId: 'GVPS-T03', name: 'Rajinder Kumar', phone: '9888877665', email: 'rajinder.kumar@greenvalleyschool.example', qualification: 'M.Sc. Physics, B.Ed.', subject: 'Physics', assignedClass: 'Class 11 - Science', joiningDate: '2017-08-10', address: '112, Model Town, Jalandhar', status: 'Active' },
      { id: 'TEA-004', employeeId: 'GVPS-T04', name: 'Sunita Verma', phone: '9815044332', email: 'sunita.verma@greenvalleyschool.example', qualification: 'M.Sc. Chemistry, B.Ed.', subject: 'Chemistry', assignedClass: 'Class 12 - Science', joiningDate: '2020-01-15', address: '78, GTB Nagar, Jalandhar', status: 'Active' },
      { id: 'TEA-005', employeeId: 'GVPS-T05', name: 'Amanpreet Singh', phone: '9876522110', email: 'amanpreet.singh@greenvalleyschool.example', qualification: 'M.C.A., B.Ed.', subject: 'Computer Science', assignedClass: 'Class 8', joiningDate: '2021-03-01', address: '502, Silver Heights, Urban Estate II', status: 'Active' }
    ],

    classes: [
      { id: 'CLS-01', name: 'Class 10', section: 'A', classTeacher: 'Harpreet Singh Sandhu', roomNo: 'Room 204', capacity: 40 },
      { id: 'CLS-02', name: 'Class 10', section: 'B', classTeacher: 'Manpreet Kaur Dhillon', roomNo: 'Room 205', capacity: 40 },
      { id: 'CLS-03', name: 'Class 11 - Science', section: 'A', classTeacher: 'Rajinder Kumar', roomNo: 'Lab Block 1', capacity: 35 },
      { id: 'CLS-04', name: 'Class 12 - Science', section: 'A', classTeacher: 'Sunita Verma', roomNo: 'Lab Block 2', capacity: 35 },
      { id: 'CLS-05', name: 'Class 8', section: 'A', classTeacher: 'Amanpreet Singh', roomNo: 'Room 102', capacity: 40 },
      { id: 'CLS-06', name: 'Class 12 - Commerce', section: 'A', classTeacher: 'Harpreet Singh Sandhu', roomNo: 'Room 301', capacity: 35 }
    ],

    subjects: [
      { id: 'SUB-01', code: 'PBI-01', name: 'Punjabi', category: 'Language', weeklyPeriods: 6 },
      { id: 'SUB-02', code: 'ENG-01', name: 'English', category: 'Language', weeklyPeriods: 6 },
      { id: 'SUB-03', code: 'HIN-01', name: 'Hindi', category: 'Language', weeklyPeriods: 4 },
      { id: 'SUB-04', code: 'MAT-01', name: 'Mathematics', category: 'Core', weeklyPeriods: 7 },
      { id: 'SUB-05', code: 'SCI-01', name: 'Science', category: 'Core', weeklyPeriods: 6 },
      { id: 'SUB-06', code: 'SST-01', name: 'Social Science', category: 'Core', weeklyPeriods: 5 },
      { id: 'SUB-07', code: 'CSC-01', name: 'Computer Science', category: 'Skill', weeklyPeriods: 4 },
      { id: 'SUB-08', code: 'PHY-01', name: 'Physics', category: 'Senior Science', weeklyPeriods: 6 },
      { id: 'SUB-09', code: 'CHE-01', name: 'Chemistry', category: 'Senior Science', weeklyPeriods: 6 },
      { id: 'SUB-10', code: 'BIO-01', name: 'Biology', category: 'Senior Science', weeklyPeriods: 6 },
      { id: 'SUB-11', code: 'ECO-01', name: 'Economics', category: 'Senior Commerce', weeklyPeriods: 5 },
      { id: 'SUB-12', code: 'ACC-01', name: 'Accountancy', category: 'Senior Commerce', weeklyPeriods: 6 },
      { id: 'SUB-13', code: 'BST-01', name: 'Business Studies', category: 'Senior Commerce', weeklyPeriods: 5 },
      { id: 'SUB-14', code: 'PED-01', name: 'Physical Education', category: 'Activity', weeklyPeriods: 3 }
    ],

    attendance: [
      { id: 'ATT-001', date: '2026-08-25', class: 'Class 10', section: 'A', studentId: 'STU-2025-001', status: 'Present' },
      { id: 'ATT-002', date: '2026-08-25', class: 'Class 10', section: 'A', studentId: 'STU-2025-002', status: 'Present' },
      { id: 'ATT-003', date: '2026-08-26', class: 'Class 10', section: 'A', studentId: 'STU-2025-001', status: 'Present' },
      { id: 'ATT-004', date: '2026-08-26', class: 'Class 10', section: 'A', studentId: 'STU-2025-002', status: 'Late' },
      { id: 'ATT-005', date: '2026-08-27', class: 'Class 10', section: 'A', studentId: 'STU-2025-001', status: 'Absent' },
      { id: 'ATT-006', date: '2026-08-27', class: 'Class 10', section: 'A', studentId: 'STU-2025-002', status: 'Present' }
    ],

    exams: [
      { id: 'EXM-001', name: 'Half-Yearly Examination 2025', examType: 'Half-Yearly Examination', class: 'Class 10', section: 'A', subject: 'Mathematics', date: '2026-09-15', startTime: '09:00', endTime: '12:00', maxMarks: 100 },
      { id: 'EXM-002', name: 'Half-Yearly Examination 2025', examType: 'Half-Yearly Examination', class: 'Class 10', section: 'A', subject: 'Science', date: '2026-09-18', startTime: '09:00', endTime: '12:00', maxMarks: 100 },
      { id: 'EXM-003', name: 'Unit Test 1', examType: 'Unit Test', class: 'Class 11 - Science', section: 'A', subject: 'Physics', date: '2026-09-10', startTime: '09:00', endTime: '10:30', maxMarks: 50 }
    ],

    marks: [
      { id: 'MRK-001', examId: 'EXM-001', examName: 'Half-Yearly Examination 2025', studentId: 'STU-2025-001', studentName: 'Arshdeep Singh', class: 'Class 10', section: 'A', subject: 'Mathematics', maxMarks: 100, obtainedMarks: 94, percentage: 94.0, grade: 'A1', result: 'Pass' },
      { id: 'MRK-002', examId: 'EXM-001', examName: 'Half-Yearly Examination 2025', studentId: 'STU-2025-002', studentName: 'Jasleen Kaur', class: 'Class 10', section: 'A', subject: 'Mathematics', maxMarks: 100, obtainedMarks: 88, percentage: 88.0, grade: 'A2', result: 'Pass' },
      { id: 'MRK-003', examId: 'EXM-002', examName: 'Half-Yearly Examination 2025', studentId: 'STU-2025-001', studentName: 'Arshdeep Singh', class: 'Class 10', section: 'A', subject: 'Science', maxMarks: 100, obtainedMarks: 91, percentage: 91.0, grade: 'A1', result: 'Pass' }
    ],

    assignments: [
      { id: 'ASN-001', title: 'Trigonometric Identities & Heights Worksheet', description: 'Solve NCERT Exercise 8.4 questions 1 through 10 with step-by-step diagrammatic proofs.', subject: 'Mathematics', class: 'Class 10', dueDate: '2026-09-12', assignedBy: 'Harpreet Singh Sandhu', status: 'Active' },
      { id: 'ASN-002', title: 'Punjabi Essay on Vaisakhi & Cultural Heritage', description: 'Write a 400-word essay on the historical and religious significance of Vaisakhi in Punjab.', subject: 'Punjabi', class: 'Class 10', dueDate: '2026-09-15', assignedBy: 'Manpreet Kaur Dhillon', status: 'Active' },
      { id: 'ASN-003', title: 'Electromagnetic Induction Numerical Problems', description: 'Complete the numerical problem set 3.2 on Faraday’s and Lenz’s laws.', subject: 'Physics', class: 'Class 11 - Science', dueDate: '2026-09-18', assignedBy: 'Rajinder Kumar', status: 'Active' }
    ],

    announcements: [
      { id: 'ANC-001', title: 'CBSE Board Examination Registration 2025-26', description: 'Registration for Class 10 and 12 CBSE board exams has commenced. Parents must verify their ward details and submit passport photos by September 20.', date: '2026-09-01', audience: 'Everyone', priority: 'High', author: 'Principal Office' },
      { id: 'ANC-002', title: 'Inter-School Folk Dance & Giddha Competition in Jalandhar', description: 'Green Valley will be hosting the Sahodaya Inter-School Folk Dance Competition on October 10. Auditions begin this Friday in the school auditorium.', date: '2026-09-03', audience: 'Students', priority: 'Medium', author: 'Cultural Committee' },
      { id: 'ANC-003', title: 'Staff Meeting regarding Half-Yearly Exam Evaluation', description: 'All subject teachers are requested to assemble in Conference Room 1 on Saturday at 2:00 PM.', date: '2026-09-04', audience: 'Teachers', priority: 'High', author: 'Vice Principal' }
    ],

    fees: [
      { id: 'FEE-001', receiptNo: 'GVPS-RCP-2025-1001', studentId: 'STU-2025-001', studentName: 'Arshdeep Singh', class: 'Class 10', feeType: 'Tuition Fee (Quarter 2)', amount: 4500, paidAmount: 4500, pendingAmount: 0, paymentDate: '2026-08-05', paymentMethod: 'Bank Transfer / NEFT', status: 'Paid' },
      { id: 'FEE-002', receiptNo: 'GVPS-RCP-2025-1002', studentId: 'STU-2025-001', studentName: 'Arshdeep Singh', class: 'Class 10', feeType: 'Annual Charges', amount: 8000, paidAmount: 8000, pendingAmount: 0, paymentDate: '2026-04-10', paymentMethod: 'Cheque (HDFC Bank)', status: 'Paid' },
      { id: 'FEE-003', receiptNo: 'GVPS-RCP-2025-1003', studentId: 'STU-2025-002', studentName: 'Jasleen Kaur', class: 'Class 10', feeType: 'Transport Fee (Urban Estate route)', amount: 2500, paidAmount: 0, pendingAmount: 2500, paymentDate: '', paymentMethod: '-', status: 'Pending' },
      { id: 'FEE-004', receiptNo: 'GVPS-RCP-2025-1004', studentId: 'STU-2025-003', studentName: 'Harpreet Singh', class: 'Class 10', feeType: 'Tuition Fee (Quarter 2)', amount: 4500, paidAmount: 2000, pendingAmount: 2500, paymentDate: '2026-08-14', paymentMethod: 'Cash', status: 'Partial' }
    ],

    timetable: [
      { day: 'Monday', period: '08:00 - 08:50', class: 'Class 10', subject: 'Mathematics', teacher: 'Harpreet Singh Sandhu', room: 'Room 204' },
      { day: 'Monday', period: '08:50 - 09:40', class: 'Class 10', subject: 'English', teacher: 'Sunita Verma', room: 'Room 204' },
      { day: 'Monday', period: '09:40 - 10:30', class: 'Class 10', subject: 'Science', teacher: 'Rajinder Kumar', room: 'Room 204' },
      { day: 'Monday', period: '10:50 - 11:40', class: 'Class 10', subject: 'Punjabi', teacher: 'Manpreet Kaur Dhillon', room: 'Room 204' },
      { day: 'Monday', period: '11:40 - 12:30', class: 'Class 10', subject: 'Computer Science', teacher: 'Amanpreet Singh', room: 'Lab 1' },
      { day: 'Tuesday', period: '08:00 - 08:50', class: 'Class 10', subject: 'Science', teacher: 'Rajinder Kumar', room: 'Room 204' },
      { day: 'Tuesday', period: '08:50 - 09:40', class: 'Class 10', subject: 'Mathematics', teacher: 'Harpreet Singh Sandhu', room: 'Room 204' },
      { day: 'Tuesday', period: '09:40 - 10:30', class: 'Class 10', subject: 'Social Science', teacher: 'Sunita Verma', room: 'Room 204' },
      { day: 'Wednesday', period: '08:00 - 08:50', class: 'Class 10', subject: 'Mathematics', teacher: 'Harpreet Singh Sandhu', room: 'Room 204' },
      { day: 'Wednesday', period: '08:50 - 09:40', class: 'Class 10', subject: 'Punjabi', teacher: 'Manpreet Kaur Dhillon', room: 'Room 204' },
      { day: 'Thursday', period: '08:00 - 08:50', class: 'Class 10', subject: 'Science', teacher: 'Rajinder Kumar', room: 'Room 204' },
      { day: 'Friday', period: '08:00 - 08:50', class: 'Class 10', subject: 'Physical Education', teacher: 'Amanpreet Singh', room: 'Ground' }
    ]
  },

  // Initialize DB collections in LocalStorage
  init() {
    for (const [key, initialRows] of Object.entries(this.initialData)) {
      const storageKey = APP_CONFIG.STORAGE_KEYS[key.toUpperCase()];
      if (storageKey && !localStorage.getItem(storageKey)) {
        localStorage.setItem(storageKey, JSON.stringify(initialRows));
      }
    }
    if (!localStorage.getItem('gvps_db_library_books')) {
      localStorage.setItem('gvps_db_library_books', JSON.stringify(this.initialBooks));
    }
    if (!localStorage.getItem('gvps_db_library_issues')) {
      localStorage.setItem('gvps_db_library_issues', JSON.stringify(this.initialIssues));
    }
    if (!localStorage.getItem('gvps_db_audit_logs')) {
      localStorage.setItem('gvps_db_audit_logs', JSON.stringify(this.initialAuditLogs));
    }
  },

  // Log Security & Action to Audit Trail
  async logAudit(user, action, resource, details, status = 'SUCCESS') {
    const raw = localStorage.getItem('gvps_db_audit_logs');
    const logs = raw ? JSON.parse(raw) : [];
    const newLog = {
      id: `AUD-${Date.now()}`,
      timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      actor: user ? user.name : 'System / Guest',
      role: user ? user.role : 'Unassigned',
      action: action,
      resource: resource,
      details: details,
      status: status
    };
    logs.unshift(newLog);
    localStorage.setItem('gvps_db_audit_logs', JSON.stringify(logs.slice(0, 500))); // Keep last 500 logs
  },

  // Authenticate and Authorize API Request
  _checkAuth(permission = '') {
    const user = Auth.getCurrentUser();
    if (!user) {
      throw new Error('401 Unauthorized: Please log in to perform this operation');
    }
    if (permission && !Permissions.hasPermission(user, permission)) {
      this.logAudit(user, 'DENIED_ACTION', permission, `Denied access to permission '${permission}'`, 'BLOCKED');
      throw new Error(`403 Forbidden: Your role '${user.role}' does not have the '${permission}' permission`);
    }
    return user;
  },

  // Resource-Level Authorization & Data Filtering Engine
  _filterForRole(collection, data, user) {
    if (!user) return [];
    const role = user.role;

    // Super Admin & Admin have full data visibility
    if (role === 'Super Admin' || role === 'Admin') {
      return data;
    }

    if (collection === 'students') {
      if (role === 'Principal') return data;
      if (role === 'Teacher') {
        // Teacher sees only assigned class/section
        return data.filter(s => s.class === user.assignedClass);
      }
      if (role === 'Student') {
        // Student sees ONLY own profile
        return data.filter(s => s.id === user.studentId);
      }
      if (role === 'Parent') {
        // Parent sees ONLY linked children (respecting active child if selected)
        const allowedIds = user.childIds || [user.studentId];
        return data.filter(s => allowedIds.includes(s.id));
      }
      if (role === 'Accountant') {
        // Accountant sees student info relevant for fees
        return data.map(s => ({ id: s.id, admissionNo: s.admissionNo, name: s.name, class: s.class, section: s.section, parentName: s.parentName, parentPhone: s.parentPhone, status: s.status }));
      }
      if (role === 'Librarian' || role === 'Receptionist') {
        return data.map(s => ({ id: s.id, admissionNo: s.admissionNo, name: s.name, class: s.class, section: s.section, rollNo: s.rollNo, phone: s.phone, parentName: s.parentName, status: s.status }));
      }
    }

    if (collection === 'marks') {
      if (role === 'Principal') return data;
      if (role === 'Teacher') {
        // Teacher sees ONLY marks for their assigned class & subject
        return data.filter(m => m.class === user.assignedClass && m.subject === user.assignedSubject);
      }
      if (role === 'Student') {
        return data.filter(m => m.studentId === user.studentId);
      }
      if (role === 'Parent') {
        const allowedIds = user.childIds || [user.studentId];
        return data.filter(m => allowedIds.includes(m.studentId));
      }
      // Accountant, Librarian, Receptionist cannot access marks
      return [];
    }

    if (collection === 'attendance') {
      if (role === 'Principal') return data;
      if (role === 'Teacher') {
        return data.filter(a => a.class === user.assignedClass);
      }
      if (role === 'Student') {
        return data.filter(a => a.studentId === user.studentId);
      }
      if (role === 'Parent') {
        const allowedIds = user.childIds || [user.studentId];
        return data.filter(a => allowedIds.includes(a.studentId));
      }
      return [];
    }

    if (collection === 'fees') {
      if (role === 'Accountant' || role === 'Principal') return data;
      if (role === 'Student') {
        return data.filter(f => f.studentId === user.studentId);
      }
      if (role === 'Parent') {
        const allowedIds = user.childIds || [user.studentId];
        return data.filter(f => allowedIds.includes(f.studentId));
      }
      // Teachers and Librarians cannot view financial ledgers
      return [];
    }

    if (collection === 'teachers') {
      if (role === 'Principal' || role === 'Super Admin' || role === 'Admin') return data;
      if (role === 'Teacher' || role === 'Student' || role === 'Parent' || role === 'Receptionist') {
        // Read-only contact card, hides private salary/HR details
        return data.map(t => ({ id: t.id, employeeId: t.employeeId, name: t.name, subject: t.subject, assignedClass: t.assignedClass, qualification: t.qualification, email: t.email, status: t.status }));
      }
      return [];
    }

    if (collection === 'announcements') {
      // Filter by audience
      return data.filter(a => {
        if (a.audience === 'Everyone') return true;
        if (role === 'Teacher' && a.audience === 'Teachers') return true;
        if (role === 'Student' && a.audience === 'Students') return true;
        if (role === 'Parent' && a.audience === 'Parents') return true;
        if (['Super Admin', 'Admin', 'Principal'].includes(role)) return true;
        return false;
      });
    }

    return data;
  },

  // Generic Get Collection with RBAC & Resource Filtering
  async get(collection) {
    const user = this._checkAuth();

    let storageKey = APP_CONFIG.STORAGE_KEYS[collection.toUpperCase()];
    if (!storageKey) {
      if (collection === 'library_books') storageKey = 'gvps_db_library_books';
      else if (collection === 'library_issues') storageKey = 'gvps_db_library_issues';
      else if (collection === 'audit_logs') storageKey = 'gvps_db_audit_logs';
      else if (collection === 'users') storageKey = 'gvps_db_users';
    }

    const raw = localStorage.getItem(storageKey);
    const data = raw ? JSON.parse(raw) : [];

    // Apply strict resource-level isolation
    return this._filterForRole(collection, data, user);
  },

  // Generic Get By ID with ownership verification
  async getById(collection, id) {
    const list = await this.get(collection);
    return list.find(item => item.id === id) || null;
  },

  // Generic Set / Overwrite Collection
  async set(collection, data) {
    const user = this._checkAuth();

    let storageKey = APP_CONFIG.STORAGE_KEYS[collection.toUpperCase()];
    if (!storageKey) {
      if (collection === 'library_books') storageKey = 'gvps_db_library_books';
      else if (collection === 'library_issues') storageKey = 'gvps_db_library_issues';
      else if (collection === 'audit_logs') storageKey = 'gvps_db_audit_logs';
      else if (collection === 'users') storageKey = 'gvps_db_users';
    }

    localStorage.setItem(storageKey, JSON.stringify(data));
    return data;
  },

  // Generic Add Item with Permission Check & Audit Logging
  async add(collection, item) {
    const user = this._checkAuth();

    // Specific write permissions
    if (collection === 'students') {
      if (!Permissions.hasPermission(user, 'students.create') && !Permissions.hasPermission(user, 'students.create_enquiry')) {
        throw new Error('403 Forbidden: You do not have permission to register students.');
      }
    } else if (collection === 'marks') {
      if (!Permissions.hasPermission(user, 'marks.enter') && !Permissions.hasPermission(user, 'marks.enter_assigned')) {
        throw new Error('403 Forbidden: You do not have permission to enter marks.');
      }
      // Resource check: teacher can only enter marks for assigned class and subject
      if (user.role === 'Teacher') {
        if (item.class !== user.assignedClass || item.subject !== user.assignedSubject) {
          throw new Error(`403 Forbidden: As a Teacher, you are only permitted to enter marks for ${user.assignedClass} - ${user.assignedSubject}`);
        }
      }
    } else if (collection === 'fees') {
      if (!Permissions.hasPermission(user, 'fees.collect') && !Permissions.hasPermission(user, 'fees.manage')) {
        throw new Error('403 Forbidden: Only Accountants or Administrators can record fee transactions.');
      }
    } else if (collection === 'users') {
      if (!Permissions.hasPermission(user, 'users.manage')) {
        throw new Error('403 Forbidden: Only authorized administrators can create user accounts.');
      }
    }

    const raw = localStorage.getItem(APP_CONFIG.STORAGE_KEYS[collection.toUpperCase()] || `gvps_db_${collection}`);
    const list = raw ? JSON.parse(raw) : [];
    list.unshift(item);
    localStorage.setItem(APP_CONFIG.STORAGE_KEYS[collection.toUpperCase()] || `gvps_db_${collection}`, JSON.stringify(list));

    await this.logAudit(user, 'CREATE_RECORD', collection, `Created record in ${collection} (ID: ${item.id})`);
    return item;
  },

  // Generic Update Item with Permission Check & Audit Logging
  async update(collection, id, updatedData) {
    const user = this._checkAuth();

    if (collection === 'students' && !Permissions.hasPermission(user, 'students.update')) {
      throw new Error('403 Forbidden: You do not have permission to modify student records.');
    }
    if (collection === 'users' && !Permissions.hasPermission(user, 'users.manage')) {
      throw new Error('403 Forbidden: You do not have permission to manage user accounts.');
    }

    const storageKey = APP_CONFIG.STORAGE_KEYS[collection.toUpperCase()] || `gvps_db_${collection}`;
    const raw = localStorage.getItem(storageKey);
    const list = raw ? JSON.parse(raw) : [];
    const idx = list.findIndex(item => item.id === id);

    if (idx !== -1) {
      list[idx] = { ...list[idx], ...updatedData };
      localStorage.setItem(storageKey, JSON.stringify(list));
      await this.logAudit(user, 'UPDATE_RECORD', collection, `Updated record ${id} in ${collection}`);
      return list[idx];
    }
    throw new Error(`${collection} item with id ${id} not found`);
  },

  // Generic Delete Item with Permission Check & Audit Logging
  async delete(collection, id) {
    const user = this._checkAuth();

    if (collection === 'students' && !Permissions.hasPermission(user, 'students.delete')) {
      throw new Error('403 Forbidden: Only Administrators can delete/deactivate students.');
    }
    if (collection === 'teachers' && !Permissions.hasPermission(user, 'teachers.manage')) {
      throw new Error('403 Forbidden: Only Administrators can delete faculty.');
    }
    if (collection === 'users') {
      if (user.role !== 'Super Admin') {
        throw new Error('403 Forbidden: Only Super Admin can delete user accounts.');
      }
    }

    const storageKey = APP_CONFIG.STORAGE_KEYS[collection.toUpperCase()] || `gvps_db_${collection}`;
    const raw = localStorage.getItem(storageKey);
    let list = raw ? JSON.parse(raw) : [];
    list = list.filter(item => item.id !== id);
    localStorage.setItem(storageKey, JSON.stringify(list));

    await this.logAudit(user, 'DELETE_RECORD', collection, `Deleted record ${id} from ${collection}`);
    return { success: true, id };
  },

  // Reset demo data
  resetDemoData() {
    for (const [key, initialRows] of Object.entries(this.initialData)) {
      const storageKey = APP_CONFIG.STORAGE_KEYS[key.toUpperCase()];
      if (storageKey) localStorage.setItem(storageKey, JSON.stringify(initialRows));
    }
    localStorage.setItem('gvps_db_library_books', JSON.stringify(this.initialBooks));
    localStorage.setItem('gvps_db_library_issues', JSON.stringify(this.initialIssues));
    localStorage.setItem('gvps_db_audit_logs', JSON.stringify(this.initialAuditLogs));
  }
};

Api.init();
window.Api = Api;
