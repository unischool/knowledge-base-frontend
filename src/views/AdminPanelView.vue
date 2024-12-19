<template lang="pug">
  main.workflow-container
    h1.workflow-title 創源工具知識庫RAG文件處理流程

    .workflow-section
      .workflow-header
        i.file.archive.outline.icon
        h2 文件處理與向量化流程

      .workflow-steps
        .step-card
          .step-number 01
          h3 本地端/Local端文件「doc xls pdf jpg oog png wav mp3」上傳至 Google Drive
          .step-content
            i.google.drive.icon
            .description 從本地端/Local端上傳文件到 Google Drive「準備上傳區」
            // 新增的表單部分
            .ui.form
              .field
                label 選擇文件
                .ui.action.input
                  input(
                    type="file"
                    ref="fileInput"
                    @change="handleFileChange"
                    accept="doc, xls, pdf, jpg, oog, png, wav, mp3"
                    style="display: inline-block;"
                  )
                  button.ui.primary.button(@click="uploadToGoogleDriveReady")
                    i.upload.icon
                    | 上傳至準備區
            // 新增結果顯示區域
            .upload-result
              .loading(v-if="isUploadLoading") 載入中，請稍候...
              .ui.positive.message(v-else-if="uploadResult.length > 0")
                h3 操作結果
                table.ui.celled.table
                  thead
                    tr
                      th 檔案名稱
                      th 狀態
                      th 訊息
                  tbody
                    tr(v-for="(item, index) in uploadResult" :key="index")
                      td {{ selectedFile.name }}
                      td {{ item.status }}
                      td {{ item.message }}
              .ui.negative.message(v-else-if="uploadError")
                h3 錯誤訊息
                .description {{ uploadError }}

        .step-card
          .step-number 02
          h3 Cloudflare R2 存儲
          .step-content
            i.cloud.upload.icon
            .description 將文件傳輸至 Cloudflare R2 存儲
            .tech-tag main2.ts
            ul.step-details
              li 將文件從 Google Drive「準備上傳區」傳輸至 Cloudflare R2 存儲
              li 記錄到「Cloudflare D1」數據庫 欄位有：是否已經向量化並進Cloudflare索引庫、文件路徑、檔案名稱、檔案綱要、檔案備註、檔案大小、檔案類型、上傳時間
              li 移動至 Google Drive「已上傳區」進行備份
            // 新增按鈕與結果顯示區
            button.ui.primary.button(@click="executeGDToR2Upload")
              i.upload.icon
              | 執行「準備上傳區」-> R2 並寫DB(確認後執行)

            // 顯示執行結果
            .move-result
              .loading(v-if="isMoveLoading") 載入中，請稍候...
              .ui.positive.message(v-else-if="moveResult.length > 0")
                h3 操作結果
                table.ui.celled.table
                  thead
                    tr
                      th 狀態
                      th 訊息
                  tbody
                    tr(v-for="(item, index) in moveResult" :key="index")
                      td {{ item.status }}
                      td {{ item.message }}
              .ui.negative.message(v-else-if="moveError") // 新增
                h3 錯誤訊息
                .description {{ moveError }}

        .step-card
          .step-number 03
          h3 向量化處理
          .step-content
            i.database.icon
            .description 將 R2 文件向量化並存入 Cloudflare 索引庫
            .tech-tag setupVectorFromR2
            ul.step-details
              li select from Cloudflare D1 數據庫 欄位「是否已經向量化並進Cloudflare索引庫」 等於 false的id選出來
              li 將 選出的id 從 Cloudflare R2 存儲庫 提取後向量化存入 Cloudflare 索引庫
              li 更新 Cloudflare D1 數據庫 將欄位「是否已經向量化並進Cloudflare索引庫」 等於 true

    h1.ui.header 創源工具-索引建立

    .ui.segment
      h2 步驟一：建立向量索引
      .ui.message.info
        .description 此步驟將建立向量索引，用於後續的文件檢索

      .ui.input
        input(
          type="text"
          placeholder="請輸入索引名稱.."
          v-model="indexName"
          @keyup.enter="createIndex"
        )
        button.ui.primary.button(@click="createIndex")
          i.plus.icon
          | 建立索引

      .result
        .loading(v-if="isLoading") 載入中，請稍候...
        .ui.positive.message(v-else-if="result.length > 0")
          h3 操作結果
          table.ui.celled.table
            thead
              tr
                th 索引名稱
                th 狀態
                th 訊息
            tbody
              tr(v-for="(item, index) in result" :key="index")
                td {{ indexName }}
                td {{ item.status }}
                td {{ item.message }}
        .ui.negative.message(v-else-if="error")
          h3 錯誤訊息
          .description {{ error }}

    .ui.segment
      h2 步驟二：刪除向量索引
      .ui.message.warning
        .description 此步驟將刪除向量索引，請謹慎操作

      .ui.input
        input(
          type="text"
          placeholder="請輸入要刪除的索引名稱.."
          v-model="deleteIndexName"
          @keyup.enter="deleteIndex"
        )
        button.ui.negative.button(@click="deleteIndex")
          i.trash.icon
          | 刪除索引

      .delete-result
        .loading(v-if="isDeleteLoading") 載入中，請稍候...
        .ui.positive.message(v-else-if="deleteResult.length > 0")
          h3 操作結果
          table.ui.celled.table
            thead
              tr
                th 索引名稱
                th 狀態
                th 訊息
            tbody
              tr(v-for="(item, index) in deleteResult" :key="index")
                td {{ deleteIndexName }}
                td {{ item.status }}
                td {{ item.message }}
        .ui.negative.message(v-else-if="deleteError")
          h3 錯誤訊息
          .description {{ deleteError }}

    .ui.segment
      h2 步驟四：批量 R2 文件向量化
      .ui.message.info
        .description 此步驟將對指定範圍內的 R2 文件進行批量向量化處理

      .ui.form
        .two.fields
          .field
            label 起始檔案編號
            input(
              type="number"
              placeholder="請輸入起始編號.."
              v-model="startNumber"
              min="1"
            )
          .field
            label 結束檔案編號
            input(
              type="number"
              placeholder="請輸入結束編號.."
              v-model="endNumber"
              min="1"
            )

        button.ui.teal.button(@click="vectorizeR2FileRange")
          i.files.icon
          | 批量向量化

      .batch-vectorize-result
        .loading(v-if="isBatchVectorizeLoading") 載入中，請稍候...
        .ui.positive.message(v-else-if="batchVectorizeResult.length > 0")
          h3 操作結果
          table.ui.celled.table
            thead
              tr
                th 處理範圍
                th 狀態
                th 訊息
            tbody
              tr(v-for="(item, index) in batchVectorizeResult" :key="index")
                td {{ startNumber }} - {{ endNumber }}
                td {{ item.status }}
                td {{ item.message }}
        .ui.negative.message(v-else-if="batchVectorizeError")
          h3 錯誤訊息
          .description {{ batchVectorizeError }}
  </template>

  <script lang="ts">
  import { defineComponent, ref } from 'vue';
  import axios, { AxiosError } from 'axios';

  // 定義結果介面
  interface ResultItem {
    status: string;
    message: string;
  }
  interface ErrorResponse {
    message: string;
  }

  export default defineComponent({
    name: 'AdminPanelView',
    setup() {
      const indexName = ref('');
      // 明確定義陣列類型
      const fileInput = ref<HTMLInputElement | null>(null);
      const selectedFile = ref<File | null>(null);

      const handleFileChange = (event: Event) => {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files[0]) {
          const file = input.files[0];
          // 定義允許的檔案類型
          const allowedTypes = [
            'application/msword', // .doc
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
            'application/vnd.ms-excel', // .xls
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
            'application/pdf', // .pdf
            'image/jpeg', // .jpg
            'image/png', // .png
            'audio/ogg', // .ogg
            'audio/wav', // .wav
            'audio/mpeg', // .mp3
          ];

          // 檢查檔案類型
          if (!allowedTypes.includes(file.type)) {
            alert('請只上傳：doc, xls, pdf, jpg, oog, png, wav, mp3 的檔案格式');
            // 清除選擇的檔案
            input.value = '';
            selectedFile.value = null;
            return;
          }
          // 如果檔案格式正確 ,則設置 selectedFile
          selectedFile.value = file;
        }
      };

      //const uploadFileName = ref('');
      const uploadResult = ref<ResultItem[]>([]);
      const isUploadLoading = ref(false);
      const uploadError = ref('');

      const result = ref<ResultItem[]>([]);
      const isLoading = ref(false);
      const error = ref('');

      const deleteIndexName = ref('');
      const deleteResult = ref<ResultItem[]>([]);
      const isDeleteLoading = ref(false);
      const deleteError = ref('');

      const startNumber = ref('');
      const endNumber = ref('');
      const batchVectorizeResult = ref<ResultItem[]>([]);
      const isBatchVectorizeLoading = ref(false);
      const batchVectorizeError = ref('');

      // 新增 用於執行 from GD to R2 的狀態
      const isMoveLoading = ref(false); // 新增
      const moveResult = ref<ResultItem[]>([]); // 新增
      const moveError = ref(''); // 新增

      // 上傳至Google Drive準備區
      const uploadToGoogleDriveReady = async () => {
        if (!selectedFile.value) {
          alert('請選擇檔案');
          return;
        }

        isUploadLoading.value = true;
        uploadError.value = '';
        uploadResult.value = [];

        try {
          // 創建 FormData 對象
          const formData = new FormData();
          formData.append('file', selectedFile.value);
          console.log('selectedFile.value.name:', selectedFile.value.name);
          console.log('selectedFile.value.type:', selectedFile.value.type);
          console.log('selectedFile.value.size:', selectedFile.value.size);
          console.log('formData:', formData);
          console.log('formData.get("file"):', formData.get('file'));


          const response = await axios.post(
            'https://knowledge-base-backend.leechiuhui.workers.dev/uploadToGoogleDriveReady',
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            }
          );

          console.log('response:', response);
          console.log('response.data:', response.data);
            uploadResult.value = [{
            status: '成功',
            message: '檔案已上傳至準備區'
          }];
        } catch (err) {
          console.log('err:', err);
          console.error(err);
          const axiosError = err as AxiosError<ErrorResponse>;
          const errorData = axiosError.response?.data as ErrorResponse;
          uploadError.value = errorData?.message || '上傳檔案時發生錯誤';
        } finally {
          isUploadLoading.value = false;
        }
      };

      // 建立向量索引
      const createIndex = async () => {
        if (!indexName.value.trim()) {
          alert('請輸入索引名稱');
          return;
        }

        isLoading.value = true;
        error.value = '';
        result.value = [];

        try {
          const response = await axios.get(
            'https://knowledge-base-backend.leechiuhui.workers.dev/vectorize/createVectorizeIndex/' +
            encodeURIComponent(indexName.value),
            {
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );

          console.log(response);
          result.value = [{
            status: '成功',
            message: '索引建立完成'
          }];
        } catch (err) {
            console.error(err);
          const axiosError = err as AxiosError<ErrorResponse>;
          // 使用类型断言
          const errorData = axiosError.response?.data as ErrorResponse;
          error.value = errorData?.message || '建立索引時發生錯誤';
        } finally {
          isLoading.value = false;
        }
      };


      const deleteIndex = async () => {
        if (!deleteIndexName.value.trim()) {
          alert('請輸入索引名稱');
          return;
        }

        isDeleteLoading.value = true;
        deleteError.value = '';
        deleteResult.value = [];

        try {
          const response = await axios.get(
            'https://knowledge-base-backend.leechiuhui.workers.dev/vectorize/deleteVectorizeIndex/' +
            encodeURIComponent(deleteIndexName.value),
            {
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );
          console.log('deleteIndex後第一次response訊息：');
          console.log(response);
          deleteResult.value = [{
            status: '成功',
            message: '索引刪除完成'
          }];
        } catch (err) {
          console.error(err);
          const axiosError = err as AxiosError<ErrorResponse>;
          const errorData = axiosError.response?.data as ErrorResponse;
          deleteError.value = errorData?.message || '刪除索引時發生錯誤';
        } finally {
          isDeleteLoading.value = false;
        }
      };

      const vectorizeR2FileRange = async () => {
        if (!startNumber.value || !endNumber.value) {
          alert('請輸入起始和結束編號');
          return;
        }

        const start = parseInt(startNumber.value);
        const end = parseInt(endNumber.value);

        if (start > end) {
          alert('起始編號不能大於結束編號');
          return;
        }

        isBatchVectorizeLoading.value = true;
        batchVectorizeError.value = '';
        batchVectorizeResult.value = [];

        try {
          const response = await axios.get(
            `https://knowledge-base-backend.leechiuhui.workers.dev/setupVectorFromR2/${start}/${end}`,
            {
              headers: {
              'Content-Type': 'application/json',
              },
            }
          );
          console.log('&&&&response:', response);
          console.log('********response.data:', response.data);
          batchVectorizeResult.value = [{
            status: '成功',
            message: `已完成第 ${start} 到第 ${end} 個檔案的向量化`
          }];
          console.log('********batchVectorizeResult:', batchVectorizeResult.value);

        } catch (err) {
          console.log('********err:', err);
          console.error(err);
          const axiosError = err as AxiosError<ErrorResponse>;
          const errorData = axiosError.response?.data as ErrorResponse;
          batchVectorizeError.value = errorData?.message || '批量向量化處理時發生錯誤';
        } finally {
        isBatchVectorizeLoading.value = false;
        }
      };

      // 新增：執行「準備上傳區」-> R2 的函數
      const executeGDToR2Upload = async () => {
        const confirmed = confirm('是否確定要將Google Drive「準備上傳區」的檔案全部搬移到 R2 並寫入D1資料庫？');
        if (!confirmed) return;

      isMoveLoading.value = true;
      moveError.value = '';
      moveResult.value = [];

      try {
        const response = await axios.get(
          'https://knowledge-base-backend.leechiuhui.workers.dev/uploadFromGDToR2',
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        // 將回傳結果寫入 moveResult
        moveResult.value = [{
          status: '成功',
          message: '文件已從「準備上傳區」成功搬移至R2並寫入D1資料庫，並移動至「已上傳區」。'
        }];
      } catch (err) {
        const axiosError = err as AxiosError<ErrorResponse>;
        const errorData = axiosError.response?.data as ErrorResponse;
        moveError.value = errorData?.message || '執行從GD到R2操作時發生錯誤';
        } finally {
          isMoveLoading.value = false;
        }
      };



      return {
        indexName,
        fileInput,
        selectedFile,
        handleFileChange,
       // uploadFileName,
        uploadResult,
        isUploadLoading,
        uploadError,
        uploadToGoogleDriveReady,
        result,
        isLoading,
        error,
        createIndex,
        deleteIndexName,
        deleteResult,
        isDeleteLoading,
        deleteError,
        deleteIndex,
        startNumber,
        endNumber,
        batchVectorizeResult,
        isBatchVectorizeLoading,
        batchVectorizeError,
        vectorizeR2FileRange,
        // 新增的參數
        isMoveLoading,
        moveResult,
        moveError,
        executeGDToR2Upload,
      };
    },
  });
  </script>

<style scoped>
.workflow-container {
  padding: 2rem;
}

.workflow-title {
  margin-bottom: 2rem;
  color: #2c3e50;
}

.workflow-section {
  margin-bottom: 3rem;
}

.workflow-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.workflow-steps {
  display: grid;
  gap: 2rem;
}

.step-card {
  position: relative;
  padding: 2rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: white;
}

.step-number {
  position: absolute;
  top: -15px;
  left: -15px;
  background: #2185d0;
  color: white;
  width: 50px;
  height: 50px;
  border-radius: 90%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.step-content {
  margin-top: 1rem;
}

.description {
  margin: 1rem 0;
  color: #666;
}

.tech-tag {
  display: inline-block;
  background: #e8f0fe;
  color: #1a73e8;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  margin: 0.5rem 0;
  font-size: 0.9em;
}

.step-details {
  margin-top: 1rem;
  padding-left: 1.5rem;
}

.loading {
  text-align: center;
  padding: 1rem;
  color: #666;
}

.ui.input {
  margin: 1rem 0;
}

.result,
.delete-result,
.batch-vectorize-result {
  margin-top: 1.5rem;
}

i.icon {
  font-size: 2em;
  color: #2185d0;
}
.ui.action.input {
  display: flex;
  flex-wrap: wrap; /* 允許元素換行 */
  gap: 0.5rem;
  width: 100%;
  max-width: 100%;
}

.ui.action.input input[type="file"] {
  flex: 1;
  min-width: 200px; /* 設置最小寬度 */
  max-width: 100%;
}

.ui.primary.button {
  white-space: nowrap; /* 防止按鈕文字換行 */
  margin: 0.5rem 0;
}

/* 添加響應式設計 */
@media screen and (max-width: 768px) {
  .ui.action.input {
    flex-direction: column; /* 在手機版時改為垂直排列 */
  }

  .ui.action.input input[type="file"] {
    width: 100%;
  }

  .ui.primary.button {
    width: 100%; /* 按鈕占滿整行 */
    margin-top: 0.5rem;
  }

  .step-card {
    padding: 1.5rem; /* 減少卡片內邊距 */
    margin: 1rem 0; /* 增加卡片間距 */
  }
}

/* 確保整體容器有適當的邊距 */
.workflow-container {
  padding: 1rem;
  max-width: 100%;
  overflow-x: hidden; /* 防止水平滾動 */
}


</style>
