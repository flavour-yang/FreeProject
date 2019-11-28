<template>
  <div class="content">
    <!-- <el-dialog title="广告SearchTerm分析" :fullscreen="true" :visible.sync="visible" @close="close"> -->
    <!-- <span>这是一段信息</span> -->
    <div class="block" style="margin:0 auto 10px; width:80%;">
      <el-select
        v-model="campaignValue"
        multiple
        filterable
        allow-create
        placeholder="请选择"
        style="width: 360px"
      >
        <el-option
          v-for="item in campaignNameList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-date-picker
        v-model="pickerDataFirstTime"
        value-format="yyyy-MM-dd"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        size="medium"
      />
      <el-date-picker
        v-model="pickerDataSecondTime"
        value-format="yyyy-MM-dd"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        size="medium"
      />
      <el-button type="primary" @click="showAdAnalysisReport">compare</el-button>
      <el-button v-show="ADList.length" type="primary" @click="handleDownload">export</el-button>
    </div>
    <div class="block" style="margin:0 auto 10px; width:80%;" />
    <el-table
      v-loading="ADLoading"
      :data="ADList"
      element-loading-text="Loading"
      border
      size="small"
      fit
      type="index"
      highlight-current-row
      :cell-class-name="cellClass"
      :header-cell-class-name="headerRowClass"
    >
      <el-table-column label="searchterm" align="center">
        <template slot-scope="scope">
          <el-tooltip placement="top">
            <div slot="content">
              <p
                v-for="(item, index) in scope.row.signHistory"
                :key="index"
                style="margin: 3px 0"
              >{{ item.matchType }} {{ (item.sign === true ? '否词' : '取消否词') }}{{ item.date }}</p>
              <span v-show="!scope.row.signHistory.length">无</span>
            </div>
            <span>{{ scope.row.customerSearchTerm }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column width="90" label="remark" align="center">
        <template slot-scope="scope">
          <el-tooltip
            v-show="scope.row.remark"
            class="item"
            effect="dark"
            :content="scope.row.remark"
            placement="top-start"
            :disabled="false"
          >
            <el-button
              size="mini"
              style="padding: 4px 8px;margin: 0"
              @click="remarkFocus(scope.$index,scope.row.customerSearchTerm, scope.row.remark )"
            >{{ scope.row.remark }}</el-button>
          </el-tooltip>
          <el-button
            v-show="!scope.row.remark"
            style="padding: 4px 8px;margin: 0"
            size="mini"
            @click="remarkFocus(scope.$index,scope.row.customerSearchTerm)"
          >添加备注</el-button>
        </template>
      </el-table-column>
      <el-table-column :label="pickerDataFirstTime[0]+'-'+pickerDataFirstTime[1]" align="center">
        <el-table-column label="Impressions" align="center">
          <el-table-column width="36" label="Auto" prop="value" align="center">
            <template
              slot-scope="scope"
            >{{ scope.row.columns1.impressions.auto && scope.row.columns1.impressions.auto.value }}</template>
          </el-table-column>
          <el-table-column width="36" label="Broad" prop="value" align="center">
            <template
              slot-scope="scope"
            >{{ scope.row.columns1.impressions.broad && scope.row.columns1.impressions.broad.value }}</template>
          </el-table-column>
          <el-table-column width="36" label="Exat" prop="value" align="center">
            <template
              slot-scope="scope"
            >{{ scope.row.columns1.impressions.exat && scope.row.columns1.impressions.exat.value }}</template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="Clicks" align="center">
          <el-table-column
            :sort-method="sortColumn1ClickAuto"
            sortable
            width="60"
            prop="value"
            label="Auto"
            align="center"
          >
            <template slot-scope="scope">
              {{ scope.row.columns1.clicks.auto && scope.row.columns1.clicks.auto.value }}
              <el-button
                v-show="scope.row.columns1.clicks.auto && scope.row.columns1.clicks.auto.value+''"
                size="mini"
                style="padding: 4px 8px"
                @click="changeReport(scope.$index,scope.row.customerSearchTerm,'Auto', 'columns1')"
              >{{ scope.row.columns1.clicks.auto && (scope.row.columns1.clicks.auto.sign ? 'undo' : 'Neg') }}</el-button>
            </template>
          </el-table-column>
          <el-table-column
            :sort-method="sortColumn1ClickBroad"
            sortable
            width="60"
            prop="value"
            label="Broad"
            align="center"
          >
            <template slot-scope="scope">
              {{ scope.row.columns1.clicks.broad && scope.row.columns1.clicks.broad.value }}
              <el-button
                v-show="scope.row.columns1.clicks.broad && scope.row.columns1.clicks.broad.value+''"
                size="mini"
                style="padding: 4px 8px"
                @click="changeReport(scope.$index,scope.row.customerSearchTerm,'Broad','columns1')"
              >{{ scope.row.columns1.clicks.broad && (scope.row.columns1.clicks.broad.sign ? 'undo' : 'Neg') }}</el-button>
            </template>
          </el-table-column>
          <el-table-column
            :sort-method="sortColumn1ClickExat"
            sortable
            prop="value"
            width="60"
            label="Exat"
            align="center"
          >
            <template slot-scope="scope">
              {{ scope.row.columns1.clicks.exat && scope.row.columns1.clicks.exat.value }}
              <el-button
                v-show="scope.row.columns1.clicks.exat && scope.row.columns1.clicks.exat.value+''"
                size="mini"
                style="padding: 4px 8px"
                @click="changeReport(scope.$index,scope.row.customerSearchTerm,'Exat','columns1')"
              >{{ scope.row.columns1.clicks.exat && (scope.row.columns1.clicks.exat.sign ? 'undo' : 'Neg') }}</el-button>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="Spend" align="center">
          <el-table-column width="36" label="Auto" align="center">
            <template
              slot-scope="scope"
            >{{ scope.row.columns1.spend.auto && scope.row.columns1.spend.auto.value }}</template>
          </el-table-column>
          <el-table-column width="36" label="Broad" align="center">
            <template
              slot-scope="scope"
            >{{ scope.row.columns1.spend.broad && scope.row.columns1.spend.broad.value }}</template>
          </el-table-column>
          <el-table-column width="36" label="Exat" align="center">
            <template
              slot-scope="scope"
            >{{ scope.row.columns1.spend.exat && scope.row.columns1.spend.exat.value }}</template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="Unit Sold" align="center">
          <el-table-column
            :sort-method="sortColumn1UnitAuto"
            sortable
            prop="value"
            width="36"
            label="Auto"
            align="center"
          >
            <template
              slot-scope="scope"
            >{{ scope.row.columns1.unitSold.auto && scope.row.columns1.unitSold.auto.value }}</template>
          </el-table-column>
          <el-table-column
            :sort-method="sortColumn1UnitBroad"
            sortable
            width="36"
            label="Broad"
            align="center"
          >
            <template
              slot-scope="scope"
            >{{ scope.row.columns1.unitSold.broad && scope.row.columns1.unitSold.broad.value }}</template>
          </el-table-column>
          <el-table-column
            :sort-method="sortColumn1UnitExat"
            sortable
            width="36"
            label="Exat"
            align="center"
          >
            <template
              slot-scope="scope"
            >{{ scope.row.columns1.unitSold.exat && scope.row.columns1.unitSold.exat.value }}</template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="CR" align="center">
          <el-table-column width="42" label="Auto" align="center">
            <template
              slot-scope="scope"
            >{{ scope.row.columns1.cr.auto && scope.row.columns1.cr.auto.value && formatNum(scope.row.columns1.cr.auto.value) }}</template>
          </el-table-column>
          <el-table-column width="42" label="Broad" align="center">
            <template
              slot-scope="scope"
            >{{ scope.row.columns1.cr.broad && scope.row.columns1.cr.broad.value && formatNum(scope.row.columns1.cr.broad.value) }}</template>
          </el-table-column>
          <el-table-column width="42" label="Exat" align="center">
            <template
              slot-scope="scope"
            >{{ scope.row.columns1.cr.exat && scope.row.columns1.cr.exat.value && formatNum(scope.row.columns1.cr.exat.value) }}</template>
          </el-table-column>
          <el-table-column width="42" label="Total" align="center">
            <template
              slot-scope="scope"
            >{{ scope.row.columns1.cr.total && scope.row.columns1.cr.total.value && formatNum(scope.row.columns1.cr.total.value) }}</template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="Ctr" align="center">
          <el-table-column width="42" label="Auto" align="center">
            <template
              slot-scope="scope"
            >{{ scope.row.columns1.ctr.auto && formatNum(scope.row.columns1.ctr.auto.value) }}</template>
          </el-table-column>
          <el-table-column width="42" label="Broad" align="center">
            <template
              slot-scope="scope"
            >{{ scope.row.columns1.ctr.broad && formatNum(scope.row.columns1.ctr.broad.value) }}</template>
          </el-table-column>
          <el-table-column width="42" label="Exat" align="center">
            <template
              slot-scope="scope"
            >{{ scope.row.columns1.ctr.exat && formatNum(scope.row.columns1.ctr.exat.value) }}</template>
          </el-table-column>
          <el-table-column width="42" label="Total" align="center">
            <template
              slot-scope="scope"
            >{{ scope.row.columns1.ctr.total && formatNum(scope.row.columns1.ctr.total.value) }}</template>
          </el-table-column>
        </el-table-column>
      </el-table-column>
      <el-table-column :label="pickerDataSecondTime[0]+'-'+pickerDataSecondTime[1]" align="center">
        <el-table-column label="Impressions" align="center">
          <el-table-column width="36" label="Auto" align="center">
            <template
              slot-scope="scope"
            >{{ scope.row.columns2.impressions.auto && scope.row.columns2.impressions.auto.value }}</template>
          </el-table-column>
          <el-table-column width="36" label="Broad" align="center">
            <template
              slot-scope="scope"
            >{{ scope.row.columns2.impressions.broad && scope.row.columns2.impressions.broad.value }}</template>
          </el-table-column>
          <el-table-column width="36" label="Exat" align="center">
            <template
              slot-scope="scope"
            >{{ scope.row.columns2.impressions.exat && scope.row.columns2.impressions.exat.value }}</template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="Clicks" align="center">
          <el-table-column
            :sort-method="sortColumn2ClickAuto"
            sortable
            width="60"
            label="Auto"
            align="center"
          >
            <template slot-scope="scope">
              {{ scope.row.columns2.clicks.auto && scope.row.columns2.clicks.auto.value }}
              <el-button
                v-show="scope.row.columns2.clicks.auto && scope.row.columns2.clicks.auto.value+''"
                size="mini"
                style="padding: 4px 8px"
                @click="changeReport(scope.$index,scope.row.customerSearchTerm,'Auto', 'columns2')"
              >{{ scope.row.columns2.clicks.auto && (scope.row.columns2.clicks.auto.sign ? 'undo' : 'Neg') }}</el-button>
            </template>
          </el-table-column>
          <el-table-column
            :sort-method="sortColumn2ClickBroad"
            sortable
            width="60"
            label="Broad"
            align="center"
          >
            <template slot-scope="scope">
              {{ scope.row.columns2.clicks.broad && scope.row.columns2.clicks.broad.value }}
              <el-button
                v-show="scope.row.columns2.clicks.broad && scope.row.columns2.clicks.broad.value+''"
                size="mini"
                style="padding: 4px 8px"
                @click="changeReport(scope.$index,scope.row.customerSearchTerm,'Broad','columns2')"
              >{{ scope.row.columns2.clicks.broad && (scope.row.columns2.clicks.broad.sign ? 'undo' : 'Neg') }}</el-button>
            </template>
          </el-table-column>
          <el-table-column
            :sort-method="sortColumn2ClickExat"
            sortable
            width="60"
            label="Exat"
            align="center"
          >
            <template slot-scope="scope">
              {{ scope.row.columns2.clicks.exat && scope.row.columns2.clicks.exat.value }}
              <el-button
                v-show="scope.row.columns2.clicks.exat && scope.row.columns2.clicks.exat.value+''"
                size="mini"
                style="padding: 4px 8px"
                @click="changeReport(scope.$index,scope.row.customerSearchTerm,'Exat','columns2')"
              >{{ scope.row.columns2.clicks.exat && (scope.row.columns2.clicks.exat.sign ? 'undo' : 'Neg') }}</el-button>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="Spend" align="center">
          <el-table-column width="36" label="Auto" align="center">
            <template
              slot-scope="scope"
            >{{ scope.row.columns2.spend.auto && scope.row.columns2.spend.auto.value }}</template>
          </el-table-column>
          <el-table-column width="36" label="Broad" align="center">
            <template
              slot-scope="scope"
            >{{ scope.row.columns2.spend.broad && scope.row.columns2.spend.broad.value }}</template>
          </el-table-column>
          <el-table-column width="36" label="Exat" align="center">
            <template
              slot-scope="scope"
            >{{ scope.row.columns2.spend.exat && scope.row.columns2.spend.exat.value }}</template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="Unit Sold" align="center">
          <el-table-column
            :sort-method="sortColumn2UnitAuto"
            sortable
            width="36"
            label="Auto"
            align="center"
          >
            <template
              slot-scope="scope"
            >{{ scope.row.columns2.unitSold.auto && scope.row.columns2.unitSold.auto.value }}</template>
          </el-table-column>
          <el-table-column
            :sort-method="sortColumn2UnitBroad"
            sortable
            width="36"
            label="Broad"
            align="center"
          >
            <template
              slot-scope="scope"
            >{{ scope.row.columns2.unitSold.broad && scope.row.columns2.unitSold.broad.value }}</template>
          </el-table-column>
          <el-table-column
            :sort-method="sortColumn2UnitExat"
            sortable
            width="36"
            label="Exat"
            align="center"
          >
            <template
              slot-scope="scope"
            >{{ scope.row.columns2.unitSold.exat && scope.row.columns2.unitSold.exat.value }}</template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="CR" align="center">
          <el-table-column width="42" label="Auto" align="center">
            <template
              slot-scope="scope"
            >{{ scope.row.columns2.cr.auto && scope.row.columns2.cr.auto.value&& formatNum(scope.row.columns2.cr.auto.value) }}</template>
          </el-table-column>
          <el-table-column width="42" label="Broad" align="center">
            <template
              slot-scope="scope"
            >{{ scope.row.columns2.cr.broad && scope.row.columns2.cr.broad.value&& formatNum(scope.row.columns2.cr.broad.value) }}</template>
          </el-table-column>
          <el-table-column width="42" label="Exat" align="center">
            <template
              slot-scope="scope"
            >{{ scope.row.columns2.cr.exat && scope.row.columns2.cr.exat.value&& formatNum(scope.row.columns2.cr.exat.value) }}</template>
          </el-table-column>
          <el-table-column width="42" label="Total" align="center">
            <template
              slot-scope="scope"
            >{{ scope.row.columns2.cr.total && scope.row.columns2.cr.total.value&& formatNum(scope.row.columns2.cr.total.value) }}</template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="Ctr" align="center">
          <el-table-column width="42" label="Auto" align="center">
            <template
              slot-scope="scope"
            >{{ scope.row.columns2.ctr.auto && scope.row.columns2.ctr.auto.value &&formatNum(scope.row.columns2.ctr.auto.value ) }}</template>
          </el-table-column>
          <el-table-column width="42" label="Broad" align="center">
            <template
              slot-scope="scope"
            >{{ scope.row.columns2.ctr.broad && scope.row.columns2.ctr.broad.value &&formatNum(scope.row.columns2.ctr.broad.value ) }}</template>
          </el-table-column>
          <el-table-column width="42" label="Exat" align="center">
            <template
              slot-scope="scope"
            >{{ scope.row.columns2.ctr.exat && scope.row.columns2.ctr.exat.value &&formatNum(scope.row.columns2.ctr.exat.value ) }}</template>
          </el-table-column>
          <el-table-column width="42" label="Total" align="center">
            <template
              slot-scope="scope"
            >{{ scope.row.columns2.ctr.total && scope.row.columns2.ctr.total.value &&formatNum(scope.row.columns2.ctr.total.value ) }}</template>
          </el-table-column>
        </el-table-column>
      </el-table-column>
    </el-table>
    <!-- </el-dialog> -->
  </div>
</template>

<script>
import {
  getAdAnalysisReport,
  getAllCampaignNames,
  insertSearchTermReportRemark,
  insertSearchTermReportSign,
  exportAdAnalysisReport
} from "@/api/table";
export default {
  //   props: {
  //     value: {
  //       type: Boolean,
  //       default: false
  //     }
  //   },
  data() {
    return {
      visible: false,
      campaignValue: "",
      dialogCampaign: false,
      ADLoading: false,
      ADList: [],
      loadingPage: "",
      campaignNameList: [],
      pickerDataFirstTime: ["", ""],
      pickerDataSecondTime: ["", ""]
    };
  },
  watch: {
    // value(val) {
    //   this.visible = val;
    // }
  },
  mounted() {
    // this.visible = this.value;
    this._getAllCampaignNames();
  },
  methods: {
    // close() {
    //   this.$emit("input", false);
    // },
    formatNum(value) {
      if (Math.round(value * 10000) / 100 === 0) {
        return "0";
      }
      return Math.round(value * 10000) / 100 + "%";
    },
    remarkFocus(index, customer, value) {
      // const h = this.$createElement;
      this.$prompt("请输入修改信息", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputValue: value
      })
        .then(({ value }) => {
          this._putReportRemark({
            CustomerSearchTerm: customer,
            Remark: value
          })
            .then(res => {
              if (res.code === 1000) {
                this.ADList[index].remark = value;
                this.$message({
                  type: "success",
                  message: "备注信息修改成功"
                });
              }
            })
            .catch(err => {
              this.$message({
                type: "info",
                message: "修改失败" + err.code
              });
            });
        })
        .catch(() => {});
    },
    sortColumn1ClickAuto(a, b) {
      return a.columns1.clicks.auto.value - b.columns1.clicks.auto.value;
    },
    sortColumn1ClickBroad(a, b) {
      return a.columns1.clicks.broad.value - b.columns1.clicks.broad.value;
    },
    sortColumn1ClickExat(a, b) {
      return a.columns1.clicks.exat.value - b.columns1.clicks.exat.value;
    },
    sortColumn1UnitAuto(a, b) {
      return a.columns1.unitSold.auto.value - b.columns1.unitSold.auto.value;
    },
    sortColumn1UnitBroad(a, b) {
      return a.columns1.unitSold.broad.value - b.columns1.unitSold.broad.value;
    },
    sortColumn1UnitExat(a, b) {
      return a.columns1.unitSold.exat.value - b.columns1.unitSold.exat.value;
    },

    sortColumn2ClickAuto(a, b) {
      return a.columns2.clicks.auto.value - b.columns2.clicks.auto.value;
    },
    sortColumn2ClickBroad(a, b) {
      return a.columns2.clicks.broad.value - b.columns2.clicks.broad.value;
    },
    sortColumn2ClickExat(a, b) {
      return a.columns2.clicks.exat.value - b.columns2.clicks.exat.value;
    },
    sortColumn2UnitAuto(a, b) {
      return a.columns2.unitSold.auto.value - b.columns2.unitSold.auto.value;
    },
    sortColumn2UnitBroad(a, b) {
      return a.columns2.unitSold.broad.value - b.columns2.unitSold.broad.value;
    },
    sortColumn2UnitExat(a, b) {
      return a.columns2.unitSold.exat.value - b.columns2.unitSold.exat.value;
    },
    headerRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0) {
        if (columnIndex === 2) {
          return "left-row";
        }
        if (columnIndex === 3) {
          return "right-row";
        }
      }
      if (rowIndex === 1) {
        if (columnIndex < 6) {
          return "left-row";
        }
        if (columnIndex >= 6) {
          return "right-row";
        }
      }
      if (rowIndex === 2) {
        if (columnIndex < 20) {
          return "left-row";
        }
        if (columnIndex >= 20) {
          return "right-row";
        }
      }
    },

    showAdAnalysisReport() {
      // this.
      this.ADLoading = true;
      this._getAdAnalysisReport();
    },
    handleDownload() {
      this.loadingPage = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      const nameList = [];
      this.campaignValue.forEach(item => {
        nameList.push(item);
      });
      const params = {
        campaignNames: nameList,
        startTime1: this.pickerDataFirstTime[0] || "",
        endTime1: this.pickerDataFirstTime[1] || "",
        startTime2: this.pickerDataSecondTime[0] || "",
        endTime2: this.pickerDataSecondTime[1] || ""
      };
      exportAdAnalysisReport(params)
        .then(res => {
          this.loadingPage.close();
          if (res.code === 1000) {
            window.location.href = res.data;
          } else {
            this.$message.info("导出失败!");
            console.info(res);
          }
        })
        .catch(err => {
          console.log(err);
          this.loadingPage.close();
        });
    },
    cellClass({ row, column, rowIndex, columnIndex }) {
      if (columnIndex > 1 && columnIndex < 22) {
        return "left-cell";
      }
      if (columnIndex >= 22 && columnIndex < 42) {
        return "right-cell";
      }
    },
    _putReportRemark({ CustomerSearchTerm, Remark }) {
      const params = {
        CustomerSearchTerm: CustomerSearchTerm,
        Remark: Remark
      };
      return insertSearchTermReportRemark(params).then(res => {
        // console.log(res);
        return res;
      });
    },
    _getAdAnalysisReport() {
      const nameList = [];
      this.campaignValue.forEach(item => {
        nameList.push(item);
      });
      const params = {
        campaignNames: nameList,
        startTime1: this.pickerDataFirstTime[0] || "",
        endTime1: this.pickerDataFirstTime[1] || "",
        startTime2: this.pickerDataSecondTime[0] || "",
        endTime2: this.pickerDataSecondTime[1] || ""
      };
      getAdAnalysisReport(params)
        .then(res => {
          this.ADLoading = false;
          this.ADList = res.data;
        })
        .catch(err => {
          this.ADLoading = false;
          this.$message.info("error: ", err.code, err.message);
        });
    },
    _putTermReportSign({ CustomerSearchTerm, Remark, index, column }) {
      const params = {
        CustomerSearchTerm: CustomerSearchTerm,
        MatchType: Remark
      };
      // const str = Remark.toLocaleLowerCase();
      insertSearchTermReportSign(params)
        .then(res => {
          if (res.code === 1000) {
            // this.ADList[index][column].clicks[str].sign = res.data;
            if (res.data) {
              this.$message.success("添加否词操作成功!");
            } else {
              this.$message.success("取消否词操作成功!");
            }
          } else {
            this.$message.info("失败!" + res.code + res.message);
          }
        })
        .catch(err => {
          this.$message.error("失败!" + err.code + err.message);
        });
    },
    changeReport(index, customer, type, column) {
      this._putTermReportSign({
        CustomerSearchTerm: customer,
        Remark: type,
        index,
        column
      });
    },
    _getAllCampaignNames() {
      // 获取所有广告组名称
      getAllCampaignNames().then(res => {
        this.campaignNameList = [];
        res.data.forEach(item => {
          this.campaignNameList.push({ value: item, label: item });
        });
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.content {
  padding-top: 20px;
  width: 100%;
  height: calc(100vh - 50px);
  .box-card {
    height: calc(100vh - 150px);
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
/deep/ .el-table .cell,
.el-table th div {
  padding: 0;
}
/deep/.el-table th > .cell {
  padding: 0;
}
/deep/.el-table td.left-cell {
  background: #67c23a;
  color: #fff;
}
/deep/ .el-table thead.is-group th.left-row {
  background: #67c23a;
  color: #fff;
}
/deep/ .el-table thead.is-group th.right-row {
  background: #f56c6c;
  color: #fff;
}
/deep/.el-table td.right-cell {
  background: #f56c6c;
  color: #fff;
}
/deep/.el-table.el-table__row {
  background: none;
}
/deep/.el-table--enable-row-hover .el-table__body tr:hover > td {
  background-color: rgba(0, 0, 0, 0.2) !important;
}
</style>
