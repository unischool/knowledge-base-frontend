<template lang="pug">
  main
    h1.ui.header 至青宇宙學校知識庫

    .ui.container
      .ui.grid
        .four.column.row
          .column
            .ui.segment.color-block(style="background-color: #A9D08E;")
              h3 第一類
              p 歷年課程
          .column
            .ui.segment.color-block(style="background-color: #FFD966;")
              h3 第二類
              p 創源工具
          .column
            .ui.segment.color-block(style="background-color: #F4B084;")
              h3 重要事件
              p 埋光墩等資料
          .column
            .ui.segment.color-block(style="background-color: #9DC3E6;")
              h3 應用
              p 技術工具項目

        .four.column.row
          .column
            .ui.segment.color-block(style="background-color: #A9D08E;")
              h4 2012年
              p 第一頁歷史資料
          .column
            .ui.segment.color-block(style="background-color: #FFD966;")
              h4 技術
              p 神聖季節資料
          .column
            .ui.segment.color-block(style="background-color: #F4B084;")
              h4 個論
              p 創源工具描述
          .column
            .ui.segment.color-block(style="background-color: #9DC3E6;")
              h4 工具項目
              p 金字塔、擺輪等

  </template>

  <script lang="ts">
  import { defineComponent } from 'vue'

  export default defineComponent({
    name: 'HomeView',
  })
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

  .color-block h3, .color-block h4 {
    margin-bottom: 0.5rem;
  }

  .color-block p {
    margin: 0;
    font-size: 1rem;
  }
  </style>
