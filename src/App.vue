<template>
  <div id="app" class="d-flex flex-column min-vh-100">
    <NavbarComponent />

    <div class="container mt-5 pt-5 flex-grow-1">
      <router-view />
    </div>

    <FooterComponent />
  </div>
</template>

<script>
import NavbarComponent from "./components/Navbar.vue";
import FooterComponent from "./components/AppFooter.vue";

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
  font-family: "Montserrat", sans-serif;
}
</style>
