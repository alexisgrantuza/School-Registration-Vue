<template>
  <div class="table-responsive">
    <transition-group name="list" tag="div" class="list-container" appear>
      <el-table :data="props.paginatedStudents">
        <el-table-column prop="firstName" label="First Name" />
        <el-table-column prop="lastName" label="Last Name" />
        <el-table-column prop="course" label="Course" />
        <el-table-column prop="address" label="Address" class-name="hide-mobile" />
        <el-table-column prop="birthDate" label="Birth Date" />
        <el-table-column prop="age" label="Age" />
        <el-table-column prop="actions" label="Actions" width="100" class-name="hide-mobile">
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
    <EditDrawer
      v-model="showEditModal"
      :student="selectedStudent"
      @student-updated="handleStudentUpdated"
    />
  </div>
</template>

<script setup lang="ts">
import { useActions } from '@/composables/useActions'
import { View, Edit, Delete } from '@element-plus/icons-vue'
import type { Student } from '@/types/student'
import EditDrawer from '@/components/dialogs/EditDrawer.vue'

const {
  viewStudent,
  editStudent,
  deleteStudent,
  showEditModal,
  selectedStudent,
  handleStudentUpdated,
} = useActions()

const props = defineProps<{
  paginatedStudents: Student[]
  pageSize: number
}>()

console.log('paginatedStudents', props.paginatedStudents)
</script>

<style scoped>
.table-responsive {
  width: 100%;
  overflow-x: auto;
}

.el-table {
  min-width: 600px;
}

@media (max-width: 768px) {
  .el-table {
    min-width: 500px;
    font-size: 13px;
  }
}

@media (max-width: 480px) {
  .el-table {
    min-width: 400px;
    font-size: 12px;
  }
  .hide-mobile {
    display: none !important;
  }
}
</style>
