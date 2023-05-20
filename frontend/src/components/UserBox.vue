<template>
  <div>
    <form>
      <input type="text" placeholder="Email" v-model="email" />
      <input type="password" placeholder="PW" v-model="password" />
      <input type="submit" value="Login" @click="loginButton" />
    </form>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "UserBox",
  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    loginButton(event) {
      event.preventDefault();
      const data = JSON.stringify({
        email: this.email,
        password: this.password,
      });

      axios
        .post("/api/auth/login", data, {
          headers: { timeout: 3000, "Content-Type": `application/json` },
        })
        .then((res) => {
          this.$store.commit("changeLogin", {
            type: true,
            token: res.data.token,
          });
          this.$router.push("/room");
        })
        .catch(() => {
          alert("이메일 혹은 패스워드를 다시 확인하십시오.");
        });
    },
  },
};
</script>
