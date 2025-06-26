<template>
  <div class="students-container">
    <!-- Header Section -->
    <div class="students-header">
      <div class="header-content">
        <h2 class="students-title">
          <el-icon class="title-icon"><UserFilled /></el-icon>
          Registered Students
        </h2>
        <div class="students-count">
          <el-tag type="primary" size="large" round>
            {{ students.length }} Student{{ students.length !== 1 ? 's' : '' }}
          </el-tag>
          <div class="view-buttons-segmented">
            <el-button :class="{ active: viewMode === 'list' }" @click="toggleView('list')">
              <el-icon><List /></el-icon>
            </el-button>
            <el-button :class="{ active: viewMode === 'grid' }" @click="toggleView('grid')">
              <el-icon><Grid /></el-icon>
            </el-button>
          </div>
        </div>
      </div>

      <!-- Search and Filter Bar -->
      <div class="filter-bar">
        <el-input
          v-model="searchQuery"
          placeholder="Search students by name or course..."
          :prefix-icon="Search"
          size="large"
          clearable
          class="search-input"
        />
        <el-select
          v-model="courseFilter"
          placeholder="Filter by course"
          clearable
          size="large"
          class="course-filter"
        >
          <el-option label="All Courses" value="" />
          <el-option
            v-for="course in availableCourses"
            :key="course"
            :label="course"
            :value="course"
          />
        </el-select>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <el-skeleton :rows="3" animated />
    </div>

    <!-- Empty State -->
    <div
      v-else-if="filteredStudentsAll.length === 0 && !searchQuery && !courseFilter"
      class="empty-state"
    >
      <el-empty description="No students registered yet">
        <el-button type="primary" :icon="Plus" size="large" @click="openRegistration">
          Register New Student
        </el-button>
      </el-empty>
    </div>

    <!-- No Results State -->
    <div v-else-if="filteredStudentsAll.length === 0" class="empty-state">
      <el-empty description="No students match your search criteria">
        <el-button @click="clearFilters">Clear Filters</el-button>
      </el-empty>
    </div>

    <!-- Students Grid -->
    <div v-else class="students-grid">
      <transition-group
        v-if="viewMode === 'grid'"
        name="card"
        tag="div"
        class="grid-container"
        appear
      >
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
      <transition-group v-else name="list" tag="div" class="list-container" appear>
        <el-table :data="paginatedStudents">
          <el-table-column prop="firstName" label="First Name" />
          <el-table-column prop="lastName" label="Last Name" />
          <el-table-column prop="course" label="Course" />
          <el-table-column prop="address" label="Address" />
          <el-table-column prop="birthDate" label="Birth Date" />
          <el-table-column prop="age" label="Age" />
          <el-table-column prop="actions" label="Actions" width="100">
            <template #default="scope">
              <el-button type="text" @click="viewStudent(scope.row)">
                <el-icon><View /></el-icon>
              </el-button>
              <el-button type="text" @click="editStudent(scope.row)">
                <el-icon><Edit /></el-icon>
              </el-button>
              <el-button type="text" @click="deleteStudent(scope.row)">
                <el-icon><Delete /></el-icon>
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </transition-group>
    </div>

    <!-- Pagination -->
    <div v-if="filteredStudentsAll.length > 0" class="pagination-container">
      <el-pagination
        v-model:current-page="currentPage"
        :page-size="pageSize"
        :total="filteredStudentsAll.length"
        layout="prev, pager, next, jumper, total"
        background
        @current-change="handlePageChange"
      />
    </div>

    <!-- Edit Modal -->
    <EditDrawer
      v-model="showEditModal"
      :student="selectedStudent"
      @student-updated="handleStudentUpdated"
    />

    <!-- View Modal -->
    <ViewModal v-model:visible="viewModalVisible" v-model:student="selectedStudent" />
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  UserFilled,
  Plus,
  MoreFilled,
  View,
  Edit,
  Delete,
  Calendar,
  School,
  Location,
  Search,
  List,
  Grid,
} from '@element-plus/icons-vue'
import { useStudentStore } from '@/stores/student'
import type { Student } from '@/types/student'
import EditDrawer from './EditDrawer.vue'
import ViewModal from './ViewModal.vue'

