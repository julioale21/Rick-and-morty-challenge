<template>
  <div>
    <section
      class="home bg-no-repeat h-screen bg-center bg-fixed my-0 mx-auto min-h-screen d-flex justify-center items-center"
    >
      <div class="w-full h-full flex flex-col justify-end items-center">
        <h1
          class="title text-6xl md:text-9xl md: text-lg text-center text-pink-500 font-bold mb-10 uppercase"
          data-aos="fade-up"
          data-aos-delay="500"
        >
          <span>Rick</span>
          <br />
          <span>And</span>
          <br />
          <span>Morty</span>
        </h1>
        <div class="flex justify-between mb-5 md:mb-10">
          <div
            v-for="(count, index) in counts"
            :key="index"
            class="flex flex-col justify-start items-center p-2"
            data-aos="fade-up"
          >
            <div class="iCountUp text-2xl md:text-5xl text-white font-extrabold">
              <ICountUp :end-val="count.total" :options="options" />
            </div>
            <small class="text-white text-center"
              >Total of {{ count.char.toUpperCase() }}'s in the names of all
              {{ count.table }}</small
            >
          </div>
          <div
            v-if="totalTime > 0"
            class="flex flex-col justify-start items-center p-2"
            data-aos="fade-up"
          >
            <p class="block text-white font-extrabold text-2xl md:text-5xl">{{ totalTime }}s</p>
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
      episodes: [],
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
    this.episodes = await challengeService.getAllEpisodesLocations();
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
