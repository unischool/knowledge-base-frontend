<template lang="pug">
  #login-bg.ui.dimmer.modals.visible.active.clickable(style="background: rgba(0, 0, 0, 0.6);", @click="toggleLogin()")
    #login-main.ui.middle.aligned.center.aligned.grid(style="height: 100vh;")
      .column(style="max-width: 420px;")
        .ui.raised.segment
          .ui.error.message(v-if="isInApp")
            | 本系統不支援facebook, line等app內部瀏覽，請用一般瀏覽器開啟，方可登入，謝謝
          h2.ui.black.header(style="font-size: 1.5rem; font-weight: 600;")
            | 登入您的帳號


          //- Google Login Button
          button.ui.large.primary.button(@click.prevent="loginWithGoogle", style="background-color: #e47e10; color: white; font-weight: bold;")
            i.google.icon
            | 使用Google登入

          //- or
          .ui.horizontal.divider
            | 或

          //- Email & Password Login Form
          form.ui.form.segment(style="border-radius: 10px; padding: 15px; background-color: #f0f0f0;")
            .field
              .ui.left.icon.input
                i.envelope.icon
                input(type="text" name="email" placeholder="E-mail address", style="font-size: 14px;", v-model="users_email", @click.stop)

            .field
              .ui.left.icon.input
                i.lock.icon
                input(type="password" name="user_password" placeholder="Password", style="font-size: 14px;", v-model="user_password", autocomplete, @click.stop)

            .ui.fluid.large.button(@click.prevent="loginWithEmail", style="background-color: #e47e10 ; color: white; font-weight: bold;", :class="{disabled: isInApp}") Email登入

            a.small.forgot-password(@click.stop.prevent="resetPassword") 忘記密碼

          form.ui.large.form
            .ui.segment(style="border: none; padding-top: 10px;")
              .field
                .ui.checkbox(@click.stop)
                  input(type="checkbox" v-model="keeploggedin")
                  label 保持登入狀態

            p 新用戶？按此
              button.ui.large.basic.button#register-btn(@click.stop.prevent="registerWithEmail", :class="{disabled: isInApp}") 註冊
</template>

<script lang="ts">
import { defineComponent, ref, watch, onMounted } from 'vue';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';

export default defineComponent({
  name: "LoginBox",
  props: {
    isInApp: {
      type: Boolean,
      required: true
    },
    showLogin: {
      type: Boolean,
      required: true
    }
  },
  setup(props, { emit }) {
    const users_email = ref('');
    const user_password = ref('');
    const keeploggedin = ref(false);

    watch(keeploggedin, (newVal) => {
      localStorage.setItem('keeploggedin', JSON.stringify(newVal));
    });

    onMounted(() => {
      const storedValue = localStorage.getItem('keeploggedin');
      if (storedValue !== null) {
        keeploggedin.value = JSON.parse(storedValue);
      }
    });

    const toggleLogin = () => {
      emit('toggleLogin');
    };

    // const validateEmail = async (email: string): Promise<boolean> => {
    //   // 基本的 email 格式驗證
    //   const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+(\.[a-zA-Z]{2,})+$/;
    //   if (!emailRegex.test(String(email).toLowerCase())) {
    //     return false;
    //   }

    // };
    const validateEmail = async (email: string): Promise<boolean> => {
      if (!email.includes('@')) {
        return false;
      }
  // 如果判斷通過，就回傳 true
      return true;
    };

    const loginWithGoogle = () => {
      console.log('Google login clicked');
      emit('loginWithGoogle');
    };

    const registerWithEmail = async () => {
      console.log("users_email:", users_email.value);
      console.log("user_password:", user_password.value);
      console.log('Register clicked');

      if (!users_email.value || !user_password.value) {
        window.alert('請先填寫email和密碼');
        return;
      }

      if (!user_password.value || typeof user_password.value !== 'string') {
        alert('密碼請至少包含一個英文字，請重新輸入');
        return;
      }

      emit('registerWithEmail', users_email.value, user_password.value, keeploggedin.value);
    };

    const loginWithEmail = () => {
      console.log('Login clicked');
      const path = window.location.pathname;


      if (!user_password.value || typeof user_password.value !== 'string') {
        alert('密碼無效，請重新輸入');
        return;
      }

      emit('loginWithEmail', users_email.value, user_password.value, keeploggedin.value);
    };

    const resetPassword = () => {
      console.log("Reset password function triggered");
      console.log("Email for reset:", users_email.value);

      if (!users_email.value || !validateEmail(users_email.value)) {
        alert('請先輸入有效的電子郵件地址');
        return;
      }

      const auth = getAuth();
      console.log("Firebase auth object:", auth);

      sendPasswordResetEmail(auth, users_email.value)
        .then(() => {
          alert('密碼重置郵件已發送，請檢查您的電子郵件信箱');
          console.log("Password reset email sent successfully");
        })
        .catch((error: { code: string; message: string }) => {
          console.error("密碼重置郵件發送失敗：", error.code, error.message);
          switch (error.code) {
            case 'auth/invalid-email':
              alert('無效的電子郵件地址');
              break;
            case 'auth/user-not-found':
              alert('找不到該電子郵件對應的帳號');
              break;
            default:
              alert('密碼重置郵件發送失敗，請稍後再試');
          }
        });
    };

    return {
      users_email,
      user_password,
      keeploggedin,
      toggleLogin,
      loginWithGoogle,
      registerWithEmail,
      loginWithEmail,
      resetPassword,
    };
  }
});
</script>

<style scoped>
#login-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 1000000;
  transition: background 0.3s ease;
}

#login-main {
  position: relative;
  z-index: 1000001;
}

.column {
  border-radius: 10px !important;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.ui.segment {
  padding: 1.5em;
  border-radius: 8px !important;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.ui.button {
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.ui.button:hover {
  transform: translateY(-1px);
}

.ui.large.button {
  background-color: #444;
  color: white;
}

.ui.large.button:hover {
  background-color: #333;
}

.ui.horizontal.divider {
  color: #ccc;
}

h2.ui.header {
  font-size: 1.5rem;
  color: #000;
}

.ui.left.icon.input input {
  font-size: 14px;
  padding: 10px;
}

.forgot-password {
  font-size: 0.9rem;
  text-align: right;
  display: block;
  margin-top: 1em;
}

#register-btn {
  margin-left: .6em;
  border: 1px solid #333;
}

</style>
