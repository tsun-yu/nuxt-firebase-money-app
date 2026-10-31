<template>
  <main class="main">
    <div class="container">
      <HomeItem
        v-for="v in items"
        :key="v.id"
        :item="v.item"
        :dollar="v.dollar"
        :date="formatMonthDay(v.date)"
        :id="v.id"
        @refresh="getData"
      />
    </div>
    <div class="input__container">
      <input
        id="expenseItem"
        v-model="itemName"
        type="text"
        placeholder="Item"
        @keydown.enter="postData"
      />
      <input
        id="expenseDollar"
        v-model="dollar"
        type="text"
        placeholder="Dollars"
        @input="handleDollarInput"
        @keydown.enter="postData"
      />
      <button @click="postData">
        <Icon name="bi:plus-square" />
      </button>
    </div>
  </main>
</template>

<script setup lang="ts">
import type { ItemsType } from "~/types/item";

const items = ref<ItemsType[]>([]);
const itemName = ref("");
const dollar = ref("");

const getData = async () => {
  const { items: fetched } = await $fetch<{ items: ItemsType[] }>("/api/items");
  items.value = fetched;
};

const postData = async () => {
  if (dollar.value === "" || itemName.value === "") return;

  await $fetch("/api/items", {
    method: "POST",
    body: { item: itemName.value, dollar: dollar.value },
  });

  itemName.value = "";
  dollar.value = "";
  await getData();
};

const handleDollarInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const cleaned = target.value.replace(/[^0-9]/g, "").replace(/^0+/, "");
  target.value = cleaned;
  dollar.value = cleaned;
};

const formatMonthDay = (value: string) => {
  const [, month, day] = value.split("/");
  return `${month}/${day}`;
};

onMounted(getData);
</script>

<style scoped lang="scss">
.main {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  grid-area: main;
  gap: 1rem;

  .input__container {
    width: 100%;
    flex: 0 0 4rem;
    background-color: var(--input-secondary);
    border-radius: 2rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    padding-inline: 0.75rem;

    input {
      border: none;
      height: 2.75rem;
      padding-inline: 1.5rem;
      font-size: 1.25rem;
      color: #555;
      background-color: var(--inputs-bg);
      flex: 1 1;
      width: 100%;
      border-radius: 1.5rem;
      outline: 0.125rem solid #ccc;

      &::placeholder {
        color: #ccc;
      }

      &:focus-visible {
        outline: 0.125rem solid var(--input-border-focus);
        background-color: #fff;
      }

      &:not(:focus-visible):hover {
        outline: 0.125rem solid #aaa;
      }
    }

    button {
      flex: 0 0 2.75rem;
      height: 2.75rem;
      border: none;
      cursor: pointer;
      border-radius: 50%;
      background-color: var(--btn-primary);
      font-size: 1.5rem;
      color: #555;
      display: grid;
      place-items: center;

      &:active {
        background-color: #bce1c7;
      }
    }
  }
}

.container {
  flex: 1 1;
  background-color: #fff;
  border-radius: 1.5rem;
  padding: 1rem;
  overflow: auto;
  display: grid;
  grid-gap: 1rem;
  grid-template-columns: repeat(auto-fill, minmax(13rem, 1fr));
  grid-auto-rows: min-content;
}
</style>
