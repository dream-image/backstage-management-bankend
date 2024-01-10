<template>
  <div id="all-wrapper" style="display: flex;">
    <div id="body-wrapper">
      <div id="body-title" style="height: 10px; margin: 0px 20px; display:flex;">
        <el-page-header @back="goBack">
          <template #content>
            <span class="text-large font-600 mr-3" style="place-items: center;">
              基础资料
            </span>
          </template>
        </el-page-header>

      </div>

      <div>
        <div id="body-info" style="height: 200px; display: flex; flex-direction: row; width: 100%">
          <div id="body-info-picture" style="width: 200px; position: relative">
            <el-avatar :src="props.person.avatar" :size="130"
              style="left: 30; right: 0; margin: auto; position: absolute" />
            <!-- <el-button style="
                position: absolute;
                bottom: 10px;
                left: 0;
                right: 0;
                margin: auto;
                width: 80px;
              " type="primary"></el-button> -->
          </div>
          <div id="body-info-column2" style="width: 200px; margin: 0px 10px;" class="body-info">
            <li class="body-info-li">用户名：{{ person.username }} </li>
            <li class="body-info-li" @click="nicknameClick()">昵称：
              <template v-if="isReadonly">
                <el-input @blur="changeNickName" @keydown.enter="isReadonly = !isReadonly" type="text" id="editableInput"
                  v-model="person.nickname" style="width: 120px;" />
              </template>
              <template v-if="!isReadonly">{{ person.nickname }}</template>
            </li>
            <li class="body-info-li">注册时间：{{ person.register_time }}</li>
          </div>
          <div id="body-info-column3" style="width: 200px; margin: 0px 10px;" class="body-info">
            <li class="body-info-li">
              普通模式总分：{{ person.commonSumNumber }}
            </li>
            <li class="body-info-li">
              挑战模式正确率平均数：{{ person.challengeAccuracy }}
            </li>
            <li class="body-info-li">上次登陆：{{ person.login_time }}</li>
          </div>

          <div id="body-info-column4" style="width: 300px;margin: 0px 10px;" class="body-info">
            <li class="body-info-li">用户ID：{{ person.userid }}</li>
            <li class="body-info-li">微信号：{{ person.vx_id }}</li>
            <li class="body-info-li" @click="remarkClick()">备注：
              <template v-if="isReadremark">
                <el-input @blur="isReadremark = !isReadremark" @keydown.enter="isReadremark = !isReadremark" type="text"
                  id="editable" v-model="person.remark" style="width: 120px;" />
              </template>
              <template v-if="!isReadremark">{{ person.remark }}</template>
            </li>
          </div>
        </div>
      </div>
      <div id="body-picture" style="height: 200px;position: relative;display: flex;justify-content:safe center;align-items: center;">
        <client-only>
          <div style="position: absolute;left: 50px;top: 0;transform:translateY(-80px)">
            <el-select v-model="showWhatQuestionBank" @change="changeTypeSelect" class="m-2" placeholder="请选择题库"
              size="small" style="transform: translateY(25px) translateX(17px)">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </div>

        </client-only>
        <div id="normal-picture" style="width: 450px; height: 200px; transform: translateX(-20px)" ref="normalPicture">
        </div>
        <div id="challenge-picture" style="width: 450px; height: 200px;  "
          ref="challengePicture"></div>
      </div>
    </div>
  </div>
</template>
<script setup lang="js">
import * as echarts from 'echarts';
import { routeUrl } from '~/nutils/goto';
import { _ } from "lodash"
import axios from 'axios';
import dayjs from 'dayjs';
import { SelectProps } from 'element-plus/es/components/select-v2/src/defaults';
const props = defineProps(['person'])
const person = ref({})
// reactive({

//   username: "23924928031", nickname: "谢毅1", registerDate: new Date().toLocaleDateString(),
//     normalCorrectNumber: 983,
//     challengeAccuracy: 80,
//     lastLogin: "2022/11/25",
//     userId: "d901jdlkdhj0912",
//     weChatNumber: "wxid_9jdalskdbno1iubnda",
//     remark: "没有备注"
// })

const route = useRoute()
const isReadonly = ref(false)
const isReadremark = ref(false)

watch(() => route.query.username ? route.query.username : "", (newValue, oldValue) => {
  console.log("new:" + newValue, "old:" + oldValue)
  if (newValue) {
    // 如果username不是空，说明是通过点击具体用户进来的，就需要发送请求去获取用户详细信
    console.log("发送请求")
    getUserDetail(route.query.username)
  } else {
    searchContent.value = ""
    searchQuestion(true, "")
  }
})

