<template lang="pug">
  main
    h1.ui.header Drago測試
    .ui.segment 輸入問題和R2資料庫文件做向量比對，取最相似(餘弦相似度>0.85)的文件內容回傳
      .ui.input
        input(autofocus type="text" placeholder="輸入文字..." v-model="message" @keyup.enter="sendMessage")
        button.ui.button(@click="sendMessage")  送出
    .result
      p 結果
      p(v-if="result === '' && message !== '' && isLoading") 載入中，請稍候...
      p(v-else-if="result !== ''") {{ parseResult(result) }}
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

      axios.get('https://knowledge-base-backend.leechiuhui.workers.dev/generateKeywords/' + message.value, {
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
    };
  },
});
</script>

<style scoped>
.ui.segment {
  margin-top: 20px;
  max-width: 480px;
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
</style>
