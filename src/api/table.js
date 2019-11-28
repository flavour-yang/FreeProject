import request from '@/utils/request'
import qs from 'qs'
// export function getList(params) {
//   return request({
//     url: '/table/list',
//     method: 'get',
//     params
//   })
// }

export function getProjectList(data) {
  // params.paramsSerializer = params => {
  //   return qs.stringify(params, {
  //     indices: false
  //   })
  // }
  // params = qs.stringify(params, {
  //   indices: false
  // })
  return request({
    url: '/api/v1/Product/list',
    method: 'post',
    headers: {
      "content-type": "application/json; charset=utf-8"
    },
    // paramsSerializer: function(params) {
    //   return qs.stringify(params, { indices: false })
    // },
    data
  })
}

export function insertExcelData(data) { // 上传产品图片
  return request({
    url: '/api/v1/Product/InsertExcelData',
    method: 'post',
    data
  })
}

export function postProjectPicture(data) { // 上传产品图片
  return request({
    url: '/api/v1/Product/AddProductPicture',
    method: 'post',
    data
  })
}
// 报表类型
export function getExcelTypes(params) {
  return request({
    url: '/api/v1/Product/excelTypes',
    method: 'get',
    params
  })
}
// 报表站点
export function getStations(params) {
  return request({
    url: '/api/v1/Product/stations',
    method: 'get',
    params
  })
}
// 获取产品线
export function getLines(params) {
  return request({
    url: '/api/v1/Product/lines',
    method: 'get',
    params
  })
}
// 获取最近三十天数据
export function getRecent(params) {
  return request({
    url: '/api/v1/Product/GetRecentData',
    method: 'get',
    params
  })
}

export function getCharts(data) { // 获取图标数据
  return request({
    url: '/api/v1/Product/GetCharts',
    method: 'post',
    headers: {
      'Content-Type': ' application/json; charset=utf-8'
    },
    data
  })
}

export function getParentASIN(params) { // 获取父asin
  return request({
    url: '/api/v1/Product/GetPrentASIN',
    method: 'get',
    params
  })
}

export function geRma(params) { // 获取rma
  return request({
    url: '/api/v1/Product/GetRmas',
    method: 'get',
    params
  })
}

export function getKeywordRankReport(params) { // //获取Keyword报表
  return request({
    url: '/api/v1/Product/GetKeywordRankReport',
    method: 'get',
    headers: {
      "content-type": "application/json; charset=utf-8"
    },
    // paramsSerializer: function(params) {
    //   return qs.stringify(params, { indices: false })
    // },
    params
  })
}

export function getKeywordChart(params) { // //获取keyword图表
  return request({
    url: '/api/v1/Product/GetKeywordChart',
    method: 'get',
    params
  })
}

export function getAllAsin(params) { // 获取全部aisn
  return request({
    url: '/api/v1/Product/GetAllASIN',
    method: 'get',
    params
  })
}

export function getAdAnalysisReport(data) { // 获取广告分析报表
  return request({
    url: '/api/v1/Product/GetAdAnalysisReport',
    method: 'post',
    headers: {
      'Content-Type': ' application/json; charset=utf-8'
    },
    timeout: 60000,
    paramsSerializer: function(params) {
      return qs.stringify(params, { indices: false })
    },
    data
  })
}

export function getAllCampaignNames(params) { // 获取所有广告组名称
  return request({
    url: '/api/v1/Product/GetAllCampaignNames',
    method: 'get',
    params
  })
}

export function insertSearchTermReportRemark(data) {
  return request({
    url: '/api/v1/Product/InsertSearchTermReportRemark', // 添加备注
    method: 'post',
    data
  })
}

export function insertSearchTermReportSign(data) {
  return request({
    url: '/api/v1/Product/InsertSearchTermReportSign', // 添加取消否词
    method: 'post',
    data
  })
}

export function exportAdAnalysisReport(data) {
  return request({
    url: '/api/v1/Product/ExportAdAnalysisReport', // 添加取消否词
    method: 'post',
    data
  })
}

//

//
