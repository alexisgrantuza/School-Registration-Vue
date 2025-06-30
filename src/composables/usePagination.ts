import { computed, ref, type Ref } from 'vue'
import { useStudentStore } from '@/stores/student'
import { studentUtils } from '@/composables/useStudentUtils'

export const usePagination = (searchQuery: Ref<string>, courseFilter: Ref<string>) => {
  const studentStore = useStudentStore()
  const students = computed(() => studentStore.getStudents)
  const { getFullName } = studentUtils()
  const currentPage = ref(1)
  const pageSize = ref(8)

  // First filter, then paginate
  const filteredStudents = computed(() => {
    let filtered = students.value

    // Apply search filter
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

    // Apply course filter
    if (courseFilter.value) {
      filtered = filtered.filter((student) => student.course === courseFilter.value)
    }

    return filtered
  })

  const paginatedStudents = computed(() => {
    const startIndex = (currentPage.value - 1) * pageSize.value
    const endIndex = startIndex + pageSize.value
    return filteredStudents.value.slice(startIndex, endIndex)
  })

  // Reset to page 1 when filters change
  const resetToFirstPage = () => {
    currentPage.value = 1
  }

  return {
    paginatedStudents,
    filteredStudents,
    currentPage,
    pageSize,
    resetToFirstPage,
  }
}
