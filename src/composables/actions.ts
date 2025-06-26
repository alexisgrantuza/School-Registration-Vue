import type { Student } from '@/types/student'
import { computed, ref } from 'vue'
import { useStudentStore } from '@/stores/student'
import { ElMessage, ElMessageBox } from 'element-plus'
import { studentUtils } from './studentUtils'
import { usePagination } from './pagination'

export const useActions = () => {
  const studentStore = useStudentStore()
  const searchQuery = ref('')
  const courseFilter = ref('')
  const selectedStudent = ref<Student | null>(null)
  const viewModalVisible = ref(false)
  const showEditModal = ref(false)
  const { getFullName } = studentUtils()
  const { currentPage, pageSize } = usePagination(searchQuery, courseFilter)

  const filteredStudentsAll = computed(() => {
    return studentStore.getStudents
  })

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

  return {
    viewStudent,
    editStudent,
    deleteStudent,
    handleStudentUpdated,
    selectedStudent,
    viewModalVisible,
    showEditModal,
    filteredStudentsAll,
  }
}
