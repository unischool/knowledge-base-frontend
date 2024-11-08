<template lang="pug">
div
  h1 至青宇宙學校課程一覽表：

  table.ui.celled.stackable.table
    thead
      tr
        th ID
        th 課程類別
        th 課程名稱
        th 課程描述
        th 建立資料日期
        th 更新資料日期
    tbody
      tr(v-for="item in data" :key="item.id")
        td {{ item.id }}
        td {{ item.course_type }}
        td {{ item.title }}
        td {{ item.description }}
        td {{ item.created_at }}
        td {{ item.updated_at }}
</template>

<script lang="ts">
import axios from 'axios'

export default {
  data() {
    return {
      data: [],
    }
  },
  mounted() {
    // 在組件掛載時發送請求
    axios.get('https://knowledge-base-backend.leechiuhui.workers.dev/Courses')
      .then(response => {
        console.log(response.data); // 檢查資料格式
        this.data = response.data
      })
      .catch(error => {
        console.error('出錯了', error)
      })
  }
}
</script>

<!-- <style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style> -->
<style scoped>
table {
  width: 100%;
}

th, td {
  padding: 0.5rem;
  text-align: left;
  min-width: 120px;
}

.description {
  white-space: pre-wrap;
  min-width: 200px;
}
</style>
