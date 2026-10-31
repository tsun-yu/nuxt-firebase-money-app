<template>
  <div>
    <div v-if="errMsg" class="error-message">{{ errMsg }}</div>
    <div class="login-element">
      <h2>{{ label }}</h2>
      <div class="login__input">
        <input
          id="email"
          v-model="email"
          type="email"
          placeholder="Email"
          :class="{ error: emailHasError }"
          @keydown.enter="handleLoginClick"
        />
      </div>
      <div class="login__input">
        <input
          id="password"
          v-model="password"
          type="password"
          placeholder="Password"
          :class="{ error: passwordHasError }"
          @keydown.enter="handleLoginClick"
        />
      </div>
      <div v-if="!hasMember" class="login__input">
        <input
          id="confirm"
          v-model="confirm"
          type="password"
          placeholder="Confirm"
          :class="{ error: confirmHasError }"
          @keydown.enter="handleLoginClick"
        />
      </div>
      <div class="login__input">
        <Button :label="label" @click="handleLoginClick" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ label: string; hasMember: boolean }>();

const { login, register } = useAuth();

const email = ref("admin@gmail.com");
const password = ref("admin1234");
const confirm = ref("");
const errMsg = ref("");
const loading = ref(false);

const emailHasError = computed(
  () =>
    errMsg.value === "Account doesn't exist" ||
    errMsg.value === "That Email is taken. Try another.",
);
const passwordHasError = computed(
  () =>
    errMsg.value === "Wrong Password" ||
    errMsg.value === "Passwords didn't match. Try again.",
);
const confirmHasError = computed(
  () => errMsg.value === "Passwords didn't match. Try again.",
);

const handleError = (error: any) => {
  // server 只回傳錯誤代碼，不會洩漏任何 Firebase 設定資訊
  const code =
    error?.data?.data?.code ?? error?.data?.statusMessage ?? "UNKNOWN_ERROR";
  errMsg.value = errorMessages[code] || "登入失敗，請稍後再試";
};

const handleLoginClick = async () => {
  if (loading.value) return;
  errMsg.value = "";

  if (!props.hasMember && password.value !== confirm.value) {
    errMsg.value = "Passwords didn't match. Try again.";
    return;
  }

  loading.value = true;
  try {
    props.hasMember
      ? await login(email.value, password.value)
      : await register(email.value, password.value);
    await navigateTo("/");
  } catch (error: any) {
    handleError(error);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped lang="scss">
.error-message {
  width: 100%;
  border-radius: 1.5rem;
  background-color: var(--color-error-container);
  color: var(--color-error);
  font-size: 1.125rem;
  padding: 1.5rem;
  margin-bottom: 1rem;
}

.login-element {
  background-color: #fff;
  border-radius: 1.5rem;
  padding: 2rem 2rem 1rem;

  h2 {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
  }

  .login__input {
    margin-bottom: 1rem;
    font-size: 1.125rem;

    label {
      display: block;
    }
    input {
      border: none;
      border-bottom: 2px solid rgba(60, 64, 67, 0.08);
      padding: 0.5rem 0.5rem 0.5rem 0;
      width: 100%;
      transition: 0.3s ease-in;
      font-size: 1.125rem;

      &.error {
        border-bottom: 2px solid var(--color-error);
      }

      &:focus-visible {
        outline: none;
      }

      &:not(.error):focus-visible {
        border-bottom: 2px solid var(--input-secondary);
      }
    }
  }
}
</style>
