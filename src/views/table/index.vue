<style lang="scss" scoped>
.upload-demo {
  // margin-bottom: 10px;
}
.list-image {
  width: 40px;
}
/deep/ {
  .is-leaf {
    background: #409eff;
    color: #fff;
  }
  .highlight {
    color: #fff !important;
  }
  .el-table__column-filter-trigger i {
    color: #fff !important;
  }
}
.table-header {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  .item-left {
    display: flex;
    align-items: center;
    > div {
      margin: 0 10px;
    }
  }
}
</style>
<template>
  <div class="app-container">
    <div class="table-header">
      <div class="item-left">
        <el-upload
          class="upload-demo"
          :action="baseUrl+'/api/v1/Attachment/upload'"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :on-success="handleSucess"
          :on-error="handleError"
          :before-upload="beforeUpload"
          :file-list="fileList"
          :disabled="excelValue === 'Product' ? false : (excelValue && stationValue) ? false : true"
          :show-file-list="false"
        >
          <el-button
            slot="trigger"
            :disabled="excelValue === 'Product' ? false : (excelValue && stationValue) ? false : true"
            size="small"
            type="primary"
          >上传产品</el-button>
        </el-upload>
        <el-select v-model="excelValue" size="small" placeholder="请选择报表类型">
          <el-option v-for="(item,index) in excelList" :key="index" :label="item" :value="item" />
          <!-- 报表类型， 报表站点 -->
        </el-select>
        <el-select v-model="stationValue" size="small" placeholder="请选择站点">
          <el-option v-for="(item,index) in stationList" :key="index" :label="item" :value="item" />
          <!-- 报表类型， 报表站点 -->
        </el-select>
      </div>
      <div>
        <!-- <span style="color: #666">站点:</span> -->
        <el-cascader
          v-model="cascaderStationValue"
          :options="filterStationList"
          :props="{ multiple: true}"
          collapse-tags
          clearable
          filterable
          :filter-method="filterMethod"
          placeholder="请选择站点"
          size="small"
          style="margin-right: 10px;width: 160px"
          @change="stationChange"
        />
        <!-- <span style="color: #666">产品线:</span> -->
        <el-cascader
          v-model="productLineValue"
          :options="filterLinesList"
          :props="{ multiple: true}"
          collapse-tags
          clearable
          filterable
          :filter-method="filterMethod"
          placeholder="请选择产品线"
          size="small"
          style="margin-right: 10px;width: 160px"
          @change="productLineChange"
        />
        <el-input
          v-model="searchVal"
          size="small"
          placeholder="输入ASIN,FNSKU进行查询"
          style="width: 210px;"
        />
        <el-button icon="el-icon-search" size="small" @click="handleSearch">查询</el-button>
      </div>

      <!-- 站点
       <el-cascader
        v-model="stationValue"
        :options="filterStationList"
        :props="{ multiple: true}"
        collapse-tags
        clearable
        size="medium"
        @change="productLineChange"
      />-->
    </div>
    <!-- <el-upload
      ref="upload"
      class="upload-demo"
      action="http://120.26.222.134:9005/api/v1/Attachment/upload"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :on-success="handleSucess"
      :on-error="handleError"
      :file-list="fileList"
      :auto-upload="false"
    >
      <el-button slot="trigger" size="small" type="primary">上传产品</el-button>
      <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">确定</el-button>
      <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
    </el-upload>-->
    <!-- <el-image style="width: 100px; height: 100px" :src="url" :preview-src-list="srcList" /> -->
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <!-- @filter-change="fnFilterChangeInit" -->
      <el-table-column label="产品图片" align="center">
        <template slot-scope="scope">
          <el-upload
            :action="baseUrl+'/api/v1/Attachment/upload'"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :on-success="handleListSucess"
            :on-error="handleListError"
            :before-upload="beforeUploadList"
            :multiple="false"
            :limit="1"
            :file-list="fileList"
            :show-file-list="false"
          >
            <el-popover placement="right-end" trigger="hover">
              <div v-if="scope.row.picturePath">
                <img :src="scope.row.picturePath" width="200">
              </div>
              <div slot="reference">
                <el-button
                  v-if="!scope.row.picturePath"
                  size="mini"
                  type="primary"
                  @click="handleUpload(scope.row.id)"
                >点击上传</el-button>
                <img
                  v-if="scope.row.picturePath"
                  :src="scope.row.picturePath"
                  width="40"
                  @click="handleUpload(scope.row.id)"
                >
              </div>
            </el-popover>
          </el-upload>
        </template>
      </el-table-column>
      <el-table-column label="站点" align="center">
        <!-- :filters="filterStationList"
        :filter-method="filterTag"
        column-key="tag"
        filter-placement="bottom"-->
        <template slot-scope="scope">{{ scope.row.station }}</template>
      </el-table-column>
      <el-table-column label="产品线" align="center">
        <!--column-key="line"  filter-placement="bottom"
        :filters="filterLinesList"-->
        <template slot-scope="scope">{{ scope.row.line }}</template>
      </el-table-column>
      <!-- <el-table-column label="产品" align="center">
        <template slot-scope="scope">{{ scope.row.name }}</template>
      </el-table-column>-->
      <el-table-column label="ASIN" align="center">
        <template slot-scope="scope">
          <span style="cursor: pointer;" @click="handleAsin(scope.row)">{{ scope.row.asin }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="SKU" align="center">
        <template slot-scope="scope">{{ scope.row.sku }}</template>
      </el-table-column>-->
      <el-table-column label="产品" align="center">
        <template slot-scope="scope">{{ scope.row.name }}</template>
      </el-table-column>
      <el-table-column label="FNSKU" align="center">
        <template slot-scope="scope">{{ scope.row.fnsku }}</template>
      </el-table-column>
    </el-table>
    <div style="display: flex;justify-content: center;margin-top: 20px;">
      <el-pagination
        :current-page.sync="currentPage"
        :page-size="pageSize"
        layout="prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import {
  getProjectList,
  postProjectPicture,
  getExcelTypes,
  getStations,
  getLines,
  insertExcelData
} from "@/api/table";

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        draft: "gray",
        deleted: "danger"
      };
      return statusMap[status];
    }
  },
  data() {
    return {
      list: null,
      listLoading: true,
      total: 0,
      pageSize: 10,
      currentPage: 1,
      srcList: [],
      fileList: [],
      productLineValue: "",
      cascaderStationValue: "",
      searchVal: "",
      excelList: [],
      stationList: [],
      excelValue: "",
      stationValue: "",
      showStationFilter: true,
      station: [],
      line: [],
      upLoadDisabled: false,
      linesList: []
    };
  },
  computed: {
    filterStationList() {
      const arr = [];
      this.stationList.forEach(item => {
        arr.push({ label: item, value: item });
      });
      return arr;
    },
    filterLinesList() {
      const arr = [];
      this.linesList.forEach(item => {
        arr.push({ label: item, value: item });
      });
      return arr;
    }
  },
  watch: {},
  created() {
    this.listLoading = true;
    this.list = [];
    this.fetchData();
    this._getStations();
    this._getExcelTypes();
    this._getLines();
    this.baseUrl = process.env.VUE_APP_BASE_API;
  },
  methods: {
    filterMethod(node, keyword) {
      let str = node.label;
      // .slice(0, 1);
      str = str.toLocaleLowerCase();
      return str.includes(keyword);
    },
    productLineChange(value) {
      this.line = value.flat(Infinity);
    },
    stationChange(value) {
      this.station = value.flat(Infinity);
    },
    handleAsin({ asin, picturePath, name, station, id }) {
      this.$store.commit("table/SET_ASIN", {
        asin,
        station,
        id
      });
      this.$store.commit("table/SET_PRODUCT", {
        asin,
        src: picturePath,
        name
      });
      this.$router.push({
        path: "/echarts/echarts",
        query: { asin, station, id }
      });
    },
    handleSizeChange() {},
    handleCurrentChange(page) {
      this.fetchData();
    },
    handleImg(image) {
      this.srcList = [];
      this.srcList.push(image);
    },
    handleSearch() {
      this.currentPage = 1;
      this.fetchData();
    },
    submitUpload() {},
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handleSucess(a, b, c) {
      if (a.code === 1000) {
        return insertExcelData({
          excelType: this.excelValue,
          station: this.stationValue,
          attachmentGuid: a.data[0]
        })
          .then(res => {
            this.loading.close();
            if (res.code === 1000) {
              this.$message.success("附件上传成功!");
            }
          })
          .catch(err => {
            this.loading.close();
            this.$message.error("上传失败!");
            console.log(err);
          });
      } else {
        this.loading.close();
        this.$message.success("上传失败!");
        console.log(a, b);
      }
    },
    handleError() {
      this.$message.error("上传失败");
      this.loading.close();
    },
    handlePreview(file) {
      console.log(file);
    },
    handleUpload(id) {
      this.projectId = id;
    },
    beforeUpload(file) {
      const type = file.name.split(".")[1];
      if (type !== "csv" && type !== "xlsx" && type !== "xls") {
        this.$message.error("文件只支持 csv,xlsx,xls 格式!");
        // this.loading.close();
        return false;
      }
      this.loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
    },
    beforeUploadList(file) {
      const type = file.type;
      if (
        type !== "image/jpeg" &&
        type !== "image/png" &&
        type !== "image/jpg"
      ) {
        this.$message.error("上传图片只能是 jpeg,png,jpg 格式!");
        return false;
      }
      // return type
      // if(file.type)
      // const isJPG = file.type === 'image/jpg';
      // const isLt2M = file.size / 1024 / 1024 < 2;

      // if (!isJPG) {
      //   this.$message.error('上传头像图片只能是 JPG 格式!');
      // }
      // if (!isLt2M) {
      //   this.$message.error('上传头像图片大小不能超过 2MB!');
      // }
      // return isJPG && isLt2M;
    },
    handleListSucess(a, b, c) {
      if (a.code === 1000) {
        return postProjectPicture({
          productId: this.projectId,
          attachGuid: a.data[0]
        }).then(res => {
          if (res.code === 1000) {
            this.fetchData();
          }
        });
      }
    },
    handleListError() {
      this.$message.error("上传失败");
    },
    fetchData() {
      this.listLoading = true;
      const params = {
        // StationName: this.searchVal,
        stations: this.station,
        lines: this.line,
        key: this.searchVal,
        pageSize: this.pageSize,
        pageIndex: this.currentPage
      };
      for (const key in params) {
        !params[key] && delete params[key];
      }
      getProjectList(params).then(response => {
        const res = response.data;
        this.list = res.dataList;
        this.total = res.dataCount;
        this.listLoading = false;
      });
    },

    clickTitle() {
      this.showStationFilter = !this.showStationFilter;
      console.log(this.showStationFilter);
    },
    fnFilterChangeInit(filter) {
      // do something
      // debugger
      // example 这里最好用if，没有if可以试试也许有奇迹
      // debugger;
      if (filter.tag) {
        // 为什么这么处理 怕有些同学把undefined当一个字符串传给后台
        this.station = filter.tag;
        // [0] === undefined ? "" : filter.tag[0];
      }
      if (filter.line) {
        // 为什么这么处理 怕有些同学把undefined当一个字符串传给后台
        this.line = filter.line;
        // [0] === undefined ? "" : filter.line[0];
      }
      this.fetchData();
    },
    filterTag(value, row, column) {
      return true;
    },
    _getStations() {
      getStations().then(res => {
        this.stationList = res.data;
        console.log(this.stationList);
      });
    },
    _getExcelTypes() {
      getExcelTypes().then(res => {
        this.excelList = res.data;
      });
    },
    _getLines() {
      getLines().then(res => {
        this.linesList = res.data;
      });
    }
  }
};
</script>
