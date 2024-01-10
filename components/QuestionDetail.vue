<template>
  <div>
    <div id="all-wrapper" style="">
      <div id="header-wrapper">
        <div id="header-title">
          <!-- <el-breadcrumb separator="/" style="transform: translateX(25px) translateY(10px)">
            <el-breadcrumb-item :to="{ path: routeUrl.QUESTION }">题库管理</el-breadcrumb-item>
            <el-breadcrumb-item>题库细则</el-breadcrumb-item>
            <el-breadcrumb-item>选择题</el-breadcrumb-item>
            <el-breadcrumb-item v-if="typeSelect" style="font-family: '阿里妈妈刀隶体'; font-weight: 1000">{{ breadcrumbTitle
            }}</el-breadcrumb-item> -->

          <!-- </el-breadcrumb> -->
          <client-only>

            <el-select v-model="typeSelect" @change="changeTypeSelect" class="m-2" placeholder="请选择题库" size="small"
              style="transform: translateY(25px) translateX(17px)">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </client-only>
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
              题目内容
            </h2>
            <el-input placeholder="题目内容" style="width: 130px" v-model="questionContent" clearable
              @blur="searchQuestion(false)"></el-input>
            <el-button type="primary" style="width: 60px" @click="searchQuestion(false)">查询</el-button>
            <el-button style="width: 60px" @click="reset">重置</el-button>
          </div>
          <div style="width: 100px">
            <el-button type="primary" @click="handleAdd()" style="
              width: 75px;
              position: absolute;
              top: 0;
              bottom: 0;
              margin: auto 0;
              transform: translateX(-150px);
            ">添加</el-button>
            <el-button type="primary" style="
              width: 100px;
              position: absolute;
              top: 0;
              bottom: 0;
              margin: auto 0;
              transform: translateX(-50px);
            " @click="dialogImport = true">批量导入</el-button>
            <client-only>
              <el-dialog v-model="dialogImport" title="批量导入" style="width: 300px;">
                <div style="display: flex; width: 240px;justify-content: space-between;justify-items: center;">

                  <QuestionComponent></QuestionComponent>
                  <el-button type="primary" @click="download">
                    <el-icon>
                      <Download />
                    </el-icon>
                    下载模板
                  </el-button>
                </div>

                <template #footer>
                  <span class="dialog-footer">
                    <el-button @click="dialogImport = false">取消</el-button>
                  </span>
                </template>
              </el-dialog>
            </client-only>
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
            题目列表
          </h1>
          <div style="
            margin-top: 20px;
            transform: translateX(-48px) translateY(-10px);
          ">
          </div>
        </div>

        <div id="table">
          <client-only>
            <el-table ref="multipleTableRef" :data="reallyTableData" style="width: 100%; height: 100%; display: flex;"
              lazy @expand-change="exchangeTable">
              <el-table-column type="expand">
                <template #default="props">
                  <div m="4" class="table_expand">
                    <div class="table_expand_left" style="width: 50%">
                      <p m="t-0 b-2" class="table_expand_p" style="color: #409eff">
                        题型: {{ props.row.datitype }}
                      </p>
                      <p m="t-0 b-2" class="table_expand_p">
                        题目: {{ props.row.question }}
                      </p>
                      <div v-if="props.row.datitype == '判断题'">
                        <p m="t-0 b-2" class="table_expand_p">
                          正确 : {{ props.row.optionA }}
                        </p>
                        <p m="t-0 b-2" class="table_expand_p">
                          错误 : {{ props.row.optionB }}
                        </p>
                      </div>
                      <div v-if="props.row.datitype != '判断题'" v-for="i in Object.getOwnPropertyNames(props.row).filter(
                        (j) => {
                          return /option/.test(j) && props.row[j] !== null && props.row[j] !== undefined && props.row[j] !== '';
                        }
                      )" key="{{props.row.id}}">
                        <p m="t-0 b-2" class="table_expand_p">
                          {{ i.split("n")[1] }}: {{ props.row[i] }}
                        </p>
                      </div>

                      <p m="t-0 b-2" class="table_expand_p" style="color: #f56c6c">
                        正确答案: {{ props.row.answer }}
                      </p>
                    </div>
                    <div :id="'pieChart:' + props.row.id"
                      style="width: 450px; height: 275px;position: relative;top: 0;bottom: 0;left: 0;right: 0;margin: auto;transform: translateY(10px);">
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column property="question" label="题目" :width="800" prop="question" show-overflow-tooltip>

              </el-table-column>

              <el-table-column property="question" label="类型" :width="80" prop="datitype" sortable show-overflow-tooltip>

              </el-table-column>
              <el-table-column property="handler" label="编辑" show-overflow-tooltip>
                <template #default="scope">
                  <!-- <el-button size="small" type="primary" plain @click="handleEdit(scope.$index, scope.row)" disabled="true"><el-icon>
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
        <div style="width: 100%; transform: translateY(5px); height: 50px">
          <!-- 分页器 -->
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

    <div id="edit"
      style="position:absolute; margin: 130px 280px; background-color: white; z-index: 11; display: none; width: 400px;">
      <div id="edit_box">
        <el-form :model="form" :key="timer" style="max-height: 450px; overflow:auto;">
          <div id="app">
            <el-form-item label="题目科目">
              <el-select v-model="form.coursetype" @change="" placeholder="选择科目">
                <el-option label="马原" value="马原"></el-option>
                <el-option label="中国近代史" value="中国近代史"></el-option>
                <el-option label="习概" value="习概"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="题目描述">
              <el-input v-model="form.title" style="margin:0px 0px"></el-input>
            </el-form-item>
            <el-form-item label="题型选择" style="width: 180px;">
              <el-select v-model="form.type" @change="" placeholder="选择题型">
                <!-- <el-option label="文本题" value="文本题"></el-option> -->
                <el-option label="判断题" value="判断题"></el-option>
                <el-option label="单选题" value="单选题"></el-option>
                <el-option label="多选题" value="多选题"></el-option>
              </el-select>
            </el-form-item>
            <div v-show="form.type === '文本题'">
              <label for="textAnswer">答案</label>
              <el-input type="text" id="textAnswer" name="textAnswer" style="margin: 0px 0px 0px 13px;width: 298px;"
                v-model="form.correctAnswer" />
            </div>

            <div v-show="form.type === '判断题'">
              <label for="multipleChoiceOptions">选项对：</label>
              <el-input type="text" id="multipleChoiceOptions" name="multipleChoiceOptions" v-model="form.optionA"
                style="width: 280px;" />
              <label for="multipleChoiceOptions">选项错：</label>
              <el-input type="text" id="multipleChoiceOptions" name="multipleChoiceOptions" v-model="form.optionB"
                style="width: 280px; margin: 10px 0px;" />
              <label for="textAnswer">答案:</label>
              <el-input type="text" id="textAnswer" name="textAnswer" style="margin: 0px 10px 0px 21px;width: 170px;"
                v-model="form.correctAnswer" placeholder="请填 '正确' 或 '错误'" />
            </div>

            <div v-show="form.type === '单选题'">
              <label for="optionCount">选项个数 </label>
              <el-input type="number" id="optionCount" v-model="form.columnnum" @input="generateInputFields"
                style="width: 90px; margin: 0px 9px ;" />

              <!-- 根据选项个数动态生成输入框 -->
              <div v-for="index in parseInt(form.columnnum)" :key="index">
                <div style="margin: 15px 0px;">
                  <label :for="`input${index}`">选项{{ String.fromCharCode(index + 64) }}：</label>
                  <el-input :type="inputType" :id="`input${index}`" :name="`input${index}`"
                    v-model="form[`option${String.fromCharCode(index + 64)}`]" style="width: 270px;" />
                </div>
              </div>
              <div style=" margin:15px 10px 0px 0px;">
                <label for="singleChoiceOptions" style=" margin:0px 10px 0px 0px;">答案:</label>
                <el-input type="text" id="singleChoiceOptions" name="singleChoiceOptions" v-model="form.correctAnswer"
                  style="width: 200px;margin: 0px 0px 0px 18px ;" placeholder="" />
              </div>

            </div>

            <div v-show="form.type === '多选题'">
              <label for="optionCount">选项个数 </label>
              <el-input type="number" id="optionCount" v-model.number="form.columnnum" @input="generateInputFields"
                style="width: 90px; margin: 0px 9px ;" :min="1" :max="10" />

              <!-- 根据选项个数动态生成输入框 -->
              <div v-for="index in parseInt(form.columnnum)" :key="index">
                <div style="margin: 15px 0px;">
                  <label :for="`input${index}`">选项{{ String.fromCharCode(index + 64) }}：</label>
                  <el-input :type="inputType" :id="`input${index}`" :name="`input${index}`"
                    v-model="form[`option${String.fromCharCode(index + 64)}`]" style="width: 270px;" />
                </div>
              </div>
              <div style=" margin:15px 10px 0px 0px;">
                <label for="singleChoiceOptions" style=" margin:0px 10px 0px 0px;">答案:</label>
                <el-input type="text" id="singleChoiceOptions" name="singleChoiceOptions" v-model="form.correctAnswer"
                  style="width: 200px;margin: 0px 0px 0px 18px ;" placeholder="多个选项直接填写，如：ABC" />
              </div>

            </div>

            <!-- 题目添加的按钮 -->
            <div style="margin:10px 0px">
              <el-button @click="CancelAdd" type="primary">取消</el-button>
              <el-button @click="addQuestion" type="primary">添加</el-button>
            </div>
          </div>

          <!-- 引入 Vue.js 和 Element Plus 的脚本 -->
          <!-- <script src="https://cdn.jsdelivr.net/npm/vue@2"></script>
          <script src="https://unpkg.com/element-plus/lib/index.full.js"></script> -->
          <!-- <div v-if="form.type=='单选题'">
                <span>{{console.log(form.type)}}</span>
                <el-form-item lable="选项数量">
              <el-input></el-input>
            </el-form-item>
            </div> -->

        </el-form>
      </div>
    </div>
  </div>
