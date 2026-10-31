<template>
  <div class="login-container">
    <div class="login">
      <div class="switch">
        <div
          class="switch__option"
          :class="{ active: hasMember }"
          @click="hasMemberToggle"
        >
          Log In
        </div>
        <div
          class="switch__option"
          :class="{ active: !hasMember }"
          @click="hasMemberToggle"
        >
          Sign Up
        </div>
      </div>
      <LoginPageLoginSection
        :label="hasMember ? 'Login' : 'Signup'"
        :has-member="hasMember"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const hasMember = ref(true);

const hasMemberToggle = () => {
  hasMember.value = !hasMember.value;
};
</script>

<style scoped lang="scss">
.login-container {
  background-color: var(--bg-secondary);
  height: 100%;
  grid-area: main;
  display: flex;
  justify-content: center;
  overflow: auto;

  .login {
    width: min(100%, 400px);

    .switch {
      background-color: var(--input-secondary);
      border-radius: 2rem;
      display: flex;
      align-items: center;
      margin-bottom: 1rem;

      .switch__option {
        flex: 1 1 100%;
        display: flex;
        justify-content: center;
        font-size: 1.25rem;
        font-weight: 600;
        border-radius: 2rem;
        padding: 1rem;
        cursor: pointer;

        &.active {
          background-color: var(--card-hover);
          color: var(--color-primary);
        }

        &:hover:not(.active) {
          background: linear-gradient(
            0deg,
            rgba(68, 71, 70, 0.08),
            rgba(68, 71, 70, 0.08)
          );
        }
      }
    }
  }
}
</style>
