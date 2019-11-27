import { getCharts } from "@/api/table";
import echarts from "echarts";
export default {
  data() {
    return {
      series: [
        {
          name: '',
          data: []
        }
      ],
      endu: ''
    }
  },
  methods: {
    initOneEchart(options, dom) { // 放大后的echart
      options.series = options.series.reverse()
      // const serie = options.series.splice(1, 1)
      // options.series.push(serie)
      // options.series = options.series.reverse()
      // var arr = options.series.pop()
      // options.series.unshift(arr)
      console.log(options)
      if (options.series.length > 1) {
        options.series.forEach(item => {
          if (item.name === 'natural order') {
            item['itemStyle'] = { color: '#91ca8c' }
          }
          if (item.name === 'ad order') {
            item['itemStyle'] = { color: '#dd6b66' }
          }
          if (item.name === 'natural session') {
            item['itemStyle'] = { color: '#91ca8c' }
          }
          if (item.name === 'ad session') {
            item['itemStyle'] = { color: '#dd6b66' }
          }
        })
      }
      if (options.name === 'UCR' || options.name === '广告CR') {
        options.series[0].data.forEach((item, index) => {
          options.series[0].data[index] = Number(item * 100).toFixed(1);
        })
      }
      const echart = echarts.init(dom, "light");
      // this.myChart = echarts.init(document.getElementById("echart"), "light");
      // 绘制图表
      echart.setOption({
        title: {
          text: options.name,
          left: '8%',
          top: "10%",
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
              // formatter: options.name === 'UCR' || options.name === '广告CR' ? '{value} %' : options.name === "Sales" || options.name === "广告Spend" ? '${value}' : '{value}'
            }
          },
          formatter: function(params) {
            let symbol = ''
            if (params[0].seriesName === 'UCR' || params[0].seriesName === 'ad CR') {
              symbol = '%'
            }
            let str = params[0].axisValue + "<br>";
            // console.log(params)
            for (let i = 0; i < params.length; i++) {
              if (options.name === 'Sales' || options.name === "广告Spend") {
                str += `${params[i].marker}${params[i].seriesName}: $${params[i].value}<br>`
              } else {
                str += `${params[i].marker}${params[i].seriesName}: ${params[i].value} ${symbol}<br>`
              }
            }
            return str
          }

        },
        legend: {
          top: "10%",
          data: options.yName
        },
        grid: {
          // 图标位置调整
          bottom: "10%",
          top: "20%",
          left: "10%",
          right: "4%"
        },
        toolbox: {
          show: true,
          right: '5%',
          top: '8%',
          feature: {
            dataZoom: {
              yAxisIndex: "none"
            },
            mark: {
              show: true
            },
            restore: {
              show: true
            },
            saveAsImage: {
              show: true
            }
          }

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
              formatter: options.name === 'UCR' || options.name === '广告CR' ? '{value} %' : options.name === "Sales" || options.name === "广告Spend" ? '${value}' : '{value}'
            }
          }
        ],
        series: options.series,
        calculable: false
      }, {
        notMerge: true // 是否合并之前的图表
      });
      echart.dispatchAction({ // 默认启动 toolbox 中 dataZoom 的刷选状态
        type: "takeGlobalCursor",
        key: "dataZoomSelect",
        dataZoomSelectActive: true
      })
    },
    initDiffEchart(options, dom) { // 多asin,比较echart
      options.series = options.series.reverse()
      if (options.name === 'UCR' || options.name === 'AdCR') {
        options.series.forEach((parent, parentIndex) => {
          parent.data.forEach((item, index) => {
            options.series[parentIndex].data[index] = Number(item * 100).toFixed(1);
          })
        })
      }
      if (options.series.length > 1) {
        options.series.forEach((item, index) => {
          if (item.name === 'natural order') {
            item['itemStyle'] = { color: '#91ca8c' }
          }
          if (item.name === 'ad order') {
            item['itemStyle'] = { color: '#dd6b66' }
          }
          if (item.name === 'natural session') {
            item['itemStyle'] = { color: '#91ca8c' }
          }
          if (item.name === 'ad session') {
            item['itemStyle'] = { color: '#dd6b66' }
          }
        })
      }
      const echart = echarts.init(dom, "light");
      // 绘制图表
      echart.setOption({
        title: {
          text: options.name,
          left: '8%',
          top: "10%",
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
            const obj = {}; let str = "";
            for (let i = 0; i < params.length; i++) {
              if (obj[options.series[i].selfData]) { // 存在则追加
                obj[options.series[i].selfData] += `${params[i].marker}${params[i].seriesName}: ${params[i].value}<br>`
              } else { // 不存在则赋值
                if (options.name === 'Sales' || options.name === "AdSpend") {
                  obj[options.series[i].selfData] = `${params[i].marker}${params[i].seriesName}: $${params[i].value}<br>`
                } else if (options.name === 'UCR' || options.name === 'AdCR') {
                  obj[options.series[i].selfData] = `${params[i].marker}${params[i].seriesName}: ${params[i].value}%<br>`
                } else {
                  obj[options.series[i].selfData] = `${params[i].marker}${params[i].seriesName}: ${params[i].value}<br>`
                }
              }
            }
            for (const key in obj) {
              str += `${key}<br> ${obj[key]}<br>`
            }

            return str
          }
        },
        legend: {
          top: "10%",
          data: options.yName
        },
        grid: {
          // 图标位置调整
          bottom: "10%",
          top: "20%",
          left: "10%",
          right: "4%"
        },
        toolbox: {
          show: true,
          right: '5%',
          top: '8%',
          feature: {
            dataZoom: {
              yAxisIndex: "none"
            },
            mark: {
              show: true
            },
            restore: {
              show: true
            },
            saveAsImage: {
              show: true
            }
          }
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
              formatter: options.name === 'UCR' || options.name === '广告CR' ? '{value} %' : options.name === "Sales" || options.name === "广告Spend" ? '${value}' : '{value}'
            },
            type: "value"
            // name: ""
          }
        ],
        series: options.series,
        calculable: false
      }, {
        notMerge: true // 是否合并之前的图表
      });
    },
    _getOneCharts(indicators, asin, dom) { // 点击小图表放大
      const start = this.pickerData[0] || this.startTime; const end = this.pickerData[1] || this.endTime
      const indicatorsArr = [];
      indicators.forEach(item => {
        let str = "";
        if (item.includes("广告")) {
          str = item.slice(2, item.length)
          str = "Ad" + str;
          indicatorsArr.push(str)
        } else {
          str = item;
          indicatorsArr.push(str)
        }
      })
      const params = {
        indicators: indicatorsArr,
        startTime: start,
        endTime: end,
        asins: asin
      };
      getCharts(params).then(res => {
        console.timeEnd("charts");
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
            let str = "";
            if (el.indicator.includes("Ad")) {
              str = el.indicator.slice(2, el.indicator.length);
              str = "广告" + str;
            } else {
              str = el.indicator;
            }
            obj.xValue = el.xNames;
            obj.name = str;
            obj.chartType = el.chartData[0].chartType;
            el.chartData[0].data.forEach((item, index) => {
              const serie = {
                name: item.yName,
                data: [],
                type: "bar",
                stack: "总数",
                barCategoryGap: '50%',
                markLine: {
                  data: [
                    { type: 'average', name: '平均值' }
                  ]
                }
              };
              if (obj.chartType === "StackedBarChart") {
                serie.type = "bar";
              }
              if (obj.chartType === "LineChart") {
                serie.type = "line";
                delete serie.stack
                delete serie.barCategoryGap
              }
              if (obj.chartType === "BarChart") {
                serie.type = "bar";
                delete serie.stack
              }
              if (obj.chartType === "StackedBarChart" && index === 0) {
                serie.type = "line";
                delete serie.stack
                delete serie.barCategoryGap
              }
              serie.data = item.values;
              obj.series.push(serie);
              obj.yValue.push(item.values);
              obj.yName.push(item.yName);
            });
            echartList.push(obj);
          });
          console.timeEnd();
          setTimeout(() => {
            echartList.forEach((item) => {
              this.initOneEchart(item, dom);
            });
          }, 20);
        }
      });
    },
    _getMoreCharts(indicators, asin, dom) { // 同asin
      //   debugger
      const start = this.pickerDataSameAsin[0] || this.startTime; const end = this.pickerDataSameAsin[1] || this.endTime
      const params = {
        indicators: indicators,
        startTime: start,
        endTime: end,
        asins: asin
      };
      getCharts(params).then(res => {
        console.timeEnd("charts");
        const list = res.data;
        // "LineChart","StackedBarChart","BarChart"
        if (list && list.length) {
          console.time();
          const obj = {
            name: "",
            chartType: "",
            xValue: [],
            yValue: [],
            yName: [],
            series: []
          };
          list.forEach((el, parentIndex) => {
            const result = [];
            const objchild = {};
            for (const i of el.xNames) {
              if (!objchild[i]) {
                result.push(i)
                objchild[i] = 1
              }
            }
            obj.xValue = result
            obj.name = el.indicator;
            obj.chartType = el.chartData[0].chartType;
            el.chartData.forEach((elChart) => {
              // console.log(parentIndex)
              elChart.data.forEach((item, index) => {
                const serie = {
                  name: item.yName,
                  data: [],
                  type: "bar",
                  stack: el.indicator,
                  yAxisIndex: parentIndex,
                  barCategoryGap: '50%',
                  markLine: {
                    data: [
                      { type: 'average', name: '平均值' }
                    ]
                  }
                };
                // console.log(serie)
                if (obj.chartType === "StackedBarChart") {
                  serie.type = "bar";
                }
                if (obj.chartType === "LineChart") {
                  serie.type = "line";
                  delete serie.stack
                  delete serie.barCategoryGap
                }
                if (obj.chartType === "BarChart") {
                  serie.type = "bar";
                  delete serie.stack
                }
                if (obj.chartType === "StackedBarChart" && index === 0) {
                  serie.type = "line";
                  delete serie.stack
                  delete serie.barCategoryGap
                }
                serie.data = item.values;
                if (!obj.yName.includes(item.yName)) {
                  obj.yName.push(item.yName);
                }
                obj.series.push(serie);
                obj.yValue.push(item.values);
              });
            })
            // el.chartData[0]
            // echartList.push(obj);
          });
          // echartList.ser
          console.timeEnd();
          setTimeout(() => {
            // echartList.forEach((item) => {
            this.initEchart(obj, dom);
            // console.log(obj)
            // });
          }, 20);
        }
      });
    },
    _diffAsin(indicators, asin) {
      //   debugger
      const start = this.pickerDataSameAsin[0] || this.startTime; const end = this.pickerDataSameAsin[1] || this.endTime
      const params = {
        indicators: indicators,
        startTime: start,
        endTime: end,
        asins: asin
      };
      getCharts(params).then(res => {
        const list = res.data;
        const echartList = [];
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
            const result = [];
            const objchild = {};
            for (const i of el.xNames) {
              if (!objchild[i]) {
                result.push(i)
                objchild[i] = 1
              }
            }
            obj.xValue = result
            // const arr = [];
            obj.name = el.indicator;
            obj.chartType = el.chartData[0].chartType;
            el.chartData.forEach(elChild => {
              elChild.data.forEach((item, index) => {
                const serie = {
                  name: item.yName,
                  data: [],
                  type: 'bar',
                  stack: elChild.asin,
                  selfData: elChild.asin,
                  barCategoryGap: '50%',
                  markLine: {
                    data: [
                      { type: 'average', name: '平均值' }
                    ]
                  }
                };
                if (obj.chartType === "StackedBarChart") {
                  serie.type = "bar";
                }
                if (obj.chartType === "LineChart") {
                  serie.type = "line";
                  delete serie.barCategoryGap
                  // delete serie.stack
                }
                if (obj.chartType === "BarChart") {
                  serie.type = "bar";
                  // delete serie.stack
                }
                if (obj.chartType === "StackedBarChart" && index === 0) {
                  serie.type = "line";
                  delete serie.stack
                  delete serie.barCategoryGap
                }
                serie.data = item.values;
                if (!obj.yName.includes(item.yName)) {
                  obj.yName.push(item.yName);
                }
                obj.series.push(serie);
                obj.yValue.push(item.values);
              });
            })

            echartList.push(obj);
          });
          this.differentAsinEchart = echartList
          setTimeout(() => {
            const dom = document.querySelectorAll('.echarts-diff-asin')
            echartList.forEach((item, index) => {
              this.initDiffEchart(item, dom[index]);
            });
          }, 20);
        }
      });
    }
    // swapArr(arr, index1, index2) {
    //   arr[index1] = arr.splice(index2, 1, arr[index1])[0];
    //   return arr;
    // }
  }
}
