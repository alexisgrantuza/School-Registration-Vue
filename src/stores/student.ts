import { defineStore } from 'pinia'
import type { Student } from '@/types/student'

export const useStudentStore = defineStore('student', {
  state: () => ({
    students: [] as Student[],
    isLoading: false,
  }),

  getters: {
    getStudents: (state) => state.students,
    getStudentCount: (state) => state.students.length,
    getNextId: (state) => {
      if (state.students.length === 0) {
        return 1
      }
      return Math.max(...state.students.map((s) => s._id || 0)) + 1
    },
  },

  actions: {
    async setStudents(students: Student[]) {
      this.students = students
    },

    async createStudent(student: Student) {
      const newStudent = { ...student }
      newStudent._id = this.getNextId
      this.students.push(newStudent)
      localStorage.setItem('students', JSON.stringify(this.students))
    },

    async updateStudent(student: Student) {
      const index = this.students.findIndex((s) => s._id === student._id)
      if (index !== -1) {
        this.students[index] = { ...student }
        localStorage.setItem('students', JSON.stringify(this.students))
      }
    },

    async deleteStudent(id: number) {
      console.log('Deleting student with id:', id)
      this.students = this.students.filter((student) => student._id !== id)
      localStorage.setItem('students', JSON.stringify(this.students))
    },

    async fetchStudents() {
      const students = localStorage.getItem('students')
      if (students) {
        this.students = JSON.parse(students) as Student[]
        console.log('Loaded students:', this.students)
      } else {
        console.log('No students found in localStorage')
        this.students = []
      }
    },
  },
})
