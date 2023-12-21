<template>
  <div id="app">
    <vue-particles id="tsparticles" :particlesInit="particlesInit" :particlesLoaded="particlesLoaded"
      url="http://foo.bar/particles.json" />

    <vue-particles id="tsparticles" :particlesInit="particlesInit" :particlesLoaded="particlesLoaded" :options="{
      background: {
        color: {
          value: '#0d47a1'
        }
      },
      fpsLimit: 120,
      interactivity: {
        events: {
          onClick: {
            enable: true,
            mode: 'push'
          },
          onHover: {
            enable: true,
            mode: 'repulse'
          },
          resize: true
        },
        modes: {
          bubble: {
            distance: 400,
            duration: 2,
            opacity: 0.8,
            size: 40
          },
          push: {
            quantity: 4
          },
          repulse: {
            distance: 200,
            duration: 0.4
          }
        }
      },
      particles: {
        color: {
          value: '#ffffff'
        },
        links: {
          color: '#ffffff',
          distance: 150,
          enable: true,
          opacity: 0.5,
          width: 1
        },
        move: {
          direction: 'none',
          enable: true,
          outMode: 'bounce',
          random: false,
          speed: 6,
          straight: false
        },
        number: {
          density: {
            enable: true,
            area: 800
          },
          value: 80
        },
        opacity: {
          value: 0.5
        },
        shape: {
          type: 'circle'
        },
        size: {
          random: true,
          value: 5
        }
      },
      detectRetina: true
    }" />
  </div>
  <div id="a">
    <div id="login_box">
      <div id="box_left" class="box_content">
      </div>
      <div id="box_right" class="box_content">
        <div id="wrapper">
          <div class="title-wrapper">
            <div id="left"></div>
            <div style="font-size: 20px">
              <h1 style="text-align: left">Welcome</h1>
              <h1>答题小程序后台管理</h1>
            </div>
          </div>
          <div style="
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          height: 180px;
          margin-top: 20px;
        ">
            <div>
              <el-input v-model="username" placeholder="用户名" clearable style="width: 200px;transform: translateY(-4px);"
                round>
                <template #prefix>
                  <el-icon class="el-input__icon" color="#108b96">
                    <User />
                  </el-icon>
                </template>
              </el-input>
            </div>
            <div>
              <el-input v-model="password" placeholder="密码" clearable style="width: 200px;transform: translateY(5px);"
              show-password>
                <template #prefix>
                  <el-icon class="el-input__icon" color="#108b96">
                    <Lock />
                  </el-icon>
                </template>
              </el-input>
            </div>
            <div>
              <el-checkbox v-model="isRememberPwd" label="记住密码" size="small" />
            </div>
            <div>
              <el-button type="primary" style="width: 200px;transform: translateY(-7px);" @click="login">登陆</el-button>
            </div>
            <el-alert title="用户名或密码错误" type="error" :closable="true" class="error-alert" v-if="showError" />
          </div>
        </div>
      </div>
    </div>

  </div>
</template>
<script setup>
//import { loadFull } from "tsparticles"; // if you are going to use `loadFull`, install the "tsparticles" package too.
import { loadSlim } from "tsparticles-slim"; // if you are going to use `loadSlim`, install the "tsparticles-slim" package too.
import axios from 'axios';
const particlesInit = async engine => {
  //await loadFull(engine);
  await loadSlim(engine);
};
const showError = ref(false);
const particlesLoaded = async container => {
  console.log("Particles container loaded", container);
};
import { User } from "@element-plus/icons-vue"

useHead({
  title: "登录",
  layout: "default"
})

const username = ref("");
const password = ref("");
const isRememberPwd = ref("");

function login() {
  axios.get("http://localhost:8888/login/manager", {

    params:{
      'username': username.value,
      'password': password.value
    }
  }).then(response => {
    // 请求成功，处理响应
    console.log('获取的数据:', response.data);
    navigateTo("/admin/question-manage")
  }).catch(error => {
      // 处理请求错误
      showError = true;
      console.error('请求失败:', error);
    });

}


</script>
<style lang="scss" scoped>
#login_box {
  height: 470px;
  width: 820px;
  background-color: rgba(255, 255, 255, 0.442);
  position: relative;
  border-radius: 30px;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 2px 10px 0 rgba(237, 238, 240, 0.50);

}

#box_left {
  border-right: 0px;
  border-style: solid;
  border-color: white;
  opacity: 0.75;
  background-image: url("../assets/背景图.jpg");
  border-radius: 30px 0px 0px 30px;
}

.box_content {
  width: 410px;
  height: 470px;
  display: flex;
  float: left;
}

#wrapper {
  position: relative;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  height: 250px;
  width: 200px;

  .title-wrapper {
    display: flex;
    justify-content: space-evenly;
    height: 60px;
    text-align: center;
    padding: 0;

    #left {
      border: 1px solid gray;
      box-shadow: 4px 4px 6px #868e96;
      width: 2px;
      height: 50px;
      position: relative;
      top: 0;
      bottom: 0;
      margin: auto;
      margin-right: 5px;
      background-color: gray;
    }
  }
}

#a {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(219, 215, 215, 0.718);

}
</style>
