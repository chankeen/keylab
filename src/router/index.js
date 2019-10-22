import Vue from 'vue'
import Router from 'vue-router'
import store from "../store"
import NProgress from 'nprogress' // progress bar
import { getErrorCodeByCode } from '@/utils/errorCode';

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
          path: "userPropman",
          name: "home_Propman",
          component: () => import("@/view/userPropman")
        },
        {
          path: "userOc",
          name: "home_Oc",
          component: () => import("@/view/userOc")
        },
        {
          path: "userContractor",
          name: "home_Contractor",
          component: () => import("@/view/userContractor")
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
          path: "propertyContractor",
          name: "property_contractor",
          component: () => import("@/view/contractor")
        },
        {
          path: "propertyNotice",
          name: "property_notice",
          component: () => import("@/view/notice")
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
        },
        {
          path: "propertyTermContract",
          name: "property_term_contract",
          component: () => import("@/view/termContract")
        },
        {
          path: "propertyIndividualContract",
          name: "property_individual_contract",
          component: () => import("@/view/individualContract")
        },
        {
          path: "propertyInsuranceClaims",
          name: "property_insurance_claims",
          component: () => import("@/view/insuranceClaims")
        },
        {
          path: "propertyNotes",
          name: "property_notes",
          component: () => import("@/view/notes")
        },
        {
          path: "healthCheck",
          name: "property_healthCheck",
          component: () => import("@/view/healthCheck")
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
  // start progress bar
  console.log(to);
  let url_path_array = to.fullPath.split("/").filter(element => element != "");
  console.log(url_path_array);
  NProgress.start()
  if (to.path !== "/login" && !sessionStorage.token) {
    errorModalPopUp("e_0003");
    return next("/login");
  } else if (url_path_array[0] == 'property') {
    // update vuex state app/property when from home to property Detail
    // Step1: check if sessionStory and vuex state empty, if Yes -> go to Home Page. Error Code - e_property_0001
    // Step2: check if app/property.property_id match router bid or not, if No -> go to Home. 
    if (to.params.hasOwnProperty('info')) router.app.$store.dispatch("app/setActiveProperty", to.params.info);
    let active_property = router.app.$store.getters.getActiveProperty
    if (!active_property.hasOwnProperty('property_id')) {
      errorModalPopUp("e_0001");
      return next("/home");
    } else if (active_property.property_id != to.params.bid) {
      errorModalPopUp("e_0002");
      return next("/home");
    }
  }
  next();
});

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})

var errorModalPopUp = (errorCode) => {
  router.app.$error({
    title: getErrorCodeByCode(errorCode).title,
    content: getErrorCodeByCode(errorCode).content,
  })
  NProgress.done()
}

export default router;