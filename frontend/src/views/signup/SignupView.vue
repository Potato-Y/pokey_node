<template>
  <div>
    <section class="signup">
      <div class="login">
        <div class="form">
          <p>SIGN UP</p>
          <br />
          <form class="login-form">
            <div class="inputs">
              <span class="icons"><img src="@/assets/icon/mail.png" /></span>
              <div class="group">
                <input
                  type="mail"
                  v-model="email"
                  class="logininput"
                  required
                />
                <span class="highlight"></span>
                <span class="bar"></span>
                <label class="loginlabel">Email</label>
              </div>
            </div>

            <div class="inputs">
              <span class="icons"><img src="@/assets/icon/user.png" /></span>
              <div class="group">
                <input type="text" v-model="name" class="logininput" required />
                <span class="highlight"></span>
                <span class="bar"></span>
                <label class="loginlabel">Name</label>
              </div>
            </div>

            <div class="inputs">
              <span class="icons"><img src="@/assets/icon/padlock.png" /></span>
              <div class="group">
                <input
                  type="password"
                  v-model="pwd"
                  required
                  class="logininput"
                />
                <span class="highlight"></span>
                <span class="bar"></span>
                <label class="loginlabel">Passwd</label>
              </div>
            </div>

            <div class="inputs">
              <span class="icons"><img src="@/assets/icon/padlock.png" /></span>
              <div class="group">
                <input
                  type="password"
                  v-model="pwd2"
                  required
                  class="logininput"
                />
                <span class="highlight"></span>
                <span class="bar"></span>
                <label class="loginlabel">Confirm Password</label>
              </div>
            </div>
          </form>

          <div class="langbtn">
            <!--                    <span class="icons"><img src="img/linguistics.png"></span>-->
            <div class="toggle-button">
              <input
                id="Korea"
                name="radio2"
                v-model="country"
                value="KR"
                type="radio"
              />
              <label for="Korea" data-text="한국"></label>
              <div class="toggle-button__icon"></div>
            </div>
            <div class="toggle-button">
              <input
                id="USA"
                name="radio2"
                v-model="country"
                value="US"
                type="radio"
              />
              <label for="USA" data-text="USA"></label>
              <div class="toggle-button__icon"></div>
            </div>
          </div>

          <div class="langbtn">
            <!--                    <span class="icons"><img src="img/linguistics.png"></span>-->
            <div class="toggle-button">
              <input
                id="Korean"
                name="radio3"
                v-model="language"
                value="KO"
                type="radio"
              />
              <label for="Korean" data-text="한국어"></label>
              <div class="toggle-button__icon"></div>
            </div>
            <div class="toggle-button">
              <input
                id="English"
                name="radio3"
                v-model="language"
                value="EN"
                type="radio"
              />
              <label for="English" data-text="English"></label>
              <div class="toggle-button__icon"></div>
            </div>
          </div>
          <div class="wrap">
            <button class="smbtn" @click="btnClick">Submit</button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "SignupView",
  data() {
    return {
      email: "",
      name: "",
      pwd: "",
      pwd2: "",
      country: "",
      language: "",
    };
  },
  methods: {
    btnClick(event) {
      event.preventDefault();

      // 이메일 입력 확인
      if (this.email == "") {
        return alert("이메일을 확인해주세요.");
      }

      // 이름 확인
      if (this.name == "") {
        return alert("이름을 적어주세요.");
      }

      // 입력한 비밀번호가 다른지 확인
      if (this.pwd == "" || this.pwd != this.pwd2) {
        return alert("비밀번호를 다시 확인하십시오.");
      }

      // 라디오 사용 확인
      if (this.country == "" || this.language == "") {
        return alert("언어와 국가를 확인해 주세요.");
      }

      const data = JSON.stringify({
        email: this.email,
        name: this.name,
        country: this.country,
        language: this.language,
        password: this.pwd,
      });

      axios
        .post("/api/auth/register", data, {
          headers: { timeout: 3000, "Content-Type": `application/json` },
        })
        .then(() => {
          alert("가입이 완료되었습니다.");
          location.href = "/";
        })
        .catch(() => {
          alert("이메일 혹은 패스워드를 다시 확인하십시오.");
        });
    },
  },
};
</script>

<style scoped>
@import url("./SignupView.css");
</style>
