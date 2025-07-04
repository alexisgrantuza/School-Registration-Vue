import { computed, ref, type Ref } from 'vue'
import { useStudentStore } from '@/stores/student'
import { studentUtils } from '@/composables/useStudentUtils'

export const usePagination = (searchQuery: Ref<string>, courseFilter: Ref<string>) => {
  const studentStore = useStudentStore()
  const students = computed(() => studentStore.getStudents)
  const { getFullName } = studentUtils()
  const currentPage = ref(1)
  const pageSize = ref(8)

  // function to set it in default value
  const normalizeText = (text: string): string => {
    return text.toLowerCase().trim().replace(/\s+/g, ' ')
  }

  // First filter, then paginate
  const filteredStudents = computed(() => {
    let filtered = students.value

    // Apply search filter
    if (searchQuery.value) {
      const query = normalizeText(searchQuery.value)
      filtered = filtered.filter((student) => {
        const firstName = normalizeText(student.firstName)
        const lastName = normalizeText(student.lastName)
        const fullName = normalizeText(getFullName(student))

        const fullNameReversed = normalizeText(`${student.lastName} ${student.firstName}`)
        const fullNameWithMiddle = student.middleName
          ? normalizeText(`${student.firstName} ${student.middleName} ${student.lastName}`)
          : ''

        return (
          firstName.includes(query) ||
          lastName.includes(query) ||
          fullName.includes(query) ||
          fullNameReversed.includes(query) ||
          (fullNameWithMiddle && fullNameWithMiddle.includes(query)) ||
          // Also check if the query matches when split by spaces
          query
            .split(' ')
            .every(
              (word) =>
                firstName.includes(word) ||
                lastName.includes(word) ||
                (student.middleName && normalizeText(student.middleName).includes(word)),
            )
        )
      })
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
