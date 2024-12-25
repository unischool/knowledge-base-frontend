<template lang="pug">
  .ui.container
    .ui.active.dimmer(v-if="isLoading")
      .ui.text.loader 搜尋中...
    h1 全文檢索-創源工具
    .ui.form
      .field
        .ui.action.input
          input(type="text" autofocus v-model="searchQuery" placeholder="請輸入搜尋關鍵字...")
          button.ui.button.primary(@click="search")
            i.search.icon
            | 搜尋
    div.ui.segment#search-results(v-if="searchResults.length > 0")
      .ui.list
        .item(v-for="result in searchResults")
          .content
            .header {{ result.filename }}
            .description {{ result.content }}
            button.ui.primary.button(@click="goToResult(result.filename)") 下載檔案
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
      axios.get('https://knowledge-base-backend.leechiuhui.workers.dev/api/download/' + encodeURIComponent(filename))
      .then((response) => {
        console.log(response);
      })
        .catch((error) => {
          console.error(error);
        });

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
</style>
