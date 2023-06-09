<template>
  <div>
    <div class="container clearfix">
      <div class="people-list" id="people-list">
        <ul class="list">
          <div v-for="(item, index) in reversedTransList" :key="index">
            <li class="clearfix">
              <div class="about">
                <div class="name">{{ item.name }}</div>
                <div class="status">
                  <i class="fa online"></i> {{ item.translation }}
                </div>
              </div>
            </li>
            <br />
          </div>
        </ul>

        <div class="wrap">
          <button class="smbtn" @click="download">Download</button>
        </div>
      </div>

      <div class="video">
        <div class="video-history">
          <!-- 상대 화면 추가 -->
          <div>
            <video
              id="big-peer-face"
              autoplay
              playsinline
              width="665"
              height="543"
            ></video>
          </div>
        </div>

        <div class="video-message clearfix">
          <!-- 내 화면 추가-->
          <div id="myStream">
            <video id="myFace" autoplay playsinline height="142"></video>
          </div>

          <peer-video
            :id="'peerFace-' + index"
            v-for="(item, index) in peerConnections"
            :key="index"
            :stream="item.stream"
            :click="videoClick"
          ></peer-video>
          <div v-for="(item, index) in dummy" :key="index">
            <div></div>
          </div>
          <i class="fa fa-file-o"></i> &nbsp;&nbsp;&nbsp;
          <i class="fa fa-file-image-o"></i>
        </div>
      </div>

      <div class="chat" id="talk">
        <div class="chat-header clearfix">
          <div class="chat-about">
            <div class="chat-with">___Chatting Room</div>
            <div class="chat-num-messages">maessages's number</div>
          </div>
          <i class="fa fa-star"></i>
        </div>
        <!-- end chat-header -->

        <div class="chat-history" id="greetings">
          <ul id="message-ul">
            <!--                        텍스트 채팅 내용-->
          </ul>
        </div>
        <!-- end chat-history -->

        <div class="chat-message clearfix">
          <form id="input-message">
            <textarea
              name="message-to-send"
              id="text-message"
              v-model="text"
              class="form-control"
              placeholder="Type your message"
              rows="3"
              @keydown.enter.exact.prevent="msgSubmit"
            ></textarea>
          </form>

          <i class="fa fa-file-o"></i> &nbsp;&nbsp;&nbsp;
          <i class="fa fa-file-image-o"></i>

          <button class="btn btn-default" type="submit" id="send">Send</button>
        </div>
        <!-- end chat-message -->
      </div>
      <!-- end chat -->
    </div>
    <!-- end container -->
    <div id="footer">
      <div class="footer">
        <nav role="navigation">
          <div id="menuToggle">
            <input class="menuinput" type="checkbox" />

            <span class="menuspan"></span>
            <span class="menuspan"></span>
            <span class="menuspan"></span>
            <div id="menu">
              <div class="menutop">
                <!-- 등록한 이메일 리스트 -->
                <div
                  id="peremail"
                  v-for="(email, index) in authUserEmails"
                  :key="index"
                >
                  <div class="inputs">
                    <div class="group">
                      <label class="loginlabel">{{ email }}</label>
                    </div>
                  </div>

                  <div class="wrap">
                    <button class="smbtn" @click="sendDeleteAuthUser(email)">
                      ✖
                    </button>
                  </div>
                </div>
              </div>
              <div class="inputs">
                <div class="group">
                  <input
                    type="email"
                    v-model="inputEmail"
                    required
                    class="logininput"
                  />
                  <span class="highlight"></span>
                  <span class="bar"></span>
                  <label class="loginlabel">Email</label>
                </div>
              </div>

              <div class="wrap">
                <button class="smbtn" @click="sendAuthUser">+</button>
              </div>
            </div>
          </div>
        </nav>
      </div>

      <div class="ft-toggle">
        <div class="toggle">
          <div class="togglebtn">
            <p><b>Mic On</b></p>
          </div>
          <div class="togglebtn">
            <input
              type="checkbox"
              id="togglech"
              hidden
              @click="handleMuteClick"
            />
            <label for="togglech" class="toggleSwitch">
              <span class="toggleButton"></span>
            </label>
          </div>

          <div class="togglebtn">
            <p><b>Video On</b></p>
          </div>
          <div class="togglebtn">
            <input
              type="checkbox"
              id="togglech2"
              hidden
              @click="handleCameraClick"
            />
            <label for="togglech2" class="toggleSwitch blue">
              <span class="toggleButton"></span>
            </label>
          </div>
        </div>
      </div>
      <div class="info">
        <p>
          <b>{{ this.$store.state.name }}</b>
        </p>
      </div>
    </div>
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
      authUserEmails: [],
      inputEmail: "",
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
      text: "",
      textCount: 0,
      currentTime: "",
      transList: [],
    };
  },
  created() {
    setInterval(() => {
      this.currentTime = new Date().toLocaleTimeString();
    }, 1000);
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

      this.transList.push({
        date: date,
        name: info.name,
        translation: translation,
      });
      // console.log(`[${getDate}] ${info.name}: ${translation}`);
    });

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

    // text chat
    socket.on("new_message", async (info, msg) => {
      const userName = info.name;
      this.addMessageYours(userName, msg, this.textCount);
      const focus = document.getElementById("focus" + this.textCount);
      focus.scrollIntoView({ behavior: "smooth" });
      this.textCount++;
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
    sendAuthUser(event) {
      event.preventDefault();

      this.authUserEmails.push(this.inputEmail);

      this.socketAuthEmit();
    },

    sendDeleteAuthUser(email) {
      this.authUserEmails = this.authUserEmails.filter(
        (value) => value !== email
      );
      this.socketAuthEmit();
    },

    socketAuthEmit() {
      socket.emit(
        "setAuthUser",
        this.authUserEmails,
        this.roomName,
        (result) => {
          if (result === true) {
            alert("처리되었습니다.");
            this.inputEmail = "";
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

          this.transList.push({
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
    msgSubmit(event) {
      event.preventDefault();
      const inputMsg = document.getElementById("input-message");
      const input = inputMsg.querySelector("textarea");
      const text = input.value;

      if (event) {
        socket.emit("new_message", text, this.roomName, () => {
          this.addMessageMine(`나`, `${text}`, this.textCount);
          this.text = ""; // 초기화
          const focus = document.getElementById("focus" + this.textCount);
          focus.scrollIntoView({ behavior: "smooth" });
          this.textCount++;

          this.$refs.focus.scrollIntoView({ behavior: "smooth" });
        });
      }
    },
    addMessageMine(user, message, count) {
      const msg = document.getElementById("message-ul");

      msg.innerHTML =
        msg.innerHTML +
        `<li id="focus${count}"` +
        ' class="cleardot">\n' +
        '                              <div class="message-data align-right">\n' +
        '                                  <span class="message-data-time" >' +
        this.currentTime +
        "</span> &nbsp; &nbsp;\n" +
        '                                  <span class="message-data-name" >' +
        user +
        '</span> <i class="fa me"></i>\n' +
        "\n" +
        "                              </div>\n" +
        '                              <div class="message other-message float-right">\n' +
        message +
        "                              </div>\n" +
        "                          </li>";
    },
    addMessageYours(user, message, count) {
      const msg = document.getElementById("message-ul");

      msg.innerHTML =
        msg.innerHTML +
        `<li id="focus${count}"` +
        ' class="cleardot">\n' +
        '                              <div class="message-data">\n' +
        '                                  <span class="message-data-name"><i class="fa online"></i>' +
        user +
        "</span>\n" +
        '                                  <span class="message-data-time">' +
        this.currentTime +
        "</span>\n" +
        "                              </div>\n" +
        '                              <div class="message my-message">\n' +
        message +
        "                              </div>\n" +
        "                          </li>";
    },
    videoClick(item) {
      const bigPeerFace = document.querySelector("#big-peer-face");
      bigPeerFace.srcObject = item;
    },
    download() {
      txtDownload(this.roomName, this.transList);
    },
  },
  computed: {
    reversedTransList() {
      return this.transList.slice().reverse();
    },
  },
};
</script>
<style>
@import url("./chat.css");
</style>
