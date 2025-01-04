import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { getAuth } from 'firebase/auth'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    // {
    //   path: '/dragotesting',
    //   name: 'dragotesting',
    //   component: () => import('../views/DragoTestingView.vue')
    // },
    {
      path: '/faq',
      name: 'faq',
      component: () => import('../views/FaqView.vue')
    },
    {
      path: '/ai',
      name: 'ai',
      component: () => import('../views/AiView.vue')
    },
    {
      path: '/ai-rag',
      name: 'ai-rag',
      component: () => import('../views/Ai-ragView.vue')
    },
    {
      path: '/fulltextsearch',
      name: 'fulltextsearch',
      component: () => import('../views/FullTextSearchView.vue')
    },
    {
      path: '/unifulltextsearch',
      name: 'unifulltextsearch',
      component: () => import('../views/UniFullTextSearchView.vue')
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/adminpanel',
      name: 'adminpanel',
      component: () => import('../views/AdminPanelView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/d1adminpanel',
      name: 'd1adminpanel',
      component: () => import('../views/D1AdminPanelView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/uniadminpanel',
      name: 'uniadminpanel',
      component: () => import('../views/UniAdminPanelView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/upload',
      name: 'upload',
      component: () => import('../views/UploadView.vue'),
      meta: { requiresAuth: true }
    }
  ]
})

router.beforeEach((to, from, next) => {
  const auth = getAuth()
  //console.log("^^^auth", auth)
  const currentUser = auth.currentUser
  //console.log("^^^currentUser", currentUser)

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!currentUser) {
      // 若沒有登入，可做以下兩種處理:
      // 1. 直接 next('/') 回到首頁
      // 2. 或 next('/login') 進到登入頁
      next('/')
    } else {
      next()
    }
  } else {
    next()
  }
})
export default router
