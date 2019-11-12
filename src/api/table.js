import request from '@/utils/request'
import qs from 'qs'
export function getList(params) {
  return request({
    url: '/table/list',
    method: 'get',
    params
  })
}

export function getProjectList(params) {
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
    method: 'get',
    paramsSerializer: function(params) {
      return qs.stringify(params, { indices: false })
    },
    params
  })
}

export function postProjectPicture(data) {
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

export function getRecent(params) {
  return request({
    url: '/api/v1/Product/GetRecentData',
    method: 'get',
    params
  })
}

