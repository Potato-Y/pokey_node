<template>
  <div>
    <li class="cleardot">
      <div class="message-data align-right">
        <span class="message-data-time">
          {{ currentTime }}
        </span>
        &nbsp; &nbsp;
        <span class="message-data-name">
          {{ user }}
        </span>
        <i class="fa me"></i>
      </div>

      <div class="message other-message float-right">
        {{ message }}
      </div>
    </li>
  </div>
</template>

<script>
export default {
  name: "MyBubble",
  props: ["user", "message", "currentTime"],
};
</script>
