const state = {
  asinList: [],
  product: {},
  asin: "",
  // station: "",
  searchTerm: false
};

const mutations = {
  SET_ASIN: (state, asin) => { // asin: {asin, station}
    // debugger
    state.asin = asin.asin;
    const arr = []
    for (let i = 0; i < state.asinList.length; i++) {
      arr.push(state.asinList[i].asin)
    }

    if (!arr.includes(asin.asin)) {
      if (state.asinList.length > 8) { // 限制标签数量
        state.asinList.shift()
      }
      state.asinList.push(asin)
    }
  },
  // SET_STATION: (state, station) => { // 存储站点
  //   state.station = station
  // },
  SET_PRODUCT: (state, asin) => {
    // debugger
    state.product[asin['asin']] = asin
  },
  REMOVE_ASIN: (state, asin) => {
    const index = state.asinList.indexOf(asin)
    state.asinList.splice(index, 1)
    // state.push(asin)
  },
  SET_SEARCH_TERM: (state, value) => {
    state.searchTerm = value
  }
};

const actions = {

  // user login
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
