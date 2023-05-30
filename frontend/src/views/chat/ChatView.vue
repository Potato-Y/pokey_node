<template>
  <div>
    <!--<div class="info">-->
    <!--  <p><b>UserName</b>-->

    <!--    <button id="connect" class="logout" type="submit">Login</button>-->
    <!--    <button id="disconnect" class="logout" type="submit" disabled="disabled">Logout</button>-->
    <!--  </p>-->

    <!--</div>-->

    <div class="container clearfix">
      <div class="people-list" id="people-list">
        <div class="search">
          <input type="text" placeholder="search" />
          <i class="fa fa-search"></i>
        </div>
        <ul class="list">
          <li class="clearfix">
            <div class="about">
              <div class="name">Talk for 4th Team</div>
              <div class="status">
                <i class="fa fa-circle online"></i> online
              </div>
            </div>
          </li>
        </ul>

        <!--    <nav role="navigation">-->
        <!--      <div id="menuToggle2">-->
        <!--        <input type="checkbox" />-->

        <!--        <span></span>-->
        <!--        <span></span>-->
        <!--        <span></span>-->
        <!--        <ul id="menu2">-->
        <!--          <div class="menuroom">-->
        <!--            <input class="roomin" type="text" required>-->
        <!--            <label class="roomla">Room Name</label>-->
        <!--            <span class="roomsp"></span>-->
        <!--          </div>-->
        <!--          <div class="menuroom">-->
        <!--            <input class="roomin" type="text" required>-->
        <!--            <label class="roomla">Room passwd</label>-->
        <!--            <span class="roomsp"></span>-->
        <!--          </div>-->
        <!--          <button class="createroombtn" type="button">CREATE</button>-->
        <!--        </ul>-->
        <!--      </div>-->
        <!--    </nav>-->

        <!--            <li class="clearfix">-->
        <!--                <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/195612/chat_avatar_02.jpg" alt="avatar" />-->
        <!--                <div class="about">-->
        <!--                    <div class="name">Aiden Chavez</div>-->
        <!--                    <div class="status">-->
        <!--                        <i class="fa fa-circle offline"></i> left 7 mins ago-->
        <!--                    </div>-->
        <!--                </div>-->
        <!--            </li>-->

        <!--            <li class="clearfix">-->
        <!--                <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/195612/chat_avatar_03.jpg" alt="avatar" />-->
        <!--                <div class="about">-->
        <!--                    <div class="name">Mike Thomas</div>-->
        <!--                    <div class="status">-->
        <!--                        <i class="fa fa-circle online"></i> online-->
        <!--                    </div>-->
        <!--                </div>-->
        <!--            </li>-->

        <!--            <li class="clearfix">-->
        <!--                <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/195612/chat_avatar_04.jpg" alt="avatar" />-->
        <!--                <div class="about">-->
        <!--                    <div class="name">Erica Hughes</div>-->
        <!--                    <div class="status">-->
        <!--                        <i class="fa fa-circle online"></i> online-->
        <!--                    </div>-->
        <!--                </div>-->
        <!--            </li>-->

        <!--            <li class="clearfix">-->
        <!--                <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/195612/chat_avatar_05.jpg" alt="avatar" />-->
        <!--                <div class="about">-->
        <!--                    <div class="name">Ginger Johnston</div>-->
        <!--                    <div class="status">-->
        <!--                        <i class="fa fa-circle online"></i> online-->
        <!--                    </div>-->
        <!--                </div>-->
        <!--            </li>-->

        <!--            <li class="clearfix">-->
        <!--                <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/195612/chat_avatar_06.jpg" alt="avatar" />-->
        <!--                <div class="about">-->
        <!--                    <div class="name">Tracy Carpenter</div>-->
        <!--                    <div class="status">-->
        <!--                        <i class="fa fa-circle offline"></i> left 30 mins ago-->
        <!--                    </div>-->
        <!--                </div>-->
        <!--            </li>-->

        <!--            <li class="clearfix">-->
        <!--                <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/195612/chat_avatar_07.jpg" alt="avatar" />-->
        <!--                <div class="about">-->
        <!--                    <div class="name">Christian Kelly</div>-->
        <!--                    <div class="status">-->
        <!--                        <i class="fa fa-circle offline"></i> left 10 hours ago-->
        <!--                    </div>-->
        <!--                </div>-->
        <!--            </li>-->

        <!--            <li class="clearfix">-->
        <!--                <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/195612/chat_avatar_08.jpg" alt="avatar" />-->
        <!--                <div class="about">-->
        <!--                    <div class="name">Monica Ward</div>-->
        <!--                    <div class="status">-->
        <!--                        <i class="fa fa-circle online"></i> online-->
        <!--                    </div>-->
        <!--                </div>-->
        <!--            </li>-->

        <!--            <li class="clearfix">-->
        <!--                <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/195612/chat_avatar_09.jpg" alt="avatar" />-->
        <!--                <div class="about">-->
        <!--                    <div class="name">Dean Henry</div>-->
        <!--                    <div class="status">-->
        <!--                        <i class="fa fa-circle offline"></i> offline since Oct 28-->
        <!--                    </div>-->
        <!--                </div>-->
        <!--            </li>-->

        <!--            <li class="clearfix">-->
        <!--                <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/195612/chat_avatar_10.jpg" alt="avatar" />-->
        <!--                <div class="about">-->
        <!--                    <div class="name">Peyton Mckinney</div>-->
        <!--                    <div class="status">-->
        <!--                        <i class="fa fa-circle online"></i> online-->
        <!--                    </div>-->
        <!--                </div>-->
        <!--            </li>-->
        <!--        </ul>-->
      </div>

      <div class="video">
        <div class="video-history">
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

        <div class="video-message clearfix">
          <i class="fa fa-file-o"></i> &nbsp;&nbsp;&nbsp;
          <i class="fa fa-file-image-o"></i>
        </div>
        <!-- 내 화면 추가-->
        <div id="myStream">
          <video
            id="myFace"
            autoplay
            playsinline
            width="400"
            height="400"
          ></video>
        </div>

        <!--    <div class="toggle">-->
        <!--      <div class="togglebtn">-->
        <!--        <p><b>Mic On</b></p>-->
        <!--      </div>-->
        <!--      <div class="togglebtn">-->
        <!--        <input type="checkbox" id="togglech" hidden>-->
        <!--        <label for="togglech" class="toggleSwitch">-->
        <!--          <span class="toggleButton"></span>-->
        <!--        </label>-->
        <!--      </div>-->

        <!--      <div class="togglebtn">-->
        <!--        <p><b>Video On</b></p>-->
        <!--      </div>-->
        <!--      <div class="togglebtn">-->
        <!--        <input type="checkbox" id="togglech2" hidden>-->
        <!--        <label for="togglech2" class="toggleSwitch blue">-->
        <!--          <span class="toggleButton"></span>-->
        <!--        </label>-->
        <!--      </div>-->
        <!--    </div>-->
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
          <!--            <ul>-->
          <!--                <li class="clearfix">-->
          <!--                    <div class="message-data align-right">-->
          <!--                        <span class="message-data-time" >10:10 AM, Today</span> &nbsp; &nbsp;-->
          <!--                        <span class="message-data-name" >Olia</span> <i class="fa fa-circle me"></i>-->

          <!--                    </div>-->
          <!--                    <div class="message other-message float-right">-->
          <!--                        Hi Vincent, how are you? How is the project coming along?-->
          <!--                    </div>-->
          <!--                </li>-->

          <!--                <li>-->
          <!--                    <div class="message-data">-->
          <!--                        <span class="message-data-name"><i class="fa fa-circle online"></i> Vincent</span>-->
          <!--                        <span class="message-data-time">10:12 AM, Today</span>-->
          <!--                    </div>-->
          <!--                    <div class="message my-message">-->
          <!--                        Are we meeting today? Project has been already finished and I have results to show you.-->
          <!--                    </div>-->
          <!--                </li>-->

          <!--                <li class="clearfix">-->
          <!--                    <div class="message-data align-right">-->
          <!--                        <span class="message-data-time" >10:14 AM, Today</span> &nbsp; &nbsp;-->
          <!--                        <span class="message-data-name" >Olia</span> <i class="fa fa-circle me"></i>-->

          <!--                    </div>-->
          <!--                    <div class="message other-message float-right">-->
          <!--                        Well I am not sure. The rest of the team is not here yet. Maybe in an hour or so? Have you faced any problems at the last phase of the project?-->
          <!--                    </div>-->
          <!--                </li>-->

          <!--                <li>-->
          <!--                    <div class="message-data">-->
          <!--                        <span class="message-data-name"><i class="fa fa-circle online"></i> Vincent</span>-->
          <!--                        <span class="message-data-time">10:20 AM, Today</span>-->
          <!--                    </div>-->
          <!--                    <div class="message my-message">-->
          <!--                        Actually everything was fine. I'm very excited to show this to our team.-->
          <!--                    </div>-->
          <!--                </li>-->

          <!--                <li>-->
          <!--                    <div class="message-data">-->
          <!--                        <span class="message-data-name"><i class="fa fa-circle online"></i> Vincent</span>-->
          <!--                        <span class="message-data-time">10:31 AM, Today</span>-->
          <!--                    </div>-->
          <!--                    <i class="fa fa-circle online"></i>-->
          <!--                    <i class="fa fa-circle online" style="color: #AED2A6"></i>-->
          <!--                    <i class="fa fa-circle online" style="color:#DAE9DA"></i>-->
          <!--                </li>-->

          <!--            </ul>-->
        </div>
        <!-- end chat-history -->

        <div class="chat-message clearfix">
          <form>
            <textarea
              name="message-to-send"
              id="name"
              class="form-control"
              placeholder="Type your message"
              rows="3"
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

    <!--    <script id="message-template" type="text/x-handlebars-template">-->
    <!--      <li class="clearfix">-->
    <!--        <div class="message-data align-right">-->
    <!--          <span class="message-data-time" >{{time}}, Today</span> &nbsp; &nbsp;-->
    <!--          <span class="message-data-name" >Olia</span> <i class="fa fa-circle me"></i>-->
    <!--        </div>-->
    <!--        <div class="message other-message float-right">-->
    <!--          {{messageOutput}}-->
    <!--        </div>-->
    <!--      </li>-->
    <!--    </script>-->

    <!--    <script id="message-response-template" type="text/x-handlebars-template">-->
    <!--      <li>-->
    <!--        <div class="message-data">-->
    <!--          <span class="message-data-name"><i class="fa fa-circle online"></i> Vincent</span>-->
    <!--          <span class="message-data-time">{{time}}, Today</span>-->
    <!--        </div>-->
    <!--        <div class="message my-message">-->
    <!--          {{response}}-->
    <!--        </div>-->
    <!--      </li>-->
    <!--    </script>-->

    <!--    <script>-->
    <!--      (function(){var w=window;if(w.ChannelIO){return w.console.error("ChannelIO script included twice.")}var ch=function(){ch.c(arguments)};ch.q=[];ch.c=function(args){ch.q.push(args)};w.ChannelIO=ch;function l(){if(w.ChannelIOInitialized){return}w.ChannelIOInitialized=true;var s=document.createElement("script");s.type="text/javascript";s.async=true;s.src="https://cdn.channel.io/plugin/ch-plugin-web.js";var x=document.getElementsByTagName("script")[0];if(x.parentNode){x.parentNode.insertBefore(s,x)}}if(document.readyState==="complete"){l()}else{w.addEventListener("DOMContentLoaded",l);w.addEventListener("load",l)}})();-->

    <!--      ChannelIO('boot', {-->
    <!--        "pluginKey": "f6a1d323-f36a-493b-acba-327ebed4a2e6"-->
    <!--      });-->
    <!--    </script>-->

    <div id="footer">
      <div class="footer">
        <nav role="navigation">
          <div id="menuToggle">
            <input type="checkbox" />

            <span></span>
            <span></span>
            <span></span>
            <ul id="menu">
              <div class="menuroom">
                <input class="roomin" type="text" required />
                <label class="roomla">Room Name</label>
                <span class="roomsp"></span>
              </div>
              <div class="menuroom">
                <input class="roomin" type="text" required />
                <label class="roomla">Room passwd</label>
                <span class="roomsp"></span>
              </div>
              <button class="createroombtn" type="button">CREATE</button>
            </ul>
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
          <b>UserName</b>

          <button id="connect" class="logout" type="submit">Login</button>
          <button
            id="disconnect"
            class="logout"
            type="submit"
            disabled="disabled"
          >
            Logout
          </button>
        </p>
      </div>
    </div>
  </div>
</template>
<script>
import { socket } from "@/socket";
//import PeerVideo from "@/components/PeerVideo.vue";

export default {
  name: "ChatView",
  components: {
    //PeerVideo,
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
    socket.on("trans_return", (info, translation) => {
      console.log(`${info.name}: ${translation}`);
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
  },
};
</script>
<style>
@import url("./chat.css");
</style>
