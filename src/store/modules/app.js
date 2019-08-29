const state = {
  domain: "http://34.92.191.50/",
  TOKEN: ""
};
const mutations = {
  SET_TOKEN(state, TOKEN) {
    state.TOKEN = TOKEN;
  }
};
export default {
  namespaced: true,
  state,
  mutations
};
