<template>
  <div class="content">
    <el-container>
      <el-aside width="320px">
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
              <span
                v-for="(item, index) in parentAsinList"
                :key="index"
                class="asin-parent"
                @click="chooseParentAsin(item)"
              >{{ item }}</span>
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
            <div class="block">
              <span class="demonstration">不同asin指标对比</span>
              <div>
                <el-cascader
                  :options="differentAsinOptions"
                  :props="{ multiple: true}"
                  collapse-tags
                  clearable
                />
                <el-button type="primary" @click="showDiffAsinComparison">compare</el-button>
              </div>
            </div>
            <!-- <div class="block">
              <span class="demonstration">不同asin不同指标对比</span>
              <div>
                <el-cascader
                  :options="differentAsinIndicatorOptions"
                  :props="{ multiple: true}"
                  collapse-tags
                  clearable
                />
                <el-button type="primary">compare</el-button>
              </div>
            </div>-->
          </div>
        </el-header>
        <el-main style="padding-top: 0">
          <div class="echart-list" style>
            <div
              v-for="(item, index) in echartList"
              :key="index"
              class="echart-content"
              @click.capture.stop="handleEchart(item)"
            />
            <div class="table-content" @click="handleRma">
              <i>RMA</i>
            </div>
            <div class="table-content" @click="handleKwtrend">
              <i>KW TRENDS</i>
            </div>
          </div>
        </el-main>
      </el-container>
    </el-container>
    <div />
    <el-dialog :title="oneEchartName[0]" :visible.sync="dialogVisible" width="60%">
      <!-- <span>这是一段信息</span> -->
      <div class="block" style="margin:0 auto 10px; width:80%;">
        <el-date-picker
          v-model="pickerData"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions"
        />
      </div>
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
          :picker-options="pickerOptions"
        />
      </div>
      <div id="echart_omparison" class="echarts-scals" />
    </el-dialog>
    <el-dialog title="对比" :visible.sync="dialogDifferentAsin" width="60%">
      <!-- <span>这是一段信息</span> -->
      <div class="block" style="margin:0 auto 10px; width:80%;">
        <el-cascader
          v-model="asinIndicator"
          :options="differentAsinOptions"
          :props="{ multiple: true}"
          collapse-tags
          clearable
          size="medium"
          style="width: 80%"
        />
        <el-button size="medium" type="primary" @click="handleComparisonAsin">compare</el-button>
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
          :picker-options="pickerOptions"
        />
      </div>
      <div id="echart_asin_indicator" class="echarts-scals" />
    </el-dialog>
    <el-dialog title="RMA" :visible.sync="dialogRma" width="60%">
      <!-- <span>这是一段信息</span> -->
      <div class="block" style="margin:0 auto 10px; width:80%;">
        <el-date-picker
          v-model="pickerDataRma"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          size="medium"
          :picker-options="pickerOptions"
        />
      </div>
      <el-table
        v-loading="listLoading"
        :data="rmaList"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
      >
        <el-table-column label="time" align="center">
          <template slot-scope="scope">{{ scope.row.returnData }}</template>
        </el-table-column>
        <el-table-column label="reason" align="center">
          <template slot-scope="scope">{{ scope.row.reason }}</template>
        </el-table-column>
        <el-table-column label="comment" align="center">
          <template slot-scope="scope">{{ scope.row.customerComments }}</template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog title="KW TRENDS" :visible.sync="dialogKwtrend" width="60%">
      <!-- <span>这是一段信息</span> -->
      <div class="block" style="margin:0 auto 10px; width:80%;">
        <el-date-picker
          v-model="pickerDataKwtrend"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          size="medium"
          :picker-options="pickerOptions"
        />
      </div>
      <el-table
        v-loading="listLoading"
        :data="kwtrendList"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
      >
        <el-table-column label="keyword" align="center">
          <template slot-scope="scope">{{ scope.row.keyword }}</template>
        </el-table-column>
        <el-table-column label="searchNum" align="center">
          <template slot-scope="scope">{{ scope.row.searchNum }}</template>
        </el-table-column>
        <el-table-column label="searchCapacity" align="center">
          <template slot-scope="scope">{{ scope.row.searchCapacity }}</template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import echarts from "echarts";
import {
  getRecent,
  getCharts,
  getParentASIN,
  geRma,
  getKeywordRankReport,
  getKeywordChart,
  getAllAsin
} from "@/api/table";
import mixin from "./mixin.js";

