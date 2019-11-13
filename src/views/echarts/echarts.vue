<template>
  <div class="content">
    <el-container>
      <el-aside width="350px">
        <el-card class="box-card" style="margin: 10px">
          <div slot="header" class="clearfix">
            <!-- <span>近三十天数据</span> -->
            <p>
              <span style="font-weight: bold;">ASIN:</span>
              <span>{{ asin }}</span>
            </p>
            <el-divider />
            <div>
              <span style="font-weight: bold;">Parent ASIN:</span>
              <span v-for="(item, index) in parentAsinList" :key="index">{{ item }}</span>
            </div>
          </div>
          <div class="card-info">
            <p>
              近30天售量:
              <span>{{ recentData.unitsOrders }}</span>
            </p>
            <p>
              近30天UCR:
              <span>{{ recentData.ucr }}</span>
            </p>
            <p>
              近30天退货率:
              <span>{{ recentData.refundRate }}</span>
            </p>
            <p>
              近30天销售额:
              <span>{{ recentData.sales }}</span>
            </p>
            <p>
              近30天花费:
              <span>{{ recentData.spends }}</span>
            </p>
          </div>
        </el-card>
      </el-aside>
      <el-container>
        <el-header height="120px">
          <div class="header-cascader" style>
            <div class="block">
              <span class="demonstration">同一asin指标对比</span>
              <el-cascader :options="options" :props="{ multiple: true}" collapse-tags clearable />
            </div>
            <div class="block">
              <span class="demonstration">不同asin指标对比</span>
              <el-cascader :options="options" :props="{ multiple: true}" collapse-tags clearable />
            </div>
            <div class="block">
              <span class="demonstration">不同asin不同指标对比</span>
              <el-cascader :options="options" :props="{ multiple: true}" collapse-tags clearable />
            </div>
          </div>
        </el-header>
        <el-main>
          <!-- 柱 -->
          <div id="sales" />
          <!-- 柱 -->
          <div id="order" />
          <!-- 折线 -->
          <div id="ucr" />
          <!-- 柱 -->
          <div id="session" />
          <!-- 柱 -->
          <div id="AD_spend" />
          <!-- 柱 -->
          <div id="AD_order" />
          <!-- 折线 -->
          <div id="AD_cr" />
          <!-- 柱 -->
          <div id="AD_sales" />
          <!-- 折线 -->
          <!-- <div id="AD_acos" /> -->
          <div id="echart1" class="echarts" />
          <div class="echart-list" style>
            <!-- <div style="overflow: auto;"> -->
            <div v-for="(item, index) in echartList" :key="index" class="echart-content" @click="handleEchart" />
            <!-- </div> -->
          </div>
        </el-main>
      </el-container>
    </el-container>
    <div />
    <el-dialog title="提示" :visible.sync="dialogVisible" width="50%">
      <span>这是一段信息</span>
      <!-- <div id="echart" class="echarts" /> -->
    </el-dialog>
  </div>
</template>

