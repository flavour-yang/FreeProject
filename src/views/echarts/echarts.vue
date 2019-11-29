<template>
  <div class="content">
    <el-container>
      <el-aside width="320px">
        <el-card class="box-card" style="margin: 10px">
          <div slot="header" class="clearfix">
            <!-- <span>近三十天数据</span> -->
            <p>
              <span style="font-weight: bold;">ASIN:</span>
              <span class="asin-child" @click="chooseChildAsin()">{{ childAsin }}</span>
            </p>
            <p v-if="productFomater" style="display: flex; align-items: center;">
              <span>{{ productFomater.name }}</span>
              <img width="40" style="margin-left: 40px" :src="productFomater.src">
            </p>
            <el-divider />
            <div>
              <span style="font-weight: bold;">Parent ASIN:</span>
              <span
                v-for="(item, index) in parentAsinList"
                :key="index"
                class="asin-parent"
                @click="chooseParentAsin(item.asin)"
              >{{ item.asin }}</span>
            </div>
          </div>
          <div class="card-info">
            <p>
              近30天售量:
              <span>{{ recentData.unitsOrders }}</span>
            </p>
            <p>
              近30天UCR:
              <span>{{ recentData.ucr }}%</span>
            </p>
            <p>
              近30天退货率:
              <span>{{ recentData.refundRate }}%</span>
            </p>
            <p>
              近30天销售额:
              <span>${{ recentData.sales }}</span>
            </p>
            <p>
              近30天花费:
              <span>${{ recentData.spends }}</span>
            </p>
          </div>
        </el-card>
      </el-aside>
      <el-container>
        <el-header height="120px">
          <!-- <div>
            <el-tag
              v-for="(item, index) in asinList"
              :key="index"
              :effect="asin === item ? 'dark':'plain'"
              closable
              :disable-transitions="false"
              style="cursor: pointer;"
              @click="handleClick(item)"
              @close="handleClose(item)"
            >{{ item }}</el-tag>
          </div>-->
          <div class="header-cascader">
            <div class="block">
              <span class="demonstration">同一asin指标对比</span>
              <div>
                <el-cascader
                  v-model="sameAsin"
                  :options="options"
                  :props="{ multiple: true}"
                  collapse-tags
                  clearable
                  @change="sameAsinChange"
                />
                <el-button type="primary" @click="showComparison">compare</el-button>
              </div>
            </div>
            <div class="block">
              <span class="demonstration">不同asin指标对比</span>
              <div>
                <el-cascader
                  v-model="asinIndicator"
                  :options="differentAsinOptions"
                  :props="{ multiple: true}"
                  collapse-tags
                  clearable
                />
                <el-button type="primary" @click="showDiffAsinComparison">compare</el-button>
              </div>
            </div>
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
            <div style="font-size: 32px" class="table-content" @click="handleCampaign">
              <i>广告SearchTerm分析</i>
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
    <el-dialog title="同asin对比" :visible.sync="dialogComparison" width="60%">
      <!-- <span>这是一段信息</span> -->
      <div class="block" style="margin:0 auto 10px; width:80%;">
        <el-cascader
          v-model="sameAsin"
          :options="options"
          filterable
          :props="{ multiple: true}"
          collapse-tags
          clearable
          size="medium"
          style="width: 80%"
          @change="sameAsinChange"
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
    <el-dialog title="对比" :fullscreen="true" :visible.sync="dialogDifferentAsin" width="60%">
      <!-- <span>这是一段信息</span> -->
      <div class="block" style="margin:0 auto 10px; width:80%;">
        <el-cascader
          v-model="asinIndicator"
          filterable
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
      <div v-for="(item, index) in differentAsinEchart" :key="index" class="echarts-diff-asin" />
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
      <div style="display: flex;">
        <div style="flex: 1">
          <el-table
            v-loading="listLoading"
            :data="kwtrendList"
            element-loading-text="Loading"
            border
            fit
            highlight-current-row
            @row-click="rowClick"
          >
            <el-table-column label="关键字" align="center">
              <template slot-scope="scope">{{ scope.row.keyword }}</template>
            </el-table-column>
            <el-table-column label="搜索容量排名" align="center">
              <template slot-scope="scope">{{ scope.row.searchCapacity }}</template>
            </el-table-column>
            <el-table-column label="最新自然搜索排名" align="center">
              <template slot-scope="scope">{{ scope.row.searchNum }}</template>
            </el-table-column>
          </el-table>
          <div style="display: flex;justify-content: center;margin-top: 20px;">
            <el-pagination
              :current-page.sync="keyWordPageIndex"
              :page-size="keyWordPageSize"
              layout="prev, pager, next, jumper"
              :total="total"
              @current-change="handleCurrentChange"
            />
          </div>
        </div>
        <div id="keyword_charts" style="flex: 1;height: 50vh" />
      </div>
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
import { mapGetters } from "vuex";
export default {
  mixins: [mixin],
  data() {
    return {
      hoverActiveIndex: -1,
      total: 0,
      pickerData: "",
      pickerDataSameAsin: "",
      pickerDataRma: "",
      pickerDataKwtrend: "",
      startTime: "",
      endTime: "",
      asin: "",
      station: "",
      childAsin: "",
      campaignValue: "",
      loadingPage: "",
      dialogVisible: false,
      dialogComparison: false,
      dialogRma: false,
      dialogKwtrend: false,
      dialogCampaign: false,
      dialogDifferentAsin: false,
      listLoading: true,
      ADLoading: false,
      downloadLoading: false,
      oneDay: 24 * 3600 * 1000,
      value: Math.random() * 1000,
      keyWordPageIndex: 1,
      keyWordPageSize: 10,
      domEchart: null,
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
      differentAsinEchart: [],
      campaignNameList: [],
      options: [
        { value: "Sales", label: "Sales", disabled: false },
        { value: "Order", label: "Order", disabled: false },
        { value: "UCR", label: "UCR", disabled: false },
        { value: "Session", label: "Session", disabled: false },
        { value: "AdSpend", label: "AdSpend", disabled: false },
        { value: "AdClicks", label: "AdClicks", disabled: false },
        { value: "AdOrder", label: "AdOrder", disabled: false },
        { value: "AdCR", label: "AdCR", disabled: false }
      ],
      options2: [
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
  computed: {
    ...mapGetters(["asinList", "product"]),
    productFomater() {
      return this.product[this.asin];
    }
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
    this.loadingPage = this.$loading({
      lock: true,
      text: "Loading",
      spinner: "el-icon-loading",
      background: "rgba(0, 0, 0, 0.7)"
    });
    const start = new Date();
    const end = new Date(start.getTime() - 3600 * 1000 * 24 * 30);
    this.endTime = `${start.getFullYear()}-${start.getMonth() +
      1}-${start.getDate()}`;
    this.startTime = `${end.getFullYear()}-${end.getMonth() +
      1}-${end.getDate()}`;

    const { asin, id, station } = this.$route.query;
    this.childAsin = asin;
    this.asin = asin;
    this.station = station;
    console.log('id', id)
    this._getRecent(asin); // 最近三十天数据
    this._getCharts({ asin: asin, station: station });
    this._getParentASIN(asin);
  },
  destroyed() {
    window.removeEventListener("resize", this.resizeChart);
  },
  methods: {
    sameAsinChange(value) {
      if (value.length >= 2) {
        const arr = value.flat(Infinity);
        const list = this.options;
        // debugger
        list.forEach(el => {
          if (!arr.includes(el.value)) {
            el.disabled = true;
          }
        });
        this.options = list;
      } else {
        this.options.forEach(el => {
          el.disabled = false;
        });
      }
    },
    // handleClose(value) {
    //   this.$store.commit("table/REMOVE_ASIN", value);
    //   const list = this.$store.state.table.asinList;
    //   if (list.length) {
    //     const asin = list[list.length - 1];
    //     this.asin = asin.asin;
    //     this.childAsin = asin.asin;
    //     this._getRecent(asin.asin);
    //     this._getCharts(asin.asin);
    //     this._getParentASIN(asin.asin);
    //   }
    // },

    handleCurrentChange(page) {
      // console.log(this.currentPage, page)
      this._getKeywordRankReport();
    },
    goBack() {
      this.$router.go(-1);
    },
    resizeChart() {
      // this.myChart.resize({
      //   width: "auto",
      //   height: "auto"
      // });
    },
    changeReport(index, customer, type, column) {
      this._putTermReportSign({
        CustomerSearchTerm: customer,
        Remark: type,
        index,
        column
      });
    },
    changeRemark() {},
    showDiffAsinComparison() {
      this.dialogDifferentAsin = true;
    },
    chooseChildAsin() {
      this.asin = this.childAsin;
      this._getRecent(this.asin);
      this._getCharts({ asin: this.asin, station: this.station });
    },
    chooseParentAsin(value) {
      this.asin = value;
      this._getRecent(value);
      this._getCharts({ asin: value, station: this.station });
      // this._getParentASIN(value);
      // this._getRma();
    },
    rowClick(row, column, event) {
      this._getKeywordChart(row.keyword);
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
      // const dom = document.getElementById("echart_asin_indicator");
      this.asinIndicator.forEach(item => {
        if (item[0] === "ASIN") {
          asinList.push(item[1]);
        }
        if (item[0] === "indicator") {
          indicator.push(item[1]);
        }
      });
      this._diffAsin(indicator, asinList);
    },
    handleKwtrend() {
      this.dialogKwtrend = true;
      this._getKeywordRankReport();
    },
    handleCampaign() {
      this.$store.commit("table/SET_SEARCH_TERM", true);
      this.$router.push("/searchTerm/searchTerm");
      // this.dialogCampaign = true;
      // this._getAllCampaignNames();
    },
    initEchart(options, dom) {
      const echart = echarts.init(dom, "light");
      options.series = options.series.reverse();
      // options.series = options.series.reverse();
      // var arr = options.series.pop();
      // options.series.unshift(arr);
      if (options.series.length > 1) {
        options.series.forEach(item => {
          if (item.name === "natural order") {
            item["itemStyle"] = { color: "#91ca8c" };
          }
          if (item.name === "ad order") {
            item["itemStyle"] = { color: "#dd6b66" };
          }
          if (item.name === "natural session") {
            item["itemStyle"] = { color: "#91ca8c" };
          }
          if (item.name === "ad session") {
            item["itemStyle"] = { color: "#dd6b66" };
          }
        });
        // options.series[0]['yAxisIndex'] = 1
      }
      if (
        options.yName.includes("UCR") ||
        options.yName.includes("ad CR") ||
        options.yName.includes("广告CR")
      ) {
        options.series.forEach((parent, parentIndex) => {
          if (parent.name === "UCR" || parent.name === "ad CR") {
            parent.data.forEach((item, index) => {
              options.series[parentIndex].data[index] = Number(
                item * 100
              ).toFixed(1);
            });
          }
        });
      }
      echart.setOption(
        {
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
            },
            formatter: function(params) {
              let symbol = "";
              let str = params[0].axisValue + "<br>";
              for (let i = 0; i < params.length; i++) {
                if (
                  params[i].seriesName === "UCR" ||
                  params[i].seriesName === "ad CR"
                ) {
                  symbol = "%";
                } else {
                  symbol = "";
                }
                if (
                  params[i].seriesName === "sale" ||
                  params[i].seriesName === "spend"
                ) {
                  str += `${params[i].marker}${params[i].seriesName}: $${params[i].value}<br>`;
                } else {
                  str += `${params[i].marker}${params[i].seriesName}: ${params[i].value} ${symbol}<br>`;
                }
              }
              return str;
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
            left: "13%",
            right: "6%"
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
              axisLabel: {
                formatter: function(value, index) {
                  // debugger
                  // console.log(value, index);
                  // 格式化成月/日，只在第一个刻度显示年份
                  if (
                    options.yName.indexOf("UCR") === 0 ||
                    options.yName.indexOf("ad CR") === 0
                  ) {
                    return `${value}%`;
                  }
                  if (
                    options.yName.indexOf("sale") === 0 ||
                    options.yName.indexOf("spend") === 0
                  ) {
                    return `$${value}`;
                  }
                  // texts.unshift(date.getYear());
                  return value;
                }
              }
            },
            {
              type: "value",
              axisLabel: {
                formatter: function(value, index) {
                  // 格式化成月/日，只在第一个刻度显示年份
                  if (
                    options.yName.indexOf("UCR") === options.yName.length - 1 ||
                    options.yName.indexOf("ad CR") === options.yName.length - 1
                  ) {
                    return `${value}%`;
                  }
                  if (
                    options.yName.indexOf("sale") ===
                      options.yName.length - 1 ||
                    options.yName.indexOf("spend") === options.yName.length - 1
                  ) {
                    return `$${value}`;
                  }
                  // texts.unshift(date.getYear());
                  return value;
                }
              }
            }
          ],
          series: options.series,
          calculable: false
        },
        {
          notMerge: true // 是否合并之前的图表
        }
      );
      echart.resize({
        width: "auto",
        height: "auto"
      });
      window.addEventListener("resize", this.resizeChart);
    },
    _getRecent(value) {
      getRecent({ ASIN: value, Station: this.station }).then(res => {
        this.recentData = res.data;
        // debugger;
      });
    },
    _getCharts({ asin, station }) {
      const params = {
        indicators: this.indicators,
        startTime: this.startTime,
        endTime: this.endTime,
        asins: [
          {
            ASIN: asin,
            Station: station
          }
        ]
      };
      getCharts(params)
        .then(res => {
          this.echartList = [];
          const list = res.data;
          const echartList = [];
          // "LineChart","StackedBarChart","BarChart"
          if (list && list.length) {
            list.forEach(el => {
              const obj = {
                name: "",
                chartType: "",
                xValue: [],
                yValue: [],
                yName: [],
                series: []
              };
              let str = "";
              if (el.indicator.includes("Ad")) {
                str = el.indicator.slice(2, el.indicator.length);
                str = "广告" + str;
              } else {
                str = el.indicator;
              }
              // const arr = [];
              obj.xValue = el.xNames;
              obj.name = str;
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
                  delete serie.stack;
                }
                if (obj.chartType === "BarChart") {
                  serie.type = "bar";
                  delete serie.stack;
                }
                if (obj.chartType === "StackedBarChart" && index === 0) {
                  serie.type = "line";
                  delete serie.stack;
                }
                serie.data = item.values;
                obj.series.push(serie);
                obj.yValue.push(item.values);
                obj.yName.push(item.yName);
              });
              echartList.push(obj);
            });
            this.echartList = echartList;
            setTimeout(() => {
              this.domEchart = document.querySelectorAll(".echart-content");
              // console.log(this.domEchart);
              echartList.forEach((item, index) => {
                this.initEchart(item, this.domEchart[index]);
              });
              this.loadingPage.close();
            }, 20);
            this._getAllAsin();
          }
          // console.log(this.echartList);
        })
        .catch(() => this.loadingPage.close());
    },
    _getParentASIN(value) {
      getParentASIN({ ASIN: value, Station: this.station }).then(res => {
        this.parentAsinList = res.data;
      });
    },
    _getRma() {
      const params = {
        startTime: this.pickerDataRma[0] || this.startTime,
        endTime: this.pickerDataRma[1] || this.endTime,
        ASIN: {
          ASIN: this.asin,
          Station: this.station
        }
      };
      geRma(params).then(res => {
        // console.log(res);
        this.rmaList = res.data;
        this.listLoading = false;
      });
    },
    _getKeywordRankReport() {
      // 获取报表
      const params = {
        startTime: this.pickerDataKwtrend[0] || this.startTime,
        endTime: this.pickerDataKwtrend[1] || this.endTime,
        ASIN: {
          ASIN: this.asin,
          Station: this.station
        },
        PageIndex: this.keyWordPageIndex,
        PageSize: this.keyWordPageSize
      };
      getKeywordRankReport(params).then(res => {
        this.total = res.data.dataCount;
        this.kwtrendList = res.data.dataList;
        this.listLoading = false;
      });
    },
    _getKeywordChart(keyword) {
      // 获取图表
      const params = {
        keyword: keyword,
        startTime: this.pickerDataKwtrend[0] || this.startTime,
        endTime: this.pickerDataKwtrend[1] || this.endTime,
        ASIN: {
          ASIN: this.asin,
          Station: this.station
        }
      };
      getKeywordChart(params).then(res => {
        const data = res.data;
        const obj = {
          name: "",
          chartType: "",
          xValue: [],
          yValue: [],
          yName: [],
          series: []
        };
        obj.xValue = data.xNames;
        obj.name = data.indicator;
        obj.chartType = data.chartData[0].chartType;
        data.chartData[0].data.forEach((item, index) => {
          const serie = {
            name: item.yName,
            data: [],
            type: "bar",
            stack: "总数"
            // barCategoryGap: '100%'
          };
          if (obj.chartType === "StackedBarChart") {
            serie.type = "bar";
          }
          if (obj.chartType === "LineChart") {
            serie.type = "line";
            delete serie.stack;
            delete serie.barCategoryGap;
          }
          if (obj.chartType === "BarChart") {
            serie.type = "bar";
            delete serie.stack;
          }
          if (obj.chartType === "StackedBarChart" && index === 0) {
            serie.type = "line";
            delete serie.stack;
            delete serie.barCategoryGap;
          }
          serie.data = item.values;
          obj.series.push(serie);
          obj.yValue.push(item.values);
          obj.yName.push(item.yName);
        });
        setTimeout(() => {
          const domEchart = document.querySelector("#keyword_charts");
          this.initEchart(obj, domEchart);
        }, 20);
      });
    },
    _getAllAsin() {
      getAllAsin({ station: this.station }).then(res => {
        const list = res.data;
        const obj = {
          label: "ASIN",
          value: "ASIN",
          children: []
        };
        const indicator = {
          label: "indicator",
          value: "indicator",
          children: this.options2
        };
        this.differentAsinOptions = [];
        list.forEach(item => {
          obj.children.push({
            value: item.asin,
            label: item.asin
          });
        });
        this.differentAsinOptions.push(indicator);
        this.differentAsinOptions.push(obj);
        // debugger
      });
    }
    // 获取广告分析
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
  .asin-parent,
  .asin-child {
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
.echarts-diff-asin {
  width: 48%;
  display: inline-block;
  height: 430px;
}
.echart-list {
  display: flex;
  justify-content: space-around;
  width: 100%;
  height: calc(100vh - 180px);
  overflow: auto;
  flex-wrap: wrap;
  .echart-content,
  .table-content {
    border-radius: 5px;
    width: 320px;
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
