import Vue from 'vue'
import Router from 'vue-router'
import store from "../store"
Vue.use(Router)
const router = new Router({
  routes: [
    {
      path: '/',
      redirect: "login"
    },
    //主頁
    {
      path: "/home",
      name: "home",
      redirect: "home/property",
      component: () => import("@/layout/home.vue"),
      children: [
        {
          path: "property",
          name: "home_property",
          component: () => import("@/view/property")
        },
        {
          path: "user",
          name: "home_user",
          component: () => import("@/view/user")
        }
      ]
    },
    // 大廈詳情
    {
      path: "/property/:bid",
      name: "property",
      redirect: "property/:bid/propertyHome",
      component: () => import("@/layout/propertyDetail.vue"),
      children: [
        {
          path: "propertyHome",
          name: "property_home",
          component: () => import("@/view/propertyDetail/home.vue")
        },
        {
          path: "propertyOc",
          name: "property_oc",
          component: () => import("@/view/oc")
        },
        {
          path: "propertyPropman",
          name: "property_propman",
          component: () => import("@/view/propman")
        },
        {
          path: "propertyImportant",
          name: "property_important",
          component: () => import("@/view/important")
        },
        {
          path: "propertyMinutes",
          name: "property_minutes",
          component: () => import("@/view/minutes")
        },
        {
          path: "propertyUnitList",
          name: "property_unit_list",
          component: () => import("@/view/unitList")
        },
        {
          path: "propertyUnitFee",
          name: "property_unit_fee",
          component: () => import("@/view/unitFee")
        },
        {
          path: "propertyUnitFile",
          name: "property_unit_file",
          component: () => import("@/view/unitFile")
        }
      ]
    },
    // 登入頁面
    {
      path: "/login",
      component: () => import("@/view/login.vue"),
    },
    //登入頁面
    {
      path: "*",
      name: "404",
      component: () => import("@/view/404.vue")
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