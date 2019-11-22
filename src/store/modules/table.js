const state = {
  asinList: [],
  product: {}
};

const mutations = {
  SET_ASIN: (state, asin) => {
    // debugger
    // state.asin = asin;
    if (!state.asinList.includes(asin)) {
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
