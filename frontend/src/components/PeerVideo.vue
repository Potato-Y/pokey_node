<template>
  <video
    ref="videoTag"
    :id="id"
    autoplay
    playsinline
    width="400"
    height="400"
  ></video>
</template>

<script>
export default {
  name: "PeerVideo",
  props: ["id", "stream"],
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
};
</script>
