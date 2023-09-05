<template>
  <video
    ref="videoTag"
    :id="id"
    autoplay
    playsinline
    height="142"
    @click="setChang"
    style="margin-left: 10px"
  ></video>
</template>

<script>
export default {
  name: "PeerVideo",
  props: ["id", "stream", "click"],
  watch: {
    stream(newStream) {
      if (newStream) {
        this.$refs.videoTag.srcObject = newStream;
      }
    },
  },
  mounted() {
    if (this.stream) {
      this.$refs.videoTag.srcObject = this.stream;
    }
  },
  methods: {
    setChang() {
      this.click(this.stream);
    },
  },
};
</script>
