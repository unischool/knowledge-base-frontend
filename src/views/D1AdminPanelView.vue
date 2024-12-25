<template lang="pug">
main.d1-admin-container
  h1.panel-title D1 資料庫管理面板

  .panel-section
    .section-header
      i.database.icon
      h2 知識庫索引資料列表

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
            th 向量化狀態
            th 檔案路徑
            th 檔案名稱
            th 檔案大小
            th 檔案類型
            th 上傳時間
            th 向量化時間
            th 操作
        tbody
          tr(v-for="record in records" :key="record.id")
            td {{ record.id }}
            td
              .ui.label(
                :class="record.havebeenIndexed ? 'green' : 'yellow'"
              ) {{ record.havebeenIndexed ? '已向量化' : '未向量化' }}
            td {{ record.filepath }}
            td {{ record.filename }}
            td {{ formatFileSize(record.filesize) }}
            td {{ record.filetype }}
            td {{ formatDate(record.uploadeddate) }}
            td {{ record.indexeddate ? formatDate(record.indexeddate) : '尚未向量化' }}
            td
              button.ui.mini.button(
                @click="deleteRecord(record.id)"
                :class="{ loading: isDeletingId === record.id }"
              )
                i.trash.icon
                | 刪除
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import axios from 'axios'

interface D1Record {
  id: number
  havebeenIndexed: number
  filepath: string
  filename: string
  fileoutline: string | null
  filenote: string | null
  filesize: string
  filetype: string
  content: string
  year: number
  uploadeddate: number
  indexeddate: number | null
}

interface ApiResponse {
  success: boolean
  message: string
  data: D1Record[]
}

export default defineComponent({
  name: 'D1AdminPanelView',
  setup() {
    const records = ref<D1Record[]>([])
    const isLoading = ref(false)
    const error = ref('')
    const isDeletingId = ref<number | null>(null)

    const loadRecords = async () => {
      try {
        isLoading.value = true
        error.value = ''

        const response = await axios.get<ApiResponse>(
          'https://knowledge-base-backend.leechiuhui.workers.dev/D1AdminPanel'
        )

        if (response.data.success) {
          records.value = response.data.data
        } else {
          throw new Error(response.data.message)
        }
      } catch (err) {
        console.error('載入錯誤:', err)
        error.value = err instanceof Error ? err.message : '載入資料時發生錯誤'
      } finally {
        isLoading.value = false
      }
    }

    const formatFileSize = (size: string) => {
      return size || '未知'
    }

    const formatDate = (timestamp: number) => {
      return new Date(timestamp).toLocaleString('zh-TW')
    }

    const deleteRecord = async (id: number) => {
      if (!confirm('確定要刪除此筆記錄嗎？')) return

      isDeletingId.value = id
      try {
        // 實作刪除邏輯
        await axios.delete(`https://knowledge-base-backend.leechiuhui.workers.dev/D1AdminPanel/${id}`)
        records.value = records.value.filter(record => record.id !== id)
      } catch (err) {
        console.error('刪除錯誤:', err)
        error.value = '刪除記錄時發生錯誤'
      } finally {
        isDeletingId.value = null
      }
    }

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
