<template>
  <div class="content">
    <el-container>
      <el-header>
        <div>
          select time
          <el-date-picker
            v-model="pickerData"
            type="monthrange"
            range-separator="至"
            start-placeholder="开始月份"
            end-placeholder="结束月份"
            value-format="yyyy-MM-d"
          />
        </div>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>近三十天数据</span>
            </div>
            <p>退货率: {{ recentData.refundRate }}</p>
            <p>销售额: {{ recentData.sales }}</p>
            <p>花费: {{ recentData.spends }}</p>
            <p>UCR: {{ recentData.ucr }}</p>
          </el-card>
        </el-aside>
        <el-container>
          <el-main>
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
          </el-main>
        </el-container>
      </el-container>
    </el-container>
    <div />
  </div>
</template>

<script>
import echarts from "echarts";
import { getRecent, getCharts } from "@/api/table";
export default {
  data() {
    return {
      myChart: null,
      pickerData: "",
      dateList: [],
      echartList: [],
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      now: +new Date(1997, 9, 3),
      oneDay: 24 * 3600 * 1000,
      value: Math.random() * 1000,
      data1: [],
      recentData: [],
      startTime: "2019-11-1",
      endTime: "2019-11-12"
    };
  },
  watch: {
    pickerData(val) {
      this.startTime = val[0];
      this.endTime = val[1];
      this._getCharts(this.$route.query.asin);
      // const time = val[1].split("-")[1] - val[0].split("-")[1];
      // this.dateList = [];
      // for (let i = val[0].split("-")[1]; i <= time + 1; i++) {
      //   this.dateList.push(i + "月份");
      // }
      // this.initEchart();
    }
  },
  mounted() {
    // for (var i = 1; i < 13; i++) {
    //   this.dateList.push(i + '月份')
    // }
    this.dateList = ["一月", "二月", "三月"];
    for (var j = 0; j < 1000; j++) {
      this.data1.push(this.randomData());
    }
    // this.initEchart();
    // this.initLineChart();
    const asin = this.$route.query.asin;
    // debugger
    if (asin) {
      this._getRecent(asin);
    }
    this._getCharts(asin);
    //     refundRate: 0 //最近三十天退货率
    // sales: 151 // 销售额
    // spends: 0 //30天花费
    // ucr: 57.14 //最近三十天UCR
    // unitsOrders: 20 // 销量
    // this.chart = echarts.init(document.getElementById("echart"));
  },
  destroyed() {
    window.removeEventListener("resize", this.resizeChart);
  },
  methods: {
    resizeChart() {
      this.myChart.resize({
        width: "auto",
        height: "auto"
      });
    },
    initEchart(value) {
      // xData = xData || [];
      // yData = yData || [];
      // yData.forEach(item => {
      //   item.type = "bar";
      // });
      this.myChart = echarts.init(document.getElementById("echart"), "light");
      // 绘制图表
      this.myChart.setOption({
        title: {
          text: value[2][0],
          left: 10,
          top: 10,
          textStyle: {
            fontSize: 14,
            fontWeight: 400
          }
        },
        tooltip: {
          trigger: "axis"
        },
        legend: {
          top: "4%",
          data: ["order", "ad order", "natural order"]
        },
        grid: {
          bottom: "10%",
          top: "20%",
          left: "4%",
          right: "4%"
        },
        toolbox: {
          show: true,
          feature: {
            dataZoom: {
              yAxisIndex: "none"
            },
            mark: {
              show: true
            },
            magicType: {
              show: true,
              type: ["line", "bar"]
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
            type: "category",
            boundaryGap: true, // 刻度显示
            data: value[0][0] // x轴值
          }
        ],
        yAxis: [
          {
            splitLine: {
              lineStyle: {
                type: "dashed"
              }
            },
            type: "value",
            name: "数量"
          }
        ],
        series: [
          {
            name: "总数",
            type: "line",
            stack: "总量",
            symbolSize: 10,
            symbol: "circle",
            itemStyle: {
              normal: {
                color: "rgba(252,230,48,1)",
                barBorderRadius: 0,
                label: {
                  // show: true,
                  position: "top"
                  // formatter: function(p) {
                  //   return p.value > 0 ? p.value : ''
                  // }
                }
              }
            },
            data: value[1][0]
          },
          {
            name: "order",
            type: "bar",
            stack: "order",
            barMaxWidth: 35,
            barGap: "10%",
            itemStyle: {
              normal: {
                color: "rgba(255,144,128,1)",
                label: {
                  show: true,
                  textStyle: {
                    color: "#fff"
                  },
                  position: "insideTop",
                  formatter: function(p) {
                    return p.value > 0 ? p.value : "";
                  }
                }
              }
            }
          },

          {
            name: "order",
            type: "bar",
            stack: "ad order",
            itemStyle: {
              normal: {
                color: "rgba(0,191,183,1)",
                barBorderRadius: 0,
                label: {
                  show: true,
                  position: "top",
                  formatter: function(p) {
                    return p.value > 0 ? p.value : "";
                  }
                }
              }
            },
            data: value[1][1]
          },
          {
            name: "order",
            type: "bar",
            stack: "natural order",
            itemStyle: {
              normal: {
                color: "rgba(200,191,2,1)",
                barBorderRadius: 0,
                label: {
                  show: true,
                  position: "top",
                  formatter: function(p) {
                    return p.value > 0 ? p.value : "";
                  }
                }
              }
            },
            data: value[1][2]
          }
        ],
        calculable: false
      });
      window.addEventListener("resize", this.resizeChart);
    },
    initLineChart() {
      this.myChart1 = echarts.init(document.getElementById("echart1"), "light");

      this.myChart1.setOption({
        title: {
          text: "动态数据 + 时间坐标轴"
        },
        tooltip: {
          trigger: "axis",
          formatter: function(params) {
            params = params[0];
            var date = new Date(params.name);
            return (
              date.getDate() +
              "/" +
              (date.getMonth() + 1) +
              "/" +
              date.getFullYear() +
              " : " +
              params.value[1]
            );
          },
          axisPointer: {
            animation: false
          }
        },
        xAxis: {
          type: "time",
          splitLine: {
            show: false
          }
        },
        yAxis: {
          type: "value",
          boundaryGap: [0, "100%"],
          splitLine: {
            show: false
          }
        },
        series: [
          {
            name: "模拟数据",
            type: "line",
            showSymbol: false,
            hoverAnimation: false,
            data: this.data1
          }
        ]
      });
    },

    randomData() {
      this.now = new Date(+this.now + this.oneDay);
      this.value = this.value + Math.random() * 21 - 10;
      return {
        name: this.now.toString(),
        value: [
          [
            this.now.getFullYear(),
            this.now.getMonth() + 1,
            this.now.getDate()
          ].join("/"),
          Math.round(this.value)
        ]
      };
    },
    _getRecent(value) {
      getRecent({ asin: value }).then(res => {
        this.recentData = res.data;
        // debugger;
      });
    },
    _getCharts(value) {
      const params = {
        indicators: ["Order", "Sales", "StackedBarChart"],
        startTime: this.startTime,
        endTime: this.endTime,
        asins: [value]
      };
      getCharts(params).then(res => {
        this.echartList = []
        const list = res.data;
        const chartName = [];
        const echartList = [];
        const xNameList = [];
        if (list && list.length) {
          list.forEach(el => {
            const arr = [];
            xNameList.push(el.xNames);
            chartName.push(el.indicator);
            el.chartData[0].data.forEach(item => {
              arr.push(item.values);
            });
            echartList.push(arr);
          });
          this.echartList.push(xNameList);
          this.echartList.push(echartList);
          this.echartList.push(chartName);
          this.initEchart(this.echartList);
        }
        // console.log(echartList, xNameList);
        console.log(this.echartList);
        // debugger;
      });
    }
  }
};
// X轴: ['一月','二月','三月']
// Y轴: [[5,10,4],[1,3,2],[3,4,1],[1,3,1]]
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
    width: 600px;
    height: 400px;
  }
}
</style>