watch(props, () => {
  person.value ={
     ...props.person,
     register_time: dayjs(props.person.register_time).format('YYYY-MM-DD HH:mm:ss'),
     login_time: dayjs(props.person.login_time).format('YYYY-MM-DD HH:mm:ss')
  }
})




const searchContent = ref("")

//返回按钮
const goBack = () => {
  console.log('go back')
  navigateTo("/admin/user-manage/user")
}
//修改
function nicknameClick() {
  isReadonly.value = true;
}
function remarkClick() {
  isReadremark.value = true;
}
function changeNickName() {
  isReadonly = !isReadonly

}
// 题目内容模糊查询
function searchQuestion(reset, username) {
  if (reset || username == "") {
    Object.getOwnPropertyNames(person).forEach(i => {
      person[i] = ""
    })
  } else {
    let obj = personsData.find(i => {
      return i.username == username
    })
    Object.getOwnPropertyNames(obj).forEach(i => {
      console.log(i, obj[i])
      person[i] = obj[i]
    })
    // console.log(person)
  }

}
function changeTypeSelect(value) {
  options.value.forEach((i, index, arr) => {
    if (i.value == value) {
      showWhatQuestionBank.value = arr[index].label
    }
  })
}
//图形展示
const normalPicture = ref(null)
const challengePicture = ref(null)
const showWhatQuestionBank = ref("")
const history=ref([])
const options = useState('options', () => {
  (async () => {
    const { data, pending, error, refresh } = await useFetch('http://localhost:8888/questionBanks')
    console.log(toValue(data.value.options))
    options.value= toValue(data.value.options)
    showWhatQuestionBank.value=options.value[0].value
  })()
})
//当options还没有缓存的时候，还会执行后面的回调，而回调的返回值会作为初始值赋值给options
//但是，我回调里面写的是异步函数，所以直接在异步结束的时候再赋值给一遍options  这样就实现了，有options就不去服务器拿，没有options才去服务器拿


