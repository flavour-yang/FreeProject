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

