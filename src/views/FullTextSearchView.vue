<template lang="pug">
  .ui.container
    .ui.active.dimmer(v-if="isLoading")
      .ui.text.loader 搜尋中...
    .ui.segment.color-block(style="background-color: #FFD966;")
      h1 全文檢索 - 創源工具
      .ui.input-area
        .ui.input
          input(
            type="text"
            autofocus
            v-model="searchQuery"
            placeholder="請輸入搜尋關鍵字..."
            @keyup.enter="search"
          )
        button.ui.button.primary(@click="search")
          i.search.icon
          | 搜尋
    .ui.segment.color-block(style="background-color: #A9D08E; margin-top: 20px;", v-if="searchResults.length > 0")
      h2 查詢結果
      table.ui.stackable.celled.table
        thead
          tr
            th 檔案名稱
            th 內文
            th.actions 操作
        tbody
          tr(v-for="result in searchResults" :key="result.filename")
            td
              div {{ result.filename }}
            td
              div(v-html="highlightKeyword(result.content)")
            td.actions
              button.ui.primary.button(@click="goToResult(result.filename)")
                i.download.icon
                | 下載檔案
    p(v-else-if="!isLoading") 未找到相關結果
  </template>

  <script lang="ts">
  import axios from 'axios';
  import { defineComponent } from 'vue';

  export default defineComponent({
    name: 'FullTextSearchView',
    data() {
      return {
        searchQuery: '',
        isLoading: false,
        searchResults: []
      };
    },
    methods: {
      search() {
        if (!this.searchQuery.trim()) {
          alert('請輸入搜尋關鍵字');
          return;
        }
        this.isLoading = true;
        axios
          .get(
            'https://knowledge-base-backend.leechiuhui.workers.dev/api/search/' +
              encodeURIComponent(this.searchQuery)
          )
          .then((response) => {
            this.searchResults = response.data;
            this.isLoading = false;
          })
          .catch((error) => {
            console.error(error);
            this.isLoading = false;
          });
      },
      goToResult(filename: string) {
        const fileUrl =
          'https://knowledge-base-backend.leechiuhui.workers.dev/api/download/' + filename;
        window.open(fileUrl, '_blank');
      },
      escapeHtml(text: string): string {
        return text
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#039;');
      },
      highlightKeyword(content: string): string {
        if (!this.searchQuery) return this.escapeHtml(content);
        const escapedContent = this.escapeHtml(content);
        const escapedQuery = this.escapeHtml(this.searchQuery);
        const regex = new RegExp(escapedQuery, 'gi');
        return escapedContent.replace(regex, (match) => `<mark>${match}</mark>`);
      }
    }
  });
  </script>

  <style scoped>
  .ui.container {
    margin-top: 20px;
  }

  .color-block {
    padding: 20px;
    border-radius: 10px;
    color: white;
    transition: transform 0.3s ease;
  }

  .color-block:hover {
    transform: scale(1.05);
  }

  .ui.input-area {
    display: flex;
    gap: 10px;
    justify-content: center;
    align-items: center;
  }

  mark {
    background-color: yellow;
    padding: 0.2em;
    border-radius: 2px;
  }

  .ui.table td {
    vertical-align: top;
    word-wrap: break-word;
  }

  .ui.table td.actions {
    text-align: center;
    min-width: 150px;
  }

  .ui.table td.actions button {
    padding: 10px;
  }
  </style>
