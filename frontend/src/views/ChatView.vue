<template>
  <div>
    <div id="call">
      <div id="myStream">
        <video
          id="myFace"
          autoplay
          playsinline
          width="400"
          height="400"
        ></video>
        <button id="mute">Mute</button>
        <button id="camera">Turn Camera Off</button>
        <select id="cameras"></select>
      </div>
      <video
        id="peerFace"
        autoplay
        playsinline
        width="400"
        height="400"
      ></video>
    </div>
    <button @click="disconnect">bus</button>
  </div>
</template>

<script>
import { socket } from "@/socket";

export default {
  name: "ChatView",
  data() {
    return {
      roomName: "",
      myStream: null,
      muted: false,
      cameraOff: false,
      myPeerConnection: null,
    };
  },
  beforeUnmount() {
    this.disconnect();
  },
  async mounted() {
    this.getRoomName();
    await this.getMedia();
    this.connect();
    socket.emit("join_room", this.roomName);

    socket.on("welcome", async () => {
      const offer = await this.myPeerConnection.createOffer();
      this.myPeerConnection.setLocalDescription(offer);
      console.log("sent the offer");
      socket.emit("offer", offer, this.roomName);
    });

    socket.on("offer", async (offer) => {
      console.log("received the offer");
      this.myPeerConnection.setRemoteDescription(offer);
      const answer = await this.myPeerConnection.createAnswer();
      this.myPeerConnection.setLocalDescription(answer);
      socket.emit("answer", answer, this.roomName);
      console.log("sent the answer");
    });

    socket.on("answer", (answer) => {
      console.log("received the answer");
      this.myPeerConnection.setRemoteDescription(answer);
    });

    socket.on("ice", (ice) => {
      console.log("received candidate");
      this.myPeerConnection.addIceCandidate(ice);
    });

    this.makeConnection();
  },
  methods: {
    getRoomName() {
      const urlParam = new URLSearchParams(window.location.search);
      this.roomName = urlParam.get("room");
    },
    connect() {
      socket.connect();
      /** 라우터 이동 시 데이터 새로고침을 중지 */
    },
    disconnect() {
      this.myPeerConnection.close();
      this.myPeerConnection = null;
      if (this.myStream) {
        this.myStream.getAudioTracks().forEach((track) => track.stop());
        this.myStream.getVideoTracks().forEach((track) => track.stop());
      }
      this.myStream = null;
      socket.disconnect();
      console.log("disconnect");
    },
    async getCameras() {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const cameras = devices.filter(
          (device) => device.kind === "videoinput"
        );
        const currentCamera = this.myStream.getVideoTracks()[0];

        cameras.forEach((camera) => {
          const option = document.createElement("option");
          option.value = camera.deviceId;
          option.innerText = camera.label;
          if (currentCamera.label === camera.label) {
            option.selected = true;
          }
          this.camerasSelect.appendChild(option);
        });
      } catch (e) {
        console.log(e);
      }
    },
    async getMedia(deviceId) {
      const initialConstrains = {
        audio: true,
        video: { facingMode: "user" },
      };
      const cameraConstraints = {
        audio: true,
        video: { deviceId: { exact: deviceId } },
      };
      try {
        this.myStream = await navigator.mediaDevices.getUserMedia(
          deviceId ? cameraConstraints : initialConstrains
        );
        const myFace = document.querySelector("#myFace");
        myFace.srcObject = this.myStream;
        if (!deviceId) {
          // 카메라 목록이 계속 추가되지 않도록 최초만 작동하도록 수정
          await this.getCameras();
        }
      } catch (e) {
        console.log(e);
      }
    },
    handleMuteClick() {
      this.myStream
        .getAudioTracks()
        .forEach((track) => (track.enabled = !track.enabled));
      if (!this.muted) {
        this.muteBtn.innerText = "Unmute";
        this.muted = true;
      } else {
        this.muteBtn.innerText = "Mute";
        this.muted = false;
      }
    },
    handleCameraClick() {
      this.myStream
        .getVideoTracks()
        .forEach((track) => (track.enabled = !track.enabled));
      if (this.cameraOff) {
        this.cameraBtn.innerText = "Turn Camera Off";
        this.cameraOff = false;
      } else {
        this.cameraBtn.innerText = "Turn Camera On";
        this.cameraOff = true;
      }
    },
    // async handleCameraChange() {
    //   await this.getMedia(camerasSelect.value);
    //   if (this.myPeerConnection) {
    //     const videoTrack = myStream.getVideoTracks()[0];
    //     const videoSender = myPeerConnection
    //       .getSenders()
    //       .find((sender) => sender.track.kind === "video");
    //     videoSender.replaceTrack(videoTrack);
    //   }
    // },
    // RTC Code
    makeConnection() {
      this.myPeerConnection = new RTCPeerConnection({
        iceServers: [
          {
            urls: [
              "stun:stun.l.google.com:19302",
              "stun:stun1.l.google.com:19302",
              "stun:stun2.l.google.com:19302",
              "stun:stun3.l.google.com:19302",
              "stun:stun4.l.google.com:19302",
            ],
          },
        ],
      });
      this.myPeerConnection.addEventListener("icecandidate", this.handleIce);
      this.myPeerConnection.addEventListener("addstream", this.handleAddStream);
      this.myStream.getTracks().forEach((track) => {
        this.myPeerConnection.addTrack(track, this.myStream);
      });
    },
    handleIce(data) {
      console.log("sent candidate");
      socket.emit("ice", data.candidate, this.roomName);
    },
    handleAddStream(data) {
      const peersStream = document.querySelector("#peerFace");

      peersStream.srcObject = data.stream;
    },
  },
};
</script>
