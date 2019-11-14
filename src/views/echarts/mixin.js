import { getCharts } from "@/api/table";
export default {
  data() {
    return {

    }
  },
  methods: {
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
          setTimeout(() => {
            echartList.forEach((item) => {
              this.initEchart(item, dom);
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
          //   const serieList = []
          const obj = {
            name: "",
            chartType: "",
            xValue: [],
            yValue: [],
            yName: [],
            series: []
          };
          list.forEach(el => {
            obj.xValue = el.xNames;
            const chartType = el.chartData[0].chartType;
            el.chartData[0].data.forEach((item, index) => {
              const serie = {
                name: item.yName,
                data: [],
                type: "bar",
                stack: "总数",
                barWidth: 10
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
              serie.data = item.values;
              obj.series.push(serie);
              // serieList.push(serie)
              obj.yValue.push(item.values);
              obj.yName.push(item.yName);
            });
            // echartList.push(obj);
          });
          // echartList.ser
          console.timeEnd();
          setTimeout(() => {
            // echartList.forEach((item) => {
            this.initEchart(obj, dom);
            console.log(obj)
            // });
          }, 20);
        }
      });
    }

  }
}