const props = defineProps<{
  searchQuery?: string
}>()

const emit = defineEmits(['openRegistration', 'editStudent', 'viewStudent', 'searchQuery'])

// Store
const studentStore = useStudentStore()

// Reactive data
const loading = ref(true)
const searchQuery = ref('')
const courseFilter = ref('')
const currentPage = ref(1)
const pageSize = ref(8)
const viewMode = ref<'list' | 'grid'>('list')

// Edit Modal state
const showEditModal = ref(false)
const selectedStudent = ref<Student | null>(null)
const viewModalVisible = ref(false)

// Computed properties
const students = computed(() => studentStore.getStudents)
console.log('Students kopal:', students.value)

// watch for search query and pass it to the other component
watch(
  () => props.searchQuery,
  (newValue) => {
    if (newValue !== undefined) {
      searchQuery.value = newValue
    }
  },
)

const availableCourses = computed(() => {
  const courses = students.value.map((student) => student.course)
  console.log('Courses:', courses)
  return [...new Set(courses)].sort()
})

// Separate computed for all filtered students (without pagination)
const filteredStudentsAll = computed(() => {
  console.log('Filtered students:', students.value)
  let filtered = students.value

  // search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(
      (student) =>
        student.firstName.toLowerCase().includes(query) ||
        student.lastName.toLowerCase().includes(query) ||
        student.course.toLowerCase().includes(query) ||
        getFullName(student).toLowerCase().includes(query),
    )
  }

  //  course filter
  if (courseFilter.value) {
    filtered = filtered.filter((student) => student.course === courseFilter.value)
  }

  return filtered
})

// Separate computed for paginated students
const paginatedStudents = computed(() => {
  const startIndex = (currentPage.value - 1) * pageSize.value
  const endIndex = startIndex + pageSize.value
  return filteredStudentsAll.value.slice(startIndex, endIndex)
})

const toggleView = (mode: 'list' | 'grid') => {
  viewMode.value = mode
  console.log('View mode:', viewMode.value)
}

// Methods
const getFullName = (student: Student): string => {
  const middleInitial = student.middleInitial ? `${student.middleInitial}.` : ''
  return `${student.firstName} ${middleInitial} ${student.lastName}`.trim()
}

