<template lang="pug">
main.d1-admin-container
  h1.panel-title D1 資料庫管理面板

  .panel-section
    .section-header
      i.database.icon
      h2 資料庫記錄列表

    // 載入狀態顯示
    .loading-state(v-if="isLoading")
      i.spinner.loading.icon
      span 正在載入資料...

    // 錯誤訊息顯示
    .error-message(v-if="error")
      .ui.negative.message
        i.close.icon
        .header 發生錯誤
        p {{ error }}

    // 資料表格
    .data-table(v-if="records.length > 0")
      table.ui.celled.table
        thead
          tr
            th ID
            th 檔案名稱
            th 檔案路徑
            th 檔案大小
            th 檔案類型
            th 上傳時間
            th 向量化狀態
            th 操作
        tbody
          tr(v-for="record in records" :key="record.id")
            td {{ record.id }}
            td {{ record.fileName }}
            td {{ record.filePath }}
            td {{ formatFileSize(record.fileSize) }}
            td {{ record.fileType }}
            td {{ formatDate(record.uploadTime) }}
            td
              .ui.label(
                :class="record.isVectorized ? 'green' : 'yellow'"
              ) {{ record.isVectorized ? '已向量化' : '未向量化' }}
            td
              button.ui.mini.button(
                @click="deleteRecord(record.id)"
                :class="{ loading: isDeletingId === record.id }"
              )
                i.trash.icon
                | 刪除

    // 無資料顯示
    .no-data(v-else-if="!isLoading")
      .ui.placeholder.segment
        .ui.icon.header
          i.database.icon
          | 暫無資料記錄
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import axios from 'axios'

interface D1Record {
  id: number
  fileName: string
  filePath: string
  fileSize: number
  fileType: string
  uploadTime: string
  isVectorized: boolean
}

export default defineComponent({
  name: 'D1AdminPanelView',

  setup() {
    const records = ref<D1Record[]>([])
    const isLoading = ref(true)
    const error = ref('')
    const isDeletingId = ref<number | null>(null)

    // 格式化檔案大小
    const formatFileSize = (bytes: number): string => {
      if (bytes === 0) return '0 Bytes'
      const k = 1024
      const sizes = ['Bytes', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    // 格式化日期
    const formatDate = (dateString: string): string => {
      return new Date(dateString).toLocaleString('zh-TW', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    // 載入資料
    const loadRecords = async () => {
      try {
        isLoading.value = true
        error.value = ''

        const response = await axios.get(
          'https://knowledge-base-backend.leechiuhui.workers.dev/D1AdminPanel'
        )

        records.value = response.data.records
      } catch (err) {
        error.value = err instanceof Error ? err.message : '載入資料時發生錯誤'
      } finally {
        isLoading.value = false
      }
    }

    // 刪除記錄
    const deleteRecord = async (id: number) => {
      if (!confirm('確定要刪除此記錄嗎？')) return

      try {
        isDeletingId.value = id
        await axios.delete(
          `https://knowledge-base-backend.leechiuhui.workers.dev/D1AdminPanel/${id}`
        )
        records.value = records.value.filter(record => record.id !== id)
      } catch (err) {
        error.value = err instanceof Error ? err.message : '刪除記錄時發生錯誤'
      } finally {
        isDeletingId.value = null
      }
    }

    // 組件掛載時載入資料
    onMounted(() => {
      loadRecords()
    })

    return {
      records,
      isLoading,
      error,
      isDeletingId,
      formatFileSize,
      formatDate,
      deleteRecord
    }
  }
})
</script>

<style scoped>
.d1-admin-container {
  padding: var(--spacing-lg);
  max-width: 1400px;
  margin: 0 auto;
}

.panel-title {
  color: var(--color-text);
  margin-bottom: var(--spacing-lg);
  font-size: 2rem;
}

.panel-section {
  background: var(--color-bg);
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: var(--spacing-lg);
}

.section-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-lg);
}

.section-header h2 {
  margin: 0;
  font-size: 1.5rem;
}

.loading-state {
  text-align: center;
  padding: var(--spacing-xl);
  color: var(--color-secondary);
}

.error-message {
  margin: var(--spacing-md) 0;
}

.data-table {
  overflow-x: auto;
}

.ui.table {
  margin: 0;
}

.ui.table th {
  background-color: var(--color-hover);
}

.no-data {
  text-align: center;
  padding: var(--spacing-xl);
  color: var(--color-secondary);
}

/* 響應式設計 */
@media (max-width: 768px) {
  .d1-admin-container {
    padding: var(--spacing-md);
  }

  .panel-section {
    padding: var(--spacing-md);
  }

  .ui.table {
    font-size: 0.9rem;
  }
}
</style>
