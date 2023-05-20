import { reactive } from "vue";
import { io } from "socket.io-client";

export const state = reactive({
  connected: false,
  fooEvents: [],
  barEvents: [],
});

const URL =
  process.env.NODE_ENV === "production"
    ? undefined
    : process.env.VUE_APP_SERVER_URL;

export const socket = io(URL);

// socket.on("connect", () => {
//   console.log(URL);
//   state.connected = true;
//   console.log("ok");
// });

// socket.on("disconnect", () => {
//   state.connected = false;
//   console.log("disconnect");
// });

// socket.on("foo", (...args) => {
//   state.fooEvents.push(args);
// });

// socket.on("bar", (...args) => {
//   state.barEvents.push(args);
// });
