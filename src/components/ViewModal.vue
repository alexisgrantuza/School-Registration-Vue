<template>
  <el-dialog v-model="dialogVisible" title="View Modal" width="50%">
    <div class="view-modal-content">
      <h1>{{ student?.firstName }} {{ student?.lastName }}</h1>
    </div>
    <template #footer>
      <el-button @click="dialogVisible = false">Close</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import type { Student } from '@/types/student'

const dialogVisible = defineModel<boolean>('visible', { required: true })
const student = defineModel<Student | null>('student', { required: true })

console.log('Student kopal:', student)
</script>
<style scoped>
.view-modal-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
