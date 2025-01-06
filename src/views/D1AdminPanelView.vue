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
              th 檔案內容
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
              td.file-type {{ record.filetype }}
              td {{ formatDate(record.uploadeddate) }}
              td {{ record.indexeddate ? formatDate(record.indexeddate) : '尚未向量化' }}
              td.content-cell
                span(v-if="!editMode || editingId !== record.id") {{ record.content }}
                div.edit-overlay(v-if="editMode && editingId === record.id")
                  textarea.edit-textarea(v-model="editContent", rows="10")
                  button.ui.primary.button(@click="saveEdit(record.id)")
                    i.save.icon 保存
              td
                .ui.mini.vertical.buttons
                  button.ui.mini.primary.button(v-if="!editMode"
                    @click="editRecord(record.id)"
                  )
                    i.edit.icon
                    | 編輯
                  button.ui.mini.primary.button(v-else
                    @click="saveEdit(record.id)"
                  )
                    i.save.icon
                    | 保存
                  //- button.ui.mini.button(
                  //-   @click="deleteRecord(record.id)"
                  //-   :class="{ loading: isDeletingId === record.id }"
                  //- )
                  //-   i.trash.icon
                  //-   | 刪除整個檔案
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
      const editMode = ref(false)
      const editContent = ref('')
      const editingId = ref<number | null>(null)

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
          // 待實作刪除邏輯
          await axios.delete(`https://knowledge-base-backend.leechiuhui.workers.dev/D1AdminPanel`, {
            data: {
              id: id
            }
          })
          records.value = records.value.filter(record => record.id !== id)
        } catch (err) {
          console.error('刪除錯誤:', err)
          error.value = '刪除記錄時發生錯誤'
        } finally {
          isDeletingId.value = null
        }
      }

      const editRecord = (id: number) => {
        editingId.value = id
        editMode.value = true
        editContent.value = records.value.find(record => record.id === id)?.content || ''
      }

      const saveEdit = async (id: number) => {
        // 待串接保存編輯內容的邏輯
        console.log('saveEdit', editContent.value)
        editingId.value = null
        editMode.value = false
        await axios.patch(`https://knowledge-base-backend.leechiuhui.workers.dev/D1AdminPanel`, {
          id: id,
          content: editContent.value
        }).then((response) => {
          console.log('response', response)
          loadRecords()
        })
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
        deleteRecord,
        editingId,
        editMode,
        editContent,
        editRecord,
        saveEdit
      }
    }
  })
  </script>

  <style scoped>
/* 基本樣式 */
th, td {
  min-width: 5em;
}

.file-type {
  max-width: 5em;
  overflow: auto;
  white-space: nowrap;
}

.content-cell {
  width: 200px;
  height: 160px;
  overflow: auto;
  text-overflow: ellipsis;
  white-space: pre-wrap;
  display: block;
  word-break: break-all;
}

.data-table table td {
  vertical-align: top;
}

/* 浮動編輯樣式 */
.edit-overlay {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60%;
  padding: 20px;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  z-index: 1000;
}

.edit-textarea {
  width: 100%;
  height: 300px;
  font-size: 1rem;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  resize: none;
  box-sizing: border-box;
}

body {
  overflow: hidden; /* 防止背景滾動 */
}
</style>
