
<template>
  <div>
    <div style="position: relative;" id="button">
      <input type="file" ref="fileDom" @change="getFile" v-if="isShow" style="width: 130px;opacity: 0;position: absolute;z-index: 1;"/>
      <span  style="position: absolute;border: 1px solid #409eff;padding: 5px;text-align: center;border-radius: 4px;color: white; background-color: #409eff;width: 130px;">选择文件上传</span>
      <span style="position: absolute;transform: translateY(30px);width: max-content;">{{ fileName+"."+suffix }}</span>
    </div>
    
    <el-dialog v-model="centerDialogVisible" title="Warning" width="30%" align-center>
      <span>成功导入，请确认提交</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="cancel">再思考一下</el-button>
          <el-button type="primary" @click="submit">
            确认提交
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ElMessage } from "element-plus";
import { nanoid } from "nanoid";
import { ref } from "vue";
import { readFile, utils } from "xlsx";
const fileDom = ref(null)
const centerDialogVisible = ref(false)
const isShow = ref(true)
var questionList = []
const fileName = ref("")
const suffix=ref("")
function getFile() {
  let file = fileDom.value.files[0]
  let name
  name = fileDom.value.value.split('\\')
  name = name[name.length - 1]

  if (name.lastIndexOf(".xlsx") != name.length - 5)
    throw new Error("文件必须是xlsx文件")

  suffix.value=name.split(".")[1]
  name = name.split(".")[0]
  let reader = new FileReader()
  reader.readAsArrayBuffer(file)
  reader.onloadend = (e) => {
    let data = e.target.result
    let workbook = readFile(data, { type: 'binary' })
    let result = []
    try {
      // console.log(workbook.SheetNames)
      workbook.SheetNames.forEach((x, index) => {
        if (x == "说明")
          return;
        result[index] = utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[index]])
        result[index].every((i, index) => {
          if (i["题目"].trim() == "") {
            throw new Error(`第${index + 2}行的题目为空，请检查`)
          }
          if (i["answer"].trim() == "") {
            throw new Error(`第${index + 2}行的答案为空，请检查`)
          }
          return true

        })
        result[index] = result[index].map(i => {
          let option = {}
          Object.getOwnPropertyNames(i).filter(i => {
            return /option/.test(i)
          }).forEach(j => {
            option[j] = i[j]
          })
          // console.log(option)
          return {
            question: i["题目"],
            answer: i.answer,
            ...option
          }
        })
      })

      centerDialogVisible.value = true
      // console.log(result)
      let a = []
      result.map(i => {
        if (i)
          a = a.concat(i)
      })
      questionList = a
      fileName.value = name
      // console.log(questionList)
    } catch (error) {

      ElMessage({
        message: error.message,
        type: 'error',
      })
      cancel()
    }


  }
}

function submit() {
  questionList = questionList.map(i => {
    let columnum = Object.getOwnPropertyNames(i).filter(i => i.search("option") != -1).length

    let datitype
    if (i.answer.search(/(^true$)|(^false$)/) == -1) {
      datitype = i.answer.length == 1 ? "单选题" : "多选题"
    } else {
      datitype = "判断题"
    }
    return {
      id: nanoid(),
      coursetype: fileName.value,
      datitype: datitype,
      columnnum: columnum == 0 ? 2 : columnum,
      ...i
    }
  })
  // console.log(questionList)
  // questionList=questionList.slice(0,10)
  let length = 30
  let index = Math.ceil(questionList.length / length)
  let a = []
  for (let i = 0; i < index; i++) {
    a[i] = questionList.slice(i * length, (i + 1) * length)
  }
  let err=""
  try {
    a.forEach(i => {
      questionList = i
      // console.log(i)
      fetch("http://localhost:3000/questionList", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(questionList),
        cache: "no-cache"
      }).then(res => res.json())
        .then(res => {
          ElMessage.success("提交成功")
          cancel()
        }).catch(error => {
          console.log(error)
          throw new Error(error)
        })
    })

    
    cancel()
  } catch (error) {
    if(!err){
      ElMessage.error(error)
      err=error
    }
    console.log(error)
    cancel()
  }

}
function cancel() {
  centerDialogVisible.value = false
  fileName.value = ""
  isShow.value = false
  suffix.value=""
  setTimeout(() => {
    isShow.value = true
  }, 50);
}
</script>


<style scoped>
.dialog-footer button:first-child {
  margin-right: 10px;
}
input{

}
#button:hover{
  filter: brightness(115%);
}
</style>
