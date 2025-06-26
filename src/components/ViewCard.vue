<template>
  <transition-group name="card" tag="div" class="grid-container" appear>
    <div
      v-for="student in paginatedStudents"
      :key="`${student._id}-${currentPage}`"
      class="student-card"
    >
      <el-card class="card-content">
        <!-- Card Header -->
        <template #header>
          <div class="card-header">
            <div class="student-avatar">
              <el-avatar :size="50" class="avatar">
                {{ getInitials(student.firstName, student.lastName) }}
              </el-avatar>
            </div>
            <div class="student-basic-info">
              <h3 class="student-name">
                {{ getFullName(student) }}
              </h3>
            </div>
            <div class="card-actions">
              <el-dropdown trigger="click">
                <el-button type="text" :icon="MoreFilled" circle />
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="viewStudent(student)">
                      <el-icon><View /></el-icon>
                      View Details
                    </el-dropdown-item>
                    <el-dropdown-item @click="editStudent(student)">
                      <el-icon><Edit /></el-icon>
                      Edit
                    </el-dropdown-item>
                    <el-dropdown-item @click="deleteStudent(student)" divided>
                      <el-icon><Delete /></el-icon>
                      Delete
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </div>
        </template>

        <!-- Card Body -->
        <div class="card-body">
          <div class="info-grid">
            <div class="info-item">
              <el-icon class="info-icon"><Calendar /></el-icon>
              <div class="info-content">
                <span class="info-label">Age</span>
                <span class="info-value">{{ student.age }} years old</span>
              </div>
            </div>

            <div class="info-item">
              <el-icon class="info-icon"><School /></el-icon>
              <div class="info-content">
                <span class="info-label">Course</span>
                <span class="info-value">{{ student.course }}</span>
              </div>
            </div>

            <div class="info-item">
              <el-icon class="info-icon"><Location /></el-icon>
              <div class="info-content">
                <span class="info-label">Address</span>
                <span class="info-value">{{ truncateText(student.address, 40) }}</span>
              </div>
            </div>

            <div class="info-item">
              <el-icon class="info-icon"><Calendar /></el-icon>
              <div class="info-content">
                <span class="info-label">Birth Date</span>
                <span class="info-value">{{ formatDate(student.birthDate) }}</span>
              </div>
            </div>
          </div>
        </div>
      </el-card>
    </div>
  </transition-group>
  <EditDrawer
    v-model="showEditModal"
    :student="selectedStudent"
    @student-updated="handleStudentUpdated"
  />
</template>

<script setup lang="ts">
import { useActions } from '@/composables/actions'
import { studentUtils } from '@/composables/studentUtils'
import { MoreFilled, View, Edit, Delete, Calendar, School, Location } from '@element-plus/icons-vue'
import type { Student } from '@/types/student'
import EditDrawer from './EditDrawer.vue'

const {
  viewStudent,
  editStudent,
  deleteStudent,
  showEditModal,
  selectedStudent,
  handleStudentUpdated,
} = useActions()
const { getFullName, getInitials, formatDate, truncateText } = studentUtils()

const props = defineProps<{
  paginatedStudents: Student[]
  currentPage: number
}>()
</script>

<style scoped>
.students-grid {
  margin-bottom: 2rem;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 1.5rem;
}

.card-content {
  height: 100%;
  border-radius: 12px;
  border: 1px solid #e4e7ed;
  overflow: hidden;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0;
}

.student-avatar {
  flex-shrink: 0;
}

.avatar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-weight: 600;
}

.student-basic-info {
  flex: 1;
}

.student-name {
  margin: 0 0 0.25rem 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #2c3e50;
}

.student-id {
  margin: 0;
  font-size: 0.875rem;
  color: #909399;
}

.card-actions {
  flex-shrink: 0;
}

.card-body {
  padding: 0;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.info-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.info-icon {
  font-size: 1.25rem;
  color: #409eff;
  margin-top: 0.125rem;
  flex-shrink: 0;
}

.info-content {
  flex: 1;
  min-width: 0;
}

.info-label {
  display: block;
  font-size: 0.75rem;
  color: #909399;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 0.25rem;
}

.info-value {
  display: block;
  font-size: 0.875rem;
  color: #2c3e50;
  font-weight: 500;
  word-break: break-word;
}

.card-footer {
  display: flex;
  gap: 0.75rem;
  padding: 0;
}

.card-footer .el-button {
  flex: 1;
}

/* Enhanced Animations */
.card-enter-active {
  transition: all 0.6s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.card-leave-active {
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.card-enter-from {
  opacity: 0;
  transform: translateY(30px) scale(0.95);
}

.card-leave-to {
  opacity: 0;
  transform: translateY(-20px) scale(0.95);
}

.card-move {
  transition: transform 0.5s cubic-bezier(0.25, 0.8, 0.25, 1);
}

/* Staggered animation effect */
.card-enter-active:nth-child(1) {
  transition-delay: 0ms;
}
.card-enter-active:nth-child(2) {
  transition-delay: 50ms;
}
.card-enter-active:nth-child(3) {
  transition-delay: 100ms;
}
.card-enter-active:nth-child(4) {
  transition-delay: 150ms;
}
.card-enter-active:nth-child(5) {
  transition-delay: 200ms;
}
.card-enter-active:nth-child(6) {
  transition-delay: 250ms;
}
.card-enter-active:nth-child(7) {
  transition-delay: 300ms;
}
.card-enter-active:nth-child(8) {
  transition-delay: 350ms;
}
.card-enter-active:nth-child(9) {
  transition-delay: 400ms;
}
.card-enter-active:nth-child(10) {
  transition-delay: 450ms;
}
.card-enter-active:nth-child(11) {
  transition-delay: 500ms;
}
.card-enter-active:nth-child(12) {
  transition-delay: 550ms;
}

@media (max-width: 480px) {
  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .card-actions {
    align-self: flex-end;
    width: 100%;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
