import { getCharts } from "@/api/table";
import echarts from "echarts";
export default {
  data() {
    return {

    }
  },
  methods: {
    initOneEchart(options, dom) {
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
            }
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
            // magicType: {
            //   show: true,
            //   type: ["line", "bar"]
            // },
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
      }, {
        notMerge: true // 是否合并之前的图表
      });
    },
    _getOneCharts(indicators, asin, dom) {
      //   debugger
      const start = this.pickerData[0] || this.startTime; const end = this.pickerData[1] || this.endTime
      const params = {
        indicators: indicators,
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
            obj.xValue = el.xNames;
            obj.name = el.indicator;
            obj.chartType = el.chartData[0].chartType;
            el.chartData[0].data.forEach((item, index) => {
              const serie = {
                name: item.yName,
                data: [],
                type: "bar",
                stack: "总数",
                // barWidth: 20,
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
          setTimeout(() => {
            echartList.forEach((item) => {
              this.initOneEchart(item, dom);
            });
          }, 20);
        }
      });
    },
    _getMoreCharts(indicators, asin, dom) {
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
          list.forEach(el => {
            const result = [];
            const objchild = {};
            for (const i of el.xNames) {
              if (!objchild[i]) {
                result.push(i)
                objchild[i] = 1
              }
            }
            obj.xValue = result
            el.chartData.forEach((elChart, index) => {
              const chartType = elChart.chartType;
              const serie = {
                name: [],
                data: [],
                type: "bar",
                stack: "总数",
                markLine: {
                  data: [
                    { type: 'average', name: '平均值' }
                  ]
                }
              };
              if (chartType === "StackedBarChart") {
                serie.type = "bar";
              }
              if (chartType === "LineChart") {
                serie.type = "line";
                delete serie.stack
              }
              if (chartType === "BarChart") {
                serie.type = "bar";
                delete serie.stack
              }
              if (chartType === "StackedBarChart" && index === 0) {
                serie.type = "line";
              }
              // item.asin
              elChart.data.forEach((item) => {
                serie.data = item.values;
                serie.name = item.yName
                // serieList.push(serie)
                // obj.yValue.push(item.values);
                // obj.yName.push(item.yName);
              });
              obj.series.push(serie);
            })
            console.log(obj)
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
    }

  }
}
