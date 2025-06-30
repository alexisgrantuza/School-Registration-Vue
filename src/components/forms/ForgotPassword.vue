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
    <el-form-item prop="username">
      <el-input
        v-model="form.username"
        placeholder="USERNAME"
        show-password
        style="width: 300px; height: 45px; border-radius: 10px"
        clearable
        class="transparent-input"
        @keyup.enter="onSubmit"
        autocomplete="off"
      >
        <template #prefix>
          <el-icon><User /></el-icon>
        </template>
      </el-input>
    </el-form-item>

    <el-form-item prop="password">
      <el-input
        v-model="form.password"
        placeholder="NEW PASSWORD"
        show-password
        style="width: 300px; height: 45px; border-radius: 10px"
        clearable
        class="transparent-input"
        @keyup.enter="onSubmit"
        @input="updatePasswordChecks"
        autocomplete="off"
      >
        <template #prefix>
          <el-icon><Lock /></el-icon>
        </template>
      </el-input>
    </el-form-item>

    <!-- Password Requirements Display -->
    <div v-if="form.password.length > 0" class="password-requirements">
      <h4 style="color: #fff; font-size: 14px; margin-bottom: 10px">Password Requirements:</h4>
      <div class="requirements-list">
        <div
          v-for="(check, index) in passwordChecks"
          :key="index"
          class="requirement-item"
          :class="{ valid: check.isValid, invalid: !check.isValid }"
        >
          <el-icon v-if="check.isValid" class="check-icon valid">
            <CircleCheck />
          </el-icon>
          <el-icon v-else class="check-icon invalid">
            <CircleClose />
          </el-icon>
          <span class="requirement-text">{{ check.label }}</span>
        </div>
      </div>

      <!-- Password Strength Bar -->
      <div
        class="background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 8px; padding: 15px; margin-bottom: 20px;"
      >
        <div class="strength-label">
          <span>Password Strength</span>
          <span>{{ validChecksCount }}/5</span>
        </div>
        <el-progress
          :percentage="(validChecksCount / 5) * 100"
          :color="getStrengthColor()"
          :show-text="false"
          :stroke-width="6"
        />
      </div>
    </div>

    <el-form-item prop="confirmPassword">
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

    <!-- Password Match Indicator -->
    <div v-if="form.confirmPassword.length > 0">
      <el-icon v-if="passwordsMatch" class="match-icon valid">
        <CircleCheck />
      </el-icon>
      <el-icon v-else class="match-icon invalid">
        <CircleClose />
      </el-icon>
      <span :class="{ valid: passwordsMatch, invalid: !passwordsMatch }">
        {{ passwordsMatch ? 'Passwords match' : 'Passwords do not match' }}
      </span>
    </div>

    <el-form-item>
      <el-button
        type="primary"
        @click="onSubmit"
        :disabled="!canSubmit"
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
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { CircleCheck, CircleClose, Lock, User } from '@element-plus/icons-vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import type { FormInstance, FormRules } from 'element-plus'
import type { ChangePasswordResponse } from '@/types/auth'

const router = useRouter()
const authStore = useAuthStore()

const form = ref<ChangePasswordResponse>({
  password: '',
  confirmPassword: '',
  username: '',
})

const formRef = ref<FormInstance | null>(null)

// Password validation checks
const passwordChecks = ref([
  {
    label: 'At least 8 characters long',
    isValid: false,
    test: (pwd: string) => pwd.length >= 8,
  },
  {
    label: 'Contains uppercase letter (A-Z)',
    isValid: false,
    test: (pwd: string) => /[A-Z]/.test(pwd),
  },
  {
    label: 'Contains lowercase letter (a-z)',
    isValid: false,
    test: (pwd: string) => /[a-z]/.test(pwd),
  },
  {
    label: 'Contains at least one number (0-9)',
    isValid: false,
    test: (pwd: string) => /[0-9]/.test(pwd),
  },
  {
    label: 'Contains special character (!@#$%^&*)',
    isValid: false,
    test: (pwd: string) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd),
  },
])

