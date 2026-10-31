<template>
  <header class="header">
    <div>
      <CommonHamburger v-model:is-checked="model" />
      <h1 class="header__logo">
        <Icon name="tabler:brand-firebase" />
        Firebase - Nuxt
      </h1>
    </div>
    <div class="header__member" @click="logOut">
      <Icon name="bi:person-circle" />
    </div>
  </header>
</template>

<script setup lang="ts">
const model = defineModel<boolean>("isChecked", { default: false });

const { logout } = useAuth();

const logOut = async () => {
  await logout();
  await navigateTo("/login");
};
</script>

<style scoped lang="scss">
.header {
  background-color: var(--bg-secondary);
  display: flex;
  align-items: center;
  justify-content: space-between;
  grid-area: header;
  padding-left: 1.125rem;

  div {
    display: flex;
    align-items: center;

    .header__logo {
      font-size: 1.5rem;
      color: #555;
      display: flex;
      align-items: center;
    }
  }
  .header__member {
    font-size: 1.5rem;
    color: #555;
    cursor: pointer;
  }
}
</style>
