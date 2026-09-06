/**
 * Green Valley Public School, Jalandhar
 * Application Configuration & Environment Settings
 */

const APP_CONFIG = {
  // Mode: 'DEVELOPMENT' or 'PRODUCTION'
  ENVIRONMENT: 'DEVELOPMENT',
  
  // Set to true when API Gateway & Cognito backend is live
  USE_AWS_BACKEND: false,

  // AWS Configuration (Non-secret)
  AWS: {
    REGION: 'ap-south-1', // Asia Pacific (Mumbai)
    API_BASE_URL: 'https://api.greenvalleyschool.example/prod',
    COGNITO_USER_POOL_ID: 'ap-south-1_gvpsPool123',
    COGNITO_CLIENT_ID: '3k4j5h6g7f8d9s0a1b2c3d4e5f',
    S3_BUCKET_NAME: 'gvps-school-documents-jalandhar',
    CLOUDFRONT_DOMAIN: 'https://d111111abcdef8.cloudfront.net'
  },

  // School Identity - Fictional Green Valley Public School, Jalandhar
  SCHOOL: {
    NAME: 'Green Valley Public School',
    AFFILIATION: 'Affiliated to CBSE, New Delhi (Affiliation No: 1630892)',
    ADDRESS: 'Urban Estate Phase II, Jalandhar, Punjab - 144022, India',
    PHONE: '+91 98765 43210',
    EMAIL: 'info@greenvalleyschool.example',
    WEBSITE: 'https://greenvalleyschool.example',
    ESTD: '2004',
    CURRENCY: '₹',
    TIMEZONE: 'Asia/Kolkata'
  },

  // Academic Standards
  ACADEMIC_YEAR: '2025-2026',

  // Standard CBSE 9-Point Grading Scale
  GRADING_SCALE: [
    { min: 91, max: 100, grade: 'A1', points: 10, remark: 'Outstanding' },
    { min: 81, max: 90,  grade: 'A2', points: 9,  remark: 'Excellent' },
    { min: 71, max: 80,  grade: 'B1', points: 8,  remark: 'Very Good' },
    { min: 61, max: 70,  grade: 'B2', points: 7,  remark: 'Good' },
    { min: 51, max: 60,  grade: 'C1', points: 6,  remark: 'Above Average' },
    { min: 41, max: 50,  grade: 'C2', points: 5,  remark: 'Average' },
    { min: 33, max: 40,  grade: 'D',  points: 4,  remark: 'Pass' },
    { min: 0,  max: 32,  grade: 'E',  points: 0,  remark: 'Needs Improvement / Fail' }
  ],

  // Classes offered
  CLASSES: [
    'Nursery', 'LKG', 'UKG',
    'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5',
    'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10',
    'Class 11 - Science', 'Class 11 - Commerce',
    'Class 12 - Science', 'Class 12 - Commerce'
  ],

  SECTIONS: ['A', 'B', 'C'],

  EXAM_TYPES: [
    'Unit Test 1',
    'Periodic Test 1',
    'Half-Yearly Examination',
    'Periodic Test 2',
    'Pre-Board Examination',
    'Annual Examination'
  ],

  FEE_TYPES: [
    'Tuition Fee',
    'Admission Fee',
    'Annual Charges',
    'Examination Fee',
    'Transport Fee',
    'Library Fee',
    'Activity Fee'
  ],

  STORAGE_KEYS: {
    AUTH_TOKEN: 'gvps_auth_token',
    AUTH_USER: 'gvps_auth_user',
    STUDENTS: 'gvps_db_students',
    TEACHERS: 'gvps_db_teachers',
    CLASSES: 'gvps_db_classes',
    SUBJECTS: 'gvps_db_subjects',
    ATTENDANCE: 'gvps_db_attendance',
    EXAMS: 'gvps_db_exams',
    MARKS: 'gvps_db_marks',
    ASSIGNMENTS: 'gvps_db_assignments',
    ANNOUNCEMENTS: 'gvps_db_announcements',
    FEES: 'gvps_db_fees',
    TIMETABLE: 'gvps_db_timetable',
    SETTINGS: 'gvps_db_settings'
  }
};

// Export to window for vanilla JS modularity
window.APP_CONFIG = APP_CONFIG;
