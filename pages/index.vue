<template>
  <div>
    <section
      class="home bg-no-repeat h-screen bg-center bg-fixed my-0 mx-auto min-h-screen d-flex justify-center items-center"
    >
      <div class="w-full h-full flex flex-col justify-end items-center">
        <h1 class="title md:text-9xl text-center text-6xl text-white font-bold mb-10 uppercase">
          Rick and Morty
        </h1>
        <div class="flex justify-between mb-5">
          <div
            v-for="(count, index) in counts"
            :key="index"
            class="flex flex-col justify-start items-center p-2"
          >
            <div class="iCountUp text-2xl text-white font-extrabold">
              <ICountUp :end-val="count.total" :options="options" />
            </div>
            <small class="text-white text-center"
              >Total of {{ count.char.toUpperCase() }}'s in the names of all
              {{ count.table }}</small
            >
          </div>
          <div v-if="totalTime > 0" class="flex flex-col justify-start items-center p-2">
            <p class="block text-white font-extrabold text-2xl">{{ totalTime }}s</p>
            <small class="text-white">Total time</small>
          </div>
        </div>
      </div>
    </section>
    <section>
      <div>
        <h2>dasfasdf</h2>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Totam, vero voluptatem quae
          accusamus soluta debitis nam consequatur reprehenderit odit magnam incidunt quod obcaecati
          enim voluptas, voluptatibus laborum mollitia! Doloremque, quaerat!
        </p>
      </div>
    </section>
  </div>
</template>

<script>
import ICountUp from "vue-countup-v2";
import challengeService from "../services/challengeService.js";
export default {
  components: { ICountUp },
  data() {
    return {
      counts: [],
      totalTime: 0,
      options: {
        useEasing: true,
        useGrouping: true,
        separator: ",",
        decimal: ".",
        prefix: "",
        suffix: "",
      },
    };
  },
  async created() {
    const { counts, totalTime } = await challengeService.getCounters();
    this.counts = counts;
    this.totalTime = totalTime;
  },
};
</script>

<style>
.home {
  background-image: url("../assets/rick-and-morty-full.jpg");
}
.title {
  font-family: "Quicksand", "Source Sans Pro", "-apple-system", "BlinkMacSystemFont", "Segoe UI",
    "Roboto", "Helvetica Neue", Arial, sans-serif;
  letter-spacing: 1px;
}
</style>
