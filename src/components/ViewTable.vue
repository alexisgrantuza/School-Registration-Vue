<template>
  <transition-group name="list" tag="div" class="list-container" appear>
    <el-table :data="props.paginatedStudents">
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
</template>

<script setup lang="ts">
import { useActions } from '@/composables/actions'
import { View, Edit, Delete } from '@element-plus/icons-vue'
import type { Student } from '@/types/student'

const { viewStudent, editStudent, deleteStudent } = useActions()

const props = defineProps<{
  paginatedStudents: Student[]
  pageSize: number
}>()

console.log('paginatedStudents', props.paginatedStudents)
</script>

<style scoped></style>
