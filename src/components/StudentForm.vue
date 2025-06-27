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
        @input="filterStringInput('firstName', $event, studentForm)"
        @keydown="preventNumbersInput"
      />
    </el-form-item>

    <!-- Middle Initial -->
    <el-form-item label="Middle Initial" prop="middleInitial">
      <el-input
        v-model="studentForm.middleInitial"
        placeholder="M.I."
        maxlength="3"
        @input="filterStringInput('middleInitial', $event, studentForm)"
        @keydown="preventNumbersInput"
      />
    </el-form-item>

    <!-- Last Name -->
    <el-form-item label="Last Name" prop="lastName">
      <el-input
        v-model="studentForm.lastName"
        placeholder="Enter last name"
        @input="filterStringInput('lastName', $event, studentForm)"
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
      <el-select v-model="studentForm.course" placeholder="Select a course" style="width: 100%">
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
  filterStringInput,
  preventNumbersInput,
  validateStringOnly,
  validateAge,
} from '@/composables/validation'
import { useStudentStore } from '@/stores/student'
import { COURSES } from '@/constants/courses'

const studentStore = useStudentStore()

const emit = defineEmits(['student-registered', 'cancel-registration'])

const courses = Object.entries(COURSES).map(([value, label]) => ({ value, label }))

const studentFormRef = ref<FormInstance>()
const submitting = ref(false)

const studentForm = reactive<Student>({
  _id: 0,
  avatar: '',
  firstName: '',
  middleInitial: '',
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
  middleInitial: [
    { validator: validateStringOnly, trigger: 'blur' },
    { max: 3, message: 'Middle initial should be only 3 characters', trigger: 'blur' },
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
      message: 'Address must be between 10 and 200 characters',
      trigger: 'blur',
    },
  ],
  course: [{ required: true, message: 'Course selection is required', trigger: 'change' }],
}

// Full Name
const fullName = computed(() => {
  return `${studentForm.firstName} ${studentForm.middleInitial ? studentForm.middleInitial + '. ' : ''}${studentForm.lastName}`
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

const submitForm = async () => {
  if (!studentFormRef.value) return

  try {
    await studentFormRef.value.validate()
    submitting.value = true

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
  if (studentFormRef.value) {
    studentFormRef.value.resetFields()
  }
}

const cancelRegistration = () => {
  emit('cancel-registration')
}
</script>
