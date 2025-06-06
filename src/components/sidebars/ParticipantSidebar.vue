<template>
  <div class="pt-[20px]">
    <div
      class="d-flex flex-column flex-shrink-0 p-3 text-white bg-primary"
      style="width: 260px; min-height: 100vh"
    >
      <router-link
        to="/participant"
        class="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none"
      >
        <svg class="bi me-2" width="40" height="32">
          <use xlink:href="#bootstrap" />
        </svg>
        <span class="fs-4">PARTICIPANT</span>
      </router-link>
      <hr />
      <ul class="nav nav-pills flex-column mb-auto">
        <li class="nav-item">
          <router-link
            to="/participant/hackathons"
            class="nav-link text-white bg-black"
            aria-current="page"
          >
            <i class="bi bi-speedometer2 me-2"></i>
            My Hackathons
          </router-link>
        </li>
        <li>
          <router-link to="/participant/teams" class="nav-link text-white"
            ><i class="bi bi-people me-2"></i>My Team</router-link
          >
        </li>
        <li>
          <router-link to="/participant/rating" class="nav-link text-white"
            ><i class="bi bi-grid-3x3-gap me-2"></i>Leaderboard</router-link
          >
        </li>
      </ul>
      <hr />
      <button class="btn btn-outline-light" @click="$emit('logout')">
        Logout
      </button>
    </div>
  </div>
</template>

<style scoped></style>
