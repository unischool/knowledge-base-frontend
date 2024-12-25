<template lang="pug">
  main
    h1.ui.header AI機器人-創源工具RAG
    .ui.segment 輸入創源工具問題和R2資料庫文件做向量比對，取最高分的2個文件內容回傳。
      p 請輸入問題
      .ui.input
        input(autofocus type="text" placeholder="請輸入問題..", v-model="message", @keyup.enter="sendMessage")
        button.ui.button(@click="sendMessage") 送出
      .result
        p(v-if="isLoading") 載入中，請稍候...
        template(v-else-if="result.length > 0")
          h1 查詢結果列表如下
          table.ui.celled.table
            thead
              tr
                //- th 序號
                th 問題
                th 答案
                //- th 匹配ID
                //- th 相似度分數
                //- th MetaData
                th 動作
            tbody
              tr(v-for="(item, index) in result" :key="index")
                //- td {{ index + 1 }}
                td {{ message }}
                td {{ item.aiResponse }}
                //- td {{ item.id }}
                //- td {{ item.score.toFixed(2) }}
                //- td
                  pre {{ formatMetadata(item.metadata) }}
                td
                  button.ui.primary.button(@click="downloadFile(item.metadata)", style="min-width:10em")
                    i.download.icon
                    | 下載檔案
        p(v-else) 未找到相關結果
      .ui.dimmer(:class="{ active: isLoading }")
        .ui.loader

</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import axios from 'axios';

export default defineComponent({
  name: 'AiView',
  setup() {
    const message = ref('');
    //const result = ref('');
    const result = ref([]);// 將 result 初始化為陣列
    const isLoading = ref(false);

    const sendMessage = () => {
      if (!message.value.trim()) {
        alert('請輸入問題');
        return;
      }
      isLoading.value = true;
      result.value = [];
      console.log(message.value);

      if (!message.value.endsWith('？')) {
        message.value += '？';
      }

      //axios.get('https://knowledge-base-backend.leechiuhui.workers.dev/generateBeddings/' + message.value, {
      axios.get('https://knowledge-base-backend.leechiuhui.workers.dev/generateBeddings/' + encodeURIComponent(message.value), {
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((response) => {
        console.log(response);
        result.value = response.data; // response.data 是一個陣列
        isLoading.value = false;
      }).catch((error) => {
        console.error(error);
        isLoading.value = false;
      });
    };
    const formatMetadata = (metadata: any) => {
      return JSON.stringify(metadata, null, 2); // 格式化为带缩进的 JSON 字符串
    };
    const downloadFile = (metadata: any) => {
      console.log(metadata);
      // 下載檔案
      const fileUrl = 'https://knowledge-base-backend.leechiuhui.workers.dev/api/download/' + metadata.filename;
      window.open(fileUrl, '_blank');
    };


    /* const parseResult = (result: string) => {
      if (result === '。') {
        return '請說得詳細一點';
      }
      return result;
    };
 */
    return {
      message,
      result,
      isLoading,
      sendMessage,
      formatMetadata,
      downloadFile,
    };
  },
});
</script>

<style scoped>
.ui.segment {
  position: relative;
  margin-top: 20px;
  max-width: 100%;
}

.ui.header {
  margin-top: 1em;
}

.result {
  margin-top: 1em;
  font-size: 16px;
  line-height: 1.4;
  white-space: pre-wrap;
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

pre {
  white-space: pre-wrap;
  word-wrap: break-word;
  margin: 0;
}

.ui.dimmer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s, visibility 0.3s;
}

.ui.dimmer.active {
  opacity: 1;
  visibility: visible;
}



</style>
