<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-header">
        <h1>百里口才</h1>
        <p>后台管理系统</p>
      </div>
      <el-form :model="form" :rules="rules" ref="formRef" class="login-form">
        <el-form-item prop="username">
          <el-input
            v-model="form.username"
            placeholder="请输入用户名"
            prefix-icon="User"
            size="large"
          />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="请输入密码"
            prefix-icon="Lock"
            size="large"
            @keyup.enter="handleLogin"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="large" :loading="loading" @click="handleLogin" style="width: 100%;">
            登录
          </el-button>
        </el-form-item>
      </el-form>
      <div class="login-tips">
        <p>演示账号：admin / 123456</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()
const formRef = ref(null)
const loading = ref(false)

const form = reactive({
  username: '',
  password: ''
})

const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

const handleLogin = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      
      try {
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        if (form.username === 'admin' && form.password === '123456') {
          localStorage.setItem('admin_token', 'demo_token')
          ElMessage.success('登录成功')
          router.push('/')
        } else {
          ElMessage.error('用户名或密码错误')
        }
      } catch (error) {
        ElMessage.error('登录失败')
      } finally {
        loading.value = false
      }
    }
  })
}
</script>

<style lang="scss" scoped>
.login-container {
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-box {
  width: 400px;
  background: white;
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.login-header {
  text-align: center;
  margin-bottom: 40px;
  
  h1 {
    color: #FF6B35;
    font-size: 28px;
    margin: 0 0 8px 0;
  }
  
  p {
    color: #666;
    font-size: 14px;
    margin: 0;
  }
}

.login-form {
  .el-button {
    background-color: #FF6B35;
    border-color: #FF6B35;
    
    &:hover {
      background-color: #e55a28;
      border-color: #e55a28;
    }
  }
}

.login-tips {
  text-align: center;
  margin-top: 20px;
  
  p {
    color: #999;
    font-size: 12px;
    margin: 0;
  }
}
</style>