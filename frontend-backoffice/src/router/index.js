import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'admin-login',
      component: () => import('../views/Login.vue'),
    },
    {
      path: '/',
      name: 'dashboard',
      component: () => import('../views/Dashboard.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/items',
      name: 'items',
      component: () => import('../views/Items.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/items/create',
      name: 'items-create',
      component: () => import('../views/ItemForm.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/items/:id/edit',
      name: 'items-edit',
      component: () => import('../views/ItemForm.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/categories',
      name: 'categories',
      component: () => import('../views/Categories.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/rentals',
      name: 'rentals',
      component: () => import('../views/Rentals.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/rentals/:id',
      name: 'rental-detail',
      component: () => import('../views/RentalDetail.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/returns',
      name: 'returns',
      component: () => import('../views/Returns.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/customers',
      name: 'customers',
      component: () => import('../views/Customers.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/customers/:id',
      name: 'customer-detail',
      component: () => import('../views/CustomerDetail.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/payments',
      name: 'payments',
      component: () => import('../views/Payments.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/promotions',
      name: 'promotions',
      component: () => import('../views/Promotions.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/content',
      name: 'content',
      component: () => import('../views/Content.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/notifications',
      name: 'notifications',
      component: () => import('../views/Notifications.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/roles',
      name: 'roles',
      component: () => import('../views/Roles.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/reports',
      name: 'reports',
      component: () => import('../views/Reports.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('../views/Settings.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/audit',
      name: 'audit',
      component: () => import('../views/AuditLog.vue'),
      meta: { requiresAuth: true },
    },
  ],
})

// Navigation guard
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('adminToken')
  if (to.meta.requiresAuth && !token) {
    next('/login')
  } else {
    next()
  }
})

export default router
