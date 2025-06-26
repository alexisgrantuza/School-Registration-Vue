# vue-first

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

## Table View and Card View Implementation

This project implements a dual-view system for displaying student data with both table and card layouts. The implementation has been refactored into a modular architecture with separate components and composables.

### Architecture Overview

The implementation is split across multiple files for better maintainability:

- **`src/components/StudentListCard.vue`**: Main container component
- **`src/components/ViewCard.vue`**: Card view component
- **`src/components/ViewTable.vue`**: Table view component
- **`src/composables/toggle.ts`**: View toggle and pagination logic
- **`src/composables/actions.ts`**: Student actions (view, edit, delete)
- **`src/composables/studentUtils.ts`**: Utility functions for student data

### Key Features

#### 1. Modular Component Structure

**Main Container (`StudentListCard.vue`):**

```vue
<template>
  <div class="students-container">
    <!-- Header with toggle buttons -->
    <div class="view-buttons-segmented">
      <el-button :class="{ active: viewMode === 'list' }" @click="toggleView('list')">
        <el-icon><List /></el-icon>
      </el-button>
      <el-button :class="{ active: viewMode === 'grid' }" @click="toggleView('grid')">
        <el-icon><Grid /></el-icon>
      </el-button>
    </div>

    <!-- Conditional rendering of view components -->
    <div class="students-grid">
      <ViewCard v-if="viewMode === 'grid'" />
      <ViewTable v-else />
    </div>
  </div>
</template>
```

**Card View Component (`ViewCard.vue`):**

```vue
<template>
  <transition-group name="card" tag="div" class="grid-container" appear>
    <div
      v-for="student in paginatedStudents"
      :key="`${student._id}-${currentPage}`"
      class="student-card"
    >
      <!-- Card content -->
    </div>
  </transition-group>
</template>
```

**Table View Component (`ViewTable.vue`):**

```vue
<template>
  <transition-group name="list" tag="div" class="list-container" appear>
    <el-table :data="paginatedStudents">
      <!-- Table columns -->
    </el-table>
  </transition-group>
</template>
```

#### 2. Composable-Based State Management

**Toggle Composable (`useToggle`):**

```typescript
export const useToggle = () => {
  const viewMode = ref<'grid' | 'list'>('grid')
  const currentPage = ref(1)
  const pageSize = ref(8)
  const searchQuery = ref('')
  const courseFilter = ref('')

  const toggleView = (mode: 'grid' | 'list') => {
    viewMode.value = mode
  }

  const filteredStudentsAll = computed(() => {
    let filtered = students.value
    // Filtering logic
    return filtered
  })

  const paginatedStudents = computed(() => {
    const startIndex = (currentPage.value - 1) * pageSize.value
    const endIndex = startIndex + pageSize.value
    return filteredStudentsAll.value.slice(startIndex, endIndex)
  })

  return {
    viewMode,
    toggleView,
    paginatedStudents,
    filteredStudentsAll,
    currentPage,
    pageSize,
    searchQuery,
    courseFilter,
    // ... other properties
  }
}
```

**Actions Composable (`useActions`):**

```typescript
export const useActions = () => {
  const selectedStudent = ref<Student | null>(null)
  const viewModalVisible = ref(false)
  const showEditModal = ref(false)

  const viewStudent = (student: Student) => {
    selectedStudent.value = student
    viewModalVisible.value = true
  }

  const deleteStudent = async (student: Student) => {
    try {
      await ElMessageBox.confirm(`Are you sure you want to delete ${getFullName(student)}?`)
      await studentStore.deleteStudent(student._id!)
      ElMessage.success('Student deleted successfully')
    } catch (error) {
      console.log('Delete cancelled')
    }
  }

  return {
    viewStudent,
    editStudent,
    deleteStudent,
    selectedStudent,
    viewModalVisible,
    showEditModal,
  }
}
```

#### 3. Shared Functionality

**Student Utils (`studentUtils`):**

```typescript
export const studentUtils = () => {
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

  return {
    getFullName,
    getInitials,
    formatDate,
    truncateText,
  }
}
```