const validChecksCount = computed(() => {
  const validChecks = passwordChecks.value.filter((check) => check.isValid).length
  console.log(validChecks)
  return validChecks
})

const passwordsMatch = computed(() => {
  const passwordsMatch = form.value.password === form.value.confirmPassword
  console.log(passwordsMatch)
  return passwordsMatch
})

const canSubmit = computed(
  () => validChecksCount.value === 5 && passwordsMatch.value && form.value.username,
)

// Methods
const updatePasswordChecks = () => {
  const checks = passwordChecks.value.forEach((check) => {
    check.isValid = check.test(form.value.password)
  })
  console.log(checks)
}

const getStrengthColor = () => {
  if (validChecksCount.value <= 2) return '#f56565' // red
  if (validChecksCount.value <= 4) return '#ed8936' // orange
  return '#48bb78' // green
}

const validateUsername = async (rule: any, value: string, callback: any) => {
  if (!value) {
    callback(new Error('Username is required'))
    return
  }

  // Check if username exists in localStorage
  const user = localStorage.getItem('user')
  if (user) {
    const userData = JSON.parse(user)
    if (userData.username === value) {
      callback() // Username is valid
      return
    } else {
      callback(new Error('Username not found'))
      return
    }
  } else {
    callback(new Error('No user data found'))
    return
  }
}

// Custom validator that shows all failing requirements
const validatePassword = (rule: any, value: string, callback: any) => {
  if (!value) {
    callback(new Error('Password is required'))
    return
  }

  const failedChecks = passwordChecks.value
    .filter((check) => !check.isValid)
    .map((check) => check.label)

  if (failedChecks.length > 0) {
    callback(new Error(`Missing requirements:\n• ${failedChecks.join('\n• ')}`))
  } else {
    callback()
  }
}

const validateConfirmPassword = (rule: any, value: string, callback: any) => {
  if (!value) {
    callback(new Error('Please confirm your password'))
    return
  }

  if (value !== form.value.password) {
    callback(new Error('Passwords do not match'))
    return
  }

  callback()
}

const rules = ref<FormRules>({
  username: [{ validator: validateUsername, trigger: 'blur' }],
  password: [{ validator: validatePassword, trigger: 'blur' }],
  confirmPassword: [{ validator: validateConfirmPassword, trigger: 'blur' }],
})

const onSubmit = async () => {
  try {
    if (!formRef.value) return

    if (!canSubmit.value) {
      ElMessage.error('Please fix all password requirements before submitting')
      return
    }

    await formRef.value.validate()

    const result = await authStore.changePassword(form.value.confirmPassword, form.value.username)

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

onMounted(() => {
  // Only set default credentials if no user exists
  const existingUser = localStorage.getItem('user')
  if (!existingUser) {
    localStorage.setItem(
      'user',
      JSON.stringify({
        id: 1,
        username: 'admin',
        password: 'admin123',
        email: 'admin@example.com',
      }),
    )
  }
})
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

/* Password Requirements Styles */
.password-requirements {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 20px;
}

.requirements-list {
  margin-bottom: 15px;
}

.requirement-item {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.check-icon {
  margin-right: 8px;
  font-size: 16px;
}

.check-icon.valid {
  color: #67c23a;
}

.check-icon.invalid {
  color: #f56c6c;
}

.requirement-text {
  font-size: 13px;
  transition: all 0.3s ease;
}

.requirement-item.valid .requirement-text {
  color: #67c23a;
}

.requirement-item.invalid .requirement-text {
  color: rgba(255, 255, 255, 0.8);
}

.password-strength {
  margin-top: 10px;
}

.strength-label {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 5px;
}

.password-match {
  display: flex;
  align-items: center;
  margin-top: 8px;
  font-size: 13px;
}

.match-icon {
  margin-right: 6px;
  font-size: 14px;
}

.match-icon.valid,
.password-match .valid {
  color: #67c23a;
}

.match-icon.invalid,
.password-match .invalid {
  color: #f56c6c;
}
</style>
