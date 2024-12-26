<template lang="pug">
header
  nav.ui.fixed.top.menu
    button.no-border.ui.item(@click="toggleSidebar")
      i.icon.bars
    RouterLink.item(to="/")
      i.home.icon
      | 首頁-文件搜尋



    //- AI相關的dropdown
    .ui.simple.dropdown.item(@click="handleDropdownClick($event)")
      i.chess.king.icon
      | AI機器人
      i.dropdown.icon
      .menu
        RouterLink.item(to="/ai")
          i.chess.king.icon
          | 創源工具RAG
        RouterLink.item(to="/ai-rag")
          i.chess.queen.icon
          | 學校課程RAG

    //- 全文檢索的dropdown
    .ui.simple.dropdown.item.fat-only(@click="handleDropdownClick($event)")
      i.search.icon
      | 全文檢索
      i.dropdown.icon
      .menu
        RouterLink.item(to="/fulltextsearch") 創源工具
        RouterLink.item(to="/unifulltextsearch") 學校課程

    //- 其他獨立項目
    RouterLink.item.fat-only(to="/faq") FAQ
    RouterLink.item.fat-only(to="/about") ABOUT

    //- 後台管理的dropdown
    .ui.simple.dropdown.item.fat-only
      i.settings.icon
      | 後台管理
      i.dropdown.icon
      .menu
        RouterLink.item(to="/adminpanel") 創源工具
        RouterLink.item(to="/d1adminpanel") 創源工具Cloudflare D1 後台管理
        RouterLink.item(to="/uniadminpanel") 學校課程
        RouterLink.item.fat-only(to="/upload") 上傳檔案
    .right.menu
      button.no-border.ui.item(@click="toggleLogin", v-if="!uid")
        i.user.icon
        | 登入
        span.fat-only / 註冊
      .ui.simple.dropdown.item(v-else)
        img.ui.avatar.image(v-if="photoURL" :src="photoURL" alt="User Avatar" @error="useDefaultAvatar" @load="onImageLoad")
        i.user.icon(v-else)
        .menu
          router-link.item(to="/profile")
            i.flag.icon
            | 我的旗幟
          button.no-border.ui.item(v-if="uid", @click="logout")
            i.sign-out.icon
            | 登出

.small-spacer
.ui.sidebar.vertical.menu#side-menu(:class="{'hidden': !sidebarVisible}")
  RouterLink.item(to='/', exact='', name="home")
    i.home.icon
    | 首頁-文件搜尋
  //- RouterLink.item(to='/dragotesting', name="dragotesting")
  //-   i.dragTesting.icon
  //-   | Drago測試
  RouterLink.item(to='/ai', name="ai")
    i.chess.king.icon
    | AI機器人-創源工具RAG
  RouterLink.item(to='/ai-rag', name="ai-rag")
    i.chess.queen.icon
    | AI機器人-學校課程RAG
  RouterLink.item(to='/fulltextsearch', name="fulltextsearch")
    i.search.icon
    | 全文檢索-創源工具
  RouterLink.item(to='/unifulltextsearch', name="unifulltextsearch")
    i.search.icon
    | 全文檢索-學校課程
  RouterLink.item(to='/faq', name="faq")
    i.help.icon
    | FAQ
  RouterLink.item(to='/about', name="about")
    i.info.icon
    | ABOUT
  RouterLink.item(to='/adminpanel', name="adminpanel")
    i.settings.icon
    | 創源工具後台管理
  RouterLink.item(to='/d1adminpanel', name="d1adminpanel")
    i.settings.icon
    | 創源工具Cloudflare D1 後台管理
  RouterLink.item(to='/uniadminpanel', name="uniadminpanel")
    i.settings.icon
    | 學校課程後台管理
  RouterLink.item(to='/upload', name="upload")
    i.upload.icon
    | 上傳檔案
.ui.sidebar.bg(:class="{'hidden': !sidebarVisible}", @click="toggleSidebar")

//- .ui.container
//-   RouterView(:courses="courses" :keywordsWithFiles="keywordsWithFiles", @fileUploaded="handleFileUploaded")
.ui.container
  RouterView(
    @toggleLogin="toggleLogin",
    @locate="locate",
    :uid="uid",
    :isInApp="isInApp",
    :user="user",
    :users="users",
    :photoURL="photoURL",
    :email="email",
    :emailVerified="emailVerified"
  )
Login(
  v-if="showLogin"
  :showLogin="showLogin"
  :isInApp="false"
  @toggleLogin="toggleLogin",
  @logout="logout",
  @registerWithEmail="registerWithEmail",
  @loginWithEmail="loginWithEmail",
  @resendVerificationEmail="resendVerificationEmail"
)
</template>

<script lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
import { defineComponent, ref } from 'vue'
import axios from 'axios'


export default defineComponent({
  setup() {
    const sidebarVisible = ref(false)
    const courses = ref([])
    const keywordsWithFiles = ref([])
    return { sidebarVisible, courses, keywordsWithFiles }
  },
  mounted() {
    axios.get('https://knowledge-base-backend.leechiuhui.workers.dev/api/Courses')
      .then(response => {
        this.courses = response.data
      })
      .catch(error => {
        console.error('出錯了', error)
      })

    axios.get('https://knowledge-base-backend.leechiuhui.workers.dev/api/keywordsWithFiles').then((response) => {
      this.keywordsWithFiles = response.data
    }).catch(error => {
      console.error('出錯了', error)
    })
  },
  methods: {
    toggleSidebar() {
      this.sidebarVisible = !this.sidebarVisible
    },
    handleFileUploaded() {
      axios.get('https://knowledge-base-backend.leechiuhui.workers.dev/api/keywordsWithFiles').then((response) => {
        this.keywordsWithFiles = response.data
      })
    },
    handleDropdownClick(event: Event) {
      const dropdown = event.currentTarget as HTMLElement;
      dropdown.classList.toggle('active');
      dropdown.classList.toggle('visible');

      const menu = dropdown.querySelector('.menu') as HTMLElement;
      if (menu) {
        menu.classList.toggle('visible');
      }

      // 點擊其他地方時關閉dropdown
      const closeDropdown = (e: Event) => {
        if (!dropdown.contains(e.target as Node)) {
          dropdown.classList.remove('active', 'visible');
          menu?.classList.remove('visible');
          document.removeEventListener('click', closeDropdown);
        }
      };

      document.addEventListener('click', closeDropdown);
    }
  }
})
</script>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: black !important;
  font-weight: bold;
  background-color: hsla(160, 100%, 37%, 1) !important;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}


.no-border {
  border: none !important;
}

.ui.sidebar {
  transition: transform .3s ease, opacity .3s ease, visibility .3s ease !important;
  z-index: 1000;
  position: fixed;
  top: 0 !important;
  left: 0;
  width: 250px;
  height: 100%;
  background-color: #fff;
  opacity: 1;
  visibility: visible;
}

.ui.sidebar.bg {
  z-index: 2 !important; /* 設定一個低值 */
  background-color: rgba(180, 180, 180, 0.62); /* 確保有背景色 */
  width: 100vw;
  cursor: pointer;
}

.ui.sidebar.hidden {
  opacity: 0;
  visibility: hidden !important;
  transition: all 0s linear !important;
  transform: translateX(-100%); /* 隱藏時向左滑動 */
}

/* 新增移動設備的樣式 */
@media (max-width: 767px) {
  .ui.dropdown .menu {
    position: absolute !important;
    display: none;
  }

  .ui.dropdown .menu.visible {
    display: block !important;
  }
}
</style>
<!--
<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style> -->
