import { ElMessage } from 'element-plus'
import type { Student } from '@/types/student'

export const validateStringOnly = (rule: any, value: string, callback: any) => {
  // Allow empty values for optional fields
  if (!value || value.trim() === '') {
    callback()
    return
  }

  // Allow letters and spaces, but require at least one letter
  if (value.match(/^[a-zA-Z\s]+$/) && value.match(/[a-zA-Z]/)) {
    callback()
  } else {
    if (/[0-9]/.test(value)) {
      callback(new Error(`${rule.field} cannot contain numbers`))
      return
    }

    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value)) {
      callback(new Error(`${rule.field} cannot contain special characters`))
      return
    }

    if (!value.match(/[a-zA-Z]/)) {
      callback(new Error(`${rule.field} must contain at least one letter`))
      return
    }
  }
}

export const preventNumbersInput = (event: KeyboardEvent) => {
  if (/[0-9]/.test(event.key)) {
    event.preventDefault()
    ElMessage.error('Numbers are not allowed')
  }
}

export const filterInput = (fieldName: keyof Student, value: string, studentForm: Student) => {
  // Allow letters and spaces, remove numbers
  const filteredValue = value.replace(/[0-9\s]/g, '')

  studentForm[fieldName] = filteredValue as never

  if (value !== filteredValue) {
    ElMessage.warning('Numbers/Spaces have been removed from the input')
  }
}

export const validateAge = (rule: any, value: string, callback: any) => {
  const age = parseInt(value)
  if (age < 16) {
    callback(new Error('Student must be at least 16 years old'))
  } else if (age > 65) {
    callback(new Error('Student age cannot exceed 65 years'))
  } else {
    callback()
  }
}

export const validatePassword = (rule: any, value: string, callback: any) => {
  if (value.length < 8) {
    callback(new Error('Password must be at least 8 characters long'))
  }

  if (!/[A-Z]/.test(value)) {
    callback(new Error('Password must contain at least one uppercase letter'))
  }

  if (!/[a-z]/.test(value)) {
    callback(new Error('Password must contain at least one lowercase letter'))
  }

  if (!/[0-9]/.test(value)) {
    callback(new Error('Password must contain at least one number'))
  }

  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value)) {
    callback(new Error('Password must contain at least one special character'))
  }

  callback()
}
