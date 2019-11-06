<style lang="scss">
.upload-demo {
  margin-bottom: 10px;
}
</style>
<template>
  <div class="app-container">
    <el-upload
      ref="upload"
      class="upload-demo"
      action="http://120.26.222.134:9005/api/v1/product/upload/"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :on-success="handleSucess"
      :on-error="handleError"
      :file-list="fileList"
      :auto-upload="false"
    >
      <el-button slot="trigger" size="small" type="primary">上传产品</el-button>
      <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">确定</el-button>
      <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
    </el-upload>
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
      <!-- <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">{{ scope.$index }}</template>
      </el-table-column>-->
      <el-table-column label="asin" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.asin }}</span>
        </template>
      </el-table-column>
      <el-table-column label="产品图片" align="center">
        <template slot-scope="scope">
          <el-upload
            v-if="!scope.row.picturePath"
            class="upload-demo"
            action="http://120.26.222.134:9005/api/v1/Attachment/upload"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :on-success="handleListSucess"
            multiple
            :limit="3"
            :file-list="fileList"
          >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
          <!-- :preview-src-list="srcList"/ -->
          <el-image
            v-if="scope.row.picturePath"
            style="height: 40px"
            :src="scope.row.picturePath"
            :preview-src-list="srcList"
            @click.native="handleImg(scope.row.picturePath)"
          />
          <!-- <img v-if="scope.row.picturePath" :src="scope.row.picturePath" alt width="40" /> -->
        </template>
      </el-table-column>

      <el-table-column label="产品">
        <template slot-scope="scope">{{ scope.row.name }}</template>
      </el-table-column>
      <el-table-column label="站点" align="center">
        <template slot-scope="scope">{{ scope.row.station }}</template>
      </el-table-column>
      <el-table-column label="sku" align="center">
        <template slot-scope="scope">{{ scope.row.sku }}</template>
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
import { getProjectList } from "@/api/table";

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
      srcList: [
        "https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg",
        "https://fuss10.elemecdn.com/1/8e/aeffeb4de74e2fde4bd74fc7b4486jpeg.jpeg"
      ],
      fileList: [
        // {
        //   name: 'food.jpeg',
        //   url:
        //     'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
        // },
        // {
        //   name: 'food2.jpeg',
        //   url:
        //     'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
        // }
      ]
    };
  },
  created() {
    this.listLoading = true;
    this.list = [];
    this.fetchData();
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
    fetchData() {
      this.listLoading = true;
      getProjectList({
        pageSize: this.pageSize,
        pageIndex: this.currentPage
      }).then(response => {
        const res = response.data;
        this.list = res.dataList;
        this.total = res.dataCount;
        this.listLoading = false;
      });
    },
    submitUpload() {
      this.loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      // setTimeout(()=>{

      // })
      debugger;
      this.$refs.upload.submit();
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handleSucess() {
      this.loading.close();
    },
    handleListSucess(a, b, c) {
    },
    handleError() {
      this.loading.close();
    },
    handlePreview(file) {
      console.log(file);
    }
  }
};
</script>
