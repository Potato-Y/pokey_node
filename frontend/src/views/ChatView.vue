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
      <!-- 상대 화면 추가 -->
      <div>
        <peer-video
          :id="'peerFace-' + index"
          v-for="(item, index) in peerConnections"
          :key="index"
          :stream="item.stream"
        ></peer-video>
        <div v-for="(item, index) in dummy" :key="index">
          <div></div>
        </div>
      </div>
    </div>
    <button @click="download">지금까지의 대화 내용 다운로드</button>
    <button @click="disconnect">disconnect</button>
  </div>
</template>

<script>
import { socket } from "@/socket";
import PeerVideo from "@/components/PeerVideo.vue";
import txtDownload from "@/util/txtToProceedings.js";

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
      /**
       * 상태 변경을 위해 더미 변수 추가
       */
      dummy: [0],
      recognition: null,
      txt: [],
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
        this.setStt();
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
          this.dummy[0]++;
        },
        (event) => {
          const state = event.target;
          if (
            state.iceConnectionState === "disconnected" ||
            state.iceConnectionState === "closed"
          ) {
            // 상대 피어의 연결이 닫힌 경우 실행
            this.peerConnections = this.peerConnections.filter((item) => {
              return item.socketId !== info.socketId;
            });
          }
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
          this.dummy[0]++;
        }
      );

      await obj.peerConnection.setRemoteDescription(inOffer);
      const answer = await obj.peerConnection.createAnswer();
      await obj.peerConnection.setLocalDescription(answer);

      this.peerConnections.push(obj);

      console.log("sent the answer");
      socket.emit("answer", info.socketId, answer);
    });

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
    });

    // { socketId: socket.id, name: socket.user.name }, translation
    socket.on("trans_return", (info, date, translation) => {
      // var language = this.$store.state.language;
      // var country = this.$store.state.country;

      this.txt.push({
        date: date,
        name: info.name,
        translation: translation,
      });
      // console.log(`[${getDate}] ${info.name}: ${translation}`);
    });

    // socket.on("trans_me", (date, text) => {
    // console.log("!!!trans me!!!!");
    // var language = this.$store.state.language;
    // var country = this.$store.state.country;
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

    socket.on("user_disconnect", (info) => {
      console.log(info.name + "님이 방을 나가셨습니다.");
      this.peerConnections = this.peerConnections.filter((item) => {
        return item.socketId != info.socketId;
      });
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
    // 내가 나갈 때 실행
    disconnect() {
      this.peerConnections.forEach((item) => {
        item.peerConnection.close();
      });
      this.peerConnections = [];

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
        this.muted = true;
        this.recognition.stop();
      } else {
        this.muted = false;
        this.recognition.start();
      }
    },
    handleCameraClick() {
      this.myStream
        .getVideoTracks()
        .forEach((track) => (track.enabled = !track.enabled));
      if (this.cameraOff) {
        this.cameraOff = false;
      } else {
        this.cameraOff = true;
      }
    },
    async handleCameraChange(event) {
      await this.getMedia(event.target.value);

      this.peerConnections.forEach((item) => {
        const videoTrack = this.myStream.getVideoTracks()[0];
        const videoSender = item.peerConnection
          .getSenders()
          .find((sender) => sender.track.kind === "video");
        videoSender.replaceTrack(videoTrack);
      });
    },
    // RTC Code
    makeConnection(
      obj,
      handleIce,
      handleAddStream,
      handleConnectionStateChange
    ) {
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
      obj.peerConnection.addEventListener(
        "iceconnectionstatechange",
        handleConnectionStateChange
      ); // Add event listener for ice connection state change

      this.myStream.getTracks().forEach((track) => {
        obj.peerConnection.addTrack(track, this.myStream);
      });
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

    /**
     * 음성 인식을 설정
     */
    setStt() {
      // eslint-disable-next-line no-undef
      this.recognition = new webkitSpeechRecognition();
      var language = this.$store.state.language;
      var country = this.$store.state.country;

      console.log(`적용 언어: ${language}-${country}`);
      this.recognition.lang = `${language}-${country}`;

      this.recognition.onresult = (event) => {
        const speechResult = event.results[0][0].transcript;
        console.log(`인식 결과 ${speechResult}`);

        // 음소거 중이면 전송하지 않도록
        if (!this.muted) {
          const name = this.$store.state.name;

          const date = new Date();

          this.txt.push({
            date: date,
            name: name,
            translation: speechResult,
          });
          socket.emit("trans", this.roomName, speechResult);
        }
      };

      // this.recognition.onerror = (event) => {
      //   console.log(event.error);
      // };

      this.recognition.onend = () => {
        // console.log("다음 말을 인식합니다.");
        if (this.muted) {
          this.recognition.stop();
        } else {
          this.recognition.start();
        }
      };

      this.recognition.start();
    },
    download() {
      txtDownload(this.roomName, this.txt);
    },
  },
};
</script>