onMounted(() => {
  axios.get("http://localhost:3000/person", {
    params: {
      userId: route.query.id,
    }
  }).then(response => {
    history.value=response.data.range
    // myChart = this.$echarts.init (document.getElementById ('normal-picture'))
    // myChart.setOption (normalOption,true);


  }).catch(error => {
    console.log(error);
    console.log("获取最近五次挑战信息失败");
  })

  // axios.get("http://localhost:8888/get/history/nearlyfivetimes", {
  //   params: {
  //     username: route.query.username,
  //     mode: "挑战模式"

  //   }
  // }).then(response => {
  //   console.log(response.data);
  //   response.data.forEach(element => {
  //     element.date = element.date.substring(0, 10)
  //   });
  //   console.log(challengeHistory)
  //   challengeHistory = response.data;
  //   console.log(challengeHistory)

  //   let challengeOption = {
  //     toolbox: {
  //       show: false
  //     },
  //     title: {
  //       text: '挑战模式答题记录',
  //       textStyle: {
  //         fontSize: 15,
  //       },
  //       right: 'center',
  //       top: 0
  //     },
  //     tooltip: {
  //       trigger: 'axis',
  //       formatter: '{b} <br/> 花费{c0}秒<br />{a1}:{c1}%'
  //     },

  //     legend: {
  //       data: ['答题时间', '准确率'],
  //       orient: 'vertical',
  //       right: 20,
  //       top: 0
  //     },
  //     grid: {
  //       left: '3%',
  //       right: '4%',
  //       bottom: '3%',
  //       containLabel: true,

  //     },
  //     toolbox: {
  //       feature: {
  //         saveAsImage: {}
  //       }
  //     },
  //     xAxis: {
  //       type: 'category',
  //       data: history.map(i => {
  //         return i.date
  //       }),
  //       name: "日期"
  //     },
  //     yAxis: [
  //       {
  //         type: "value",
  //         name: "答题时间(秒)",
  //         nameLocation: "middle",
  //         nameTextStyle: {
  //           padding: [0, 0, 24, 0],
  //           fontWeight: "bold",
  //           fontSize: "12",
  //           color: "#232253"
  //         },
  //         position: "left",
  //         nameGap: "5",
  //         min: 0,
  //         max: 1000
  //       },
  //       {
  //         type: "value",
  //         name: "准确率(%)",
  //         nameLocation: "middle",
  //         nameTextStyle: {
  //           padding: [20, 10, 10, 0],
  //           fontWeight: "bold",
  //           fontSize: "12",
  //           color: "#232253"
  //         },
  //         min: "0",
  //         max: "100",
  //         splitLine: {
  //           show: false
  //         },
  //         nameGap: "10"
  //       },

  //     ],
  //     series: [
  //       { name: "答题时间", type: 'bar', data: challengeHistory.map(j => j.spendTime), label: { formatter: '{c}', show: true } },
  //       { yAxisIndex: 1, name: "准确率", type: 'line', data: challengeHistory.map(j => j.accuracy), label: { formatter: '{c}%', show: true } }
  //     ]
  //   };
  //   const challengeChartDom = challengePicture.value;
  //   const challengeChart = echarts.init(challengeChartDom);
  //   challengeOption && challengeChart.setOption(challengeOption);
  // })

  // let normalOption = {
  //   toolbox: {
  //     show: false
  //   },
  //   title: {
  //     text: '普通模式答题记录',
  //     textStyle: {
  //       fontSize: 15
  //     },
  //     left: 'center',
  //   },
  //   tooltip: {
  //     trigger: 'axis',
  //     formatter: '{b} <br/> 共答{c0}题<br />{a1}:{c1}%'
  //   },

  //   legend: {
  //     data: ['答题数目', '准确率'],
  //     orient: 'vertical',
  //     right: 20,
  //     top: 0
  //   },
  //   grid: {
  //     left: '3%',
  //     right: '4%',
  //     bottom: '3%',
  //     containLabel: true
  //   },
  //   toolbox: {
  //     feature: {
  //       saveAsImage: {}
  //     }
  //   },
  //   xAxis: {
  //     type: 'category',
  //     data: history.map(i => {
  //       return i.date
  //     }),
  //     name: "日期"
  //   },
  //   yAxis: [
  //     {
  //       type: "value",
  //       name: "答题数目(题)",
  //       nameLocation: "center",
  //       nameTextStyle: {
  //         padding: [0, 0, 10, 0],
  //         fontWeight: "bold",
  //         fontSize: "12",
  //         color: "#232253"
  //       },
  //       position: "left",
  //       nameGap: "20",
  //       min: 0,
  //       max: 1000
  //     },

  //     {
  //       type: "value",
  //       name: "准确率(%)",
  //       nameLocation: "center",
  //       nameTextStyle: {
  //         padding: [10, 0, 0, 20],
  //         fontWeight: "bold",
  //         fontSize: "12",
  //         color: "#232253"
  //       },
  //       min: "0",
  //       max: "100",
  //       splitLine: {
  //         show: false
  //       },
  //       nameGap: "20"
  //     },

  //   ],
  //   series: [
  //     { name: "答题数目", type: 'bar', data: history.map(j => j.number), label: { formatter: '{c}', show: true } },
  //     { yAxisIndex: 1, name: "准确率", type: 'line', data: history.map(j => _.floor(j.correctNumber / j.number * 100, 2)), label: { formatter: '{c}%', show: true } }
  //   ]
  // };
  // let challengeOption = {
  //   toolbox: {
  //     show: false
  //   },
  //   title: {
  //     text: '挑战模式答题记录',
  //     textStyle: {
  //       fontSize: 15,
  //     },
  //     right: 'center',
  //     top: 0
  //   },
  //   tooltip: {
  //     trigger: 'axis',
  //     formatter: '{b} <br/> 花费{c0}秒<br />{a1}:{c1}%'
  //   },

  //   legend: {
  //     data: ['答题时间', '准确率'],
  //     orient: 'vertical',
  //     right: 20,
  //     top: 0
  //   },
  //   grid: {
  //     left: '3%',
  //     right: '4%',
  //     bottom: '3%',
  //     containLabel: true,

  //   },
  //   toolbox: {
  //     feature: {
  //       saveAsImage: {}
  //     }
  //   },
  //   xAxis: {
  //     type: 'category',
  //     data: history.map(i => {
  //       return i.date
  //     }),
  //     name: "日期"
  //   },
  //   yAxis: [
  //     {
  //       type: "value",
  //       name: "答题时间(秒)",
  //       nameLocation: "middle",
  //       nameTextStyle: {
  //         padding: [0, 0, 24, 0],
  //         fontWeight: "bold",
  //         fontSize: "12",
  //         color: "#232253"
  //       },
  //       position: "left",
  //       nameGap: "5",
  //       min: 0,
  //       max: 1000
  //     },
  //     {
  //       type: "value",
  //       name: "准确率(%)",
  //       nameLocation: "middle",
  //       nameTextStyle: {
  //         padding: [20, 10, 10, 0],
  //         fontWeight: "bold",
  //         fontSize: "12",
  //         color: "#232253"
  //       },
  //       min: "0",
  //       max: "100",
  //       splitLine: {
  //         show: false
  //       },
  //       nameGap: "10"
  //     },

  //   ],
  //   series: [
  //     { name: "答题时间", type: 'bar', data: challengeHistory.map(j => j.spendTime), label: { formatter: '{c}', show: true } },
  //     { yAxisIndex: 1, name: "准确率", type: 'line', data: challengeHistory.map(j => j.accuracy), label: { formatter: '{c}%', show: true } }
  //   ]
  // };



})

