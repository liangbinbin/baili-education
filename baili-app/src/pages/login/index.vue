<template>
  <view class="login-page">
    <view class="login-header">
      <image class="logo" src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=elegant%20education%20logo%20for%20kids%20speech%20training&image_size=square" mode="aspectFit" />
      <text class="app-name">百里口才</text>
      <text class="app-slogan">让每个孩子都能自信表达</text>
    </view>

    <view class="login-form">
      <view class="form-item">
        <view class="input-wrapper">
          <text class="input-prefix">+86</text>
          <input
            class="input"
            type="number"
            v-model="phone"
            placeholder="请输入手机号"
            maxlength="11"
          />
        </view>
      </view>

      <view class="form-item">
        <view class="input-wrapper code-input">
          <input
            class="input"
            type="number"
            v-model="code"
            placeholder="请输入验证码"
            maxlength="6"
          />
          <view class="code-btn" @click="handleGetCode" :class="{ 'code-btn--disabled': countdown > 0 }">
            <text v-if="countdown > 0">{{ countdown }}s</text>
            <text v-else>获取验证码</text>
          </view>
        </view>
      </view>

      <Button type="primary" size="large" :disabled="!canSubmit" @click="handleLogin">
        登录
      </Button>

      <view class="login-agreement">
        <checkbox-group @change="handleAgreementChange">
          <label class="agreement-label">
            <checkbox value="agree" :checked="agreed" color="#FF6B35" />
            <text>我已阅读并同意</text>
            <text class="agreement-link">《用户协议》</text>
            <text>和</text>
            <text class="agreement-link">《隐私政策》</text>
          </label>
        </checkbox-group>
      </view>
    </view>

    <view class="login-footer">
      <view class="divider">
        <view class="divider-line"></view>
        <text class="divider-text">其他登录方式</text>
        <view class="divider-line"></view>
      </view>

      <view class="other-login">
        <view class="login-method" @click="handleWechatLogin">
          <view class="login-icon wechat-icon">
            <text class="icon-wechat">💬</text>
          </view>
          <text class="login-text">微信登录</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useUserStore } from '@/store/user'
import { getSmsCode } from '@/api/auth'
import { validatePhone } from '@/utils/validate'

const userStore = useUserStore()

const phone = ref('')
const code = ref('')
const agreed = ref(false)
const countdown = ref(0)

const canSubmit = computed(() => {
  return validatePhone(phone.value) && code.value.length === 6 && agreed.value
})

let timer = null

const handleGetCode = async () => {
  if (countdown.value > 0) return
  if (!validatePhone(phone.value)) {
    uni.showToast({ title: '请输入正确的手机号', icon: 'none' })
    return
  }

  try {
    await getSmsCode(phone.value)
    uni.showToast({ title: '验证码已发送', icon: 'success' })
    
    countdown.value = 60
    timer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) {
        clearInterval(timer)
      }
    }, 1000)
  } catch (error) {
    console.error('获取验证码失败', error)
  }
}

const handleLogin = async () => {
  if (!canSubmit.value) return
  
  try {
    await userStore.doLoginByCode(phone.value, code.value)
    uni.showToast({ title: '登录成功', icon: 'success' })
    uni.switchTab({ url: '/pages/student/home' })
  } catch (error) {
    console.error('登录失败', error)
  }
}

const handleWechatLogin = () => {
  uni.navigateTo({ url: '/pages/login/bind-wechat' })
}

const handleAgreementChange = (e) => {
  agreed.value = e.detail.value.includes('agree')
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.login-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #FFF8F5 0%, #FFFFFF 100%);
  padding: 120rpx $spacing-xl $spacing-xl;
  display: flex;
  flex-direction: column;
}

.login-header {
  text-align: center;
  margin-bottom: 120rpx;

  .logo {
    width: 160rpx;
    height: 160rpx;
    border-radius: 40rpx;
    margin-bottom: $spacing-lg;
  }

  .app-name {
    display: block;
    font-size: 48rpx;
    font-weight: $font-weight-bold;
    color: $color-text-primary;
    margin-bottom: $spacing-sm;
  }

  .app-slogan {
    display: block;
    font-size: $font-size-body;
    color: $color-text-secondary;
  }
}

.login-form {
  .form-item {
    margin-bottom: $spacing-lg;
  }

  .input-wrapper {
    background: $color-bg-card;
    border-radius: $radius-lg;
    padding: $spacing-md $spacing-lg;
    display: flex;
    align-items: center;
    border: 2rpx solid $color-border-light;

    .input-prefix {
      font-size: $font-size-body;
      color: $color-text-secondary;
      margin-right: $spacing-sm;
      padding-right: $spacing-sm;
      border-right: 2rpx solid $color-border;
    }

    .input {
      flex: 1;
      font-size: $font-size-body;
      color: $color-text-primary;
      height: 64rpx;
      line-height: 64rpx;
    }

    &.code-input {
      .code-btn {
        padding: $spacing-xs $spacing-md;
        font-size: $font-size-body;
        color: $color-primary;
        font-weight: $font-weight-medium;
        white-space: nowrap;

        &--disabled {
          color: $color-text-placeholder;
        }
      }
    }
  }

  .login-agreement {
    margin-top: $spacing-lg;

    .agreement-label {
      display: flex;
      align-items: center;
      font-size: $font-size-caption;
      color: $color-text-secondary;

      checkbox {
        margin-right: $spacing-xs;
      }

      .agreement-link {
        color: $color-primary;
      }
    }
  }
}

.login-footer {
  margin-top: auto;
  padding-top: $spacing-xxl;

  .divider {
    display: flex;
    align-items: center;
    margin-bottom: $spacing-xl;

    .divider-line {
      flex: 1;
      height: 2rpx;
      background: $color-border;
    }

    .divider-text {
      padding: 0 $spacing-lg;
      font-size: $font-size-caption;
      color: $color-text-placeholder;
    }
  }

  .other-login {
    display: flex;
    justify-content: center;

    .login-method {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: $spacing-xs;

      .login-icon {
        width: 96rpx;
        height: 96rpx;
        border-radius: 50%;
        background: $color-success-light;
        display: flex;
        align-items: center;
        justify-content: center;

        .icon-wechat {
          font-size: 48rpx;
        }
      }

      .login-text {
        font-size: $font-size-caption;
        color: $color-text-secondary;
      }
    }
  }
}
</style>
