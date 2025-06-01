<template>
  <div id="app">
    <NavbarComponent />

    <div class="pt-[30px]">
      <router-view />
    </div>

    <FooterComponent />
  </div>
</template>

<script>
import NavbarComponent from "./components/NavbarComponent.vue";
import FooterComponent from "./components/AppFooter.vue";
import "./assets/tailwind.css";

export default {
  name: "App",
  components: {
    NavbarComponent,
    FooterComponent,
  },
};
</script>

<style>
* {
  font-family: "Tomorrow", sans-serif;
}
</style>
