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
              <div>
                <el-cascader
                  v-model="sameAsin"
                  :options="options"
                  :props="{ multiple: true}"
                  collapse-tags
                  clearable
                />
                <el-button type="primary" @click="showComparison">compare</el-button>
              </div>
            </div>
            <!-- <div class="block">
              <span class="demonstration">不同asin指标对比</span>
              <div>
                <el-cascader :options="options" :props="{ multiple: true}" collapse-tags clearable />
                <el-button type="primary">compare</el-button>
              </div>
            </div>
            <div class="block">
              <span class="demonstration">不同asin不同指标对比</span>
              <div>
                <el-cascader :options="options" :props="{ multiple: true}" collapse-tags clearable />
                <el-button type="primary">compare</el-button>
              </div>
            </div>-->
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
          <div class="echart-list" style>
            <!-- <div style="overflow: auto;"> -->
            <div
              v-for="(item, index) in echartList"
              :key="index"
              class="echart-content"
              @click="handleEchart(item)"
            />
            <!-- </div> -->
          </div>
        </el-main>
      </el-container>
    </el-container>
    <div />
    <el-dialog :title="oneEchartName[0]" :visible.sync="dialogVisible" width="60%">
      <!-- <span>这是一段信息</span> -->
      <el-date-picker
        v-model="pickerData"
        value-format="yyyy-MM-dd"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      />
      <div id="echart" class="echarts-scals" />
    </el-dialog>
    <el-dialog title="对比" :visible.sync="dialogComparison" width="60%">
      <!-- <span>这是一段信息</span> -->
      <div class="block" style="margin:0 auto 10px; width:80%;">
        <el-cascader
          v-model="sameAsin"
          :options="options"
          :props="{ multiple: true}"
          collapse-tags
          clearable
          size="medium"
          style="width: 80%"
        />
        <el-button size="medium" type="primary" @click="handleSameAsin">compare</el-button>
      </div>
      <div class="block" style="margin:0 auto 10px; width:80%;">
        <el-date-picker
          v-model="pickerDataSameAsin"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          size="medium"
        />
      </div>
      <div id="echart_omparison" class="echarts-scals" />
    </el-dialog>
  </div>
</template>

<script>
import echarts from "echarts";
import { getRecent, getCharts, getParentASIN } from "@/api/table";
import mixin from "./mixin.js";

export default {
  mixins: [mixin],
  data() {
    return {
      myChart: null,
      pickerData: "",
      pickerDataSameAsin: "",
      dateList: [],
      echartList: [],
      sameAsin: [],
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
      dialogComparison: false,
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
      ],
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
      oneEchartName: []
    };
  },
  watch: {
    pickerData(val) {
      this._getOneCharts(this.oneEchartName, [this.asin]);
    },
    dialogVisible(val) {
      if (!val) {
        this.pickerData = "";
      }
    }
  },
  mounted() {
    const start = new Date();
    const end = new Date(start.getTime() - 3600 * 1000 * 24 * 30);
    this.endTime = `${start.getFullYear()}-${start.getMonth() +
      1}-${start.getDate()}`;
    this.startTime = `${end.getFullYear()}-${end.getMonth() +
      1}-${end.getDate()}`;

    const asin = this.$route.query.asin;
    this.asin = asin;
    // debugger
    if (asin) {
      this._getRecent(asin);
    }
    console.time("charts");
    this._getCharts(asin);
    this._getParentASIN(asin);
    // refundRate: 0 //最近三十天退货率
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
    showComparison() {
      this.dialogComparison = true;
    },
    handleSameAsin() {
      const dom = document.getElementById("echart_omparison");
      if (this.sameAsin.length) {
        // this.sameAsin.forEach(item => {
        //   // debugger
        // })
        const strArr = this.sameAsin.flat(Infinity)
        // const strArr = this.sameAsin.join('","');
        this._getMoreCharts(strArr, [this.asin], dom);
      }

      // if (this.sameAsin.length) {
      //   this.
      // }
      // debugger;
    },
    handleEchart(value) {
      this.dialogVisible = true;
      const nameArr = [];
      nameArr.push(value.name);
      this.oneEchartName = nameArr;
      const dom = document.getElementById("echart");

      this._getOneCharts(nameArr, [this.asin], dom);
    },
    initEchart(options, dom) {
      const echart = echarts.init(dom, "light");
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
          // 图标位置调整
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
    _getRecent(value) {
      getRecent({ asin: value }).then(res => {
        this.recentData = res.data;
        // debugger;
      });
    },
    _getCharts(value) {
      const params = {
        indicators: this.indicators,
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
            // console.log(this.domEchart);
            echartList.forEach((item, index) => {
              this.initEchart(item, this.domEchart[index]);
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
  .box-card {
    height: calc(100vh - 150px);
  }
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
      width: 310px;
      display: flex;
      flex-direction: column;
      .demonstration {
        margin-bottom: 10px;
      }
    }
  }
}
.echarts-scals {
  margin-left: 10px;
  width: 100%;
  height: 500px;
}
.echart-list {
  display: flex;
  justify-content: space-around;
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
  }
}
</style>