</template>
<script setup lang="js">
import { routeUrl } from '~/nutils/goto';
import { _ } from "lodash"
import * as echarts from 'echarts';

const props = defineProps(["options", "tableData"])
const copyData = ref([])
const tableData = ref([])
const options = ref([])
const breadcrumbTitle = ref("题库选择")
const typeSelect = ref("")
const selectedQuestionType = ref("")
const currentPage = ref(1)
const pageSize = ref(10)
const totalNumber = ref(tableData.value.length)
const reallyTableData = ref([])
const questionContent = ref("")
const dialogImport = ref(false)
watchEffect(() => {
  totalNumber.value = tableData.value.length
  // console.log(tableData.value)
  reallyTableData.value = !tableData.value?[]:tableData.value.slice((currentPage.value - 1) * pageSize.value, _.min([(currentPage.value) * pageSize.value, tableData.value.length]))
})
watch(props, () => {

  options.value = props.options
  typeSelect.value = props.options[0].value

}, { immediate: true })



watch(typeSelect, () => {
  axios.get(`http://localhost:8888/get/allquestion?name=${typeSelect.value}`).then(response => {
    // 请求成功，处理响应
    if(response.data && response.data.message){
      tableData.value=[]
      copyData.value=[]
      return 

    }
    tableData.value = response.data;
    copyData.value = response.data;
    // console.log(tableData);
  }).catch(error => {
    // 处理请求错误
    ElMessage.error('获取题目列表失败');
    console.error('请求失败:', error);
  })
}, { immediate: true })
//表单数据和函数
import axios from 'axios';
import { ElPopconfirm } from 'element-plus';
const timer = ref(1);
const inputs = ref([]);
// do not use same name with ref

