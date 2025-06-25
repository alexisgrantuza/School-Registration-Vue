import { ElMessage } from 'element-plus'
import type { Student } from '@/types/student'

export const validateStringOnly = (rule: any, value: string, callback: any) => {
  if (value.match(/^[a-zA-Z]+$/)) {
    callback()
  } else {
    callback(new Error(`${rule.field} cannot contain numbers`))
    return
  }

  if (/[0-9]/.test(value)) {
    callback(new Error(`${rule.field} cannot contain numbers`))
    return
  }

  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value)) {
    callback(new Error(`${rule.field} cannot contain special characters`))
    return
  }
}

export const preventNumbersInput = (event: KeyboardEvent) => {
  if (/[0-9]/.test(event.key)) {
    event.preventDefault()
    ElMessage.error('Numbers are not allowed')
  }
}

export const filterStringInput = (
  fieldName: keyof Student,
  value: string,
  studentForm: Student,
) => {
  const filteredValue = value.replace(/[0-9]/g, '')

  studentForm[fieldName] = filteredValue as never

  if (value !== filteredValue) {
    ElMessage.warning('Numbers have been removed from the input')
  }
}
