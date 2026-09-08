<template>
  <section class="not-found">
    <h1>404</h1>
    <p>Cette page n'existe pas.</p>
    <router-link to="/">Retour à la liste des candidatures</router-link>
  </section>
</template>

<style scoped>
.not-found {
  text-align: center;
  padding: 4rem 1rem;
}

.not-found h1 {
  font-size: 3rem;
  margin: 0;
}

.not-found a {
  color: var(--color-primary);
  font-weight: 600;
}
</style>