const onSubmit = () => {
  console.log('submit!')
}
const form = reactive({
  coursetype: '',
  title: '',
  optionA: '',
  optionB: '',
  optionC: '',
  optionD: '',
  optionE: '',
  optionF: '',
  optionG: '',
  optionH: '',
  optionI: '',
  optionJ: '',
  Anumber: "",
  Bnumber: "",
  Cnumber: "",
  Dnumber: "",
  Enumber: "",
  Fnumber: "",
  Gnumber: "",
  Hnumber: "",
  Inumber: "",
  Jnumber: "",
  correctAnswer: '',
  type: '',
  creationTime: '',
  lastModified: '',
  modifiedBy: '',
  createdBy: '',
  columnnum: 0
});

watch(() => form.type, () => {
  if (form.type == "判断题") {
    form.columnnum = 2
  }
})
// 题库选择
function changeTypeSelect(value) {
  options.value.forEach((i, index, arr) => {
    if (i.value == value) {
      breadcrumbTitle.value = arr[index].label
    }
  })
}

function generateInputFields() {
  console.log(inputs);
  inputs = Array.from({ length: parseInt(form.columnnum) }, () => '');
  console.log(inputs);
}
// 题目内容模糊查询
function searchQuestion(reset) {
  if (reset || questionContent.value == "") {
    reallyTableData.value.push({})
    reallyTableData.value.pop()
    currentPage.value = 1
    tableData.value = copyData.value
  } else {
    tableData.value = copyData.value
    reallyTableData.value = tableData.value.filter(i => {
      return (new RegExp(questionContent.value)).test(i.question)
    })
    tableData.value = reallyTableData.value
  }

}

