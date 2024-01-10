<template>
  <div id="all-wrapper" style="display: flex; justify-content: space-evenly;">
    <div id="header-wrapper">
      <div id="header-title">
        <el-breadcrumb separator="/" style="transform: translateX(25px) translateY(10px)">
          <el-breadcrumb-item :to="{ path: routeUrl.QUESTION }">用户管理</el-breadcrumb-item>
          <el-breadcrumb-item>用户总览</el-breadcrumb-item>
        </el-breadcrumb>
        <div style="
            transform: translateY(25px) translateX(25px);
            font-weight: bold;
          ">
          <p>用户总览</p>
        </div>

      </div>
      <div id="header-body">
        <div style="
            display: flex;
            justify-content: space-around;
            width: 400px;
            position: relative;
            top: 0;
            bottom: 0;
            margin: auto 0;
            height: max-content;
          ">
          <h2 style="
              text-align: center;
              height: 32px;
              line-height: 32px;
              width: 80px;
            ">
            用户 查询
          </h2>
          <el-input placeholder="用户名 / 昵称" style="width: 130px" v-model="searchContent" clearable
            @blur="searchQuestion(false)"></el-input>
          <el-button type="primary" style="width: 60px" @click="searchQuestion(false)">查询</el-button>
          <el-button style="width: 60px" @click="reset">重置</el-button>
        </div>
      </div>
    </div>
    <div id="body-wrapper">
      <div style="
          display: flex;
          justify-content: space-between;
          height: 27px;
          width: 100%;
        ">
        <h1 style="
            font-size: large;
            font-weight: bolder;
            transform: translateX(25px) translateY(8px);
            height: 27px;
            width: 80px;
          ">
          用户列表
        </h1>
        <div style="
            margin-top: 20px;
            transform: translateX(-48px) translateY(-10px);
          ">
          <!-- <el-button @click="clearSelected()" style="width: 80px" size="small" type="primary">清除选中</el-button> -->
          <!-- <el-button @click="deleteSelection()" style="width: 80px" size="small" type="primary">批量删除</el-button> -->
        </div>
      </div>

      <div id="table">
        <client-only>
          <el-table ref="multipleTableRef" :data="reallyTableData" style="width: 100%; height: 310px; border: none"
            @selection-change="handleSelectionChange" lazy @row-click="activeCheckbox"
            :default-sort="{ order: 'ascending', prop: 'username' }">
            <el-table-column type="selection" width="55" />
            <el-table-column property="username" label="用户名" show-overflow-tooltip width="155" sortable />
            <el-table-column property="nickname" label="昵称" show-overflow-tooltip width="130" sortable />
            <el-table-column property="registerDate" label="注册时间" show-overflow-tooltip width="150" sortable />
            <el-table-column property="lastLogin" label="上次登陆" show-overflow-tooltip width="150" sortable />
            <el-table-column property="commonSumNumber" label="普通模式总分" show-overflow-tooltip width="135"
              align="center " header-align="left" sortable />
            <el-table-column property="challengeAccuracy" label="挑战模式平均正确率" show-overflow-tooltip width="110" align="center"
              header-align="center" sortable  />
            <el-table-column property="handler" label="操作" show-overflow-tooltip>
              <template #default="scope">
                <el-button size="small" @click="handleEdit(scope.$index, scope.row)" style="width: 40px; border: none">
                  <img src="~/assets/info.svg" width="23" height="23" id="img" />
                </el-button>
                <!-- <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)" plain>
                  <el-icon>
                    <Delete />
                  </el-icon> </el-button> -->
                </template>
            </el-table-column>
          </el-table>
        </client-only>
      </div>
      <div style="width: 100%; height: 30px">
        <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100, 150, 200]" :small="true" :disabled="false" :background="false"
          layout="total, sizes, prev, pager, next, jumper" :total="totalNumber" @size-change="handleSizeChange"
          @current-change="handleCurrentChange" style="
            position: absolute;
            right: 100px;
            transform: translateY(13px);
            user-select: none;
          " />
      </div>
    </div>
  </div>
</template>
<script setup lang="js">
import { routeUrl } from '~/nutils/goto';
import axios from 'axios'
import { _ } from "lodash"
useHead({
  link: [{ rel: "stylesheet", href: "https://unpkg.com/view-ui-plus/dist/styles/viewuiplus.css" }],
})

