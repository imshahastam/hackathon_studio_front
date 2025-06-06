<template>
  <div class="pt-[20px]">
    <div
      class="d-flex flex-column flex-shrink-0 p-3 text-white bg-secondary"
      style="width: 260px; min-height: 100vh"
    >
      <router-link
        to="/judge"
        class="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none"
      >
        <svg class="bi me-2" width="40" height="32">
          <use xlink:href="#bootstrap" />
        </svg>
        <span class="fs-4 text-center">JUDGE</span>
      </router-link>
      <ul class="nav nav-pills flex-column mb-auto">
        <li class="nav-item">
          <router-link
            to="/judge/invitations"
            class="nav-link text-white bg-black"
            aria-current="page"
          >
            <i class="bi bi-speedometer2 me-2"></i>
            Invitations
          </router-link>
        </li>
        <li>
          <router-link to="/judge/my-hackathons" class="nav-link text-white"
            ><i class="bi bi-people me-2"></i>Assigned Hackathons</router-link
          >
        </li>
        <li>
          <router-link to="/judge/scores" class="nav-link text-white"
            ><i class="bi bi-grid-3x3-gap me-2"></i>My Scores</router-link
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
