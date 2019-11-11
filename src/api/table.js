import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/table/list',
    method: 'get',
    params
  })
}

export function getProjectList(params) {
  return request({
    url: '/api/v1/Product/list',
    method: 'get',
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
