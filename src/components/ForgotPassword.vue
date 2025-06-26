<template>
  <el-form
    ref="formRef"
    :model="form"
    :rules="rules"
    label-width="auto"
    style="
      max-width: 600px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    "
  >
    <el-form-item prop="password" :show-message="true">
      <el-input
        v-model="form.password"
        placeholder="NEW PASSWORD"
        show-password
        style="width: 300px; height: 45px; border-radius: 10px"
        clearable
        class="transparent-input"
        @keyup.enter="onSubmit"
        autocomplete="off"
      >
        <template #prefix>
          <el-icon><Lock /></el-icon>
        </template>
      </el-input>
    </el-form-item>

    <el-form-item prop="confirmPassword" :show-message="true">
      <el-input
        v-model="form.confirmPassword"
        placeholder="CONFIRM PASSWORD"
        show-password
        style="width: 300px; height: 45px; border-radius: 10px"
        clearable
        class="transparent-input"
        @keyup.enter="onSubmit"
        autocomplete="off"
      >
        <template #prefix>
          <el-icon><CircleCheck /></el-icon>
        </template>
      </el-input>
    </el-form-item>

    <el-form-item>
      <el-button
        type="primary"
        @click="onSubmit"
        style="
          width: 100%;
          height: 45px;
          border-radius: 4px;
          color: #244bc5;
          font-size: 16px;
          font-weight: 600;
          font-family: 'Montserrat';
          line-height: 20px;
          text-transform: uppercase;
          background-color: #fff;
          margin-top: 25px;
        "
      >
        Reset Password
      </el-button>

      <div style="width: 100%; text-align: right; margin-top: -15px">
        <el-link
          href="/"
          style="
            color: #fff;
            font-size: 16px;
            font-weight: 600;
            font-family: 'Montserrat';
            line-height: 20px;
            margin-top: 30px;
          "
        >
          Back to Login
        </el-link>
      </div>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { validatePassword } from '@/composables/validation'
import type { FormInstance, FormRules } from 'element-plus'
import type { ChangePasswordResponse } from '@/types/auth'

const router = useRouter()
const authStore = useAuthStore()

const form = ref<ChangePasswordResponse>({
  password: '',
  confirmPassword: '',
})

const formRef = ref<FormInstance | null>(null)

onMounted(() => {
  const admin = localStorage.setItem(
    'user',
    JSON.stringify({
      id: 1,
      username: 'admin',
      password: 'admin123',
      email: 'admin@example.com',
    }),
  )
  return admin
})

const rules = ref<FormRules>({
  password: [
    { required: true, message: 'Password is required', trigger: 'blur' },
    { validator: validatePassword, trigger: 'blur' },
  ],
  confirmPassword: [
    { required: true, message: 'Confirm password is required', trigger: 'blur' },
    { validator: validatePassword, trigger: 'blur' },
  ],
})

const onSubmit = async () => {
  try {
    if (!formRef.value) return

    const { password, confirmPassword } = form.value

    if (password !== confirmPassword) {
      ElMessage.error('Passwords do not match')
      return
    }

    await formRef.value.validate()

    const result = await authStore.changePassword(confirmPassword)

    console.log(result)
    if (result.success) {
      router.push('/')
      ElMessage.success('Password reset successful')
    } else {
      ElMessage.error(result.error || 'Password reset failed')
    }
  } catch (error) {
    ElMessage.error('Password reset failed. Please try again.')
    console.error(error)
  }
}
</script>

<style scoped>
.transparent-input :deep(.el-input__wrapper) {
  background-color: transparent !important;
  box-shadow: none !important;
  border: 1px solid rgba(255, 255, 255, 0.3) !important;
}

.transparent-input :deep(.el-input__inner) {
  background-color: transparent !important;
  color: #fff !important;
}

.transparent-input :deep(.el-input__inner::placeholder) {
  color: rgba(255, 255, 255, 0.7) !important;
}

.transparent-input :deep(.el-input__prefix) {
  color: #fff !important;
}

.transparent-input :deep(.el-input__prefix .el-icon) {
  color: #fff !important;
  font-size: 16px !important;
}

.transparent-input :deep(.el-input__suffix .el-input__clear) {
  color: #fff !important;
}

.transparent-input :deep(.el-input__suffix .el-input__password) {
  color: #fff !important;
}

.transparent-input :deep(.el-input__suffix .el-icon) {
  color: #fff !important;
}

.transparent-input :deep(.el-input__wrapper:focus-within) {
  border-color: rgba(255, 255, 255, 0.8) !important;
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.2) inset !important;
}

.transparent-input :deep(.el-input__wrapper:hover) {
  border-color: rgba(255, 255, 255, 0.5) !important;
}
</style>
