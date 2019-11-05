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
    url: '/api/v1/Project/list',
    method: 'get',
    params
  })
}
