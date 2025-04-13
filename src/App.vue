<template>
  <div id="app">
    <NavbarComponent />
    <div class="container mt-5 pt-5">
      <router-view />
    </div>
  </div>
</template>

<script>
import NavbarComponent from "./components/Navbar.vue";
export default {
  name: "App",
  components: {
    NavbarComponent,
  },
};
</script>

<style>
* {
  font-family: "Montserrat", sans-serif;
}
</style>
