import request from '@/utils/request'
import qs from 'qs'
export function login(data) {
  return request({
    url: '/api/v1/User/login',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    data: qs.stringify(data)
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}
export function putPassword(data) { // LoginName OldPassword NewPassword
  // debugger
  return request({
    url: '/api/v1/User/modifyPwd',
    method: 'put',
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    data: qs.stringify(data)
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
