const state = {
  domain: "http://34.92.29.165:8080/",
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
