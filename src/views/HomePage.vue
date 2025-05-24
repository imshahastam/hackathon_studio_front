<template>
  <!-- Hero -->
  <section class="hero">
    <div class="container">
      <h1>Create. Compete. Conquer.</h1>
      <p>
        Join or organize hackathons effortlessly. Empower innovation, build
        communities, and discover talent.
      </p>
      <a href="#" class="btn btn-primary btn-lg mt-3">get started</a>
    </div>
  </section>

  <!-- Features -->
  <section id="features" class="py-5">
    <div class="container">
      <h2 class="section-title">Why HackStudio?</h2>
      <div class="row g-4">
        <div class="col-md-4">
          <div class="card p-4">
            <h5 class="fw-bold">Organizers</h5>
            <p>
              Launch your hackathon in minutes with timeline controls, team
              management, and judging modules.
            </p>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card p-4">
            <h5 class="fw-bold">Participants</h5>
            <p>
              Find hackathons, build teams, meet deadlines, and submit projects
              seamlessly from your dashboard.
            </p>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card p-4">
            <h5 class="fw-bold">Judges</h5>
            <p>
              Rate and review projects, track team progress, and collaborate
              with fellow experts.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- How it Works -->
  <section id="how" class="py-5 bg-light">
    <div class="container">
      <h2 class="section-title">How it Works</h2>
      <div class="row text-center">
        <div class="col-md-3">
          <h5>Create</h5>
          <p>Set up your event with dates, prizes, and themes.</p>
        </div>
        <div class="col-md-3">
          <h5>Invite</h5>
          <p>Bring in judges and participants with smart invitations.</p>
        </div>
        <div class="col-md-3">
          <h5>Collaborate</h5>
          <p>Teams work with built-in messaging and update tools.</p>
        </div>
        <div class="col-md-3">
          <h5>Evaluate</h5>
          <p>Judges review GitHub links and rate submissions.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Testimonials / Showcase -->
  <section id="testimonials" class="py-5">
    <div class="container">
      <h2 class="section-title">Hackathons that made impact</h2>
      <div class="row g-4">
        <div class="col-md-4">
          <div class="card p-3">
            <h5 class="fw-bold">AI Challenge 2025</h5>
            <p>
              300+ participants. 42 projects. Sponsored by TechCore. Winning
              team built a real-time speech bot.
            </p>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card p-3">
            <h5 class="fw-bold">GreenHack</h5>
            <p>
              Focused on sustainability. Winner built an app that tracks carbon
              emissions using receipts.
            </p>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card p-3">
            <h5 class="fw-bold">FutureFinance</h5>
            <p>
              Fintech-focused hackathon where students built a budgeting
              extension that went viral.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- CTA -->
  <section class="cta-section">
    <div class="container">
      <h2>Start your journey with HackStudio</h2>
      <p class="lead">Let your ideas lead the way. Build the future today.</p>
      <a href="#" class="btn btn-light btn-lg mt-3"
        >Create your first hackathon</a
      >
    </div>
  </section>
</template>

<script>
export default {
  name: "HomePage",
};
</script>

<style scoped>
body {
  font-family: "Inter", sans-serif;
}

.hero {
  padding: 120px 0;
  text-align: center;
  background: #f9f9f9;
}

.hero h1 {
  font-size: 3rem;
  font-weight: 700;
}

.hero p {
  font-size: 1.25rem;
  color: #555;
}

.features .card {
  border: none;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.section-title {
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 1rem;
  text-align: center;
}

.cta-section {
  background: #1a535c;
  color: #fff;
  padding: 100px 0;
  text-align: center;
}
</style>
