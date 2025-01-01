<template lang="pug">
header
  nav.ui.fixed.top.menu
    button.no-border.ui.item(@click="toggleSidebar")
      i.icon.bars
    RouterLink.item(to="/")
      i.home.icon
      span.fat-only 首頁-文件搜尋

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
    :uid="uid",
    :isInApp="isInApp",
    :user="user",
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
import Login from './components/Login.vue'
import { defineComponent, ref } from 'vue'
import axios from 'axios'
import InApp from 'detect-inapp'; // 導入InApp以偵測瀏覽器內部環境
import { getAuth, sendEmailVerification,
  createUserWithEmailAndPassword, signInWithEmailAndPassword,
  setPersistence, browserLocalPersistence, inMemoryPersistence
} from 'firebase/auth';
import { get, ref as dbRef, onValue, set } from 'firebase/database';
import { auth, database } from './firebase';

export default defineComponent({
  setup() {
    const showLogin = ref(false)
    const sidebarVisible = ref(false)
    const email = ref('')
    const emailVerified = ref(false)
    const uid = ref('')
    const user = ref({})
    const photoURL = ref('')
    const inApp = new InApp(window.navigator.userAgent);
    // 初始假設為 InApp 庫的偵測結果
    const isInApp = ref(inApp.isInApp);

    return {
      showLogin,
      sidebarVisible,
      email,
      emailVerified,
      uid,
      isInApp,
      user,
      photoURL
    }
  },
  components: {
    Login,
    RouterLink,
    RouterView
  },
  mounted() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const vm = this;
    auth.onAuthStateChanged((user) => {
      if (user) {
        vm.uid = user.uid;
        vm.email = user.email || '';
        vm.photoURL = user.photoURL || 'https://we.alearn.org.tw/logo-new.png';
        vm.emailVerified = user.emailVerified;
        vm.updateUserData(user);
      } else {
        vm.uid = '';
        vm.email = '';
        vm.photoURL = '';
        vm.emailVerified = false;
      }
    });
  },
  methods: {
    toggleLogin() {
      this.showLogin = !this.showLogin
    },
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
    },
    logout () {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const vm = this; // 儲存當前Vue實例
      auth.signOut().then(function() {
        vm.user = null; // 清除用戶資料
        vm.users = {}; // 清除所有用戶資料
        vm.uid = ''; // 清除用戶ID
        vm.photoURL = ''; // 清除用戶頭像URL
        vm.$nextTick().then(() => {
          vm.$router.push('/'); // 導航回首頁
        })
      });
    },
    async registerWithEmail(normalRegister_email: string, normalRegister_password: string, normalRegister_keeploggedin: boolean) {
      if (!normalRegister_password || typeof normalRegister_password !== 'string') {
        alert('接收的密碼無效，請確認輸入');
        return;
      }

      try {
        const auth = getAuth();
        const userCredential = await createUserWithEmailAndPassword(auth, normalRegister_email, normalRegister_password);
        const user = userCredential.user;

        if (user && user.email) {
          this.email = user.email;
          this.uid = user.uid;
          this.photoURL = 'https://we.alearn.org.tw/logo-new.png';

          const pvdata = [{
            displayName: this.email?.split('@')[0] || 'Unknown',
            email: this.email,
            photoURL: this.photoURL
          }];
          this.user = { email: this.email, photoURL: this.photoURL, providerData: pvdata };

          const userRef = dbRef(database, 'users/' + this.uid);
          const snapshot = await get(userRef);
          if (!snapshot.exists()) {
            await set(userRef, {
              email: this.email,
              name: this.email?.split('@')[0] || 'Unknown',
              connect_me: this.email,
              photoURL: this.photoURL,
              login_method: 'email'
            });
          }

          await sendEmailVerification(user);
          alert('驗證郵件已發送，請檢查您的郵箱(含垃圾信箱)以完成驗證。');
          this.logout();
        } else {
          console.error('User or user email is undefined after registration');
          alert('註冊過程中發生錯誤，請稍後再試。');
        }
      } catch (error: any) {
        if (error.code === 'auth/email-already-in-use') {
          alert('此電子郵件已被使用，請使用其他電子郵件或嘗試登入。');
        } else {
          console.error("註冊失敗：", error);
          alert("註冊失敗：" + error.message);
        }
      }
    },
    async loginWithEmail(normalRegister_email: string, normalRegister_password: string, normalRegister_keeploggedin: boolean) {
      try {
        if (normalRegister_keeploggedin) {
          await setPersistence(auth, browserLocalPersistence);
        } else {
          await setPersistence(auth, inMemoryPersistence);
        }
        const userCredential = await signInWithEmailAndPassword(auth, normalRegister_email, normalRegister_password);
        const user = userCredential.user;

        if (!user.emailVerified) {
          alert('您的電子郵件尚未驗證，請檢查您的郵箱並完成驗證。');
          this.resendVerificationEmail()
          this.logout();
          return;
        }

        this.emailVerified = true;
        console.log('登入成功：', user);
        this.updateUserData(user);
      } catch (error: any) {
        console.error("登入失敗：", error);
        let errorMessage = "登入失敗：";
        if (error.message.includes('auth/wrong-password')) {
          errorMessage = "密碼錯誤，請檢查後再試。";
        } else if (error.message.includes('auth/user-not-found')) {
          errorMessage = "帳號不存在，請確認您的電子郵件地址。";
        } else if (error.message.includes('auth/invalid-email')) {
          errorMessage = "無效的電子郵件地址，請重新輸入。";
        } else if (error.message.includes('auth/too-many-requests')) {
          errorMessage = "嘗試次數過多，請稍後再試。";
        } else {
          errorMessage += error.message;
        }
        alert(errorMessage);
      }
    },
    resendVerificationEmail() {
      const user = getAuth().currentUser;
      if (user) {
        sendEmailVerification(user).then(() => {
          console.log('驗證郵件已重新發送。');
        }).catch((error) => {
          console.error('重新發送驗證郵件失敗：', error);
          // alert('重新發送驗證郵件失敗，請稍後再試。');
        });
      }
    },
    async updateUserData(user: any) {
      if (!user) {
        console.error('User is undefined in updateUserData');
        return;
      }
      this.email = user.email || null;
      this.uid = user.uid;
      this.photoURL = user.photoURL ? decodeURI(user.photoURL) : "https://we.alearn.org.tw/logo-new.png";
      this.emailVerified = user.emailVerified;

      const pvdata = user.providerData || [{
        displayName: this.email?.split('@')[0] || 'Unknown',
        email: this.email,
        photoURL: this.photoURL
      }];

      // 直接獲取當前用戶的資料
      await this.fetchUserData(pvdata);
    },
    async fetchUserData(pvdata: any[]) {
      try {
        if (!this.uid) {
          console.error('No user ID available');
          return;
        }

        // 只監聽當前用戶的資料
        const userRef = dbRef(database, `users/${this.uid}`);
        onValue(userRef, (snapshot) => {
          const userData = snapshot.val();
          if (userData) {
            this.user = { ...userData, providerData: pvdata };
            if (this.user.photoURL && this.user.photoURL !== 'undefined') {
              this.photoURL = this.user.photoURL;
            }
          } else {
            this.user = { providerData: pvdata };
          }
        }, (error) => {
          this.user = { providerData: pvdata };
          console.error("Error fetching user data:", error);
        });
      } catch (error) {
        console.error("Error in fetchUserData:", error);
        this.user = { providerData: pvdata };
      }
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
