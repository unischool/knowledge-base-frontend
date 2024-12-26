<template lang="pug">
  main
    h1.ui.header AI機器人-創源工具RAG

    .ui.container
      .ui.grid
        .row
          .column
            .ui.segment.color-block(style="background-color: #FFD966;")
              h3 輸入問題
              p 請輸入創源工具相關問題進行查詢。
              .ui.input-area
                .ui.input
                  input(
                    autofocus type="text" placeholder="請輸入問題..."
                    v-model="message" @keyup.enter="sendMessage"
                  )
                button.ui.button(@click="sendMessage") 送出
        .row
          .column
            .ui.segment.color-block(style="background-color: #A9D08E;")
              h3 查詢結果
              p(v-if="isLoading") 載入中，目前要等大概15秒以上..請稍候...
              template(v-else-if="result.length > 0")
                table.ui.celled.table
                  thead
                    tr
                      th 問題
                      th 答案
                      th 匹配ID
                      th 相似度分數
                      th MetaData
                      th 動作
                  tbody
                    tr(v-for="(item, index) in result" :key="index")
                      td {{ message }}
                      td {{ item.aiResponse }}
                      td {{ item.id }}
                      td {{ item.score.toFixed(2) }}
                      td
                        pre {{ formatMetadata(item.metadata) }}
                      td
                        button.ui.primary.button(@click="downloadFile(item.metadata)")
                          i.download.icon
                          | 下載【{{ item.metadata.filename }}】
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
      const result = ref([]);
      const isLoading = ref(false);

      const sendMessage = () => {
        if (!message.value.trim()) {
          alert('請輸入問題');
          return;
        }
        isLoading.value = true;
        result.value = [];
        if (!message.value.endsWith('？')) {
          message.value += '？';
        }

        axios
          .get(
            'https://knowledge-base-backend.leechiuhui.workers.dev/generateBeddings/' +
              encodeURIComponent(message.value),
            {
              headers: {
                'Content-Type': 'application/json',
              },
            }
          )
          .then((response) => {
            result.value = response.data;
            isLoading.value = false;
          })
          .catch((error) => {
            console.error(error);
            isLoading.value = false;
          });
      };

      const formatMetadata = (metadata: any) => {
        return JSON.stringify(metadata, null, 2);
      };

      const downloadFile = (metadata: any) => {
        const fileUrl =
          'https://knowledge-base-backend.leechiuhui.workers.dev/api/download/' +
          metadata.filename;
        window.open(fileUrl, '_blank');
      };

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
  .ui.grid {
    margin-top: 2rem;
  }

  .color-block {
    padding: 2rem;
    color: white;
    text-align: center;
    border-radius: 10px;
    cursor: pointer;
    transition: transform 0.3s ease;
  }

  .color-block:hover {
    transform: scale(1.05);
  }

  .ui.input-area {
    display: flex;
    gap: 1rem;
    justify-content: center;
    align-items: center;
    margin-top: 1rem;
  }

  .ui.celled.table {
    margin-top: 2rem;
    background: #fff;
  }

  pre {
    white-space: pre-wrap;
    word-wrap: break-word;
    margin: 0;
    font-size: 0.9rem;
    color: #333;
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
