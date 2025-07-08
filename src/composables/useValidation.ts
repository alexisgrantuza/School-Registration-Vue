import { ElMessage } from 'element-plus'
import type { Student } from '@/types/student'
import { VALIDATION_CONSTANTS } from '@/constants/validation'

// Enhanced string validation with better error messages
export const validateStringOnly = (rule: any, value: string, callback: any) => {
  // Allow empty values for optional fields
  if (!value || value.trim() === '') {
    callback()
    return
  }

  const trimmedValue = value.trim()
  const fieldName = rule.field || 'Field'

  // Check for minimum length requirement
  if (trimmedValue.length < VALIDATION_CONSTANTS.NAME.MIN_LENGTH) {
    callback(
      new Error(
        `${fieldName} must be at least ${VALIDATION_CONSTANTS.NAME.MIN_LENGTH} characters long`,
      ),
    )
    return
  }

  // Check for numbers
  if (/\d/.test(trimmedValue)) {
    callback(new Error(`${fieldName} cannot contain numbers`))
    return
  }

  // Check for special characters (allow hyphens and apostrophes for names like O'Connor or Mary-Jane)
  const allowedSpecialChars = /^[\p{L}\s'-]+$/u
  if (!allowedSpecialChars.test(trimmedValue)) {
    callback(new Error(`${fieldName} can only contain letters, spaces, hyphens, and apostrophes`))
    return
  }

  // Ensure at least one letter exists
  if (!/[a-zA-Z]/.test(trimmedValue)) {
    callback(new Error(`${fieldName} must contain at least one letter`))
    return
  }

  // Check for excessive spaces
  if (/\s{2,}/.test(trimmedValue)) {
    callback(new Error(`${fieldName} cannot contain multiple consecutive spaces`))
    return
  }

  // Check for leading/trailing spaces in original value
  if (value !== trimmedValue) {
    callback(new Error(`${fieldName} cannot start or end with spaces`))
    return
  }

  callback()
}

// Enhanced input prevention with better UX
export const preventNumbersInput = (event: KeyboardEvent) => {
  const isNumber = /\d/.test(event.key)

  if (isNumber) {
    event.preventDefault()
    // Show message only once every 2 seconds to avoid spam
    const now = Date.now()
    const lastMessageTime = (window as any).lastNumberWarning || 0

    if (now - lastMessageTime > 2000) {
      ElMessage.warning('Numbers are not allowed in name fields')
      ;(window as any).lastNumberWarning = now
    }
  }
}

// Enhanced input filtering with better feedback
export const filterInput = (fieldName: keyof Student, value: string, studentForm: Student) => {
  if (!value) {
    studentForm[fieldName] = '' as never
    return
  }

  // Remove numbers and excessive spaces
  let filteredValue = value
    .replace(/\d/g, '') // Remove numbers
    .replace(/\s{2,}/g, ' ') // Replace multiple spaces with single space

  // Track what was removed for user feedback
  const removedNumbers = /\d/.test(value)
  const hadExcessiveSpaces = /\s{2,}/.test(value)

  studentForm[fieldName] = filteredValue as never

  // Provide specific feedback about what was filtered
  if (removedNumbers && hadExcessiveSpaces) {
    ElMessage.warning('Numbers and excessive spaces have been removed')
  } else if (removedNumbers) {
    ElMessage.warning('Numbers have been removed from the input')
  } else if (hadExcessiveSpaces) {
    ElMessage.warning('Excessive spaces have been reduced')
  }
}

export const excessiveSpaceRegex = (value: string, studentForm: Student) => {
  let filteredValue = value.replace(/\s{2,}/g, ' ') // Replace multiple spaces with single space

  const hadExcessiveSpaces = /\s{2,}/.test(value)
  if (hadExcessiveSpaces) {
    ElMessage.warning('Excessive spaces have been reduced')
  }
  studentForm.address = filteredValue as never
}

// Enhanced age validation with better error messages
export const validateAge = (rule: any, value: string, callback: any) => {
  if (!value || value.trim() === '') {
    callback(new Error('Age is required'))
    return
  }

  const age = parseInt(value, 10)

  // Check if it's a valid number
  if (isNaN(age) || !Number.isInteger(age)) {
    callback(new Error('Age must be a valid whole number'))
    return
  }

  // Check age range
  if (age < VALIDATION_CONSTANTS.AGE.MIN) {
    callback(new Error(`Student must be at least ${VALIDATION_CONSTANTS.AGE.MIN} years old`))
    return
  }

  if (age > VALIDATION_CONSTANTS.AGE.MAX) {
    callback(new Error(`Student age cannot exceed ${VALIDATION_CONSTANTS.AGE.MAX} years`))
    return
  }

  callback()
}

// Enhanced password validation with comprehensive checks
export const validatePassword = (rule: any, value: string, callback: any) => {
  if (!value) {
    callback(new Error('Password is required'))
    return
  }

  const errors: string[] = []

  // Length check
  if (value.length < VALIDATION_CONSTANTS.PASSWORD.MIN_LENGTH) {
    errors.push(`at least ${VALIDATION_CONSTANTS.PASSWORD.MIN_LENGTH} characters long`)
  }

  // Character type checks
  if (!/[A-Z]/.test(value)) {
    errors.push('one uppercase letter')
  }

  if (!/[a-z]/.test(value)) {
    errors.push('one lowercase letter')
  }

  if (!/\d/.test(value)) {
    errors.push('one number')
  }

  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value)) {
    errors.push('one special character')
  }

  // Check for common weak patterns
  if (/(.)\1{2,}/.test(value)) {
    errors.push('no more than 2 consecutive identical characters')
  }

  if (/^[0-9]+$/.test(value)) {
    errors.push('not only numbers')
  }

  if (/^[a-zA-Z]+$/.test(value)) {
    errors.push('not only letters')
  }

  if (errors.length > 0) {
    const errorMessage =
      errors.length === 1
        ? `Password must contain ${errors[0]}`
        : `Password must contain: ${errors.join(', ')}`
    callback(new Error(errorMessage))
    return
  }

  callback()
}

