<template lang="pug">
  main
    h1.ui.header Drago測試
    .ui.segment 輸入創源工具問題和R2資料庫文件做向量比對，取最高分的兩個文件內容回傳。
      p 請輸入問題
      .ui.input
        input(autofocus type="text" placeholder="請輸入問題..", v-model="message", @keyup.enter="sendMessage")
        button.ui.button(@click="sendMessage") 送出
      .result
        //- p(v-if="result === '' && message !== '' && isLoading") 載入中，請稍候...
        //- p(v-else-if="result !== ''") {{ parseResult(result) }}
        p(v-if="result === '' && message !== '' && isLoading") 載入中，請稍候...
        p(v-else-if="result !== ''")
          h1 查詢結果列表如下
          table.ui.celled.table
            tbody
              tr
                td 問題
                td 答案
                td 原始文件
              tr
                td {{ message }}
                td {{ parseResult(result) }}
                td

</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import axios from 'axios';

export default defineComponent({
  name: 'DragoTestingView',
  setup() {
    const message = ref('');
    const result = ref('');
    const isLoading = ref(false);

    const sendMessage = () => {
      isLoading.value = true;
      result.value = '';
      console.log(message.value);

      if (!message.value.endsWith('？')) {
        message.value += '？';
      }

      axios.get('https://knowledge-base-backend.leechiuhui.workers.dev/generateBeddings/' + message.value, {
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((response) => {
        console.log(response);
        result.value = response.data;
        isLoading.value = false;
      });
    };

    const parseResult = (result: string) => {
      if (result === '。') {
        return '請說得詳細一點';
      }
      return result;
    };

    return {
      message,
      result,
      isLoading,
      sendMessage,
      parseResult,
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

</style>
