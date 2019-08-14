import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
const router = new Router({
  routes: [
    {
      path: '/',
      redirect: "login"
    },
    {
      path: "/home",
      name: "home",
      redirect: "home/p_master",
      component: () => import("@/layout/home.vue"),
      children: [
        {
          path: "p_master",
          name: "p_master",
          component: () => import("@/view/PMaster")
        }
      ]
    },
    {
      path: "/login",
      component: () => import("@/view/login.vue"),
    }
  ],
  linkActiveClass: "ant-menu-item-selected"
})

router.beforeEach((to, from, next) => {
  if (to.path !== "/login" && !sessionStorage.token) {
    return next("/login");
  }
  next();
});

export default router;