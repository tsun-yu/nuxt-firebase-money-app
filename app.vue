<template>
  <div class="body" :class="{ expand: isChecked }">
    <CommonHeader v-model:is-checked="isChecked" />
    <CommonSidebar />
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
const isChecked = ref(false);
</script>

<style scoped lang="scss">
.body {
  width: 100%;
  height: 100vh;
  display: grid;
  grid-template-rows: 4rem minmax(0, 1fr);
  grid-template-columns: 4.875rem minmax(0, 1fr);
  transition: 0.3s ease-in;
  overflow: hidden;
  padding: 0 2rem 2rem 0.75rem;

  grid-template-areas:
    "header header"
    "aside main ";

  &.expand {
    grid-template-columns: 16rem minmax(0, 1fr);
  }
}
</style>
