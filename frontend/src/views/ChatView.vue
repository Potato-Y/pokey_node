<template>
  <div>
    허용할 유저 이메일 <br />
    <input type="text" v-model="authUserEmail" />
    <button @click="sendAuthUser">저장</button>
    <div id="call">
      <div id="myStream">
        <video
          id="myFace"
          autoplay
          playsinline
          width="400"
          height="400"
        ></video>
        <button id="mute" @click="handleMuteClick">
          {{ muted ? "Unmute" : "Mute" }}
        </button>
        <button id="camera" @click="handleCameraClick">
          {{ cameraOff ? "Turn Camera On" : "Turn Camera Off" }}
        </button>
        <select
          id="cameras"
          v-model="camerasSelect"
          @change="handleCameraChange"
        >
          <option
            v-for="(item, index) in camerasList"
            :key="index"
            :value="item.value"
          >
            {{ item.name }}
          </option>
        </select>
      </div>
      <!-- <video
        id="peerFace"
        autoplay
        playsinline
        width="400"
        height="400"
      ></video> -->
      <div>
        <peer-video
          :id="'peerFace-' + index"
          v-for="(item, index) in peerConnections"
          :key="index"
          :stream="item.stream"
        ></peer-video>
      </div>
    </div>
    <button @click="disconnect">disconnect</button>
  </div>
</template>

<script>
import { socket } from "@/socket";
import PeerVideo from "@/components/PeerVideo.vue";

