const state = {
  domain: "http://34.92.191.50/",
  user: {}
};
const mutations = {
  setUser(state, user) {
    state.user = user;
  }
};
const actions = {};
export default {
  namespaced: true,
  state,
  mutations,
  actions
};