// New validation for addresses with minimum requirements
export const validateAddress = (rule: any, value: string, callback: any) => {
  if (!value || value.trim() === '') {
    callback(new Error('Address is required'))
    return
  }

  const trimmedValue = value.trim()

  if (trimmedValue.length < 10) {
    callback(new Error('Address must be at least 10 characters long'))
    return
  }

  if (trimmedValue.length > 200) {
    callback(new Error('Address cannot exceed 200 characters'))
    return
  }

  // Check if address contains some meaningful content (not just spaces and punctuation)
  if (!/[a-zA-Z0-9]/.test(trimmedValue)) {
    callback(new Error('Address must contain letters or numbers'))
    return
  }

  if (!/^[\p{L}\d\s.,'\\/#-]+$/u.test(trimmedValue)) {
    callback(
      new Error(
        `Address can only contain letters, numbers, spaces, and common punctuation (.,'\\/#-)`,
      ),
    )
    return
  }

  const hadExcessiveSpaces = /\s{2,}/.test(value)

  // Provide specific feedback about what was filtered
  if (hadExcessiveSpaces) {
    ElMessage.warning('Numbers and excessive spaces have been removed')
  } else if (hadExcessiveSpaces) {
    ElMessage.warning('Excessive spaces have been reduced')
  }

  callback()
}

// Utility function to format phone numbers
export const formatPhoneNumber = (value: string): string => {
  const digitsOnly = value.replace(/\D/g, '')

  if (digitsOnly.length === 10) {
    return digitsOnly.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3')
  } else if (digitsOnly.length === 11) {
    return digitsOnly.replace(/(\d{1})(\d{3})(\d{3})(\d{4})/, '$1-($2) $3-$4')
  }

  return value
}

// Utility function to capitalize names properly
export const formatName = (value: string): string => {
  return value
    .trim()
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}