export default {
  name: "ChatView",
  components: {
    PeerVideo,
  },
  data() {
    return {
      authUserEmail: "",
      roomName: "",
      myStream: null,
      peerStream: null,
      muted: false,
      cameraOff: false,
      /**
       * socketId: info.socketId,
       * name: info.name,
       * offer: offer.createOffer(),
       */
      peerConnections: [],
      camerasSelect: null,
      camerasList: [],
    };
  },
  beforeUnmount() {
    this.disconnect();
  },
  async mounted() {
    this.getRoomName();
    await this.getMedia();
    this.connect();
    socket.emit(
      "join_room",
      this.roomName,
      this.$store.state.accessToken,
      () => {
        // this.makeConnection();
      }
    );

    // 방에 새로운 사람이 입장할 시 발생하는 이벤트
    // 새로 입장한 사람에게 offer 전송
    // info 예시 데이터 { socketId: socket.id, name: socket.user.name }
    socket.on("welcome", async (info) => {
      console.log(info.name + "님이 접속하셨습니다.");
      var peerConnection;
      var obj = {
        peerConnection: peerConnection,
        socketId: info.socketId,
        name: info.name,
      };

      await this.makeConnection(
        obj,
        (data) => {
          console.log("welcome/sent candidate" + data.candidate);
          socket.emit("ice", info.socketId, data.candidate);
        },
        (data) => {
          obj.stream = data.stream;
        }
      );

      var offer = await obj.peerConnection.createOffer();
      obj.peerConnection.setLocalDescription(offer);

      this.peerConnections.push(obj);
      console.log("sent the offer");
      // 내가 가진 offer을 전송
      socket.emit("offer", info.socketId, offer);
      return;
    });

    // socket.on("welcome", async () => {
    //   const offer = await this.myPeerConnection.createOffer();
    //   this.myPeerConnection.setLocalDescription(offer);
    //   console.log("sent the offer");
    //   socket.emit("offer", offer, this.roomName);
    // });

    // 기존 입장한 유저가 보낸 offer를 받고 답장을 보냄.
    // 서버에서 전송된 데이터 ({ socketId: socket.id, name: socket.user.name }, offer)
    socket.on("offer", async (info, inOffer) => {
      var peerConnection;
      var obj = {
        socketId: info.socketId,
        name: info.name,
        peerConnection: peerConnection,
      };

      await this.makeConnection(
        obj,
        (data) => {
          console.log("offer/sent candidate " + data.candidate);
          socket.emit("ice", info.socketId, data.candidate);
        },
        (data) => {
          obj.stream = data.stream;
        }
      );

      await obj.peerConnection.setRemoteDescription(inOffer);
      const answer = await obj.peerConnection.createAnswer();
      await obj.peerConnection.setLocalDescription(answer);

      this.peerConnections.push(obj);

      console.log("sent the answer");
      socket.emit("answer", info.socketId, answer);
    });

    // socket.on("offer", async (offer) => {
    //   console.log("received the offer");
    //   this.myPeerConnection.setRemoteDescription(offer);
    //   const answer = await this.myPeerConnection.createAnswer();
    //   this.myPeerConnection.setLocalDescription(answer);
    //   socket.emit("answer", answer, this.roomName);
    //   console.log("sent the answer");
    // });

    // ({ socketId: socket.id, name: socket.user.name }, answer)
    socket.on("answer", async (info, answer) => {
      var obj = this.peerConnections.find((item) => {
        return item.socketId == info.socketId;
      });
      console.log("received the answer");
      // await obj.peerConnection.setRemoteDescription(answer);
      if (obj.peerConnection.signalingState != "stable") {
        await obj.peerConnection.setRemoteDescription(answer);
      }
    });

    // ({ socketId: socket.id, name: socket.user.name }, ice)
    socket.on("ice", async (info, ice) => {
      console.log("received candidate");
      var obj = this.peerConnections.find((item) => {
        return item.socketId == info.socketId;
      });

      await obj.peerConnection.addIceCandidate(ice);

      // if (obj.peerConnection.remoteDescription && ice) {
      //   await obj.peerConnection.addIceCandidate(ice);
      // }
    });

    // socket.on("answer", (answer) => {
    //   console.log("received the answer");
    //   this.myPeerConnection.setRemoteDescription(answer);
    // });

    // socket.on("ice", (ice) => {
    //   console.log("received candidate");
    //   this.myPeerConnection.addIceCandidate(ice);
    // });

    socket.on("not_room_auth", () => {
      alert("방에 접속할 수 없습니다.");
      this.$router.push("/");
    });

    socket.on("not_auth", () => {
      alert("로그인이 필요합니다.");
      this.$router.push("/");
    });

    socket.on("disconnect", () => {
      // alert("서버와 연결이 끊켰습니다.");
      console.log("disconnect");
    });
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
      if (this.myPeerConnection !== null) {
        this.myPeerConnection.close();
      }
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
          this.camerasList.push({ name: camera.label, value: camera.deviceId });
          if (currentCamera.label == camera.label) {
            this.camerasSelect = camera.label;
          }
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
        this.myStream = await navigator.mediaDevices
          .getUserMedia(deviceId ? cameraConstraints : initialConstrains)
          .catch((err) => {
            console.log(err);
          });
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
        // this.muteBtn.innerText = "Unmute";
        this.muted = true;
      } else {
        // this.muteBtn.innerText = "Mute";
        this.muted = false;
      }
    },
    handleCameraClick() {
      this.myStream
        .getVideoTracks()
        .forEach((track) => (track.enabled = !track.enabled));
      if (this.cameraOff) {
        // this.cameraBtn.innerText = "Turn Camera Off";
        this.cameraOff = false;
      } else {
        // this.cameraBtn.innerText = "Turn Camera On";
        this.cameraOff = true;
      }
    },
    async handleCameraChange(event) {
      await this.getMedia(event.target.value);
      if (this.myPeerConnection) {
        const videoTrack = this.myStream.getVideoTracks()[0];
        const videoSender = this.myPeerConnection
          .getSenders()
          .find((sender) => sender.track.kind === "video");
        videoSender.replaceTrack(videoTrack);
      }
    },
    // RTC Code
    makeConnection(obj, handleIce, handleAddStream) {
      console.log("webRTC start");
      obj.peerConnection = new RTCPeerConnection({
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
      obj.peerConnection.addEventListener("icecandidate", handleIce);
      obj.peerConnection.addEventListener("addstream", handleAddStream);
      this.myStream.getTracks().forEach((track) => {
        obj.peerConnection.addTrack(track, this.myStream);
      });
    },
    handleIce(data) {
      console.log("sent candidate");
      socket.emit("ice", this.roomName, data.candidate);
    },
    handleAddStream(data) {
      // const peersStream = document.querySelector("#peerFace");

      // peersStream.srcObject = data.stream;
      this.peerStream = data.stream;
    },
    /**
     * 입장 가능한 유저의 정보를 서버에 전송한다.
     */
    sendAuthUser() {
      socket.emit(
        "setAuthUser",
        this.authUserEmail,
        this.roomName,
        (result) => {
          if (result === true) {
            alert("등록되었습니다.");
          } else {
            alert("등록에 실패하였습니다.");
          }
        }
      );
    },
  },
};
</script>
