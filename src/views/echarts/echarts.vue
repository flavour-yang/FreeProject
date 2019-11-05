<template>
  <div class="content">
    <div>
      select time
      <!-- <el-date-picker
        v-model="pickerData"
        type="daterange"
        align="right"
        unlink-panels
        value-format="yyyy-MM-dd"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :picker-options="pickerOptions"
      />-->
      <el-date-picker
        v-model="pickerData"
        type="monthrange"
        range-separator="至"
        start-placeholder="开始月份"
        end-placeholder="结束月份"
        value-format="yyyy-M"
      />
    </div>
    <!-- <div v-for="item in echartList"/> -->
    <div class="echart-content">
      <!-- 柱 -->
      <div id="sales" />
      <!-- 柱 -->
      <div id="order" />
      <!-- 折线 -->
      <div id="ucr" />
      <!-- 柱 -->
      <div id="session" />
      <!-- 柱 -->
      <div id="spend" />
      <!-- 柱 -->
      <div id="AD_order" />
      <!-- 折线 -->
      <div id="AD_cr" />
      <!-- 柱 -->
      <div id="AD_sales" />
      <!-- 折线 -->
      <div id="AD_acos" />

      <div id="echart" class="echarts" />
      <div id="echart1" class="echarts" />
    </div>
  </div>
</template>

<script>
import echarts from 'echarts'

export default {
  data() {
    return {
      myChart: null,
      pickerData: '',
      dateList: [],
      echartList: [],
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      },
      now: +new Date(1997, 9, 3),
      oneDay: 24 * 3600 * 1000,
      value: Math.random() * 1000,
      data1: []
    }
  },
  watch: {
    pickerData(val) {
      const time = val[1].split('-')[1] - val[0].split('-')[1]
      this.dateList = []
      for (let i = val[0].split('-')[1]; i <= time + 1; i++) {
        this.dateList.push(i + '月份')
      }
      this.initEchart()
    }
  },
  mounted() {
    for (var i = 1; i < 13; i++) {
      this.dateList.push(i + '月份')
    }
    for (var j = 0; j < 1000; j++) {
      this.data1.push(this.randomData())
    }
    this.initEchart()
    this.initLineChart()
    // this.chart = echarts.init(document.getElementById("echart"));
  },
  destroyed() {
    window.removeEventListener('resize', this.resizeChart)
  },
  methods: {
    resizeChart() {
      this.myChart.resize({
        width: 'auto',
        height: 'auto'
      })
    },
    initEchart() {
      // xData = xData || [];
      // yData = yData || [];
      // yData.forEach(item => {
      //   item.type = "bar";
      // });
      this.myChart = echarts.init(document.getElementById('echart'), 'light')
      // 绘制图表
      this.myChart.setOption({
        title: {
          text: '统计测试',
          left: 10,
          top: 10,
          textStyle: {
            fontSize: 14,
            fontWeight: 400
          }
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          top: '4%',
          data: ['男', '女', '总数']
        },
        grid: {
          bottom: '10%',
          top: '20%',
          left: '4%',
          right: '4%'
        },
        toolbox: {
          show: true,
          feature: {
            dataZoom: {
              yAxisIndex: 'none'
            },
            mark: {
              show: true
            },
            magicType: {
              show: true,
              type: ['line', 'bar']
            },
            restore: {
              show: true
            },
            saveAsImage: {
              show: true
            }
          }
        },
        // dataZoom: [
        //   {
        //     show: true,
        //     realtime: true,
        //     y: 50,
        //     height: 16,
        //     start: 0,
        //     end: 100,
        //     left: "10%",
        //     width: "80%"
        //   }
        // ],
        xAxis: [
          {
            type: 'category',
            boundaryGap: true, // 刻度显示
            data: this.dateList // x轴值
          }
        ],
        yAxis: [
          {
            splitLine: {
              lineStyle: {
                type: 'dashed'
              }
            },
            type: 'value',
            name: '数量'
          }
        ],
        series: [
          {
            name: '总数',
            type: 'line',
            stack: '总量',
            symbolSize: 10,
            symbol: 'circle',
            itemStyle: {
              normal: {
                color: 'rgba(252,230,48,1)',
                barBorderRadius: 0,
                label: {
                  // show: true,
                  position: 'top'
                  // formatter: function(p) {
                  //   return p.value > 0 ? p.value : ''
                  // }
                }
              }
            },
            data: [
              1036,
              3693,
              2962,
              3810,
              2519,
              1915,
              1748,
              4675,
              6209,
              4323,
              2865,
              4298
            ]
          },
          {
            name: '女',
            type: 'bar',
            stack: '总量',
            barMaxWidth: 35,
            barGap: '10%',
            itemStyle: {
              normal: {
                color: 'rgba(255,144,128,1)',
                label: {
                  show: true,
                  textStyle: {
                    color: '#fff'
                  },
                  position: 'insideTop',
                  formatter: function(p) {
                    return p.value > 0 ? p.value : ''
                  }
                }
              }
            },
            data: [
              709,
              1917,
              2455,
              2610,
              1719,
              1433,
              1544,
              3285,
              5208,
              3372,
              2484,
              4078
            ]
          },

          {
            name: '男',
            type: 'bar',
            stack: '总量',
            itemStyle: {
              normal: {
                color: 'rgba(0,191,183,1)',
                barBorderRadius: 0,
                label: {
                  show: true,
                  position: 'top',
                  formatter: function(p) {
                    return p.value > 0 ? p.value : ''
                  }
                }
              }
            },
            data: [
              327,
              1776,
              507,
              1200,
              800,
              482,
              204,
              1390,
              1001,
              951,
              381,
              220
            ]
          }

          // {
          //   name: '总数',
          //   type: 'bar',
          //   stack: '总量',
          //   data: [
          //     1036,
          //     3693,
          //     2962,
          //     3810,
          //     2519,
          //     1915,
          //     1748,
          //     4675,
          //     6209,
          //     4323,
          //     2865,
          //     4298
          //   ]
          // }
        ],
        calculable: false
      })
      window.addEventListener('resize', this.resizeChart)
    },
    initLineChart() {
      this.myChart1 = echarts.init(document.getElementById('echart1'), 'light')

      this.myChart1.setOption({
        title: {
          text: '动态数据 + 时间坐标轴'
        },
        tooltip: {
          trigger: 'axis',
          formatter: function(params) {
            params = params[0]
            var date = new Date(params.name)
            return (
              date.getDate() +
              '/' +
              (date.getMonth() + 1) +
              '/' +
              date.getFullYear() +
              ' : ' +
              params.value[1]
            )
          },
          axisPointer: {
            animation: false
          }
        },
        xAxis: {
          type: 'time',
          splitLine: {
            show: false
          }
        },
        yAxis: {
          type: 'value',
          boundaryGap: [0, '100%'],
          splitLine: {
            show: false
          }
        },
        series: [
          {
            name: '模拟数据',
            type: 'line',
            showSymbol: false,
            hoverAnimation: false,
            data: this.data1
          }
        ]
      })
    },

    randomData() {
      this.now = new Date(+this.now + this.oneDay)
      this.value = this.value + Math.random() * 21 - 10
      return {
        name: this.now.toString(),
        value: [
          [
            this.now.getFullYear(),
            this.now.getMonth() + 1,
            this.now.getDate()
          ].join('/'),
          Math.round(this.value)
        ]
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.content {
  width: 100%;
  height: calc(100vh - 50px);
}
.echart-content {
  padding: 10px;
  width: 100%;
  height: 100%;
  .echarts {
    margin-left: 10px;
    width: 300px;
    height: 300px;
  }
}
</style>
