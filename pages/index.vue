<template>
  <div class="home my-0 mx-auto min-h-screen flex justify-center items-center">
    <h1 class="title text-center">Chipax Challenger</h1>
  </div>
</template>

<script>
import challengeService from "../services/challengeService.js";
export default {
  async created() {
    await challengeService.getCounters();
  },
};
</script>

<style>
.home {
  background-image: url("../assets/wallpapertip_rick-and-morty-wallpaper_11371.jpg");
  background-attachment: fixed;
  background-repeat: no-repeat;
  background-position: center;
}
.title {
  font-family: "Quicksand", "Source Sans Pro", "-apple-system", "BlinkMacSystemFont", "Segoe UI",
    "Roboto", "Helvetica Neue", Arial, sans-serif;
  display: block;
  font-weight: 900;
  text-shadow: 0.5rem 0.5rem aquamarine;
  font-size: 8rem;
  color: #1db985;
  letter-spacing: 1px;
}
</style>
