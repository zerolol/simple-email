import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    redirect: '/email',
  },
  {
    path: '/sign',
    name: 'sign',
    component: () => import(/* webpackChunkName: "sign" */ '../views/sign/Sign.vue'),
  },
  {
    path: '/email',
    name: 'email',
    component: () => import(/* webpackChunkName: "email" */ '../views/email/Email.vue'),
    redirect: '/inbox',
    children: [
      {
        path: '/write',
        name: 'write',
        component: () => import(/* webpackChunkName: "email" */ '../views/email/Write.vue'),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: '/inbox',
        name: 'inbox',
        component: () => import(/* webpackChunkName: "email" */ '../views/email/Inbox.vue'),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: '/send',
        name: 'send',
        component: () => import(/* webpackChunkName: "email" */ '../views/email/Inbox.vue'),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: '/delete',
        name: 'delete',
        component: () => import(/* webpackChunkName: "email" */ '../views/email/Inbox.vue'),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: '/receive',
        name: 'receive',
        component: () => import(/* webpackChunkName: "email" */ '../views/email/Receive.vue'),
        meta: {
          requiresAuth: true,
        },
      },
    ],
  },
];

const router = new VueRouter({
  base: process.env.NODE_ENV === 'production' ? '/zy' : '/',
  mode: 'history',
  routes,
});

router.beforeEach((to, from, next) => {
  /* 判断该路由是否需要登录权限 */
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    // 是否登录
    const userInfo = sessionStorage.getItem('userInfo');

    if (!userInfo || userInfo === 'undefined') {
      next({
        path: '/sign',
        query: { redirect: to.name },
      });
    } else {
      next();
    }
  } else {
    next();
  }
});
export default router;
