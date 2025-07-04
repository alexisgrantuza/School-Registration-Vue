<template>
  <el-drawer
    v-model="visible"
    :title="`Edit Student: ${getFullName(studentForm)}`"
    width="600px"
    direction="rtl"
    :close-on-click-modal="true"
    :close-on-press-escape="true"
    :before-close="handleClose"
  >
    <el-form
      ref="studentFormRef"
      :model="studentForm"
      :rules="formRules"
      label-width="140px"
      label-position="top"
    >
      <!-- First Name -->
      <el-form-item label="First Name" prop="firstName">
        <el-input
          v-model="studentForm.firstName"
          placeholder="Enter first name"
          @input="filterInput('firstName', $event, studentForm)"
          @keydown="preventNumbersInput"
        />
      </el-form-item>

      <!-- Middle Name -->
      <el-form-item label="Middle Name" prop="middleName">
        <el-input
          v-model="studentForm.middleName"
          placeholder="M.I."
          maxlength="3"
          @input="filterInput('middleName', $event, studentForm)"
          @keydown="preventNumbersInput"
        />
      </el-form-item>

      <!-- Last Name -->
      <el-form-item label="Last Name" prop="lastName">
        <el-input
          v-model="studentForm.lastName"
          placeholder="Enter last name"
          @input="filterInput('lastName', $event, studentForm)"
          @keydown="preventNumbersInput"
        />
      </el-form-item>

      <!-- Birth Date -->
      <el-form-item label="Birth Date" prop="birthDate">
        <el-date-picker
          v-model="studentForm.birthDate"
          type="date"
          placeholder="Select birth date"
          style="width: 100%"
          :disabled-date="disabledDate"
        />
      </el-form-item>

      <!-- Age -->
      <el-form-item label="Age" prop="age">
        <el-input v-model="studentForm.age" placeholder="Age will be calculated" readonly />
      </el-form-item>

      <!-- Address -->
      <el-form-item label="Address" prop="address">
        <el-input
          v-model="studentForm.address"
          type="textarea"
          :rows="3"
          placeholder="Enter complete address"
        />
      </el-form-item>

      <!-- Course -->
      <el-form-item label="Course" prop="course">
        <el-select
          v-model="studentForm.course"
          placeholder="Select a course"
          style="width: 100%"
          fit-input-width="true"
        >
          <el-option
            v-for="course in courses"
            :key="course.value"
            :label="course.label"
            :value="course.value"
          />
        </el-select>
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">Cancel</el-button>
        <el-button type="primary" @click="submitForm" :loading="submitting">
          Update Student
        </el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import type { Student } from '@/types/student'
import {
  filterInput,
  preventNumbersInput,
  validateStringOnly,
  validateAddress,
  validateAge,
} from '@/composables/useValidation'
import { useStudentStore } from '@/stores/student'
import { COURSES } from '@/constants/courses'
import { studentUtils } from '@/composables/useStudentUtils'

// Props and Emits
const props = defineProps<{
  modelValue: boolean
  student: Student | null
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'student-updated': [student: Student]
}>()

// Store
const studentStore = useStudentStore()
const { getFullName } = studentUtils()

// Reactive data
const visible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const studentFormRef = ref<FormInstance>()
const submitting = ref(false)

// Convert courses object to array format for select
const courses = Object.entries(COURSES).map(([value, label]) => ({ value, label }))

// Form data
const studentForm = reactive<Student>({
  _id: 0,
  firstName: '',
  middleName: '',
  lastName: '',
  birthDate: '',
  age: '',
  address: '',
  course: '',
})

// Form validation rules
const formRules: FormRules<Student> = {
  firstName: [
    { required: true, message: 'First name is required', trigger: 'blur' },
    { validator: validateStringOnly, trigger: 'blur' },
    { min: 2, max: 50, message: 'First name must be between 2 and 50 characters', trigger: 'blur' },
  ],
  lastName: [
    { required: true, message: 'Last name is required', trigger: 'blur' },
    { validator: validateStringOnly, trigger: 'blur' },
    { min: 2, max: 50, message: 'Last name must be between 2 and 50 characters', trigger: 'blur' },
  ],
  middleName: [
    { validator: validateStringOnly, trigger: 'blur' },
    {
      min: 3,
      max: 50,
      message: 'Middle name must be between 3 and 50 characters',
      trigger: 'blur',
    },
  ],
  birthDate: [{ required: true, message: 'Birth date is required', trigger: 'change' }],
  age: [
    { required: true, message: 'Age is required', trigger: 'blur' },
    {
      validator: validateAge,
      trigger: 'blur',
    },
  ],
  address: [
    { required: true, message: 'Address is required', trigger: 'blur' },
    {
      min: 10,
      max: 200,
      validator: validateAddress,
      message: 'Address must be between 10 and 200 characters',
      trigger: 'blur',
    },
  ],
  course: [{ required: true, message: 'Course selection is required', trigger: 'change' }],
}

// Auto-calculate age when birthDate changes
watch(
  () => studentForm.birthDate,
  (newBirthDate) => {
    if (newBirthDate) {
      const birthDate = new Date(newBirthDate)
      const today = new Date()

      let age = today.getFullYear() - birthDate.getFullYear()
      const monthDiff = today.getMonth() - birthDate.getMonth()

      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age -= 1
      }

      studentForm.age = age.toString()
    } else {
      studentForm.age = ''
    }
  },
)

// Watch for student prop changes to populate form
watch(
  () => props.student,
  (newStudent) => {
    if (newStudent) {
      // Populate form with student data
      Object.assign(studentForm, { ...newStudent })
    }
  },
  { immediate: true, deep: true },
)

watch(
  () => visible.value,
  (isVisible) => {
    if (isVisible && props.student) {
      Object.assign(studentForm, { ...props.student })
    }
  },
)

// Methods
const disabledDate = (time: Date) => {
  const now = new Date()
  const hundredYearsAgo = new Date()
  hundredYearsAgo.setFullYear(now.getFullYear() - 100)

  return time.getTime() > now.getTime() || time.getTime() < hundredYearsAgo.getTime()
}

const submitForm = async () => {
  if (!studentFormRef.value) return

  try {
    await studentFormRef.value.validate()
    submitting.value = true

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Update student in store
    await studentStore.updateStudent(studentForm)

    ElMessage.success('Student updated successfully!')
    emit('student-updated', { ...studentForm })
    handleClose()
  } catch (error) {
    ElMessage.error('Please fix the form errors before submitting')
  } finally {
    submitting.value = false
  }
}

const handleClose = () => {
  // Reset form when closing
  if (studentFormRef.value) {
    studentFormRef.value.resetFields()
  }

  // Clear form data
  Object.assign(studentForm, {})

  visible.value = false
}
</script>

<style scoped>
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

:deep(.el-dialog__body) {
  padding: 20px 24px;
}

:deep(.el-form-item) {
  margin-bottom: 20px;
}

:deep(.el-form-item__label) {
  font-weight: 600;
  color: #2c3e50;
}

:deep(.el-input__wrapper) {
  border-radius: 8px;
}

:deep(.el-textarea__inner) {
  border-radius: 8px;
}

:deep(.el-select) {
  width: 100%;
}

:deep(.el-date-editor) {
  width: 100%;
}
</style>
