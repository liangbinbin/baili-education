<template>
  <view class="task-submit-page">
    <Navbar title="提交任务" />

    <view class="content">
      <view class="upload-section">
        <text class="section-title">上传作品</text>
        <view class="upload-area" @click="chooseUpload">
          <view class="upload-icon">📷</view>
          <text class="upload-text">点击上传图片/视频</text>
        </view>

        <view class="upload-list" v-if="uploadFiles.length > 0">
          <view class="upload-item" v-for="(file, index) in uploadFiles" :key="index">
            <image v-if="file.type === 'image'" class="preview-image" :src="file.url" mode="aspectFill" />
            <view v-else class="preview-video">
              <text class="video-icon">🎬</text>
              <text class="video-name">{{ file.name }}</text>
            </view>
            <view class="delete-btn" @click="deleteFile(index)">✕</view>
          </view>
        </view>
      </view>

      <view class="text-section">
        <text class="section-title">文字说明（选填）</text>
        <textarea
          class="textarea"
          v-model="content"
          placeholder="请输入文字说明..."
          :maxlength="500"
        />
        <text class="word-count">{{ content.length }}/500</text>
      </view>
    </view>

    <view class="footer">
      <Button type="primary" size="large" :disabled="uploadFiles.length === 0" @click="submitTask">
        提交
      </Button>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const taskId = ref('')
const content = ref('')
const uploadFiles = ref([])

onMounted(() => {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  const options = currentPage.options
  if (options.id) {
    taskId.value = options.id
  }
})

const chooseUpload = () => {
  uni.showActionSheet({
    itemList: ['拍照', '从相册选择', '拍摄视频'],
    success: (res) => {
      if (res.tapIndex === 0 || res.tapIndex === 1) {
        chooseImage(res.tapIndex === 0 ? 'camera' : 'album')
      } else {
        chooseVideo()
      }
    }
  })
}

const chooseImage = (sourceType) => {
  uni.chooseImage({
    sourceType: [sourceType],
    success: (res) => {
      res.tempFilePaths.forEach((path, index) => {
        uploadFiles.value.push({
          type: 'image',
          url: path,
          name: `图片${uploadFiles.value.length + 1}`
        })
      })
    }
  })
}

const chooseVideo = () => {
  uni.chooseVideo({
    sourceType: ['camera'],
    success: (res) => {
      uploadFiles.value.push({
        type: 'video',
        url: res.tempFilePath,
        name: `视频${uploadFiles.value.length + 1}`
      })
    }
  })
}

const deleteFile = (index) => {
  uploadFiles.value.splice(index, 1)
}

const submitTask = () => {
  uni.showLoading({ title: '提交中...' })
  setTimeout(() => {
    uni.hideLoading()
    uni.showToast({
      title: '提交成功',
      icon: 'success',
      success: () => {
        setTimeout(() => {
          uni.navigateBack()
        }, 1500)
      }
    })
  }, 1500)
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.task-submit-page {
  min-height: 100vh;
  background: $color-bg-page;
  padding-top: 88rpx;
  padding-bottom: 160rpx;
}

.content {
  padding: $spacing-lg;
}

.upload-section,
.text-section {
  background: $color-bg-card;
  border-radius: $radius-card;
  padding: $spacing-xl;
  margin-bottom: $spacing-lg;

  .section-title {
    display: block;
    font-size: $font-size-h3;
    font-weight: $font-weight-semibold;
    color: $color-text-primary;
    margin-bottom: $spacing-md;
  }
}

.upload-section {
  .upload-area {
    border: 2rpx dashed $color-border;
    border-radius: $radius-card;
    padding: 80rpx 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: $spacing-sm;
    background: $color-bg-page;

    .upload-icon {
      font-size: 64rpx;
    }

    .upload-text {
      font-size: $font-size-body;
      color: $color-text-secondary;
    }
  }

  .upload-list {
    display: flex;
    flex-wrap: wrap;
    gap: $spacing-md;
    margin-top: $spacing-lg;

    .upload-item {
      width: 200rpx;
      height: 200rpx;
      position: relative;
      border-radius: $radius-sm;
      overflow: hidden;

      .preview-image {
        width: 100%;
        height: 100%;
      }

      .preview-video {
        width: 100%;
        height: 100%;
        background: $color-border-light;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: $spacing-xs;

        .video-icon {
          font-size: 48rpx;
        }

        .video-name {
          font-size: $font-size-caption;
          color: $color-text-secondary;
        }
      }

      .delete-btn {
        position: absolute;
        top: 8rpx;
        right: 8rpx;
        width: 40rpx;
        height: 40rpx;
        background: rgba(0, 0, 0, 0.5);
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24rpx;
      }
    }
  }
}

.text-section {
  .textarea {
    width: 100%;
    min-height: 200rpx;
    background: $color-bg-page;
    border-radius: $radius-sm;
    padding: $spacing-md;
    font-size: $font-size-body;
    color: $color-text-primary;
    line-height: 1.6;
  }

  .word-count {
    display: block;
    text-align: right;
    font-size: $font-size-caption;
    color: $color-text-placeholder;
    margin-top: $spacing-sm;
  }
}

.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: $color-bg-card;
  padding: $spacing-lg $spacing-xl;
  box-shadow: 0 -4rpx 12rpx rgba(0, 0, 0, 0.05);
}
</style>
