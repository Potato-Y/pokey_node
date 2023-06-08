import { createRouter, createWebHistory } from "vue-router";
// import HomeView from "../views/HomeView.vue";

const routes = [
  // {
  //   path: "/",
  //   name: "home",
  //   component: HomeView,
  // },
  {
    path: "/",
    name: "main",
    component: () =>
      import(/* webpackChunkName: "main" */ "../views/main/MainView.vue"),
  },
  {
    path: "/about",
    name: "about",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
  },
  {
    path: "/room",
    name: "room",
    component: () =>
      import(/* webpackChunkName: "room" */ "../views/RoomView.vue"),
  },
  {
    path: "/chat",
    name: "chat",
    component: () =>
      import(/* webpackChunkName: "chat" */ "../views/chat/ChatView.vue"),
  },
  {
    path: "/signup",
    name: "signup",
    component: () => import("../views/signup/SignupView.vue"),
  },
  {
    path: "/profile",
    name: "profile",
    component: () => import("../views/profile_edit/ProfileEditView.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