// 重置按钮
function reset() {
  questionContent.value = ""
  searchQuestion(true)

}
//取消添加题目
function CancelAdd() {
  document.getElementById("all").style.display = "none";
  document.getElementById("edit").style.display = "none";
}
// const moment = require('moment');
// const formattedTime = moment().format('YYYY-MM-DD');
//添加题目按钮
function addQuestion() {
  // console.log(questionContent);
  // formattedTime
  // console.log(formattedTime);
  console.log(form);
  form.correctAnswer = form.correctAnswer.trim()
  if (form.title.trim().length == 0) {
    ElMessage.error("问题不能为空")
    returnn
  }
  if (form.correctAnswer.trim().length == 0) {
    ElMessage.error("答案不能为空")
    return
  }
  if (form.columnnum <= 0 || form.columnnum > 10) {
    ElMessage.error("选项不能为小于1个或者大于10个")
    return
  }
  if (form.type == "单选题" && (form.correctAnswer.length > 1 || new RegExp(`^[a-jA-J]$`).test(form.correctAnswer) == false)) {
    ElMessage.error("单选题答案格式不对")
    return
  }
  else if (form.type == "多选题" && (form.correctAnswer.length == 1 || new RegExp(`^([a-jA-J]{1,${form.columnnum}})$`).test(form.correctAnswer) == false)) {
    ElMessage.error("多选题答案格式不对")
    return
  }
  else if (form.type == "判断题" && new RegExp(`^(正确|错误)$`).test(form.correctAnswer) == false) {
    ElMessage.error("判断题答案格式不对")
    return
  }


  axios.post("http://localhost:3000/add/question", form).then(response => {
    ElMessage.success("添加成功");
    CancelAdd()
    // console.log(response.data);
    // console.log(form);
  }).catch(error => {
    ElMessage.error(error.message);
  })
}
function handleSizeChange() {

}
function handleCurrentChange() {

}


function dateChange() {
  console.log("值改变")
  console.log(timer)
  timer.value = timer.value + 1;

}
// 更改某条数据
function handleAdd() {
  document.getElementById("all").style.display = "block";
  document.getElementById("edit").style.display = "block";
  // editForm.value = obj;
  // console.log(editForm.value.title)
}


// 删除数据
function handleDelete(a, obj) {
  ElMessageBox.confirm('你确定要删除吗？', 'warning', {
    confirmButtonText: '确定',
    cancelButtonText: '再想想',
    type: 'warning',
  }).then(() => {
    if (questionContent.value) {
      let dataIndex = null
      try {
        copyData.value.forEach((i, index) => {
          if (i.id == obj.id) {
            dataIndex = index
            throw new Error("找到对应的元素了")
          }
        })
      } catch {
        copyData.value.splice(dataIndex, 1)
        let dataIndex2 = null
        try {
          tableData.value.forEach((i, index) => {
            if (i.id == obj.id) {
              dataIndex2 = index
              throw new Error("找到对应的元素了")
            }
          })
        }
        catch {
          // console.log("dasda")
          $fetch("http://localhost:8888/question", {
            method: "DELETE",
            body: {
              id: [tableData.value[dataIndex2].id]
            }
          }).then(() => {
            ElMessage({
              message: '删除成功',
              type: 'success',
            })
            tableData.value.splice(dataIndex2, 1)
          }).catch(err => {
            ElMessage({
              message: '删除失败:' + err.message,
              type: 'errrorr',
            })
          })
        }

      }
    }
    else {
      let realIndex = (currentPage.value - 1) * pageSize.value + a
      // console.log("@@", a)
      $fetch("http://localhost:8888/question", {
        method: "DELETE",
        body: {
          id: [tableData.value[realIndex].id]
        }
      }).then(() => {

        ElMessage({
          message: '删除成功',
          type: 'success',
        })
        tableData.value.splice(realIndex, 1)
        // console.log('@',tableData.value,copyData.value)
        copyData.value = tableData.value
        // console.log('@@',tableData.value,copyData.value)
      }).catch(err => {
        ElMessage({
          message: '删除失败:' + err.message,
          type: 'errrorr',
        })
      })

    }
  })


}

