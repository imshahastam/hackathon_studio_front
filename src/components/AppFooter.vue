<template>
  <footer class="bg-light text-muted py-4 border-top mt-auto">
    <div class="container">
      <div class="row justify-content-between align-items-start">
        <!-- О платформе -->
        <div class="col-md-4 mb-3">
          <h6 class="fw-semibold">Hackathon Studio</h6>
          <p class="small">
            Web-platform for organize and participate in hackathons. Everything
            you need — in one place.
          </p>
        </div>

        <!-- Быстрые ссылки -->
        <div class="col-md-3 mb-3">
          <h6 class="fw-semibold">Links</h6>
          <ul class="list-unstyled small">
            <li>
              <a href="/hackathons" class="text-muted text-decoration-none"
                >Hackathons</a
              >
            </li>
            <li>
              <a href="/dashboard" class="text-muted text-decoration-none"
                >Dashboard</a
              >
            </li>
            <li>
              <a
                href="/create-hackathon"
                class="text-muted text-decoration-none"
                >Create a hackathon</a
              >
            </li>
          </ul>
        </div>

        <!-- Контакты -->
        <div class="col-md-4 mb-3">
          <h6 class="fw-semibold">Contacts</h6>
          <ul class="list-unstyled small">
            <li>
              Email:
              <a
                href="mailto:support@hackplatform.kg"
                class="text-muted text-decoration-none"
                >support@hackstudio.kg</a
              >
            </li>
            <li>
              <a
                href="https://t.me/yourchannel"
                target="_blank"
                class="text-muted text-decoration-none"
                >Telegram</a
              >
            </li>
            <li>
              <a
                href="https://github.com/yourrepo"
                target="_blank"
                class="text-muted text-decoration-none"
                >GitHub</a
              >
            </li>
          </ul>
        </div>
      </div>

      <hr class="my-3" />

      <div class="text-center small">
        © {{ currentYear }} HackStudio. Made with care.
      </div>
    </div>
  </footer>
</template>

<script setup>
const currentYear = new Date().getFullYear();
</script>

<style>
p {
  font-size: 16px;
}
</style>
