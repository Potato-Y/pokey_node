<template>
  <div>
    <section class="signup">
      <div class="login">
        <div class="form">
          <p>Enter Room</p>
          <br />
          <form class="login-form">
            <div class="inputs">
              <span class="icons"><img src="@/assets/icon/door.png" /></span>
              <div class="group">
                <input
                  v-model="roomName"
                  type="text"
                  required
                  class="logininput"
                />
                <span class="highlight"></span>
                <span class="bar"></span>
                <label class="loginlabel">Room ID</label>
              </div>
            </div>
          </form>

          <div class="wrap">
            <button class="smbtn" @click="enter">Enter</button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: "RoomView",
  data() {
    return {
      roomName: "",
    };
  },
  methods: {
    enter(event) {
      event.preventDefault();

      if (this.roomName == "") {
        return alert("방 이름을 입력해주세요.");
      }

      //   this.$router.push("/chat?room=" + this.roomName);
      window.location = "/chat?room=" + this.roomName;
    },
  },
};
</script>

<style scoped>
@import url("./RoomView.css");
</style>