const getInitials = (firstName: string, lastName: string): string => {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

const clearFilters = () => {
  searchQuery.value = ''
  courseFilter.value = ''
  currentPage.value = 1
}

const handlePageChange = (page: number) => {
  currentPage.value = page

  // Smooth scroll to top of grid
  nextTick(() => {
    const gridElement = document.querySelector('.students-grid')
    if (gridElement) {
      gridElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  })
}

const viewStudent = (student: Student) => {
  console.log('Viewing student:', student)
  selectedStudent.value = student
  viewModalVisible.value = true
}

const deleteStudent = async (student: Student) => {
  try {
    await ElMessageBox.confirm(
      `Are you sure you want to delete ${getFullName(student)}?`,
      'Confirm Delete',
      {
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        type: 'warning',
        confirmButtonClass: 'el-button--danger',
      },
    )

    await studentStore.deleteStudent(student._id!)
    ElMessage.success('Student deleted successfully')

    // Adjust current page if needed after deletion
    const totalPages = Math.ceil(filteredStudentsAll.value.length / pageSize.value)
    if (currentPage.value > totalPages && totalPages > 0) {
      currentPage.value = totalPages
    }
  } catch (error) {
    console.log('Delete cancelled')
  }
}

const editStudent = (student: Student) => {
  selectedStudent.value = student
  showEditModal.value = true
}

const handleStudentUpdated = (updatedStudent: Student) => {
  console.log('Student updated:', updatedStudent)
  // The store will automatically update the list
}

const openRegistration = () => {
  emit('openRegistration')
}

// Lifecycle
onMounted(async () => {
  try {
    await studentStore.fetchStudents()
  } catch (error) {
    console.error('Error loading students:', error)
    ElMessage.error('Failed to load students')
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.students-container {
  padding: 2rem;
  background: #f8f9fa;
  min-height: 100vh;
}

.students-header {
  margin-bottom: 2rem;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.students-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 0;
  font-size: 2rem;
  font-weight: 700;
  color: #2c3e50;
}

.title-icon {
  font-size: 2rem;
  color: #409eff;
}

/* Enhanced View Button Styles */
.students-count {
  display: flex;
  align-items: center;
  gap: 1rem;
}

/* View Toggle Buttons Container */
.view-toggle-buttons {
  display: flex;
  background: #ffffff;
  border-radius: 12px;
  padding: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border: 1px solid #e4e7ed;
}

/* Individual View Buttons */
.view-toggle-buttons .el-button {
  margin: 0 !important;
  border: none !important;
  background: transparent !important;
  color: #606266 !important;
  font-weight: 500;
  padding: 8px 16px !important;
  border-radius: 8px !important;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  min-width: 44px;
  height: 36px;
}

/* Active State */
.view-toggle-buttons .el-button.active {
  background: #409eff !important;
  color: #ffffff !important;
  box-shadow: 0 2px 4px rgba(64, 158, 255, 0.3);
  transform: translateY(-1px);
}

/* Hover States */
.view-toggle-buttons .el-button:not(.active):hover {
  background: #f5f7fa !important;
  color: #409eff !important;
  transform: translateY(-1px);
}

.view-toggle-buttons .el-button.active:hover {
  background: #337ecc !important;
  box-shadow: 0 4px 8px rgba(64, 158, 255, 0.4);
}

/* Focus States */
.view-toggle-buttons .el-button:focus {
  outline: 2px solid #409eff;
  outline-offset: 2px;
}

/* Icon Styling */
.view-toggle-buttons .el-button .el-icon {
  font-size: 16px;
  transition: transform 0.2s ease;
}

.view-toggle-buttons .el-button:hover .el-icon {
  transform: scale(1.1);
}

/* Alternative: Segmented Control Style */
.view-buttons-segmented {
  display: inline-flex;
  background: #f0f2f5;
  border-radius: 8px;
  padding: 2px;
  gap: 0;
}

.view-buttons-segmented .el-button {
  margin: 0 !important;
  border: none !important;
  background: transparent !important;
  color: #606266 !important;
  border-radius: 6px !important;
  padding: 6px 12px !important;
  font-weight: 500;
  transition: all 0.2s ease;
  min-width: 40px;
  height: 32px;
}

.view-buttons-segmented .el-button.active {
  background: #ffffff !important;
  color: #409eff !important;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.view-buttons-segmented .el-button:hover:not(.active) {
  color: #409eff !important;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .view-toggle-buttons,
  .view-buttons-segmented,
  .view-buttons-pills,
  .view-buttons-gradient,
  .view-buttons-neuro {
    gap: 4px;
  }

  .view-toggle-buttons .el-button,
  .view-buttons-segmented .el-button,
  .view-buttons-pills .el-button,
  .view-buttons-gradient .el-button,
  .view-buttons-neuro .el-button {
    min-width: 36px !important;
    padding: 6px 12px !important;
  }
}

.filter-bar {
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
}

.search-input {
  flex: 1;
  min-width: 300px;
}

.course-filter {
  min-width: 200px;
}

.loading-container,
.empty-state {
  padding: 3rem;
  text-align: center;
}

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

.pagination-container {
  display: flex;
  justify-content: center;
  padding: 2rem 0;
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

/* Responsive Design */
@media (max-width: 768px) {
  .students-container {
    padding: 1rem;
  }

  .header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .students-title {
    font-size: 1.5rem;
  }

  .filter-bar {
    flex-direction: column;
    width: 100%;
  }

  .search-input,
  .course-filter {
    width: 100%;
    min-width: unset;
  }

  .grid-container {
    grid-template-columns: 1fr;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .card-footer {
    flex-direction: column;
  }

  .view-toggle-buttons,
  .view-buttons-pills {
    gap: 4px;
  }

  .view-toggle-buttons .el-button,
  .view-buttons-pills .el-button {
    min-width: 36px !important;
    padding: 6px 12px !important;
  }
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
