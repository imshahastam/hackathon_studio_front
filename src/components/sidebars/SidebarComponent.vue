<!-- src/components/SidebarComponent.vue -->
<template>
  <div class="pt-[20px]">
    <div
      class="d-flex flex-column flex-shrink-0 p-3 text-white bg-dark"
      style="width: 260px; position: sticky; top: 0; height: 100vh"
    >
      <router-link
        to="/dashboard"
        class="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none"
      >
        <svg class="bi me-2" width="40" height="32">
          <use xlink:href="#bootstrap" />
        </svg>
        <span class="fs-4">DASHBOARD</span>
      </router-link>
      <hr />
      <ul class="nav nav-pills flex-column mb-auto">
        <li class="nav-item">
          <router-link
            to="/dashboard"
            class="nav-link active text-white"
            aria-current="page"
          >
            <i class="bi bi-house-door me-2"></i>
            Main
          </router-link>
        </li>
        <li>
          <router-link to="/my-hackathons" class="nav-link text-white">
            <i class="bi bi-speedometer2 me-2"></i>
            Hackathons
          </router-link>
        </li>
        <li>
          <router-link to="/judges" class="nav-link text-white">
            <i class="bi bi-people me-2"></i>
            Judges
          </router-link>
        </li>
        <li>
          <router-link to="/my-hackathons-teams" class="nav-link text-white">
            <i class="bi bi-grid-3x3-gap me-2"></i>
            Teams
          </router-link>
        </li>
      </ul>
      <hr />
      <div class="dropdown">
        <a
          href="#"
          class="d-flex align-items-center text-white text-decoration-none dropdown-toggle"
          id="dropdownUser1"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <img
            src="https://avatars.githubusercontent.com/u/1?v=4"
            alt=""
            width="32"
            height="32"
            class="rounded-circle me-2"
          />
          <strong>mdo</strong>
        </a>
        <ul
          class="dropdown-menu dropdown-menu-dark text-small shadow"
          aria-labelledby="dropdownUser1"
        >
          <li>
            <router-link class="dropdown-item" to="/hackathons/create"
              >new hackathon</router-link
            >
          </li>
          <li><a class="dropdown-item" href="#">settings</a></li>
          <li><a class="dropdown-item" href="#">profile</a></li>
          <li><hr class="dropdown-divider" /></li>
          <li>
            <a class="dropdown-item" href="#" @click="$emit('logout')"
              >log out</a
            >
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
