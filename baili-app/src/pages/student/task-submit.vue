&lt;template&gt;
  &lt;view class="task-submit-page"&gt;
    &lt;Navbar title="提交任务" /&gt;

    &lt;view v-if="loading" class="loading-container"&gt;
      &lt;text class="loading-text"&gt;加载中...&lt;/text&gt;
    &lt;/view&gt;

    &lt;view v-else-if="!task" class="empty-container"&gt;
      &lt;EmptyState description="任务不存在" /&gt;
    &lt;/view&gt;

    &lt;view v-else class="content"&gt;
      &lt;view class="task-info-card"&gt;
        &lt;view class="task-info-header"&gt;
          &lt;view class="task-type-badge" :class="task.type"&gt;
            &lt;text v-if="task.type === 'homework'"&gt;📝 作业&lt;/text&gt;
            &lt;text v-else&gt;🔥 打卡&lt;/text&gt;
          &lt;/view&gt;
        &lt;/view&gt;
        &lt;text class="task-info-title"&gt;{{ task.title }}&lt;/text&gt;
        &lt;view class="task-info-meta"&gt;
          &lt;text class="task-info-date"&gt;{{ todayDate }} 第{{ (task.progress?.completedDays || 0) + 1 }}天&lt;/text&gt;
        &lt;/view&gt;
      &lt;/view&gt;

      &lt;view class="upload-section"&gt;
        &lt;view class="section-header"&gt;
          &lt;text class="section-title"&gt;上传作品&lt;/text&gt;
        &lt;/view&gt;
        &lt;view class="upload-area" @click="chooseUpload"&gt;
          &lt;view class="upload-icon"&gt;📤&lt;/view&gt;
          &lt;text class="upload-text"&gt;点击上传图片/视频/音频&lt;/text&gt;
        &lt;/view&gt;
        &lt;view v-if="uploadFiles.length &gt; 0" class="upload-list"&gt;
          &lt;view v-for="(file, index) in uploadFiles" :key="index" class="upload-item"&gt;
            &lt;view class="file-preview"&gt;
              &lt;image v-if="file.type === 'image'" :src="file.url" class="preview-image" mode="aspectFill" /&gt;
              &lt;view v-else class="preview-media"&gt;
                &lt;text class="media-icon"&gt;{{ file.type === 'video' ? '🎬' : '🎵' }}&lt;/text&gt;
                &lt;text class="media-name"&gt;{{ file.name }}&lt;/text&gt;
              &lt;/view&gt;
            &lt;/view&gt;
            &lt;view class="delete-btn" @click.stop="deleteFile(index)"&gt;
              &lt;text&gt;✕&lt;/text&gt;
            &lt;/view&gt;
          &lt;/view&gt;
        &lt;/view&gt;
      &lt;/view&gt;

      &lt;view class="text-section"&gt;
        &lt;view class="section-header"&gt;
          &lt;text class="section-title"&gt;文字说明（选填）&lt;/text&gt;
        &lt;/view&gt;
        &lt;textarea 
          class="textarea" 
          v-model="content" 
          placeholder="请输入您的练习心得..."
          :maxlength="500"
        /&gt;
        &lt;text class="word-count"&gt;{{ content.length }}/500&lt;/text&gt;
      &lt;/view&gt;
    &lt;/view&gt;

    &lt;view v-if="task" class="footer"&gt;
      &lt;Button 
        type="primary" 
        size="large" 
        :disabled="!canSubmit || submitting"
        :loading="submitting"
        @click="submitTask"
      &gt;
        {{ submitting ? '提交中...' : '提交' }}
      &lt;/Button&gt;
    &lt;/view&gt;
  &lt;/view&gt;
&lt;/template&gt;

&lt;script setup&gt;
import { ref, computed, onMounted } from 'vue'
import { useTaskStore } from '@/store/task'
import Navbar from '@/components/common/navbar.vue'
import EmptyState from '@/components/common/empty-state.vue'
import Button from '@/components/common/button.vue'

const taskStore = useTaskStore()

const taskId = ref('')
const content = ref('')
const uploadFiles = ref([])
const submitting = ref(false)

const loading = computed(() =&gt; taskStore.loading)
const task = computed(() =&gt; taskStore.currentTask)

const todayDate = computed(() =&gt; {
  const now = new Date()
  const month = (now.getMonth() + 1).toString().padStart(2, '0')
  const day = now.getDate().toString().padStart(2, '0')
  return `${month}.${day}`
})

const canSubmit = computed(() =&gt; {
  if (!task.value || submitting.value) return false
  if (uploadFiles.value.length === 0) return false
  if (task.value.todaySubmission &amp;&amp; task.value.todaySubmission.submitted) return false
  return true
})

const chooseUpload = () =&gt; {
  uni.showActionSheet({
    itemList: ['拍照', '从相册选择图片', '拍摄视频', '选择视频'],
    success: (res) =&gt; {
      if (res.tapIndex === 0 || res.tapIndex === 1) {
        chooseImage(res.tapIndex === 0 ? 'camera' : 'album')
      } else if (res.tapIndex === 2 || res.tapIndex === 3) {
        chooseVideo(res.tapIndex === 2 ? 'camera' : 'album')
      }
    }
  })
}

