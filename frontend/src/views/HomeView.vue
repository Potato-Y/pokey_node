<template>
  <div class="home">
    <UserBox />
  </div>
</template>

<script>
// @ is an alias to /src
import { socket } from "@/socket";
import UserBox from "../components/UserBox.vue";

export default {
  name: "HomeView",
  components: {
    UserBox,
  },
  mounted() {
    this.connect();
  },
  methods: {
    connect() {
      socket.connect();
    },
    disconnect() {
      socket.disconnect();
    },
  },
  data() {
    return {
      isLoading: false,
      value: "",
    };
  },
};
</script>
