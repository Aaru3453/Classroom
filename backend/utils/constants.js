module.exports = {
  // User roles
  ROLES: {
    ADMIN: 'admin',
    FACULTY: 'faculty',
    STUDENT: 'student'
  },

  // Classroom types
  CLASSROOM_TYPES: [
    'Lecture Hall',
    'Seminar Room',
    'Workshop',
    'Lab',
    'Computer Lab',
    'Conference Room'
  ],

  // Subject types
  SUBJECT_TYPES: [
    'Core',
    'Elective',
    'Lab',
    'Project',
    'Workshop',
    'Seminar'
  ],

  // Timetable status
  TIMETABLE_STATUS: {
    DRAFT: 'Draft',
    PENDING_REVIEW: 'Pending Review',
    APPROVED: 'Approved',
    REJECTED: 'Rejected'
  },

  // Days of week
  DAYS: [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
  ],

  // Time slots
  TIME_SLOTS: [
    '09:00-10:00',
    '10:00-11:00',
    '11:00-12:00',
    '12:00-13:00',
    '13:00-14:00',
    '14:00-15:00',
    '15:00-16:00',
    '16:00-17:00'
  ],

  // Departments
  DEPARTMENTS: [
    'Computer Science',
    'Electrical Engineering',
    'Mechanical Engineering',
    'Civil Engineering',
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology'
  ],

  // Notification types
  NOTIFICATION_TYPES: {
    INFO: 'info',
    WARNING: 'warning',
    SUCCESS: 'success',
    ERROR: 'error',
    SCHEDULE: 'schedule',
    SYSTEM: 'system'
  },

  // Notification categories
  NOTIFICATION_CATEGORIES: {
    TIMETABLE: 'timetable',
    FACULTY: 'faculty',
    CLASSROOM: 'classroom',
    BATCH: 'batch',
    SYSTEM: 'system',
    ALERT: 'alert'
  },

  // File upload limits
  UPLOAD_LIMITS: {
    AVATAR: 2 * 1024 * 1024, // 2MB
    DOCUMENT: 5 * 1024 * 1024, // 5MB
    IMAGE: 5 * 1024 * 1024 // 5MB
  },

  // Academic years
  ACADEMIC_YEARS: [
    '2023-2024',
    '2024-2025',
    '2025-2026',
    '2026-2027'
  ]
};