watch(showWhatQuestionBank,()=>{
  if(person.value){
    // console.log(history.value)
    
    let obj=toRaw(history.value.find(i=>i.value==showWhatQuestionBank.value))
    if(!obj){
      ElMessage.warning('无该题库记录')
      return
    }
    // console.log(data)
    if(!obj.common || !obj.common.series){
      ElMessage.warning('该题库无普通记录')
      
    }else{
      console.log(obj.common)
    let normalOption = {
      toolbox: {
        show: false
      },
      title: {
        text: `${showWhatQuestionBank.value}普通模式记录`,
        textStyle: {
          fontSize: 15
        },
        left: 'center',
      },
      tooltip: {
        trigger: 'axis',
        formatter: '{b} <br/> {a0}:{c0}<br />'
      },

      legend: {
        // data: ['分数'],
        orient: 'vertical',
        right: 20,
        top: 0
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      toolbox: {
        feature: {
          saveAsImage: {}
        }
      },
      xAxis: {
        type: 'category',
        data: obj.common.categories,
        name: "日期",
        axisLabel: {
          interval:0
        }
      },
      yAxis: [
        {
          type: "value",
          name: "分数",
          nameLocation: "center",
          nameTextStyle: {
            padding: [0, 0, 10, 0],
            fontWeight: "bold",
            fontSize: "12",
            color: "#232253"
          },
          position: "left",
          nameGap: "20",

        },
      ],
      series:obj.common.series.map(i=>{
        return {
          ...i,
          data:i.data,
          label: { formatter: '{c}', show: true },
          type:"line"
        }
      })
    };
    var normalChartDom = normalPicture.value;
    var normalChart = echarts.init(normalChartDom);
    console.log(normalOption)
    normalOption && normalChart.setOption(normalOption);
    }
    if(!obj.challenge || !obj.challenge.series){
      ElMessage.warning("该题库无挑战记录")
      
    }else{
      console.log(obj.challenge)
    let challengeOption = {
      toolbox: {
        show: false
      },
      title: {
        text: `${showWhatQuestionBank.value}挑战模式记录`,
        textStyle: {
          fontSize: 15
        },
        left: 'center',
      },
      tooltip: {
        trigger: 'axis',
        formatter: '{b0} <br/> {a0}:{c0}<br />{a1}:{c1}秒'
      },

      legend: {
        // data: ['分数',"答题时间(秒)"],
        orient: 'vertical',
        right: 20,
        top: 0
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      toolbox: {
        feature: {
          saveAsImage: {}
        }
      },
      xAxis: {
        type: 'category',
        data: obj.challenge.categories,
        name: "日期",
        axisLabel: {
          interval:0
        }
      },
      yAxis: [
        {
          type: "value",
          name: "分数",
          nameLocation: "center",
          nameTextStyle: {
            padding: [0, 0, 10, 0],
            fontWeight: "bold",
            fontSize: "12",
            color: "#232253"
          },
          position: "left",
          nameGap: "20",

        },
        {
          type: "value",
          name: "答题时间(秒)",
          nameLocation: "center",
          nameTextStyle: {
            padding: [0, 0, 35,0],
            fontWeight: "bold",
            fontSize: "12",
            color: "#232253"
          },
          position: "right",
          nameRotate:270,
          nameGap: "5",
          min:0,
          max:1000
        },
      ],
      series:obj.challenge.series.map(i=>{
        return {
          ...i,
          data:i.data,
          label: { formatter: '{c}', show: true },
          type:"line"
        }
      })
    };

    var challengeChartDom = challengePicture.value;
    var challengeChart = echarts.init(challengeChartDom);
    // console.log(challengeChart)
    challengeOption && challengeChart.setOption(challengeOption);
    }
  }
})
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
}

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
    justify-content: flex-start;
    padding: 0px 10px;
    background-color: white;
  }
}

#body-wrapper {
  height: 580px;
  overflow: auto;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  overflow: auto;
  background-color: white;
  box-shadow: 0 2px 10px 0 rgba(237, 238, 240, 0.50);
  position: relative;

  .body-info {
    height: 90%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;

    .body-info-li {
      height: 50px;
      width: 200px;
      text-align: left;
      word-break: break-all;
      overflow: auto;

      &::-webkit-scrollbar {
        display: none;
      }
    }
  }

  #body-picture {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
  }

}
</style>
