<template>
  <div class="home"></div>
</template>

<script>
// @ is an alias to /src
import { socket } from "@/socket";

export default {
  name: "HomeView",
  components: {},
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
