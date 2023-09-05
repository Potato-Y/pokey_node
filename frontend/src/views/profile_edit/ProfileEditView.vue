<template>
  <div>
    <section class="signup">
      <div class="login">
        <div class="form">
          <p>EDIT PROFILE</p>
          <br />
          <form class="login-form">
            <div class="inputs">
              <span class="icons"><img src="@/assets/icon/mail.png" /></span>
              <div class="group">
                <input type="email" class="logininput" required disabled />
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
                <input type="password" class="logininput" required disabled />
                <span class="highlight"></span>
                <span class="bar"></span>
                <label class="loginlabel">Passwd</label>
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
            <button class="smbtn" @click="editBtn">Edit</button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "ProfileEditView",
  data() {
    return {
      name: "",
      country: "",
      language: "",
    };
  },
  methods: {
    editBtn(event) {
      event.preventDefault();

      // 이름 확인
      if (this.name == "") {
        return alert("이름을 적어주세요.");
      }

      // 라디오 사용 확인
      if (this.country == "" || this.language == "") {
        return alert("언어와 국가를 확인해 주세요.");
      }

      const data = JSON.stringify({
        token: this.$store.state.accessToken,
        info: {
          name: this.name,
          country: this.country,
          language: this.language,
        },
      });

      axios
        .post("/api/auth/changing_information", data, {
          headers: { timeout: 3000, "Content-Type": `application/json` },
        })
        .then(() => {
          alert("변경되었습니다.");
          // 변경 내용 저장
          this.$store.commit("changeInfo", {
            name: this.name,
            country: this.country,
            language: this.language,
          });
        })
        .catch(() => {
          alert("오류가 발생했습니다.");
        });
    },
  },
  mounted() {
    this.name = this.$store.state.name;
    this.country = this.$store.state.country;
    this.language = this.$store.state.language;
  },
};
</script>

<style>
@import url("./ProfileEditView.css");
</style>
