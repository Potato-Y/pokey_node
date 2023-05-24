<template>
  <nav>
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link>
  </nav>
  <router-view />
</template>

<script>
import axios from "axios";

export default {
  name: "App",
  mounted() {
    this.loadLogin();
  },
  methods: {
    // 저장된 토큰이 있다면 불러오기
    loadLogin() {
      const token = window.localStorage.getItem("token");

      if (token) {
        // 토큰이 브라우저에 저장되어 있는 경우 토큰 상태를 확인
        axios
          .post("/api/auth/token_state", JSON.stringify({ token: token }), {
            headers: { timeout: 3000, "Content-Type": `application/json` },
          })
          .then((res) => {
            console.log(res);
            this.$store.commit("changeLogin", {
              type: true,
              token: token,
              email: res.data.email,
              name: res.data.name,
              country: res.data.country,
              language: res.data.language,
            });
            console.log("로그인 완료");
          })
          .catch(() => {
            window.localStorage.removeItem("token"); // 기존에 저장된 만료된 토큰 삭제
            console.log("로그인에 실패하였습니다.");
          });
      }
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
