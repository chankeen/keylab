const state = {
  domain: "http://34.92.191.50/",
  user: {
    uid:""
  }
};
const mutations = {
  SET_USER: (state, user)=> {
    state.user = user;
  }
};
const actions = {
  setUser({commit},user){
    commit('SET_USER',user)
  }
};
export default {  
  namespaced: true,
  state,
  mutations,
  actions
};
