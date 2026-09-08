import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'candidatures-list',
      component: () => import('../views/CandidaturesListView.vue'),
    },
    {
      path: '/candidatures/:id',
      name: 'candidature-detail',
      component: () => import('../views/CandidatureDetailView.vue'),
      props: (route) => ({ id: Number(route.params.id) }),
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFoundView.vue'),
    },
  ],
})

export default router
