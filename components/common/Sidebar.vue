<template>
  <aside class="aside">
    <a class="aside__link--active" href="">
      <p><Icon name="simple-icons:nuxtdotjs" /></p>
      FireBase - Nuxt
    </a>
    <a href="">
      <p><Icon name="simple-icons:react" /></p>
      React (Coming soon)
    </a>
    <a href="">
      <p><Icon name="simple-icons:svelte" /></p>
      Svelte (Coming soon)
    </a>
  </aside>
</template>

<style scoped lang="scss">
.aside {
  margin-right: 1rem;
  overflow: hidden;
  grid-area: aside;

  a {
    text-decoration: none;
    color: #555;
    font-size: 1.125rem;
    display: flex;
    align-items: center;
    padding: 0.75rem 1.25rem;
    border-radius: 2rem;
    white-space: nowrap;

    p {
      display: flex;
      align-items: center;
      margin-right: 1.125rem;
      font-size: 1.5rem;
    }

    &:hover:not(.aside__link--active) {
      background-color: var(--link-hover);
    }
  }
  .aside__link--active {
    background-color: var(--btn-secondary);
    font-weight: 700;
    color: #222;
  }
}
</style>
