<template>
  <div>
    <Question :tableData="tableData" />
  </div>
</template>
<script setup>
import { dayjs } from 'element-plus';
import axios from 'axios';
useHead({
  title:"题库总览"
})
const tableData=ref([])
onMounted(()=>{
  axios.get("http://localhost:8888/get/allquestionbank"
).then(response => {
// 请求成功，处理响应
tableData.value=response.data;

}).catch(error => {
  // 处理请求错误
  ElMessage.error(error.message)
  console.error('请求失败:', error);
})
})


// const tableData = [
//   {
//     id: "1",
//     name: "毛泽东思想",
//     number: "200",
//     createDate:  new Date().toLocaleDateString() ,
//     createPerson: "xy",
//   },
//   {
//     id: "2",
//     name: "习近平新思想",
//     number: "200",
//     createDate: new Date().toLocaleDateString(),
//     createPerson: "xy",
//   },
//   {
//     id: "3",
//     name: "马克思主义原理1",
//     number: "200",
//     createDate: new Date().toLocaleDateString(),
//     createPerson: "xy",
//   },
//   {
//     id: "4",
//     name: "马克思主义原理2",
//     number: "200",
//     createDate: new Date().toLocaleDateString(),
//     createPerson: "xy",
//   },
//   {
//     id: "5",
//     name: "马克思主义原理3",
//     number: "200",
//     createDate: new Date().toLocaleDateString(),
//     createPerson: "xy",
//   },
//   {
//     id: "6",
//     name: "马克思主义原理4",
//     number: "200",
//     createDate: new Date().toLocaleDateString(),
//     createPerson: "xy5",
//   },
//   {
//     id: "7",
//     name: "马克思主义原理6",
//     number: "200",
//     createDate: new Date().toLocaleDateString(),
//     createPerson: "xy",
//   },
//   {
//     id: "8",
//     name: "马克思主义原理7",
//     number: "200",
//     createDate: new Date().toLocaleDateString(),
//     createPerson: "xy",
//   },
//   {
//     id: "9",
//     name: "马克思主义原理8",
//     number: "200",
//     createDate: new Date().toLocaleDateString(),
//     createPerson: "xy",
//   },
//   {
//     id: "10",
//     name: "马克思主义原理9",
//     number: "200",
//     createDate: new Date().toLocaleDateString(),
//     createPerson: "xy",
//   },
//   {
//     id: "11",
//     name: "马克思主义原理10",
//     number: "200",
//     createDate: new Date().toLocaleDateString(),
//     createPerson: "xy",
//   },
//   {
//     id: "12",
//     name: "马克思主义原理11",
//     number: "200",
//     createDate: new Date().toLocaleDateString(),
//     createPerson: "xy",
//   },
//   {
//     id: "13",
//     name: "马克思主义原理12",
//     number: "200",
//     createDate: new Date().toLocaleDateString(),
//     createPerson: "xy",
//   },
//   {
//     id: "14",
//     name: "马克思主义原理13",
//     number: "200",
//     createDate: new Date().toLocaleDateString(),
//     createPerson: "xy",
//   },
//   {
//     id: "15",
//     name: "马克思主义原理14",
//     number: "200",
//     createDate: new Date().toLocaleDateString(),
//     createPerson: "xy",
//   },
//   {
//     id: "16",
//     name: "马克思主义原理15",
//     number: "200",
//     createDate: new Date().toLocaleDateString(),
//     createPerson: "xy",
//   },
//   {
//     id: "317",
//     name: "马克思主义原理16",
//     number: "200",
//     createDate: new Date().toLocaleDateString(),
//     createPerson: "xy",
//   }
// ];
</script>
<style></style>
