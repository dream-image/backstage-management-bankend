<template>
    <div>
      <UserDetail :person="person"/>
    </div>
</template>
<script setup>
import axios from "axios"
import { routeUrl } from "~/nutils/goto";
  useHead({
    title:"用户详情"
  })
  const route = useRoute()
  const router=useRouter()
  const person=ref({})
  onMounted(() => {
  axios.get("http://localhost:8888/userInfo", {
    params: {
      userId: route.query.id
    }
  }).then(response => {
    // 请求成功，处理响应
    console.log('获取的数据:', response.data);
    person.value = response.data;
    // console.log(person)
  }).catch(error => {
    // 处理请求错误
    
    ElMessage.error(error.message)
    console.error('请求失败:', error.data.message);
    setTimeout(()=>{
      navigateTo({
    path: routeUrl.USER,
  })
    },200)
  });
})

// const options = [
//   {
//     value:"23924928031",
//     label:"23924928031 谢毅1"
//   },
//   {
//     value:"23924928032",
//     label:"23924928032 谢毅2"
//   },
//   {
//     value:"23924928033",
//     label:"23924928033 谢毅3"
//   },
//   {
//     value:"23924928034",
//     label:"23924928034 谢毅4"
//   },
//   {
//     value:"23924928035",
//     label:"23924928035 谢毅5"
//   },
//   {
//     value:"23924928036",
//     label:"23924928036 谢毅6"
//   },
//   {
//     value:"23924928037",
//     label:"23924928037 谢毅7"
//   },
//   {
//     value:"23924928038",
//     label:"23924928038 谢毅8"
//   },
//   {
//     value:"23924928038",
//     label:"23924928038 谢毅8"
//   },
  
// ]
</script>
<style>
</style>