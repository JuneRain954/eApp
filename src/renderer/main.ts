import { createApp } from 'vue';
import { router } from './router';
import App from './App.vue';
// 引入全局样式
import "./assets/style.css";
// 全局引入字体图标
import "./assets/icon/iconfont.css";


createApp(App).use(router).mount("#app");