export default {
  mixins: [mixin],
  data() {
    return {
      pickerData: "",
      pickerDataSameAsin: "",
      pickerDataRma: "",
      pickerDataKwtrend: "",
      startTime: "",
      endTime: "",
      asin: "",
      dialogVisible: false,
      dialogComparison: false,
      dialogRma: false,
      dialogKwtrend: false,
      dialogDifferentAsin: false,
      listLoading: true,
      oneDay: 24 * 3600 * 1000,
      value: Math.random() * 1000,
      domEchart: null,
      myChart: null,
      parentAsinList: [],
      oneEchartName: [],
      dateList: [],
      echartList: [],
      sameAsin: [],
      asinIndicator: [],
      rmaList: [],
      kwtrendList: [],
      recentData: [],
      differentAsinOptions: [],
      differentAsinIndicatorOptions: [],
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
      pickerOptions: {
        shortcuts: [
          {
            text: "最近30天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近90天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近180天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 180);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      indicators: [
        "Sales",
        "Order",
        "UCR",
        "Session",
        "AdSpend",
        "AdClicks",
        "AdOrder",
        "AdCR"
      ]
    };
  },
  watch: {
    pickerData(val) {
      const dom = document.getElementById("echart");
      this._getOneCharts(this.oneEchartName, [this.asin], dom);
    },
    dialogVisible(val) {
      if (!val) {
        this.pickerData = "";
      }
    },
    pickerDataSameAsin(val) {
      if (val) {
        this.handleSameAsin();
      }
    },
    pickerDataRma(value) {
      value && this._getRma();
    },
    pickerDataKwtrend(value) {
      value && this._getKeywordRankReport();
    }
  },
  mounted() {
    console.time("charts");

    const start = new Date();
    const end = new Date(start.getTime() - 3600 * 1000 * 24 * 30);
    this.endTime = `${start.getFullYear()}-${start.getMonth() +
      1}-${start.getDate()}`;
    this.startTime = `${end.getFullYear()}-${end.getMonth() +
      1}-${end.getDate()}`;

    const asin = this.$route.query.asin;
    this.asin = asin;
    this._getRecent(asin);
    this._getCharts(asin);
    this._getParentASIN(asin);
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
    showDiffAsinComparison() {
      this.dialogDifferentAsin = true;
    },
    chooseParentAsin(value) {
      this.asin = value;
      this._getRecent(value);
      this._getCharts(value);
      this._getParentASIN(value);
      // this._getRma();
    },
    showComparison() {
      this.dialogComparison = true;
    },
    handleSameAsin() {
      const dom = document.getElementById("echart_omparison");
      if (this.sameAsin.length) {
        const strArr = this.sameAsin.flat(Infinity);
        this._getMoreCharts(strArr, [this.asin], dom);
      }
    },
    handleEchart(value) {
      this.dialogVisible = true;
      const nameArr = [];
      nameArr.push(value.name);
      this.oneEchartName = nameArr;
      setTimeout(() => {
        const dom = document.getElementById("echart");
        this._getOneCharts(nameArr, [this.asin], dom);
      }, 20);
    },
    handleRma() {
      this.dialogRma = true;
      this._getRma();
    },
    handleComparisonAsin() {
      const asinList = [];
      const indicator = [];
      const dom = document.getElementById("echart_asin_indicator");
      this.asinIndicator.forEach(item => {
        if (item[0] === "ASIN") {
          asinList.push(item[1]);
        }
        if (item[0] === "indicator") {
          indicator.push(item[1]);
        }
      });
      this._getMoreCharts(indicator, asinList, dom);
    },
    handleKwtrend() {
      this.dialogKwtrend = true;
      this._getKeywordRankReport();
    },
    initEchart(options, dom) {
      const echart = echarts.init(dom, "light");
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
      echart.resize({
        width: "auto",
        height: "auto"
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
                stack: "总数"
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
          this._getAllAsin();
        }
        // console.log(this.echartList);
      });
    },
    _getParentASIN(value) {
      getParentASIN({ childASIN: value }).then(res => {
        this.parentAsinList = res.data;
      });
    },
    _getRma() {
      const params = {
        StartTime: this.pickerDataRma[0] || this.startTime,
        EndTime: this.pickerDataRma[1] || this.endTime,
        ASIN: this.asin
      };
      geRma(params).then(res => {
        // console.log(res);
        this.rmaList = res.data;
        this.listLoading = false;
      });
    },
    _getKeywordRankReport() {
      const params = {
        StartTime: this.pickerDataKwtrend[0] || this.startTime,
        EndTime: this.pickerDataKwtrend[1] || this.endTime,
        ASIN: [this.asin],
        PageIndex: 1,
        PageSize: 10
      };
      getKeywordRankReport(params).then(res => {
        // console.log(res);
        this.kwtrendList = res.data.dataList;
        this.listLoading = false;
      });
    },
    _getKeywordChart() {
      getKeywordChart().then(res => {});
    },
    _getAllAsin() {
      getAllAsin().then(res => {
        const list = res.data;
        const obj = {
          label: "ASIN",
          value: "ASIN",
          children: []
        };
        const indicator = {
          label: "indicator",
          value: "indicator",
          children: this.options
        };
        this.differentAsinOptions = [];
        list.forEach(item => {
          obj.children.push({
            value: item,
            label: item
          });
        });
        this.differentAsinOptions.push(indicator);
        this.differentAsinOptions.push(obj);
        // debugger
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
  .asin-parent {
    cursor: pointer;
    &:hover {
      color: $menuActiveText;
      text-decoration: underline;
    }
  }
  .card-info {
    color: $menuActiveText;
    font-size: 14px;
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
  height: calc(100vh - 200px);
  overflow: auto;
  flex-wrap: wrap;
  .echart-content,
  .table-content {
    border-radius: 5px;
    width: 290px;
    height: 230px;
    box-shadow: 3px 3px 10px rgba(0, 0, 0, 0.2);
    margin: 10px;
    transition: all 0.3s;
    &:hover {
      box-shadow: 0 20px 20px rgba(0, 0, 0, 0.2);
      transition: all 0.3s;
    }
  }
  .table-content {
    font-size: 40px;
    line-height: 230px;
    text-align: center;
    user-select: none;
  }
}
</style>
