import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: {
      userName: '',
      phone: '',
      token: '',
    },
    type: 0,
  },
  mutations: {
    setType(state, payload) {
      state.type = payload;
    },
    setUser(state, payload) {
      state.user = { ...payload };
    },
  },
  modules: {
  },
});
