<template>
  <view class="bind-wechat-page">
    <Navbar title="绑定微信" />

    <view class="bind-content">
      <view class="wechat-info">
        <view class="wechat-avatar">
          <image src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20wechat%20avatar%20for%20education%20app&image_size=square" mode="aspectFill" />
        </view>
        <text class="wechat-name">微信用户</text>
        <text class="bind-tip">请绑定手机号以完成登录</text>
      </view>

      <view class="bind-form">
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

        <Button type="primary" size="large" :disabled="!canSubmit" @click="handleBind">
          确认绑定
        </Button>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useUserStore } from '@/store/user'
import { getSmsCode, bindWechat } from '@/api/auth'
import { validatePhone } from '@/utils/validate'

const userStore = useUserStore()

const phone = ref('')
const code = ref('')
const countdown = ref(0)

const canSubmit = computed(() => {
  return validatePhone(phone.value) && code.value.length === 6
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

const handleBind = async () => {
  if (!canSubmit.value) return
  
  try {
    await bindWechat(code.value)
    uni.showToast({ title: '绑定成功', icon: 'success' })
    setTimeout(() => {
      uni.switchTab({ url: '/pages/student/home' })
    }, 1500)
  } catch (error) {
    console.error('绑定失败', error)
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.bind-wechat-page {
  min-height: 100vh;
  background: $color-bg-page;
}

.bind-content {
  padding: $spacing-xl;
  padding-top: 120rpx;
}

.wechat-info {
  text-align: center;
  margin-bottom: 80rpx;

  .wechat-avatar {
    width: 160rpx;
    height: 160rpx;
    border-radius: 50%;
    overflow: hidden;
    margin: 0 auto $spacing-lg;

    image {
      width: 100%;
      height: 100%;
    }
  }

  .wechat-name {
    display: block;
    font-size: $font-size-h2;
    font-weight: $font-weight-semibold;
    color: $color-text-primary;
    margin-bottom: $spacing-sm;
  }

  .bind-tip {
    display: block;
    font-size: $font-size-body;
    color: $color-text-secondary;
  }
}

.bind-form {
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
}
</style>
