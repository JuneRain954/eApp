import * as VueRouter from 'vue-router';

// 定义路由规则
const routes = [
  {
    path: "/",
    redirect: "/windowMain/Chat",
  },
  {
    path: "/windowMain",
    component: () => import("./window/WindowMain.vue"),
    children: [
      { path: "Chat", component: () => import("./window/windowMain/Chat.vue") },
      { path: "Contact", component: () => import("./window/windowMain/Contact.vue") },
      { path: "Collection", component: () => import("./window/windowMain/Collection.vue") },
    ],
  },
  {
    path: "/windowSetting",
    component: () => import("./window/WindowSetting.vue"),
    children: [
      { path: "AccountSetting", component: () => import("./window/windowSetting/AccountSetting.vue") },
    ],
  },
  {
    path: "/windowUserInfo",
    component: () => import("./window/WindowUserInfo.vue"),
  }
];


// 导出路由对象
export let router = VueRouter.createRouter({
  history: VueRouter.createWebHistory(),
  routes,
})