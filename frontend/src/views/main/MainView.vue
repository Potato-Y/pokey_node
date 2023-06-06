<template>
  <header class="mainnav">
    <nav class="header_main">
      <div class="header_flex">
        <a href="/" class="header_logo">
          <img src="./img/pokey_logo2.png" />
        </a>
      </div>

      <div class="header_flex text_center">
        <img src="./img/logo2.png" />
      </div>

      <div class="header_flex text_right">
        <a href="#section1" class="loginbtn"> HOME </a>
        <a href="#section2" class="loginbtn"> ABOUT </a>
        <a href="#section3" class="loginbtn"> CONTACT </a>
        <a href="#section3" class="loginbtn"> SIGN UP </a>

        <div id="menuArea">
          <input type="checkbox" id="menuToggle" />

          <label for="menuToggle" class="menuOpen">
            <div class="open"></div>
          </label>

          <div class="menu menuEffects">
            <label for="menuToggle"></label>
            <div class="menuContent">
              <ul>
                <li><a href="#section1">HOME</a></li>
                <li><a href="#">FORUM</a></li>
                <li><a href="#">SUPPORT</a></li>
                <li><a href="#">POKEY BOT</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </nav>
  </header>

  <section class="home_main" id="section1">
    <div class="main">
      <div class="container">
        <h1 class="container_h1">Pokey sevice since 2023</h1>
        <div class="container_top">
          <figure class="container_pic">
            <!--                        <a href="/" class="container_room">-->
            <!--                            <img src="/img/videochatting.jpg">-->
            <!--                        </a>-->
            <div v-if="!this.$store.state.isLogin" class="login">
              <div class="form">
                <p>SIGN IN</p>
                <br />
                <form class="login-form">
                  <div class="group">
                    <input
                      type="email"
                      required
                      class="logininput"
                      v-model="email"
                    />
                    <span class="highlight"></span>
                    <span class="bar"></span>
                    <label class="loginlabel">Email</label>
                  </div>

                  <div class="group">
                    <input
                      type="password"
                      required
                      class="logininput"
                      v-model="password"
                    />
                    <span class="highlight"></span>
                    <span class="bar"></span>
                    <label class="loginlabel">Password</label>
                  </div>
                </form>
                <div class="wrap">
                  <button class="smbtn" @click="loginButton">Submit</button>
                </div>
              </div>
            </div>
            <div class="login" v-if="this.$store.state.isLogin">
              <div class="form2">
                <p>PROFILE</p>
                <br />
                <form class="login-form">
                  <div class="userinfo">
                    <h1 class="info-h1">{{ this.$store.state.name }}</h1>
                    <h2 class="info-h2">{{ this.$store.state.email }}</h2>
                    <div class="wrap">
                      <button class="smbtn2">EDIT PROFILE</button>
                    </div>
                    <span></span>
                  </div>
                </form>
                <div class="wrapbtns">
                  <div class="wrap">
                    <button class="smbtn" @click="logoutButton">LOG OUT</button>
                  </div>
                  <div class="wrap">
                    <button class="smbtn">CREATE ROOM</button>
                  </div>
                </div>
              </div>
            </div>
          </figure>
          <div class="container_logo">
            <img class="container_logo_img" src="./img/real_logo2.png" />
            <h3 class="container_logo_title">POKEY CHAT</h3>
            <h4 class="container_logo_subtitle">for the interviewers</h4>
          </div>
        </div>
        <div class="container_bottom">
          <div class="container_bottom_top">
            <div class="container_desc">
              <p>
                <em
                  >POKEY is online platforms or software applications that
                  enable employers to conduct interviews with job candidates
                  remotely through video calls.
                </em>
              </p>
            </div>
          </div>
          <div class="container_bottom_bottom">
            <div class="container_icon">
              <ul class="icon_list">
                <li class="icons">
                  <div class="icon_chat">
                    <img src="./img/chat.png" class="btm_icons" />
                  </div>
                  <div class="icon_desc">LIVE CHAT</div>
                </li>
                <li class="icons">
                  <div class="icon_trans">
                    <img src="./img/trans.png" class="btm_icons" />
                  </div>
                  <div class="icon_desc">TRANSLATION</div>
                </li>
                <li class="icons">
                  <div class="icon_summary">
                    <img src="./img/summay.png" class="btm_icons" />
                  </div>
                  <div class="icon_desc">SUMMARY</div>
                </li>
                <li class="icons">
                  <div class="icon_videochat">
                    <img src="./img/videoicon.png" class="btm_icons" />
                  </div>
                  <div class="icon_desc">VIDEO CHAT</div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!--            배경 애니메이션    >-->

  <section class="area">
    <ul class="squares">
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
    </ul>
  </section>

  <!--    주요 기능 설명-->
  <section class="main-function" id="section2">
    <div class="main-container">
      <div class="main-function-pic">
        <img src="./img/my_project.png" class="main-function-picture" />
      </div>

      <h1 class="contact-h1">About us</h1>
      <span class="contact-span"></span><br />

      <div class="gallery-wrap">
        <div class="item item-1"></div>
        <div class="item item-2"></div>
        <div class="item item-3"></div>
        <div class="item item-4"></div>
        <div class="item item-5"></div>
      </div>
    </div>
  </section>

  <section class="contact" id="section3">
    <div class="contact-container">
      <div class="contact-text">
        <h1 class="contact-h1">Contact us</h1>
        <span class="contact-span"></span>
        <h2 class="contact-h2">
          Please, use the form below or send an email to dltmdxo1589@daum.net
        </h2>
        <br />
        <div class="contact-logo">
          <img class="container_logo_img" src="./img/real_logo2.png" />
        </div>

        <div class="group">
          <input type="text" required class="contactinput" />
          <span class="highlight"></span>
          <span class="bar"></span>
          <label class="contactlabel">Name</label>
        </div>

        <div class="group">
          <input type="text" required class="contactinput" />
          <span class="highlight"></span>
          <span class="bar"></span>
          <label class="contactlabel">E-mail</label>
        </div>
        <br />

        <div class="group">
          <input type="text" required class="contactinput" />
          <span class="highlight"></span>
          <span class="bar"></span>
          <label class="contactlabel">Message</label>
        </div>

        <div class="wrap">
          <button class="smbtn">Submit</button>
        </div>
      </div>
    </div>
  </section>

  <section class="footer">
    <div class="footer-div">
      <h3 class="footer-h3">POKEY SERVICE © 2023.03 - 2023.06</h3>

      <div id="wrapper">
        <a href="#"><i class="fab fa-facebook-f"></i></a>
        <a href="#"><i class="fab fa-twitter"></i></a>
        <a href="#"><i class="fab fa-instagram"></i></a>
        <a href="#"><i class="fab fa-youtube"></i></a>
      </div>
    </div>
  </section>
</template>

<script>
import axios from "axios";

export default {
  name: "MainView",
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
            email: res.data.email,
            name: res.data.name,
            country: res.data.country,
            language: res.data.language,
          });
          window.localStorage.setItem("token", res.data.token);
        })
        .catch(() => {
          alert("이메일 혹은 패스워드를 다시 확인하십시오.");
        });
    },
    logoutButton() {
      window.localStorage.clear("token");

      this.$store.commit("changeLogin", { type: false });
    },
  },
};
</script>

<style>
@import url("./MainView.css");
</style>
