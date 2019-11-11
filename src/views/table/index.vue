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
          action="http://120.26.222.134:9005/api/v1/product/upload/"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :on-success="handleSucess"
          :on-error="handleError"
          :before-upload="beforeUpload"
          :file-list="fileList"
          :disabled="excelValue && stationValue"
          :show-file-list="false"
        >
          <el-button
            slot="trigger"
            :disabled="excelValue && stationValue"
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
      <el-input v-model="searchVal" placeholder="输入ASIN,FNSKU进行查询" style="width: 300px;">
        <template slot="append">
          <el-button icon="el-icon-search" @click="handleSearch" />
        </template>
      </el-input>
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
      <el-table-column label="产品图片" align="center">
        <template slot-scope="scope">
          <el-upload
            action="http://120.26.222.134:9005/api/v1/Attachment/upload"
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
          </el-upload>
        </template>
      </el-table-column>
      <el-table-column label="站点" align="center">
        <template slot-scope="scope">{{ scope.row.station }}</template>
      </el-table-column>
      <el-table-column label="产品线" align="center">
        <template slot-scope="scope">{{ scope.row.line }}</template>
      </el-table-column>
      <!-- <el-table-column label="产品" align="center">
        <template slot-scope="scope">{{ scope.row.name }}</template>
      </el-table-column>-->
      <el-table-column label="ASIN" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.asin }}</span>
        </template>
      </el-table-column>
      <el-table-column label="SKU" align="center">
        <template slot-scope="scope">{{ scope.row.sku }}</template>
      </el-table-column>
      <el-table-column label="FNSKU" align="center">
        <template slot-scope="scope">{{ scope.row.fnsku }}</template>
      </el-table-column>
      <!-- <el-table-column class-name="status-col" label="Status" width="110" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{ scope.row.status }}</el-tag>
        </template>
      </el-table-column>-->
      <!-- <el-table-column align="center" prop="created_at" label="Display_time" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.display_time }}</span>
        </template>
      </el-table-column>-->
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
  getStations
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
      searchVal: "",
      excelList: [],
      stationList: [],
      excelValue: "",
      stationValue: ""
    };
  },
  created() {
    this.listLoading = true;
    this.list = [];
    this.fetchData();
    this._getStations();
    this._getExcelTypes();
  },
  methods: {
    handleSizeChange() {},
    handleCurrentChange(page) {
      // console.log(this.currentPage, page)
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
    submitUpload() {
      // setTimeout(()=>{
      // })
      // debugger;
      // this.$refs.upload.submit();
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handleSucess() {
      this.loading.close();
    },
    handleError() {
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
    handleListError() {},
    fetchData() {
      this.listLoading = true;
      const params = {
        // StationName: this.searchVal,
        Key: this.searchVal,
        pageSize: this.pageSize,
        pageIndex: this.currentPage
      };
      getProjectList(params).then(response => {
        const res = response.data;
        this.list = res.dataList;
        this.total = res.dataCount;
        this.listLoading = false;
      });
    },
    _getStations() {
      getStations().then(res => {
        this.stationList = res.data;
      });
    },
    _getExcelTypes() {
      getExcelTypes().then(res => {
        this.excelList = res.data;
      });
    }
  }
};
</script>
