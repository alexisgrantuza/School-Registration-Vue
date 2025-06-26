import type { Student } from '@/types/student'
import { computed } from 'vue'

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

  const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  /* // Separate computed for all filtered students (without pagination)
  const filteredStudentsAll = (students: Student[], searchQuery: string, courseFilter: string) => {
    console.log('Filtered students:', students)
    let filtered = students

    // search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (student) =>
          student.firstName.toLowerCase().includes(query) ||
          student.lastName.toLowerCase().includes(query) ||
          student.course.toLowerCase().includes(query) ||
          getFullName(student).toLowerCase().includes(query),
      )
    }

    //  course filter
    if (courseFilter) {
      filtered = filtered.filter((student) => student.course === courseFilter)
    }

    return filtered
  } */

  return {
    getFullName,
    getInitials,
    formatDate,
    truncateText,
    //filteredStudentsAll,
  }
}
