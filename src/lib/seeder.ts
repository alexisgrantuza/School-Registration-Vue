import { faker } from '@faker-js/faker'
import type { Student } from '@/types/student'
import { COURSES } from '@/constants/courses'

const courseValues = Object.keys(COURSES)

function getRandomCourse() {
  return courseValues[Math.floor(Math.random() * courseValues.length)]
}

function getRandomBirthDateAndAge() {
  const age = faker.number.int({ min: 16, max: 65 })
  const birthYear = new Date().getFullYear() - age
  const birthMonth = faker.number.int({ min: 0, max: 11 })
  const birthDay = faker.number.int({ min: 1, max: 28 })
  const birthDate = new Date(birthYear, birthMonth, birthDay)
  return {
    birthDate: birthDate.toISOString().split('T')[0],
    age: age.toString(),
  }
}

export function generateFakeStudents(count: number, saveToLocalStorage: boolean = true): Student[] {
  const students = Array.from({ length: count }).map((_, i) => {
    const avatar = faker.image.avatar()
    const firstName = faker.person.firstName()
    const lastName = faker.person.lastName()
    const middleInitial = faker.string.alpha({ length: 1 }).toUpperCase()
    const { birthDate, age } = getRandomBirthDateAndAge()
    return {
      _id: i + 1,
      avatar,
      firstName,
      middleInitial,
      lastName,
      birthDate,
      age,
      address: faker.location.streetAddress({ useFullAddress: true }),
      course: getRandomCourse(),
    }
  })

  if (saveToLocalStorage) {
    localStorage.setItem('students', JSON.stringify(students))
  }

  return students
}
