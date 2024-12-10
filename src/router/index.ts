import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

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
      component: () => import('../views/AdminPanelView.vue')
    },
    {
      path: '/uniadminpanel',
      name: 'uniadminpanel',
      component: () => import('../views/UniAdminPanelView.vue')
    }
  ]
})

export default router
