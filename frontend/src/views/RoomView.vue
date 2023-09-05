<template>
  <div>
    <input type="text" v-model="roomName" /><button @click="enter">입장</button>
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
    enter() {
      this.$router.push("/chat?room=" + this.roomName);
    },
  },
};
</script>
