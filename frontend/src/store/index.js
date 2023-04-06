import { createStore } from "vuex";

export default createStore({
  state: {
    isLogin: false,
    accessToken: "",
  },
  getters: {
    getIsLogin: (state) => {
      return state.isLogin;
    },
    getSessionToken: (state) => {
      return state.accessToken;
    },
  },
  mutations: {
    /**
     * @param {*} state
     * @param {Boolean} type true: 로그인, false: 로그아웃
     * @param {String} token accessToken
     */
    changeLogin: (state, args) => {
      const { type, token } = args;

      if (!type) {
        // 로그아웃 실행
        state.isLogin = false;
        state.accessToken = "";

        console.log("Logout");
      } else {
        // 로그인 정보 추가
        state.isLogin = true;
        state.accessToken = token;

        console.log("Login");
        console.log("Token", state.accessToken);
      }
    },
  },
  actions: {},
  modules: {},
});