<script>
import echarts from "echarts";
import { getRecent, getCharts, getParentASIN } from "@/api/table";
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
      dialogVisible: false,
      now: +new Date(1997, 9, 3),
      oneDay: 24 * 3600 * 1000,
      value: Math.random() * 1000,
      recentData: [],
      startTime: "",
      endTime: "",
      domEchart: null,
      parentAsinList: [],
      asin: "",
      options: [
        { value: "Sales", label: "Sales" },
        { value: "Order", label: "Order" },
        { value: "UCR", label: "UCR" },
        { value: "Session", label: "Session" },
        { value: "AdSpend", label: "AdSpend" },
        { value: "AdClicks", label: "AdClicks" },
        { value: "AdOrder", label: "AdOrder" },
        { value: "AdCR", label: "AdCR" }
      ]
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
    const start = new Date();
    const end = new Date(start.getTime() - 3600 * 1000 * 24 * 30);
    this.endTime = `${start.getFullYear()}-${start.getMonth() +
      1}-${start.getDate()}`;
    this.startTime = `${end.getFullYear()}-${end.getMonth() +
      1}-${end.getDate()}`;
    // this.initEchart();
    // this.initLineChart();
    const asin = this.$route.query.asin;
    this.asin = asin;
    // debugger
    if (asin) {
      this._getRecent(asin);
    }
    console.time("charts");
    this._getCharts(asin);
    this._getParentASIN(asin);
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
      // this.myChart.resize({
      //   width: "auto",
      //   height: "auto"
      // });
    },
    handleEchart() {
      this.dialogVisible = true
    },
    initEchart(options, index) {
      const echart = echarts.init(this.domEchart[index], "light");
      // for (let i = 0; i < echartsList.length; i++) {
      //   echarts.init(echartsList[0], "light");
      // this.echarts
      // }
      // this.myChart = echarts.init(document.getElementById("echart"), "light");
      // 绘制图表
      echart.setOption({
        title: {
          text: options.name,
          left: 10,
          top: 10,
          textStyle: {
            fontSize: 14,
            fontWeight: 400
          }
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            animation: false,
            label: {
              backgroundColor: "#409EFF",
              borderColor: "#fff",
              borderWidth: 1,
              shadowBlur: 0,
              shadowOffsetX: 0,
              shadowOffsetY: 0,
              textStyle: {
                color: "#fff"
              }
            }
          }
        },
        legend: {
          top: "15%",
          data: options.yName
        },
        grid: {
          bottom: "10%",
          top: "30%",
          left: "10%",
          right: "4%"
        },
        // toolbox: {
        //   show: true,
        //   feature: {
        //     dataZoom: {
        //       yAxisIndex: "none"
        //     },
        //     mark: {
        //       show: true
        //     },
        //     magicType: {
        //       show: true,
        //       type: ["line", "bar"]
        //     },
        //     restore: {
        //       show: true
        //     },
        //     saveAsImage: {
        //       show: true
        //     }
        //   }
        // },
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
            data: options.xValue // x轴值
          }
        ],
        yAxis: [
          {
            splitLine: {
              lineStyle: {
                type: "dashed"
              }
            },
            type: "value"
            // name: ""
          }
        ],
        series: options.series,
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
          boundaryGap: ["10%", "20%"],
          offset: 100,
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
        indicators: [
          "Sales",
          "Order",
          "UCR",
          "Session",
          "AdSpend",
          "AdClicks",
          "AdOrder",
          "AdCR"
        ],
        startTime: this.startTime,
        endTime: this.endTime,
        asins: [value]
      };
      getCharts(params).then(res => {
        console.timeEnd("charts");
        this.echartList = [];
        const list = res.data;
        const echartList = [];
        // "LineChart","StackedBarChart","BarChart"
        if (list && list.length) {
          console.time();
          list.forEach(el => {
            const obj = {
              name: "",
              chartType: "",
              xValue: [],
              yValue: [],
              yName: [],
              series: []
            };
            // const arr = [];
            obj.xValue = el.xNames;
            obj.name = el.indicator;
            obj.chartType = el.chartData[0].chartType;
            el.chartData[0].data.forEach((item, index) => {
              const serie = {
                name: item.yName,
                data: [],
                type: "bar",
                stack: "总数",
                barWidth: 10
              };
              if (obj.chartType === "StackedBarChart") {
                serie.type = "bar";
              }
              if (obj.chartType === "LineChart") {
                serie.type = "line";
              }
              if (obj.chartType === "BarChart") {
                serie.type = "bar";
              }
              if (obj.chartType === "StackedBarChart" && index === 0) {
                serie.type = "line";
              }
              serie.data = item.values;
              obj.series.push(serie);
              obj.yValue.push(item.values);
              obj.yName.push(item.yName);
            });
            echartList.push(obj);
          });
          console.timeEnd();
          this.echartList = echartList;
          setTimeout(() => {
            this.domEchart = document.querySelectorAll(".echart-content");
            console.log(this.domEchart);
            echartList.forEach((item, index) => {
              this.initEchart(item, index);
            });
          }, 20);
        }
        console.log(this.echartList);
      });
    },
    _getParentASIN(value) {
      getParentASIN({ childASIN: value }).then(res => {
        this.parentAsinList = res.data;
      });
    }
  }
};
// X轴: ['一月','二月','三月']
// Y轴: [[5,10,4],[1,3,2],[3,4,1],[1,3,1]]
</script>
<style lang="scss" scoped>
@import "../../styles/variables";
.content {
  width: 100%;
  height: calc(100vh - 50px);
  .card-info {
    color: $menuActiveText;
    > p {
      display: flex;
      justify-content: space-between;
    }
  }
  .header-cascader {
    display: flex;
    align-items: center;
    justify-content: space-around;
    height: 100%;
    .block {
      width: 300px;
      display: flex;
      flex-direction: column;
      .demonstration {
        margin-bottom: 10px;
      }
    }
  }
}
.echart-list {
  display: flex;
  justify-content: center;
  width: 100%;
  height: calc(100vh - 150px);
  overflow: auto;
  flex-wrap: wrap;
  .echart-content {
    border-radius: 5px;
    width: 310px;
    height: 260px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
    margin: 10px;
    transition: all 0.3s;
    &:hover {
      box-shadow: 0 20px 20px rgba(0, 0, 0, 0.2);
      transition: all 0.3s;
    }
    .echarts {
      margin-left: 10px;
      width: 600px;
      height: 400px;
    }
  }
}
</style>
