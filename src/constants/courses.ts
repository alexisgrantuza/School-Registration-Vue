// Course constants
export const COURSES = {
  BSIT: 'Bachelor of Science in Information Technology',
  BSCS: 'Bachelor of Science in Computer Science',
  BST: 'Bachelor of Science in Tourism',
  BSHRM: 'Bachelor of Science in Hotel and Restaurant Management',
  BSN: 'Bachelor of Science in Nursing',
} as const

// Course options for dropdowns and forms
export const COURSE_OPTIONS = [
  { value: 'BSIT', label: 'Bachelor of Science in Information Technology' },
  { value: 'BSCS', label: 'Bachelor of Science in Computer Science' },
  { value: 'BST', label: 'Bachelor of Science in Tourism' },
  { value: 'BSHRM', label: 'Bachelor of Science in Hotel and Restaurant Management' },
  { value: 'BSN', label: 'Bachelor of Science in Nursing' },
] as const

// Course categories
export const COURSE_CATEGORIES = {
  TECHNOLOGY: ['BSIT', 'BSCS'],
  TOURISM: ['BST', 'BSHRM'],
  HEALTHCARE: ['BSN'],
} as const
