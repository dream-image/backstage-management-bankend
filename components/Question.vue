<template>
  <div id="all-wrapper" style="display: flex; justify-content: space-evenly;">
    <div id="header-wrapper">
      <div id="header-title">
        <!-- <el-breadcrumb separator="/" style="transform: translateX(25px) translateY(10px)">
          <el-breadcrumb-item :to="{ path: routeUrl.QUESTION }">题库管理</el-breadcrumb-item>
          <el-breadcrumb-item>题库总览</el-breadcrumb-item>
        </el-breadcrumb> -->
        <div style="transform: translateY(25px) translateX(25px);font-weight:bold;">
          <p>题库总览</p>
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
            题库名称
          </h2>
          <el-input placeholder="题库名称" style="width: 130px" v-model="questionBankName" clearable
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
          题库列表
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
            @selection-change="handleSelectionChange" lazy @row-click="activeCheckbox">
            <el-table-column type="selection" width="55" />
            <el-table-column property="bankname" label="题库名称" show-overflow-tooltip width="150" align="left" />
            <el-table-column property="questionnum" label="题库数量" width="150" show-overflow-tooltip align="center" />

            <el-table-column property="createtime" label="建立日期" show-overflow-tooltip width="250" align="center" />

            <el-table-column property="creater" label="建立者" width="150" show-overflow-tooltip align="center" />
            <el-table-column property="handler" label="删除" show-overflow-tooltip>
              <template #default="scope">
                <!-- <el-button size="small" type="primary" plain @click="handleEdit(scope.$index, scope.row)"><el-icon>
                    <Edit />
                  </el-icon></el-button> -->
                <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)" plain>
                  <el-icon>
                    <Delete />
                  </el-icon> </el-button></template>
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
import { _ } from "lodash"
import axios from 'axios';


const props = defineProps(["tableData"])
const { options } = props

const copyData = ref([])
const tableData = ref([])
const breadcrumbTitle = ref("题库选择")

const currentPage = ref(1)
const pageSize = ref(10)
const totalNumber = ref(tableData.value.length)
const reallyTableData = ref([])
const questionBankName = ref("")

const multipleTableRef = ref()
const multipleSelection = ref([])
watchEffect(() => {
  totalNumber.value = tableData.value.length
  reallyTableData.value = tableData.value.slice((currentPage.value - 1) * pageSize.value, _.min([(currentPage.value) * pageSize.value, tableData.value.length]))
})
watch(props,()=>{
  // console.log(props)
  copyData.value = props.tableData
  tableData.value = props.tableData
})

// 题库选择
function changeTypeSelect(value) {
  options.forEach((i, index, arr) => {
    if (i.value == value) {
      breadcrumbTitle.value = arr[index].label
    }
  })
}



// 题目内容模糊查询
function searchQuestion(reset) {
  if (reset || questionBankName.value == "") {
    reallyTableData.value.push({})
    reallyTableData.value.pop()
    currentPage.value = 1
    tableData.value = copyData.value
  } else {
    tableData.value = copyData.value
    reallyTableData.value = tableData.value.filter(i => {
      return (new RegExp(questionBankName.value)).test(i.bankname)
    })
    tableData.value = reallyTableData.value
  }

}

// 重置按钮
function reset() {
  clearSelected()
  questionBankName.value = ""
  searchQuestion(true)

}


function handleSizeChange() {

}
function handleCurrentChange() {

}



// 更改某条数据
function handleEdit(a, obj) {
  let realIndex = (currentPage.value - 1) * pageSize.value + a


}


// 删除数据
function handleDelete(a, obj) {

  if (questionBankName.value) {
    let dataIndex = null
    try {
      copyData.value.forEach((i, index) => {
        if (i.name == obj.name) {
          dataIndex = index
          throw new Error("找到对应的元素了")
        }
      })
    } catch {
      copyData.value.splice(dataIndex, 1)
      let dataIndex2 = null
      try {
        tableData.value.forEach((i, index) => {
          if (i.name == obj.name) {
            dataIndex2 = index
            throw new Error("找到对应的元素了")
          }
        })
      }
      catch {
        tableData.value.splice(dataIndex2, 1)
      }
    }
  }
  else {
    let realIndex = (currentPage.value - 1) * pageSize.value + a
    tableData.value.splice(realIndex, 1)
    copyData.value.splice(realIndex, 1)
  }
}


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
  justify-content: space-around;

  #header-wrapper {
    height: 135px;
    border-radius: 40px;
    padding: 0;
    display: flex;
    flex-direction: column;
    position: relative;
    box-shadow: 0 2px 10px 0 rgba(237, 238, 240, 0.50);

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
    #table {
      width: 93%;
      height: 320px;
      position: relative;
      left: 0;
      right: 0;
      margin: auto;
      transform: translateY(10px);
    }
  }
}
</style>
  