#### 4. Component Integration

**Main Component Setup:**

```typescript
// StudentListCard.vue
const {
  viewMode,
  toggleView,
  currentPage,
  pageSize,
  searchQuery,
  courseFilter,
  availableCourses,
  filteredStudentsAll,
  clearFilters,
  handlePageChange,
} = useToggle()

const { selectedStudent, viewModalVisible, showEditModal, handleStudentUpdated } = useActions()
```

### Benefits of Refactored Architecture

1. **Separation of Concerns**: Each component has a single responsibility
2. **Reusability**: Composables can be used across different components
3. **Maintainability**: Easier to test and modify individual pieces
4. **State Management**: Centralized state management through composables
5. **Type Safety**: Better TypeScript support with modular structure

### Usage

1. **Toggle Views**: Click the list/grid icons in the header to switch between views
2. **Search**: Use the search input to filter students by name or course
3. **Filter**: Use the course dropdown to filter by specific courses
4. **Pagination**: Navigate through pages using the pagination controls
5. **Actions**: Use the dropdown menu (card view) or action buttons (table view) to perform operations

### Technical Considerations

- **Vue 3 Composition API**: Uses modern Vue 3 patterns for better reactivity
- **Composables**: Reusable logic separated into composable functions
- **Element Plus**: Consistent UI components throughout the application
- **TypeScript**: Full type safety for better development experience
- **Responsive Design**: Mobile-first approach with CSS Grid and Flexbox
- **Animations**: Smooth transitions with Vue's transition system

### File Structure

```
src/
├── components/
│   ├── StudentListCard.vue    # Main container
│   ├── ViewCard.vue          # Card view component
│   ├── ViewTable.vue         # Table view component
│   └── ...
├── composables/
│   ├── toggle.ts             # View toggle and pagination
│   ├── actions.ts            # Student actions
│   ├── studentUtils.ts       # Utility functions
│   └── ...
└── ...
```

This modular approach makes the codebase more maintainable, testable, and scalable while providing a clean separation of concerns.

## Unpushed/New/Modified Files Documentation

This section documents files that have been added or modified locally and are not yet pushed to GitHub. These files are part of the student management and search/pagination system in the app.

### 1. `src/composables/pagination.ts`

**Purpose:**

- Provides a composable for handling pagination and filtering of students.
- Accepts reactive search and course filter refs, and returns paginated and filtered student lists, as well as pagination state and a reset function.

**Usage Example:**

```ts
import { ref } from 'vue'
import { usePagination } from '@/composables/pagination'

const searchQuery = ref('')
const courseFilter = ref('')
const { paginatedStudents, filteredStudents, currentPage, pageSize, resetToFirstPage } =
  usePagination(searchQuery, courseFilter)
```

### 2. `src/components/StudentListCard.vue`

**Purpose:**

- Main component for displaying, searching, filtering, and paginating students.
- Uses the `usePagination` composable for all filtering and pagination logic.
- Handles search input, course filter, and passes paginated students to child components like `ViewCard` and `ViewTable`.

**Key Features:**

- Search bar and course filter for dynamic filtering.
- Pagination controls.
- Responsive design.
- Emits events for editing and viewing students.

### 3. `src/components/ViewCard.vue`

**Purpose:**

- Displays a grid of student cards based on the paginated students passed from the parent.
- Does not handle filtering or pagination logic itself; receives already-paginated data as props.

**Props:**

- `paginatedStudents`: Array of students to display on the current page.
- `currentPage`: Current page number.

### 4. `src/composables/studentUtils.ts`

**Purpose:**

- Utility functions for student data (get full name, initials, format date, truncate text).
- Filtering logic is now handled in `usePagination` instead of here.

---

**Note:**

- The new pattern is to handle all filtering and pagination in the parent (`StudentListCard.vue`) using the `usePagination` composable, and pass only the relevant data to child components.
- This ensures that search and pagination work together correctly and efficiently.

---

**If you add or modify more files, please update this section accordingly before pushing to GitHub.**
