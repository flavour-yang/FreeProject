const state = {
  asinList: [],
  product: {},
  asin: "",
  searchTerm: false
};

const mutations = {
  SET_ASIN: (state, asin) => {
    // debugger
    state.asin = asin;

    if (!state.asinList.includes(asin)) {
      if (state.asinList.length > 8) {
        state.asinList.shift()
      }
      state.asinList.push(asin)
    }
  },
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
