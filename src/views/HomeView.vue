<template lang="pug">
  main
    h1.ui.header 至青宇宙學校知識庫

    .ui.container
      .ui.stackable.grid
        .four.wide.column
          .ui.segment.color-block(style="background-color: #A9D08E;")
            h3 第一類
              p 至青宇宙學校歷年課程影像 錄音 逐字稿 ppt資料
              .ui.grid.inner-grid
                .sixteen.wide.column
                  .ui.segment.inner-color-block(style="background-color: #D4E7C7;")
                    h4 初階課程
                    p 詳細內容一
                .sixteen.wide.column
                  .ui.segment.inner-color-block(style="background-color: #D4E7C7;")
                    h4 進階課程
                    p 詳細內容二
        .twelve.wide.column
          .ui.segment.color-block(style="background-color: #FFD966;")
            h3 第二類
            p 創源工具
            .ui.grid.inner-grid
              .three.column.stackable.row
                .column
                  .ui.segment.square-block(style="background-color: #FFE599;")
                    h4 吳至青博士引薦源起
                    p 詳細內容一
                .column
                  .ui.segment.square-block(style="background-color: #F4B084;")
                    h4 生命創源工具源起
                    p 詳細內容二
                .column
                  .ui.segment.square-block(style="background-color: #9DC3E6;")
                    h4 依編年事紀索引
                    p 詳細內容一
              .three.column.stackable.row
                .column
                  .ui.segment.square-block(style="background-color: #FFE599;")
                    h4 依工具類別索引
                    p 詳細內容二
                .column
                  .ui.segment.square-block(style="background-color: #F4B084;")
                    h4 重要事件
                    p 詳細內容二
                .column
                  .ui.segment.square-block(style="background-color: #9DC3E6;")
                    h4 應用
                    p 詳細內容二
          //- .column
          //-   .ui.segment.color-block(style="background-color: #F4B084;")
          //-     h3 重要事件
          //-     p 埋光墩等資料
          //-     .ui.grid.inner-grid
          //-       .two.column.row
          //-         .column
          //-           .ui.segment.inner-color-block(style="background-color: #F7C6AD;")
          //-             h4 子類別一
          //-             p 詳細內容一
          //-         .column
          //-           .ui.segment.inner-color-block(style="background-color: #F7C6AD;")
          //-             h4 子類別二
          //-             p 詳細內容二
          //- .column
          //-   .ui.segment.color-block(style="background-color: #9DC3E6;")
          //-     h3 應用
          //-     p 技術工具項目
          //-     .ui.grid.inner-grid
          //-       .two.column.row
          //-         .column
          //-           .ui.segment.inner-color-block(style="background-color: #CFE3F8;")
          //-             h4 子類別一
          //-             p 詳細內容一
          //-         .column
          //-           .ui.segment.inner-color-block(style="background-color: #CFE3F8;")
          //-             h4 子類別二
          //-             p 詳細內容二
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

  .inner-grid {
    margin: 2rem -0.5rem;
  }

  .inner-color-block {
    padding: 1.5rem;
    color: black;
    text-align: left;
    border-radius: 8px;
    background-color: #f9f9f9;
    border: 1px solid #ddd;
    cursor: pointer;
    transition: transform 0.3s ease;
  }

  .inner-color-block:hover {
    transform: scale(1.02);
    background-color: #f1f1f1;
  }

  .color-block h3, .color-block h4 {
    margin-bottom: 0.5rem;
  }

  .color-block p, .inner-color-block p {
    margin: 0;
    font-size: 1rem;
  }

  .square-block {
    aspect-ratio: 1;
    padding: 1.5rem;
    color: black;
    text-align: center;
    border-radius: 15px;
    background-color: #f9f9f9;
    border: none;
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .square-block:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0,0,0,0.15);
  }

  .square-block h4 {
    font-size: 1.1rem;
    margin-bottom: 0.8rem;
  }

  .square-block p {
    font-size: 0.9rem;
    opacity: 0.8;
  }
  </style>
