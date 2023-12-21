<template>
  <div id="all" style="background-color: rgba(128, 128, 128, 0.63); position:absolute; width: 100%; height: 100%;z-index: 10; display: none;"  ></div>
  <div class="common-layout">
    <el-container style="position: absolute;height: 100%;width: 100%;">
      <el-header id="header-wrapper">
        <div id="title-wrapper">
          <img
            src="~/assets/icon.svg"
            style="
              width: 20px;
              height: 20px;
              position: relative;
              margin-right: 10px;
              margin-top: 2px;
            "
          />
          <div style="font-size: 16px">小程序后台管理</div>
        </div>
        <div id="user-wrapper" @click="isShowLogOut = !isShowLogOut">
          <el-avatar :size="25" src="/avatar.png" style="transform: translateY(4px);" />
          <el-text
            style="
              font-size: 14px;
              text-align: left;
              line-height: 24px;
              width: 65px;
              height: 24px;
              margin-left: 6px;
              margin-top: 2px;
              font-family: '阿里妈妈刀隶体';
              font-size: large;
            "
            truncated
          >
            谢毅xxxxxxxxxx
          </el-text>

          <transition name="el-zoom-in-top">
            <el-button id="logout" v-show="isShowLogOut" type="primary" plain @click="logout" style="z-index: 1;">退出登陆</el-button>
          </transition>
        </div>
      </el-header>
      <el-container style="user-select: none;">
        <el-aside width="200px">
          <el-scrollbar>
            <el-menu
              :default-openeds="['1']"
              :unique-opened="true"
              :default-active="currentRoute"
            >
              <el-sub-menu index="1">
                <template #title>
                  <el-icon>
                    <HomeFilled color="#79bbff" /> </el-icon
                  >题库管理
                </template>
                <el-menu-item-group>
                  <el-menu-item index="1-1" @click="goto(routeUrl.QUESTION)"
                    >题库总览</el-menu-item
                  >
                </el-menu-item-group>
                <el-menu-item index="1-2"  @click="goto(routeUrl.SELECTION)">
                  <template #title>题库细则</template>
                  <!-- <el-menu-item index="1-2-1" @click="goto(routeUrl.SELECTION)"
                    >选择题</el-menu-item
                  > -->
                  <!-- <el-menu-item index="1-2-2" @click="goto(routeUrl.JUDGEMENT)"
                    >判断题</el-menu-item
                  > -->
                </el-menu-item>
              </el-sub-menu>
              <el-sub-menu index="2">
                <template #title>
                  <el-icon>
                    <UserFilled color="#79bbff" /> </el-icon
                  >用户管理
                </template>
                <el-menu-item-group>
                  <el-menu-item index="2-1" @click="goto(routeUrl.USER)">用户总览</el-menu-item>
                  <!-- <el-menu-item index="2-2" @click="goto(routeUrl.USERDETAIL)">用户详情</el-menu-item> -->
                </el-menu-item-group>
              </el-sub-menu>
            </el-menu>
          </el-scrollbar>
        </el-aside>
        <el-main
          style="
            width: 1560px;
            height: 100%;
            padding: 0;
            position: relative;
            overflow: hidden;
            background-color: rgba(177, 177, 177, 0.105);
          "
        
        >
          <slot />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script setup>
const currentRoute = ref("1");
const route = useRoute();
const isShowLogOut = ref(true);
const { path, prams } = route;
import { routeUrl } from "../nutils/goto";
function goto(url) {
  navigateTo(url);
}
function logout(){
  navigateTo("/login",{replace:true})
}
onMounted(() => {
  //当页面刷新加载回来的时候，保证左侧选择栏能够根据路由指定正确的激活状态
  if (path === routeUrl.QUESTION) {
    currentRoute.value = "1-1";
  } else if (path === routeUrl.SELECTION) {
    currentRoute.value = "1-2-1";
  } else if (path === routeUrl.JUDGEMENT) {
    currentRoute.value = "1-2-2";
  }else if(path ===routeUrl.USER){
    currentRoute.value = "2-1";
  }else if(new RegExp(routeUrl.USERDETAIL).test(path) || path ===routeUrl.USERDETAIL){
    currentRoute.value = "2-2";
  }
});
</script>

<style lang="scss">
#header-wrapper {
  height: 44px;
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  border-bottom: 2px solid #e9ecef;
  font-size: 16px;
  padding-top: 8px;
  padding-left: 50px;

  #title-wrapper {
    display: flex;
    flex-direction: row;
    height: 36px;
    width: 150px;
    margin-right: 40px;
  }

  #user-wrapper {
    user-select: none;
    display: flex;
    flex-direction: row;
    margin-right: 30px;
    width: 100px;
    cursor: pointer;
    #logout {
      position: absolute;
      top: 44px;
      width:80px;
      height: 24px;
    }
  }
}
</style>
