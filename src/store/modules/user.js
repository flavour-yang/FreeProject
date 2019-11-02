/*
 * @Author: your name
 * @Date: 2019-10-29 14:04:54
 * @LastEditTime: 2019-11-02 12:56:57
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vue-admin-template\src\store\modules\user.js
 */
import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import Layout from '@/layout'
const state = {
  token: getToken(),
  name: '',
  avatar: ''
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    debugger
    const { LoginName, Password } = userInfo
    return new Promise((resolve, reject) => {
      login({ LoginName: LoginName.trim(), Password: Password }).then(response => {
        debugger
        const { data } = response
        commit('SET_TOKEN', data.token)
        commit('SET_NAME', data.loginName)
        commit('SET_AVATAR', 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif')
        setToken(data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response

        if (!data) {
          reject('Verification failed, please Login again.')
        }

        const { name, avatar } = data

        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  addRouter({ commit, state }) {
    const routerArr = [
      {
        path: '/test',
        component: Layout,
        redirect: '/test',
        children: [
          {
            path: 'test',
            name: 'Test',
            component: () => import('@/views/testvue/test'),
            meta: { title: 'Test', icon: 'echarts' }
          }
        ]
      }
    ]
    return Promise.resolve(routerArr)
  },
  // user logout
  logout({ commit, state }) {
    debugger
    // return new Promise((resolve, reject) => {
    // logout(state.token).then(() => {
    commit('SET_TOKEN', '')
    removeToken()
    resetRouter()
    // resolve()
    // }).catch(error => {
    // reject(error)
    // })
    // })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      removeToken()
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