const multipleTableRef = ref()


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


function exchangeTable(a, expandedRows) {
  if (expandedRows.length != 0) {
    // console.log(expandedRows)
    expandedRows.forEach((i, index) => {
      setTimeout(() => {
        let dom = document.getElementById("pieChart:" + i.id)
        //piechart饼状图数据
        let pieOption;

        pieOption = {
          tooltip: {
            trigger: 'item'
          },
          legend: {
            top: '0%',
            left: 'center'
          },
          series: [
            {
              name: '选项',
              type: 'pie',
              radius: ['40%', '70%'],
              avoidLabelOverlap: false,
              itemStyle: {
                borderRadius: 10,
                borderColor: '#fff',
                borderWidth: 2
              },
              label: {
                show: true,
                position: "outside",
                rotate: "tangential",
                fontWeight: "normal",
                fontSize: 15,
                alignTo: "none",
                edgeDistance: 0,
                borderWidth: 3,
                // borderColor:"#bfa",
                formatter: '{b}: {d}%',
                distanceToLabelLine: 0,
              },
              emphasis: {
                label: {
                  show: true,
                  fontSize: 20,
                  fontWeight: 'bold'
                }
              },
              labelLine: {
                show: true,
                // showAbove:true,
                length2: 10,
                lineStyle: {
                  width: 3
                }
              },
              data: Object.getOwnPropertyNames(i).filter(x => {
                return /[A-Z]num/.test(x) && i[x] !== null
              }).map((y, index) => {
                return { value: i[y], name: i.datitype != '判断题' ? y.split('num')[0] : index == 0 ? "正确" : "错误" }
              })
            }
          ]
        };

        var myChartPie = echarts.init(dom);
        pieOption && myChartPie.setOption(pieOption);

      }, 1000)
    })
  } else {
    // console.log("aa", a)
  }
}

function download() {
  window.open('/模板.xlsx')
}
</script>
<style lang="scss" scoped>
#all-wrapper {
  // border: 1px solid black;
  position: absolute;
  height: 100%;
  width: 96%;
  left: 0px;
  right: 0px;
  top: 10px;
  margin: auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;


  #header-wrapper {
    height: 120px;
    border-radius: 40px;
    padding: 0;
    display: flex;
    flex-direction: column;
    position: relative;
    box-shadow: 0 2px 10px 0 rgba(237, 238, 240, 0.5);
    margin-bottom: 20px;
    #header-title {
      width: 100%;
      height: 95px;
      background-color: white;
    }

    #header-body {
      height: 50px;
      width: 100%;
      position: relative;
      display: flex;
      justify-content: space-between;
      padding: 5px 10px;
      background-color: white;
    }
  }

  #body-wrapper {
    overflow: hidden;
    background-color: white;
    box-shadow: 0 2px 10px 0 rgba(237, 238, 240, 0.5);
    position: relative;
    height: 75%;

    #table {
      width: 93%;
      height: 85%;
      position: relative;
      left: 0;
      right: 0;
      margin: auto;
      transform: translateY(10px);
    }

  }

  .table_expand {
    margin: 10px 60px;
    display: flex;
  }

  .table_expand_p {
    margin: 10px 0px;
  }


}

#edit {


  #edit_box {
    margin: 20px 30px;
  }
}

.el-button--text {
  margin-right: 15px;
}

.el-select {
  width: 300px;
}

.el-input {
  width: 300px;
}

.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>