const chooseImage = (sourceType) =&gt; {
  uni.chooseImage({
    sourceType: [sourceType],
    count: 9,
    success: (res) =&gt; {
      res.tempFilePaths.forEach((path, index) =&gt; {
        uploadFiles.value.push({
          type: 'image',
          url: path,
          name: `图片${uploadFiles.value.length + 1}`
        })
      })
    }
  })
}

const chooseVideo = (sourceType) =&gt; {
  uni.chooseVideo({
    sourceType: [sourceType],
    success: (res) =&gt; {
      uploadFiles.value.push({
        type: 'video',
        url: res.tempFilePath,
        name: `视频${uploadFiles.value.length + 1}`
      })
    }
  })
}

const deleteFile = (index) =&gt; {
  uploadFiles.value.splice(index, 1)
}

const submitTask = async () =&gt; {
  if (!canSubmit.value) return
  
  submitting.value = true
  uni.showLoading({ title: '提交中...' })
  
  try {
    const today = new Date()
    const dateStr = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`
    
    const result = await taskStore.doSubmitTask({
      taskId: taskId.value,
      date: dateStr,
      dailyIndex: 1,
      files: uploadFiles.value.map(file =&gt; ({
        type: file.type,
        url: file.url
      }))
    })
    
    uni.hideLoading()
    uni.showToast({
      title: '提交成功',
      icon: 'success'
    })
    
    setTimeout(() =&gt; {
      uni.navigateBack()
    }, 1500)
  } catch (error) {
    uni.hideLoading()
    console.error('提交失败', error)
    uni.showToast({
      title: error.message || '提交失败，请重试',
      icon: 'none'
    })
  } finally {
    submitting.value = false
  }
}

const fetchData = async () =&gt; {
  try {
    await taskStore.fetchTaskDetail(taskId.value)
  } catch (error) {
    console.error('获取数据失败', error)
  }
}

onMounted(() =&gt; {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  const options = currentPage.options
  if (options.id) {
    taskId.value = options.id
    fetchData()
  }
})
&lt;/script&gt;

&lt;style lang="scss" scoped&gt;
@import '@/styles/variables.scss';

.task-submit-page {
  min-height: 100vh;
  background: $color-bg-page;
  padding-top: 88rpx;
  padding-bottom: 200rpx;
}

.loading-container,
.empty-container {
  padding: 200rpx 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.loading-text {
  font-size: $font-size-body;
  color: $color-text-placeholder;
}

.content {
  padding: $spacing-lg;
}

.task-info-card,
.upload-section,
.text-section {
  background: $color-bg-card;
  border-radius: $radius-card;
  padding: $spacing-xl;
  margin-bottom: $spacing-lg;
}

.task-info-card {
  .task-info-header {
    margin-bottom: $spacing-md;
  }

  .task-type-badge {
    display: inline-flex;
    align-items: center;
    padding: $spacing-xs $spacing-sm;
    border-radius: $radius-tag;
    font-size: $font-size-caption;
    font-weight: $font-weight-medium;

    &amp;.homework {
      background: $color-primary-light;
      color: $color-primary;
    }

    &amp;.checkin {
      background: $color-checkin-light;
      color: $color-checkin;
    }
  }

  .task-info-title {
    display: block;
    font-size: $font-size-h2;
    font-weight: $font-weight-bold;
    color: $color-text-primary;
    margin-bottom: $spacing-md;
  }

  .task-info-meta {
    margin-bottom: $spacing-sm;
  }

  .task-info-date {
    font-size: $font-size-body;
    color: $color-text-secondary;
  }
}

.section-header {
  margin-bottom: $spacing-lg;
}

.section-title {
  font-size: $font-size-h3;
  font-weight: $font-weight-semibold;
  color: $color-text-primary;
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
  }

  .upload-icon {
    font-size: 64rpx;
  }

  .upload-text {
    font-size: $font-size-body;
    color: $color-text-secondary;
  }

  .upload-list {
    display: flex;
    flex-wrap: wrap;
    gap: $spacing-md;
    margin-top: $spacing-lg;
  }

  .upload-item {
    width: 200rpx;
    height: 200rpx;
    position: relative;
    border-radius: $radius-sm;
    overflow: hidden;
  }

  .file-preview {
    width: 100%;
    height: 100%;
  }

  .preview-image {
    width: 100%;
    height: 100%;
  }

  .preview-media {
    width: 100%;
    height: 100%;
    background: $color-border-light;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: $spacing-xs;
  }

  .media-icon {
    font-size: 48rpx;
  }

  .media-name {
    font-size: $font-size-caption;
    color: $color-text-secondary;
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
    box-sizing: border-box;
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
  padding-bottom: calc($spacing-lg + env(safe-area-inset-bottom));
  box-shadow: 0 -4rpx 12rpx rgba(0, 0, 0, 0.05);
}
&lt;/style&gt;
