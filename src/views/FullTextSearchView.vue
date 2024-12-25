<template lang="pug">
  .ui.container
    .ui.active.dimmer(v-if="isLoading")
      .ui.text.loader 搜尋中...
    h1 全文檢索-創源工具
    .ui.form
      .field
        .ui.action.input
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
    div.ui.segment#search-results(v-if="searchResults.length > 0")
      table.ui.stackable.celled.table
        thead
          tr
            th 檔案名稱
            th 內文
            th.actions 操作
        tbody
          tr(v-for="result in searchResults")
            td
              div {{ result.filename }}
            td
              div(v-html="highlightKeyword(result.content)")
            td.actions
              button.ui.primary.button(@click="goToResult(result.filename)")
                i.download.icon
                | 下載檔案
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
    }
  },
  methods: {
    search() {
      // TODO: 實作全文檢索
      // 1. 使用API取得搜尋結果
      // 結果的json格式應如下(backend待橋接)：
      // {
      //   "filename": "example.pdf",
      //   "content": "This is the content of the file."
      // }

      this.isLoading = true;
      axios.get('https://knowledge-base-backend.leechiuhui.workers.dev/api/search/' + encodeURIComponent(this.searchQuery))
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
      // TODO: 實作下載檔案
      // 1. 使用API下載檔案

      const fileUrl = 'https://knowledge-base-backend.leechiuhui.workers.dev/api/download/' + filename;
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
      return escapedContent.replace(regex, match => `<mark>${match}</mark>`);
    }
  }
})
</script>

<style scoped>
.ui.action.input {
  max-width: 500px;
}

#search-results {
  min-height: 300px;
}

mark {
  background-color: yellow;
  padding: 0.2em;
  border-radius: 2px;
}

.ui.list .item .description {
  margin-top: 10px;
  margin-bottom: 10px;
  white-space: pre-wrap;
  word-break: break-word;
  overflow-wrap: break-word;
  max-height: 300px;
  overflow-y: auto;
}

.ui.table td {
  vertical-align: top;
}

td {
  min-width: 6em;
  white-space: pre-wrap;
  word-break: break-word;
  overflow-wrap: break-word;
}

td > div {
  max-height: 300px;
  overflow-y: auto;
}

.ui.table td.actions {
  text-align: center;
  min-width: 9.5em;
}

.ui.table td.actions button {
  padding: 10px;
}
</style>
