import { createStore } from "vuex";

export default createStore({
  state: {
    isLogin: false,
    accessToken: "",
    name: "",
    email: "",
    country: "",
    language: "",
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
      const { type, token, email, name, language, country } = args;

      if (!type) {
        // 로그아웃 실행
        state.isLogin = false;
        state.accessToken = "";
        state.email = "";
        state.name = "";
        state.language = "";
        state.country = "";

        console.log("Logout");
      } else {
        // 로그인 정보 추가
        state.isLogin = true;
        state.accessToken = token;
        state.email = email;
        state.name = name;
        state.language = language;
        state.country = country;

        console.log("Login");
        console.log("Token", state.accessToken);
      }
    },
    changeInfo: (state, args) => {
      const { name, language, country } = args;

      state.name = name;
      state.language = language;
      state.country = country;
    },
  },
  actions: {},
  modules: {},
});
