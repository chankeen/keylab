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
      redirect: "home/property",
      component: () => import("@/layout/home.vue"),
      children: [
        {
          path: "property",
          name: "property",
          component: () => import("@/view/PMaster")
        } 
      ]
    },
    {
      path: "/building/:bid",
      name: "building",
      redirect: "building/building_detail",
      component: () => import("@/layout/building.vue"),
      children: [
        {
          path: "buildingDetail",
          name: "building_detail",
          component: () => import("@/view/buildlingDetail/home.vue")
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