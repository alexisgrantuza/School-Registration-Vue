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
      v-else-if="filteredStudents.length === 0 && !searchQuery && !courseFilter"
      class="empty-state"
    >
      <el-empty description="No students registered yet">
        <el-button type="primary" :icon="Plus" size="large" @click="openRegistration">
          Register New Student
        </el-button>
      </el-empty>
    </div>

    <!-- No Results State -->
    <div v-else-if="filteredStudents.length === 0" class="empty-state">
      <el-empty description="No students match your search criteria">
        <el-button @click="clearFilters">Clear Filters</el-button>
      </el-empty>
    </div>

    <!-- Students Grid -->
    <div v-else class="students-grid">
      <ViewCard
        v-if="viewMode === 'grid'"
        :paginated-students="paginatedStudents"
        :current-page="currentPage"
      />
      <ViewTable v-else :paginated-students="paginatedStudents" :page-size="pageSize" />
    </div>

    <!-- Pagination -->
    <div v-if="filteredStudents.length > 0" class="pagination-container">
      <el-pagination
        v-model:current-page="currentPage"
        :page-size="pageSize"
        :total="filteredStudents.length"
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
import { ElMessage } from 'element-plus'
import { UserFilled, Plus, Search, List, Grid } from '@element-plus/icons-vue'
import { useStudentStore } from '@/stores/student'
import type { Student } from '@/types/student'
import EditDrawer from './EditDrawer.vue'
import ViewModal from './ViewModal.vue'
import ViewCard from './ViewCard.vue'
import ViewTable from './ViewTable.vue'
import { useActions } from '@/composables/actions'
import { useToggle } from '@/composables/toggle'
import { usePagination } from '@/composables/pagination'

const props = defineProps<{
  searchQuery?: string
}>()

const emit = defineEmits(['openRegistration', 'editStudent', 'viewStudent'])

// Store
const studentStore = useStudentStore()
const { handleStudentUpdated } = useActions()
const { viewMode, toggleView } = useToggle()

// Reactive data
const loading = ref(true)
const searchQuery = ref('')
const courseFilter = ref('')

// Use updated pagination composable
const { paginatedStudents, filteredStudents, currentPage, pageSize, resetToFirstPage } =
  usePagination(searchQuery, courseFilter)

// Edit Modal state
const showEditModal = ref(false)
const selectedStudent = ref<Student | null>(null)
const viewModalVisible = ref(false)

// Computed properties
const students = computed(() => studentStore.getStudents)

// Watch for search query changes and reset pagination
watch([searchQuery, courseFilter], () => {
  resetToFirstPage()
})

// Watch for external search query prop
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
  return [...new Set(courses)].sort()
})

const clearFilters = () => {
  searchQuery.value = ''
  courseFilter.value = ''
  resetToFirstPage()
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
/* ... (keep all your existing styles) ... */
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

.students-count {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.pagination-container {
  display: flex;
  justify-content: center;
  padding: 2rem 0;
}

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
}
</style>
