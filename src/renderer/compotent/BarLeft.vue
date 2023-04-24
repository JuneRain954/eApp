<script setup lang="ts">
  import { ref, watch } from 'vue';
  import { useRoute } from 'vue-router';

  // 菜单列表数组
  let mainWindowRoutes = ref([
    { path: "/windowMain/Chat", isSelected: true, icon: "icon-Chat", iconSelected: "icon-chat" },
    { path: "/windowMain/Contact", isSelected: false, icon: "icon-tongxunlu", iconSelected: "icon-tongxunlu1" },
    { path: "/windowMain/Collection", isSelected: false, icon: "icon-shoucang", iconSelected: "icon-xihuan" },
  ]);
  // 使用路由
  let route = useRoute();
  // 注册路由变化监听器
  watch(
    () => route,
    () => mainWindowRoutes.value.forEach((v) => (v.isSelected = (v.path === route.fullPath) )),
    {
      immediate: true,
      deep: true,
    }
  )
</script>

<template>
  <div class="BarLeft">
    <div class="userIcon">
      <img src="../assets/avatar.png" alt="avatar">
    </div>
    <div class="menu">
      <router-link 
        v-for="item in mainWindowRoutes" 
        :to="item.path"
        :key="item.path"
        :class="['menuItem', { 'selected': item.isSelected }]">
        <i :class="['iconfont', item.isSelected ? item.iconSelected : item.icon]"></i>
      </router-link>
    </div>
    <div class="setting">
      <div class="menuItem">
        <i class="iconfont icon-setting"></i>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.BarLeft {
  width: 54px;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: rgb(46, 46, 46);
  -webkit-app-region: drag;
}
.userIcon {
  height: 84px;
  padding-top: 36px;
  box-sizing: border-box;
  img {
    width: 34px;
    height: 34px;
    margin-left: 10px;
  }
}
.menu {
  flex: 1;
}
.menuItem {
  height: 44px;
  line-height: 44px;
  text-align: center;
  padding-left: 12px;
  padding-right: 12px;
  display: block;
  text-decoration: none;
  color: rgb(126, 126, 126);
  cursor: pointer;
  -webkit-app-region: no-drag;
  i {
    font-size: 22px;
  }
  &:hover {
    color: rgb(141, 141, 141);
  }
}
.selected {
  color: rgb(7, 193, 96);
  &:hover {
    color: rgb(7, 193, 96);
  }
}
.setting {
  margin-bottom: 5px;
}
</style>