import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user'
import table from './modules/table'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    table,
    app,
    settings,
    user
  },
  getters
})

export default store
