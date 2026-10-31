<template>
  <div>
    <div class="card" :class="{ active: isEdit }">
      <p>{{ date }}</p>

      <template v-if="!isEdit">
        <h2>{{ item }}</h2>
        <h3>NTD&ensp;{{ dollar }}</h3>
        <div class="btnGroup">
          <div @click="isEditToggle"><span>Edit</span></div>
          <div @click="deleteData"><span>Delete</span></div>
        </div>
      </template>

      <template v-else>
        <h2>
          <input
            ref="itemInputRef"
            v-model="itemTemp"
            type="text"
            @keydown.enter="updateData"
          />
        </h2>
        <h3>
          NTD&ensp;
          <input
            v-model="dollarTemp"
            type="text"
            @input="handleDollarInput"
            @keydown.enter="updateData"
          />
        </h3>
        <div class="btnGroup">
          <div @click="updateData"><span>Save</span></div>
          <div @click="cancelEdit"><span>Cancel</span></div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  item: string;
  date: string;
  dollar: string;
  id: string;
}>();

const emit = defineEmits<{ refresh: [] }>();

const itemTemp = ref(props.item);
const dollarTemp = ref(props.dollar);
const isEdit = ref(false);
const itemInputRef = ref<HTMLInputElement | null>(null);

watch(isEdit, async (value) => {
  if (value) {
    await nextTick();
    itemInputRef.value?.focus();
  }
});

const isEditToggle = () => {
  isEdit.value = !isEdit.value;
};

const deleteData = async () => {
  await $fetch(`/api/items/${props.id}`, { method: "DELETE" });
  emit("refresh");
};

const updateData = async () => {
  await $fetch(`/api/items/${props.id}`, {
    method: "PUT",
    body: { item: itemTemp.value, dollar: dollarTemp.value },
  });
  emit("refresh");
  isEditToggle();
};

const cancelEdit = () => {
  itemTemp.value = props.item;
  dollarTemp.value = props.dollar;
  isEditToggle();
};

const handleDollarInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const cleaned = target.value.replace(/[^0-9]/g, "").replace(/^0+/, "");
  target.value = cleaned;
  dollarTemp.value = cleaned;
};
</script>

<style scoped lang="scss">
.card {
  background-color: var(--input-secondary);
  border-radius: 1.5rem;
  padding: 1rem;

  &:hover,
  &.active {
    background-color: var(--card-hover);
  }

  p {
    display: inline-block;
    padding: 0.25rem 0.75rem;
    border-radius: 2rem;
    background-color: var(--btn-primary);
  }

  h2 {
    margin-block: 0.5rem;
    font-size: 1.5rem;

    input {
      font-size: 1.5rem;
      height: 2rem;
    }
  }

  h3 {
    display: flex;
    align-items: center;
    font-size: 1.25rem;

    input {
      font-size: 1.25rem;
    }
  }

  h2,
  h3 {
    input {
      width: 100%;
      border: none;
      font-weight: 700;
      background: none;
      box-shadow: 0 0.125rem #edf2fa;

      &:focus-visible {
        outline: none;
        background-color: none;
        box-shadow: 0 0.125rem var(--input-border-focus);
      }
    }
  }

  .btnGroup {
    display: flex;
    margin-top: 1.5rem;
    gap: 0.5rem;

    div {
      flex: 1;
      display: flex;
      justify-content: center;
      padding: 0.5rem 0;
      border-radius: 2rem;
      background-color: var(--link-hover);
      cursor: pointer;

      &:hover {
        background-color: var(--btn-secondary);
      }
      &:active {
        background-color: var(--btn-secondary-active);
      }
    }
  }
}
</style>