const props = defineProps(["tableData"])
const copyData = ref([])
const tableData = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const totalNumber = ref(tableData.value.length)
const reallyTableData = ref([])
const searchContent = ref("")
watchEffect(() => {
  totalNumber.value = tableData.value.length
  reallyTableData.value = tableData.value.slice((currentPage.value - 1) * pageSize.value, _.min([(currentPage.value) * pageSize.value, tableData.value.length]))
})
watch(props,()=>{
  copyData.value = props.tableData
  tableData.value = props.tableData
})
// 用户名或昵称模糊查询
function searchQuestion(reset) {
  if (reset || searchContent.value == "") {
    reallyTableData.value.push({})
    reallyTableData.value.pop()
    currentPage.value = 1
    tableData.value = copyData.value
  } else {
    tableData.value = copyData.value
    reallyTableData.value = tableData.value.filter(i => {
      return (new RegExp(searchContent.value)).test(i.username) || (new RegExp(searchContent.value)).test(i.nickname)
    })
    tableData.value = reallyTableData.value
  }

}

// 重置按钮
function reset() {
  searchContent.value = ""
  searchQuestion(true)

}


function handleSizeChange() {

}
function handleCurrentChange() {

}



// 更改某条数据
function handleEdit(a, obj) {
  navigateTo({
    path: routeUrl.USERDETAIL, query: {
      id: obj.id
    }
  })


}


// // 删除数据
// function handleDelete(a, obj) {

//   if (searchContent.value) {
//     let dataIndex = null
//     try {
//       copyData.value.forEach((i, index) => {
//         if (i.id == obj.id) {
//           dataIndex = index
//           throw new Error("找到对应的元素了")
//         }
//       })
//     } catch {
//       copyData.value.splice(dataIndex, 1)
//       let dataIndex2 = null
//       try {
//         tableData.value.forEach((i, index) => {
//           if (i.id == obj.id) {
//             dataIndex2 = index
//             throw new Error("找到对应的元素了")
//           }
//         })
//       }
//       catch {
//         tableData.value.splice(dataIndex2, 1)
//       }
//     }
//   }
//   else {
//     let realIndex = (currentPage.value - 1) * pageSize.value + a
//     tableData.value.splice(realIndex, 1)
//     copyData.value.splice(realIndex, 1)
//   }
// }

const multipleTableRef = ref()
const multipleSelection = ref([])
const clearSelected = () => {
  multipleTableRef.value.clearSelection()
}
const handleSelectionChange = (val) => {
  multipleSelection.value = val
}

//批量删除
function deleteSelection() {
  let ids = []
  multipleTableRef.value.getSelectionRows().forEach((i, index, arr) => {
    ids.push(i.id)
  })
  copyData.value = copyData.value.filter(i => {
    return ids.indexOf(i.id) == -1
  })
  tableData.value = tableData.value.filter(i => {
    return ids.indexOf(i.id) == -1
  })
}

//点击某行选中
function activeCheckbox(row) {
  let selected = multipleTableRef.value.getSelectionRows().find(i => {
    return i.id == row.id
  })
  if (selected) {
    multipleTableRef.value.toggleRowSelection(row, false)
  } else {
    multipleTableRef.value.toggleRowSelection(row, true)

  }
}
</script>
<style lang="scss" scoped>
#all-wrapper {
  // border: 1px solid black;
  height: 96%;
  position: absolute;
  width: 96%;
  left: 0px;
  right: 0px;
  top: 0px;
  bottom: 0px;
  margin: auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;

  #header-wrapper {
    height: 135px;
    border-radius: 40px;
    padding: 0;
    display: flex;
    flex-direction: column;
    position: relative;
    box-shadow: 0 2px 10px 0 rgba(237, 238, 240, 0.50);
    margin-bottom: 20px;
    #header-title {
      width: 100%;
      height: 65px;
      background-color: white;

    }

    #header-body {
      height: 70px;
      width: 100%;
      position: relative;
      display: flex;
      justify-content: space-between;
      padding: 0px 10px;
      background-color: white;
    }
  }

  #body-wrapper {
    overflow: auto;
    background-color: white;
    box-shadow: 0 2px 10px 0 rgba(237, 238, 240, 0.50);
    position: relative;
    height: 100%;
    #table {
      width: 93%;
      height: 310px;
      position: relative;
      left: 0;
      right: 0;
      margin: auto;
      transform: translateY(10px);
    }
  }
}
</style>
