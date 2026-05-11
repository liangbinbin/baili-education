import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/',
    name: 'Layout',
    component: () => import('@/layout/index.vue'),
    meta: { requiresAuth: true },
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/Dashboard.vue'),
        meta: { title: '仪表盘' }
      },
      {
        path: 'students',
        name: 'Students',
        component: () => import('@/views/student/List.vue'),
        meta: { title: '学员管理' }
      },
      {
        path: 'teachers',
        name: 'Teachers',
        component: () => import('@/views/teacher/List.vue'),
        meta: { title: '教师管理' }
      },
      {
        path: 'courses',
        name: 'Courses',
        component: () => import('@/views/course/List.vue'),
        meta: { title: '课程管理' }
      },
      {
        path: 'classes',
        name: 'Classes',
        component: () => import('@/views/class/List.vue'),
        meta: { title: '班级管理' }
      },
      {
        path: 'schedule',
        name: 'Schedule',
        component: () => import('@/views/schedule/Index.vue'),
        meta: { title: '排课管理' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('admin_token')
  if (to.meta.requiresAuth && !token) {
    next('/login')
  } else if (to.path === '/login' && token) {
    next('/')
  } else {
    next()
  }
})

export default router