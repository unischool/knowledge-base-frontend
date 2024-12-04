<template lang="pug">
  main
    h1.ui.header 至青宇宙學校知識庫內容分有2類

    .ui.text.container

      .ui.list
        .item
          .content
              .header 第一類：至青宇宙學校歷年來課程
              .description 影音、逐字稿內容
        .item
          .content
            .header 第二類：創源工具
            .description 中英文工具技術資料


  //- .ui.segment.highlight-section
  //-   .ui.text.container
  //-     h1.ui.header.highlight-header
  //-       i.search.icon
  //-       .content
  //-         | 創源工具資料搜尋
  //-       .sub.header (資料逐步上傳目前可測試中)

  //-   .ui.form.container.search-container
  //-     .ui.field
  //-       .ui.large.search.icon.input
  //-         input(
  //-           v-model="mySearch",
  //-           placeholder="請輸入關鍵字搜尋...",
  //-           @input="handleSearch"
  //-         )
  //-         i.search.icon

  //-   .ui.segment.container.results-container(
  //-     v-if="mySearch.length > 0 && keywordsWithFiles.filter((keyword) => keyword.keyword.includes(mySearch)).length > 0"
  //-   )
  //-     button.keyword.ui.button(
  //-       v-for="keyword in keywordsWithFiles",
  //-       @click="handleClick(keyword)",
  //-       v-show="mySearch.length > 0 && keyword.keyword.includes(mySearch)"
  //-     ) {{ keyword.keyword }}

  //-     .secondary-search-section
  //-   h2.secondary-title
  //-     | 至青宇宙學校歷年來課程影音文字搜尋
  //-     span.status-text (尚未上線)

  //-   .search-form
  //-     .search-field
  //-       input(
  //-         v-model="mySearch",
  //-         placeholder="Search...",
  //-         @input="handleSearch"
  //-       )
  //-       i.search.icon

  //-   .search-results(
  //-     v-if="mySearch.length > 0 && keywordsWithFiles.filter((keyword) => keyword.keyword.includes(mySearch)).length > 0"
  //-   )
  //-     button.secondary-keyword-btn(
  //-       v-for="keyword in keywordsWithFiles",
  //-       @click="handleClick(keyword)",
  //-       v-show="mySearch.length > 0 && keyword.keyword.includes(mySearch)"
  //-     ) {{ keyword.keyword }}

  //-   .related-files(v-if="selectedKeyword.keyword")
  //-     h3.files-title 和 {{ selectedKeyword.keyword }} 相關的文件：
  //-     .files-list
  //-       button.file-btn(
  //-         v-for="file in selectedKeyword.files",
  //-         @click="handleFileClick(file)"
  //-       ) {{ file }}
</template>




<script lang="ts">

import { defineComponent } from 'vue'
// import TheWelcome from '../components/TheWelcome.vue'

export default defineComponent({
  name: 'HomeView',
  props: {
    keywordsWithFiles: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      selectedKeyword: {
        keyword: '',
        files: [],
      },
      mySearch: '',
    }
  },
  methods: {
    handleSearch() {
      console.log(this.mySearch)
      this.selectedKeyword = {
        keyword: '',
        files: [],
      }
    },
    handleClick(keyword: any) {
      this.selectedKeyword = keyword
    },
    handleFileClick(file: string) {
      console.log(file)
      window.open(`https://knowledge-base-backend.leechiuhui.workers.dev/file/${file}`, '_blank')
    },
  },
})
</script>

<style scoped>
.introduction {
  font-size: 1.2em;
  line-height: 1.6;
  margin-bottom: 1.5em;
  color: #333;
}

.ui.list {
  margin-top: 1em;
}

.ui.list .item {
  padding: 0.5em 0;
}

.ui.list .header {
  font-weight: bold;
  color: #2185d0;
  margin-bottom: 0.3em;
}

.ui.list .description {
  color: #666;
}

.result {
  margin-top: 10px;
  white-space: pre-wrap;
}

.ui.segment {
  margin-top: 2em;
}

.ui.header {
  margin-top: 1.5em;
}

.secondary-search-section {
  margin-top: 4rem;
  padding: 2rem;
  background: #fafafa;
  border-radius: 8px;
  opacity: 0.8;
}

.secondary-title {
  font-size: 1.4rem;
  color: #666;
  margin-bottom: 1.5rem;
  font-weight: normal;
}

.status-text {
  font-size: 0.9rem;
  color: #999;
  margin-left: 0.5rem;
}

.search-form {
  max-width: 500px;
  margin: 0 auto;
}

.search-field {
  position: relative;
  margin-bottom: 1.5rem;
}

.search-field input {
  width: 100%;
  padding: 0.8rem 2.5rem 0.8rem 1rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: #fff;
  color: #666;
  font-size: 1rem;
}

.search-field input:focus {
  outline: none;
  border-color: #ccc;
  box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.05);
}

.search-field i.search.icon {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
}

.search-results {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
  margin-top: 1rem;
}

.secondary-keyword-btn {
  padding: 0.5rem 1rem;
  background: #f0f0f0;
  border: 1px solid #ddd;
  border-radius: 4px;
  color: #666;
  cursor: pointer;
  transition: all 0.2s ease;
}

.secondary-keyword-btn:hover {
  background: #e8e8e8;
  color: #333;
}

.related-files {
  margin-top: 2rem;
  padding: 1.5rem;
  background: #fff;
  border-radius: 6px;
}

.files-title {
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 1rem;
}

.files-list {
  display: grid;
  gap: 0.8rem;
}

.file-btn {
  padding: 0.6rem 1rem;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  color: #666;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
}

.file-btn:hover {
  background: #f5f5f5;
  border-color: #ccc;
}

@media (max-width: 768px) {
  .secondary-search-section {
    padding: 1.5rem;
    margin-top: 3rem;
  }

  .secondary-title {
    font-size: 1.2rem;
  }

  .search-field input {
    padding: 0.6rem 2rem 0.6rem 0.8rem;
  }
}
</style>
