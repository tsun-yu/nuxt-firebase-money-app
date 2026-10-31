<template>
  <div id="error-page" class="error-container">
    <div class="error-element">
      <img
        v-if="error?.statusCode === 404"
        src="https://i.imgur.com/lTwuDZa.png"
        alt=""
      />
      <h1 v-else>Oops!</h1>
      <p>{{ error?.statusMessage || "Unexpected Error" }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { NuxtError } from "#app";

defineProps<{ error?: NuxtError }>();
</script>

<style scoped lang="scss">
.error-container {
  background-color: var(--bg-secondary);
  height: 100vh;
  display: grid;
  justify-content: center;
}

.error-element {
  margin-top: 4rem;

  img {
    width: min(100%, 40rem);
    display: block;
    margin-inline: auto;
  }
  h1 {
    font-size: 4rem;
    margin-bottom: 1rem;
  }
  p {
    font-size: 2rem;
    font-weight: 400;
    text-align: center;
  }
}
</style>
