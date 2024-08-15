// import { createRouter, createWebHistory } from 'vue-router'
// import HomeView from '../views/HomeView.vue'
//
// const routes = [
//   {
//     path: '/',
//     name: 'home',
//     component: HomeView
//   },
//   {
//     path: '/about',
//     name: 'about',
//     // route level code-splitting
//     // this generates a separate chunk (about.[hash].js) for this route
//     // which is lazy-loaded when the route is visited.
//     component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
//   }
// ]
//
// const router = createRouter({
//   history: createWebHistory(process.env.BASE_URL),
//   routes
// })
//
// export default router
import { createRouter, createWebHistory } from 'vue-router'
import BrandManagement from '../views/BrandManagement.vue'
import CategoryManagement from '../views/CategoryManagement.vue'
import ProductManagement from '../views/ProductManagement.vue'

const routes = [
  { path: '/brands', component: BrandManagement },
  { path: '/categories', component: CategoryManagement },
  { path: '/products', component: ProductManagement },
  { path: '/', redirect: '/brands' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
