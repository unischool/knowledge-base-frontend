<template lang="pug">
  main
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
            p 從本地端/Local端上傳文件到 Google Drive「準備上傳區」


        .step-card
          .step-number 02
          h3 Cloudflare R2 存儲
          .step-content
            i.cloud.upload.icon
            p 將文件傳輸至 Cloudflare R2 存儲
            .tech-tag main2.ts
            ul.step-details
              li 將文件從 Google Drive「準備上傳區」傳輸至 Cloudflare R2 存儲
              li 記錄到「Cloudflare D1」數據庫 欄位有：是否已經向量化並進Cloudflare索引庫、文件路徑、檔案名稱、檔案綱要、檔案備註、檔案大小、檔案類型、上傳時間
              li 移動至 Google Drive「已上傳區」進行備份

        .step-card
          .step-number 03
          h3 向量化處理
          .step-content
            i.database.icon
            p 將 R2 文件向量化並存入 Cloudflare 索引庫
            .tech-tag setupVectorFromR2
            ul.step-details
              li select from Cloudflare D1 數據庫 欄位「是否已經向量化並進Cloudflare索引庫」 等於 false的id選出來
              li 將 選出的id 從 Cloudflare R2 存儲庫 提取後向量化存入 Cloudflare 索引庫
              li 更新 Cloudflare D1 數據庫 將欄位「是否已經向量化並進Cloudflare索引庫」 等於 true

    h1.ui.header 創源工具-索引建立
    .ui.segment
      h2 步驟一：建立向量索引
      .ui.message.info
        p 此步驟將建立向量索引，用於後續的文件檢索
      .ui.input
        input(type="text" placeholder="請輸入索引名稱..", v-model="indexName", @keyup.enter="createIndex")
        button.ui.primary.button(@click="createIndex")
          i.plus.icon
          | 建立索引

      .result
        p(v-if="isLoading") 載入中，請稍候...
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
        p(v-else-if="error")
          .ui.negative.message
            h3 錯誤訊息
            p {{ error }}

  .ui.segment
    h2 步驟二：刪除向量索引
    .ui.message.warning
      p 此步驟將刪除向量索引，請謹慎操作
    .ui.input
      input(type="text" placeholder="請輸入要刪除的索引名稱..", v-model="deleteIndexName", @keyup.enter="deleteIndex")
      button.ui.negative.button(@click="deleteIndex")
        i.trash.icon
        | 刪除索引

    .delete-result
      p(v-if="isDeleteLoading") 載入中，請稍候...
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
      p(v-else-if="deleteError")
        .ui.negative.message
          h3 錯誤訊息
          p {{ deleteError }}

  .ui.segment
    h2 步驟四：批量 R2 文件向量化
    .ui.message.info
      p 此步驟將對指定範圍內的 R2 文件進行批量向量化處理
    .ui.form
      .two.fields
        .field
          label 起始檔案編號
          input(type="number" placeholder="請輸入起始編號..", v-model="startNumber", min="1")
        .field
          label 結束檔案編號
          input(type="number" placeholder="請輸入結束編號..", v-model="endNumber", min="1")
      button.ui.teal.button(@click="vectorizeR2FileRange")
        i.files.icon
        | 批量向量化

    .batch-vectorize-result
      p(v-if="isBatchVectorizeLoading") 載入中，請稍候...
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
      p(v-else-if="batchVectorizeError")
        .ui.negative.message
          h3 錯誤訊息
          p {{ batchVectorizeError }}
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

          console.log(response);
          batchVectorizeResult.value = [{
            status: '成功',
            message: `已完成第 ${start} 到第 ${end} 個檔案的向量化`
          }];
        } catch (err) {
          console.error(err);
          const axiosError = err as AxiosError<ErrorResponse>;
          const errorData = axiosError.response?.data as ErrorResponse;
          batchVectorizeError.value = errorData?.message || '批量向量化處理時發生錯誤';
        } finally {
        isBatchVectorizeLoading.value = false;
        }
      };


      return {
        indexName,
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
      };
    },
  });
  </script>

  <style scoped>
  .ui.segment {
    margin-top: 20px;
    max-width: 100%;
  }

  .ui.header {
    margin-top: 1em;
  }

  .result {
    margin-top: 2em;
  }

  .ui.input {
    width: 100%;
    margin-top: 1em;
  }

  .ui.input input {
    margin-right: 1em;
  }

  .ui.message {
    margin-top: 1em;
  }

  table {
    border-collapse: collapse;
    width: 100%;
  }

  th, td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
    vertical-align: top;
  }

  th {
    background-color: #f4f4f4;
  }

  .ui.button {
    margin-left: 1em;
  }

  .ui.message.info {
    background-color: #f8ffff;
    color: #276f86;
    box-shadow: 0 0 0 1px #a9d5de inset, 0 0 0 0 transparent;
  }

  .ui.positive.message {
    background-color: #fcfff5;
    color: #2c662d;
    box-shadow: 0 0 0 1px #a3c293 inset, 0 0 0 0 transparent;
  }

  .ui.negative.message {
    background-color: #fff6f6;
    color: #9f3a38;
    box-shadow: 0 0 0 1px #e0b4b4 inset, 0 0 0 0 transparent;
  }

.ui.teal.button {
  background-color: #00b5ad;
  color: #fff;
}

.ui.teal.button:hover {
  background-color: #009c95;
}

.batch-vectorize-result {
  margin-top: 2em;
}

.two.fields {
  display: flex;
  gap: 1em;
  margin-bottom: 1em;
}

.field {
  flex: 1;
}

.field label {
  display: block;
  margin-bottom: 0.5em;
  font-weight: bold;
}

.field input {
  width: 100%;
  padding: 0.5em;
  border: 1px solid #ddd;
  border-radius: 4px;
}
.workflow-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.workflow-title {
  font-size: 2.5rem;
  color: #24292e;
  margin-bottom: 2rem;
  border-bottom: 2px solid #e1e4e8;
  padding-bottom: 1rem;
}

.workflow-section {
  background: #ffffff;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.12);
  padding: 2rem;
}

.workflow-header {
  display: flex;
  align-items: center;
  margin-bottom: 2rem;

  h2 {
    margin: 0;
    margin-left: 1rem;
    color: #24292e;
    font-size: 1.8rem;
  }

  i {
    font-size: 2rem;
    color: #0366d6;
  }
}

.workflow-steps {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.step-card {
  background: #f6f8fa;
  border-radius: 8px;
  padding: 1.5rem;
  position: relative;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-5px);
  }
}

.step-number {
  position: absolute;
  top: -15px;
  left: -15px;
  background: #0366d6;
  color: white;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.step-content {
  margin-top: 1rem;

  i {
    font-size: 1.5rem;
    color: #0366d6;
    margin-right: 0.5rem;
  }

  p {
    color: #586069;
    margin: 0.5rem 0;
  }
}

.step-details {
  list-style: none;
  padding-left: 1rem;
  margin-top: 0.5rem;

  li {
    color: #586069;
    margin: 0.3rem 0;
    position: relative;

    &:before {
      content: "→";
      color: #0366d6;
      position: absolute;
      left: -1rem;
    }
  }
}

.tech-tag {
  display: inline-block;
  background: #0366d6;
  color: white;
  padding: 0.2rem 0.8rem;
  border-radius: 12px;
  font-size: 0.9rem;
  margin-top: 0.5rem;
}
  </style>
