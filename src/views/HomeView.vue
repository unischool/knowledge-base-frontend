<template lang="pug">
  main
    //- <TheWelcome />

    .ui.form.container
      .ui.field
        .ui.search.icon.input
          input(v-model="mySearch", placeholder="Search...", @input="handleSearch")
          i.search.icon

    .ui.segment.container(v-if="mySearch.length > 0 && keywordsWithFiles.filter((keyword) => keyword.keyword.includes(mySearch)).length > 0")
      button.keyword.ui.button(v-for="keyword in keywordsWithFiles", @click="handleClick(keyword)", v-show="mySearch.length > 0 && keyword.keyword.includes(mySearch)")
        | {{ keyword.keyword }}

    div.ui.segment(v-if="selectedKeyword.keyword")
      div.ui.header(v-if="selectedKeyword.keyword") 和 {{ selectedKeyword.keyword }} 相關的文件：
      div.ui.list
        div.ui.item(v-for="file in selectedKeyword.files")
          button.ui.basic.purple.button(@click="handleFileClick(file)") {{ file }}

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
