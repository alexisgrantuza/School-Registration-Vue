<template>
  <el-form
    ref="studentFormRef"
    :model="studentForm"
    :rules="formRules"
    label-width="140px"
    label-position="top"
    @submit.prevent="submitForm"
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
        placeholder="Enter middle name (optional)"
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
        @input="filterInput('address', $event, studentForm)"
      />
    </el-form-item>

    <!-- Course -->
    <el-form-item label="Course" prop="course">
      <el-select v-model="studentForm.course" placeholder="Select a course" fit-input-width="true">
        <el-option
          v-for="course in courses"
          :key="course.value"
          :label="course.label"
          :value="course.value"
        />
      </el-select>
    </el-form-item>

    <!-- Form Actions -->
    <el-form-item class="form-actions">
      <el-button type="primary" @click="submitForm" :loading="submitting">
        Register Student
      </el-button>
      <el-button @click="resetForm">Reset Form</el-button>
      <el-button @click="cancelRegistration">Cancel</el-button>
    </el-form-item>
  </el-form>
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
  validateAge,
  validateAddress,
} from '@/composables/useValidation'
import { useStudentStore } from '@/stores/student'
import { COURSES } from '@/constants/courses'
import { studentUtils } from '@/composables/useStudentUtils'

const studentStore = useStudentStore()

const emit = defineEmits(['student-registered', 'cancel-registration'])

const courses = Object.entries(COURSES).map(([value, label]) => ({ value, label }))

const studentFormRef = ref<FormInstance>()
const submitting = ref(false)

const studentForm = reactive<Student>({
  _id: 0,
  avatar: '',
  firstName: '',
  middleName: '',
  lastName: '',
  birthDate: '',
  age: '',
  address: '',
  course: '',
})

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
      min: 1,
      max: 50,
      message: 'Middle name must be between 1 and 50 characters',
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
    { validator: validateAddress, trigger: 'blur' },
    {
      min: 10,
      max: 200,
      message: 'Address must be between 10 and 200 characters',
      trigger: 'blur',
    },
  ],
  course: [{ required: true, message: 'Course selection is required', trigger: 'change' }],
}

// Full Name
const fullName = computed(() => {
  return `${studentForm.firstName} ${studentUtils().getInitials(studentForm.firstName, studentForm.lastName)}`
})

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
      studentForm.birthDate = formatDate(newBirthDate)
    } else {
      studentForm.age = ''
    }
  },
)

const disabledDate = (time: Date) => {
  const now = new Date()
  const hundredYearsAgo = new Date()
  hundredYearsAgo.setFullYear(now.getFullYear() - 100)

  return time.getTime() > now.getTime() || time.getTime() < hundredYearsAgo.getTime()
}

const formatDate = (dateInput: string | Date): string => {
  return studentUtils().formatDate(dateInput as string)
}

const submitForm = async () => {
  if (!studentFormRef.value) return

  try {
    await studentFormRef.value.validate()
    submitting.value = true

    const duplicate = studentStore.getStudents.some(
      (student) =>
        student.firstName.trim().toLowerCase() === studentForm.firstName.trim().toLowerCase() &&
        (student.middleName?.trim().toLowerCase() ?? '') ===
          (studentForm.middleName?.trim().toLowerCase() ?? '') &&
        student.lastName.trim().toLowerCase() === studentForm.lastName.trim().toLowerCase(),
    )

    if (duplicate) {
      ElMessage.error('The student data already exists!')
      submitting.value = false
      return
    }

    await new Promise((resolve) => setTimeout(resolve, 1000))

    ElMessage.success('Student registered successfully!')
    emit('student-registered', { ...studentForm, fullName: fullName.value })

    await studentStore.createStudent(studentForm)

    resetForm()
  } catch (error) {
    ElMessage.error('Please fix the form errors before submitting')
  } finally {
    submitting.value = false
  }
}

const resetForm = () => {
  studentFormRef.value?.resetFields()
}

defineExpose({ resetForm })

const cancelRegistration = () => {
  emit('cancel-registration')
}
</script>
