<template>
  <div>
    <User :tableData="tableData" />
  </div>

</template>
<script setup>
import axios from "axios";

useHead({
  title:"用户总览"
})
const tableData=shallowRef([])
onMounted(() => {
  axios.get("http://localhost:8888/get/alluser").then(response => {
    console.log(response.data);
    let list=response.data.map(i=>{
      return{
        ...i,
        challengeAccuracy:(i.challengeAccuracy*1).toFixed(2),
        id:i.userid,
        username:i.userid,
        nickname:i.nickname,
        registerDate:i.register_time,
        lastLogin:i.login_time,
      }
    })
    tableData.value = list;
    useState('userList',()=>list)
  }).catch(error => {

  })
})
// const tableData = [
//   {
//     id: "1",
//     username: "2392492803",
//     nickname: "谢毅",
//     registerDate: new Date().toLocaleDateString(),
//     lastLogin: new Date(2022 / 10 / 30).toLocaleDateString(),
//     commonCorrectNumber: 100,
//     challengeAccuracy: 80
//   },
//   {
//     id: "2",
//     username: "23924928032",
//     nickname: "谢毅2",
//     registerDate: new Date().toLocaleDateString(),
//     lastLogin: new Date(2022 / 10 / 30).toLocaleDateString(),
//     commonCorrectNumber: 100,
//     challengeAccuracy: 30
//   },
//   {
//     id: "3",
//     username: "23924928033",
//     nickname: "谢毅3",
//     registerDate: new Date().toLocaleDateString(),
//     lastLogin: new Date(2022 / 10 / 30).toLocaleDateString(),
//     commonCorrectNumber: 100,
//     challengeAccuracy: 20
//   },
//   {
//     id: "4",
//     username: "23924928034",
//     nickname: "谢毅4",
//     registerDate: new Date().toLocaleDateString(),
//     lastLogin: new Date(2022 / 10 / 30).toLocaleDateString(),
//     commonCorrectNumber: 100,
//     challengeAccuracy: 44
//   },
//   {
//     id: "5",
//     username: "23924928035",
//     nickname: "谢毅5",
//     registerDate: new Date().toLocaleDateString(),
//     lastLogin: new Date(2022 / 10 / 30).toLocaleDateString(),
//     commonCorrectNumber: 100,
//     challengeAccuracy: 55
//   },
//   {
//     id: "6",
//     username: "23924928036",
//     nickname: "谢毅6",
//     registerDate: new Date().toLocaleDateString(),
//     lastLogin: new Date(2022 / 10 / 30).toLocaleDateString(),
//     commonCorrectNumber: 100,
//     challengeAccuracy: 11
//   },
//   {
//     id: "7",
//     username: "23924928037",
//     nickname: "谢毅7",
//     registerDate: new Date().toLocaleDateString(),
//     lastLogin: new Date(2022 / 10 / 30).toLocaleDateString(),
//     commonCorrectNumber: 100,
//     challengeAccuracy: "80%"
//   },
//   {
//     id: "8",
//     username: "23924928038",
//     nickname: "谢毅8",
//     registerDate: new Date().toLocaleDateString(),
//     lastLogin: new Date(2022 / 10 / 30).toLocaleDateString(),
//     commonCorrectNumber: 100,
//     challengeAccuracy: "80%"
//   },
//   {
//     id: "9",
//     username: "23924928039",
//     nickname: "谢毅9",
//     registerDate: new Date().toLocaleDateString(),
//     lastLogin: new Date(2022 / 10 / 30).toLocaleDateString(),
//     commonCorrectNumber: 100,
//     challengeAccuracy: "80%"
//   },
//   {
//     id: "10",
//     username: "239249280310",
//     nickname: "谢毅10",
//     registerDate: new Date().toLocaleDateString(),
//     lastLogin: new Date(2022 / 10 / 30).toLocaleDateString(),
//     commonCorrectNumber: 100,
//     challengeAccuracy: "80%"
//   },
//   {
//     id: "11",
//     username: "239249280311",
//     nickname: "谢毅11",
//     registerDate: new Date().toLocaleDateString(),
//     lastLogin: new Date(2022 / 10 / 30).toLocaleDateString(),
//     commonCorrectNumber: 100,
//     challengeAccuracy: "80%"
//   },
//   {
//     id: "12",
//     username: "239249280312",
//     nickname: "谢毅12",
//     registerDate: new Date().toLocaleDateString(),
//     lastLogin: new Date(2022 / 10 / 30).toLocaleDateString(),
//     commonCorrectNumber: 100,
//     challengeAccuracy: "80%"
//   },
//   {
//     id: "13",
//     username: "239249280313",
//     nickname: "谢毅13",
//     registerDate: new Date().toLocaleDateString(),
//     lastLogin: new Date(2022 / 10 / 30).toLocaleDateString(),
//     commonCorrectNumber: 100,
//     challengeAccuracy: "80%"
//   },
//   {
//     id: "14",
//     username: "239249280314",
//     nickname: "谢毅14",
//     registerDate: new Date().toLocaleDateString(),
//     lastLogin: new Date(2022 / 10 / 30).toLocaleDateString(),
//     commonCorrectNumber: 100,
//     challengeAccuracy: "80%"
//   },
//   {
//     id: "15",
//     username: "239249280315",
//     nickname: "谢毅15",
//     registerDate: new Date().toLocaleDateString(),
//     lastLogin: new Date(2022 / 10 / 30).toLocaleDateString(),
//     commonCorrectNumber: 100,
//     challengeAccuracy: "80%"
//   },
//   {
//     id: "16",
//     username: "239249280316",
//     nickname: "谢毅16",
//     registerDate: new Date().toLocaleDateString(),
//     lastLogin: new Date(2022 / 10 / 30).toLocaleDateString(),
//     commonCorrectNumber: 100,
//     challengeAccuracy: "80%"
//   },
//   {
//     id: "17",
//     username: "239249280317",
//     nickname: "谢毅17",
//     registerDate: new Date().toLocaleDateString(),
//     lastLogin: new Date(2022 / 10 / 30).toLocaleDateString(),
//     commonCorrectNumber: 100,
//     challengeAccuracy: "80%"
//   },
//   {
//     id: "18",
//     username: "239249280318",
//     nickname: "谢毅18",
//     registerDate: new Date().toLocaleDateString(),
//     lastLogin: new Date(2022 / 10 / 30).toLocaleDateString(),
//     commonCorrectNumber: 100,
//     challengeAccuracy: "80%"
//   },
// ]
</script>
<style></style>
