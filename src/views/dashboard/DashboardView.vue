<template>
  <NavHeader :searchQuery="searchQuery" @searchQuery="handleSearchQuery" />
  <div class="dashboard">
    <div class="dashboard-content">
      <div class="dashboard-actions">
        <el-button type="primary" :icon="Plus" size="large" @click="openStudentDrawer">
          Register New Student
        </el-button>
        <el-button
          type="primary"
          :icon="Plus"
          size="large"
          @click="addStudent"
          :autoFocus="false"
          :loading="isAdding"
          :disabled="isAdding"
          >5
        </el-button>
      </div>

      <!-- Student Registration Drawer -->
      <el-drawer
        v-model="drawerVisible"
        title="Student Registration"
        :size="500"
        direction="rtl"
        :before-close="handleDrawerClose"
        default
      >
        <div class="registration-form">
          <StudentForm
            ref="studentFormRef"
            :courses="courses"
            @student-registered="handleStudentRegistered"
            @cancel-registration="handleCancelRegistration"
          />
        </div>
      </el-drawer>

      <StudentListCard
        :searchQuery="searchQuery"
        @openRegistration="openStudentDrawer"
        @searchQuery="handleSearchQuery"
        @viewStudent="openViewModal"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import NavHeader from '@/components/layout/NavHeader.vue'
import StudentForm from '@/components/forms/StudentForm.vue'
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import StudentListCard from '@/components/layout/StudentListCard.vue'
import { generateFakeStudents } from '@/lib/seeder'
import type { Student } from '@/types/student'
import { useStudentStore } from '@/stores/student'

const studentStore = useStudentStore()
const studentFormRef = ref()

const isAdding = ref(false)

const addStudent = async () => {
  if (isAdding.value) return
  isAdding.value = true
  try {
    await studentStore.fetchStudents()
    const existingStudents = studentStore.getStudents

    const uniqueFakeStudents = []
    let attempts = 0
    while (uniqueFakeStudents.length < 5 && attempts < 50) {
      const [fakeStudent] = generateFakeStudents(5, false)
      const isDuplicate = existingStudents
        .concat(uniqueFakeStudents)
        .some(
          (s) =>
            s.firstName.trim().toLowerCase() === fakeStudent.firstName.trim().toLowerCase() &&
            (s.middleName?.trim().toLowerCase() ?? '') ===
              (fakeStudent.middleName?.trim().toLowerCase() ?? '') &&
            s.lastName.trim().toLowerCase() === fakeStudent.lastName.trim().toLowerCase(),
        )
      if (!isDuplicate) {
        uniqueFakeStudents.push(fakeStudent)
      }
      attempts++
    }

    for (const student of uniqueFakeStudents) {
      await studentStore.createStudent(student)
    }
  } finally {
    isAdding.value = false
  }
}

const drawerVisible = ref(false)
const searchQuery = ref('')
const viewModalVisible = ref(false)

const courses = [
  { value: 'BSIT', label: 'Bachelor of Science in Information Technology' },
  { value: 'BSCS', label: 'Bachelor of Science in Computer Science' },
  { value: 'BST', label: 'Bachelor of Science in Tourism' },
  { value: 'BSHRM', label: 'Bachelor of Science in Hotel and Restaurant Management' },
  { value: 'BSN', label: 'Bachelor of Science in Nursing' },
]

const openStudentDrawer = () => {
  drawerVisible.value = true
}

const handleDrawerClose = (done: () => void) => {
  ElMessageBox.confirm(
    'You have unsaved changes. Are you sure you want to close?',
    'Confirm Close',
    {
      confirmButtonText: 'Yes, Close',
      cancelButtonText: 'Cancel',
      type: 'warning',
    },
  )
    .then(() => {
      studentFormRef.value?.resetForm()
      done()
    })
    .catch(() => {})
}

const handleStudentRegistered = (studentData: Student) => {
  ElMessage.success(`Student registered: ${studentData.firstName} ${studentData.lastName}`)
  drawerVisible.value = false
}

const handleCancelRegistration = () => {
  drawerVisible.value = false
}

const handleSearchQuery = (query: string) => {
  searchQuery.value = query
}

const openViewModal = (student: Student) => {
  viewModalVisible.value = true
}
</script>

<style scoped>
.dashboard {
  min-height: 100vh;
  background: white;
  padding: 2rem;
}

.dashboard-content {
  max-width: 1200px;
  margin: 0 auto;
}

.dashboard h1 {
  color: white;
  text-align: center;
  font-size: 2.5rem;
  font-weight: 600;
  margin-bottom: 2rem;
}

.dashboard-actions {
  display: flex;
  justify-content: end;
  margin-bottom: 2rem;
}

.registration-form {
  padding: 0 1rem;
}

.form-actions {
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #ebeef5;
}

.form-actions .el-button {
  margin-right: 1rem;
  margin-bottom: 0.5rem;
}

/* Drawer content styling */
:deep(.el-drawer__header) {
  background: #f8f9fa;
  padding: 1.5rem;
  margin-bottom: 0;
  border-bottom: 1px solid #ebeef5;
}

:deep(.el-drawer__title) {
  font-size: 1.25rem;
  font-weight: 600;
  color: #303133;
}

:deep(.el-drawer__body) {
  padding: 1.5rem;
}

/* Form styling improvements */
:deep(.el-form-item__label) {
  font-weight: 600;
  color: #606266;
}

:deep(.el-input__wrapper) {
  border-radius: 6px;
}

:deep(.el-select .el-input__wrapper) {
  border-radius: 6px;
}

:deep(.el-textarea__inner) {
  border-radius: 6px;
}

/* Responsive design */
@media (max-width: 768px) {
  .dashboard {
    padding: 1rem;
  }

  .dashboard h1 {
    font-size: 2rem;
  }

  :deep(.el-drawer) {
    width: 100% !important;
  }
}
</style>
