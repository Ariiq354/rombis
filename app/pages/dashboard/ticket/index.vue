<script setup lang="ts">
  import type { FormSubmitEvent } from "#ui/types";
  import { json2Csv } from "#imports";
  import { getInitialFormData, schema, type Schema } from "./constant";

  onMounted(() => {
    defineTopbarTitle("Ticket");
  });

  // Fetch data
  const { data: busData, status: busStatus } = await useLazyFetch("/api/bus");
  const { data, status, refresh } = await useLazyFetch("/api/tickets");

  const state = ref(getInitialFormData());
  const selectedBus = computed(() => {
    if (busData.value) {
      return busData.value.find((item) => item.id === state.value.busId);
    } else {
      return undefined;
    }
  });
  watch(selectedBus, async () => {
    if (selectedBus.value && !state.value.id) {
      state.value.price = [0];
      state.value.time = ["", ""];
      const zerosCount = selectedBus.value.route.length - 2;
      if (zerosCount > 0 && !state.value.id) {
        const zeros = new Array(zerosCount).fill(0);
        const empty = new Array(zerosCount).fill("");
        state.value.price.splice(state.value.price.length - 1, 0, ...zeros);
        state.value.time.splice(state.value.time.length - 1, 0, ...empty);
      }
    }
  });

  const modalOpen = ref(false);
  const modalLoading = ref(false);
  async function onSubmit(event: FormSubmitEvent<Schema>) {
    try {
      modalLoading.value = true;

      await $fetch("/api/tickets", {
        method: "POST",
        body: event.data,
      });

      modalLoading.value = false;
      modalOpen.value = false;
      await refresh();
    } catch (error: unknown) {
      if (isNuxtError(error)) {
        useToastError(String(error.statusCode), error.statusMessage);
        modalLoading.value = false;
      }
    }
  }

  function clickAdd() {
    state.value = getInitialFormData();
    modalOpen.value = true;
  }

  const deleteArray = ref<string[]>([]);
  async function clickDelete() {
    async function onDelete() {
      await $fetch("/api/tickets", {
        method: "DELETE",
        body: {
          id: deleteArray.value,
        },
      });
      if (deleteArray.value) {
        deleteArray.value = [];
      }
      await refresh();
    }
    openConfirmModal(onDelete);
  }

  async function clickUpdate(id: string) {
    const ticketItem = data.value!.find((item) => item.id === id)!;
    state.value.date = ticketItem.date;
    state.value.price = ticketItem.price;
    state.value.time = [...ticketItem.time];
    state.value.id = ticketItem.id;
    state.value.busId = ticketItem.busId;
    modalOpen.value = true;
  }
</script>

<template>
  <main>
    <UModal v-model="modalOpen" :ui="{ width: 'sm:max-w-4xl' }" prevent-close>
      <div class="px-4 py-5">
        <div class="mb-4 flex items-center justify-between">
          <h3
            class="text-base font-semibold leading-6 text-gray-900 dark:text-white"
          >
            {{ state.id ? "Edit" : "Tambah" }} Ticket
          </h3>
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-x-mark-20-solid"
            class="-my-1 rounded-full"
            :disabled="status === 'pending'"
            @click="modalOpen = false"
          />
        </div>
        <UForm
          :schema="schema"
          :state="state"
          class="space-y-4"
          @submit="onSubmit"
        >
          <div class="flex w-full gap-4">
            <UFormGroup label="Nama Bus" name="busId" class="w-full">
              <USelectMenu
                v-model="state.busId"
                :options="busData"
                option-attribute="name"
                value-attribute="id"
                :disabled="busStatus === 'pending'"
              />
            </UFormGroup>

            <UFormGroup label="Tanggal tiket" name="date" class="w-full">
              <UInput
                v-model="state.date"
                type="date"
                :disabled="modalLoading"
              />
            </UFormGroup>
          </div>

          <div class="flex gap-4">
            <div class="w-full">
              <div class="flex gap-4">
                <UFormGroup label="Tempat" class="w-full">
                  <UInput :model-value="selectedBus?.route[0]" disabled />
                </UFormGroup>
                <UFormGroup label="Jam" :name="`time.0`" class="w-full">
                  <UInput
                    v-model="state.time[0]"
                    type="datetime-local"
                    :disabled="modalLoading"
                  />
                </UFormGroup>
              </div>

              <UIcon name="i-heroicons-ellipsis-vertical" class="mt-2" />
              <div class="flex flex-col gap-2">
                <template
                  v-for="(item, index) in selectedBus?.route.slice(1, -1)"
                  :key="index"
                >
                  <div class="flex items-center gap-4">
                    <UInput :model-value="item" disabled />
                    <UFormGroup :name="`price.${index}`">
                      <UInput
                        v-model="state.price[index]"
                        type="number"
                        :disabled="modalLoading"
                      />
                    </UFormGroup>
                    <UFormGroup :name="`time.${index + 1}`">
                      <UInput
                        v-model="state.time[index + 1]"
                        type="datetime-local"
                        :disabled="modalLoading"
                      />
                    </UFormGroup>
                  </div>
                </template>
              </div>
              <UIcon name="i-heroicons-ellipsis-vertical" class="mt-2" />

              <div class="flex items-center gap-4">
                <UFormGroup label="Tempat">
                  <UInput
                    :model-value="
                      selectedBus?.route[selectedBus.route.length - 1]
                    "
                    disabled
                  />
                </UFormGroup>
                <UFormGroup
                  label="Harga"
                  :name="`price.${state.price.length - 1}`"
                >
                  <UInput
                    v-model="state.price[state.price.length - 1]"
                    type="number"
                    :disabled="modalLoading"
                  />
                </UFormGroup>
                <UFormGroup label="Jam" :name="`time.${state.time.length - 1}`">
                  <UInput
                    v-model="state.time[state.time.length - 1]"
                    type="datetime-local"
                    :disabled="modalLoading"
                  />
                </UFormGroup>
              </div>
            </div>
            <div class="flex w-full flex-col gap-4">
              <div class="flex gap-4">
                <UFormGroup label="Jumlah Kursi" class="w-full">
                  <UInput :model-value="selectedBus?.seat" disabled />
                </UFormGroup>
                <UFormGroup label="Tipe Kursi" class="w-full">
                  <UInput :model-value="selectedBus?.type" disabled />
                </UFormGroup>
              </div>
              <div class="flex w-full justify-center">
                <BusSeatPicker
                  v-if="selectedBus"
                  :seat="selectedBus.seat"
                  :type="selectedBus.type"
                />
              </div>
            </div>
          </div>

          <div class="flex w-full justify-end gap-2">
            <UButton
              icon="i-heroicons-x-mark-16-solid"
              variant="ghost"
              :disabled="modalLoading"
              @click="modalOpen = false"
            >
              Batal
            </UButton>
            <UButton
              type="submit"
              icon="i-heroicons-check-16-solid"
              :loading="modalLoading"
            >
              Simpan
            </UButton>
          </div>
        </UForm>
      </div>
    </UModal>
    <UCard
      :ui="{
        body: {
          padding: 'sm:p-8',
        },
      }"
    >
      <div
        class="mb-6 flex items-center justify-between rounded-lg border border-gray-200 p-3 dark:border-gray-700"
      >
        <div class="flex gap-2">
          <UButton
            icon="i-heroicons-plus"
            variant="soft"
            class="gap-2 text-base text-black dark:text-white"
            @click="clickAdd"
          >
            Tambah
          </UButton>
          <UButton
            icon="i-heroicons-trash"
            variant="soft"
            class="gap-2 text-base text-black disabled:opacity-50 dark:text-white"
            :disabled="deleteArray.length === 0"
            @click="clickDelete"
          >
            Hapus
          </UButton>
        </div>
        <UButton
          icon="i-heroicons-arrow-up-tray"
          variant="soft"
          class="gap-2 text-base text-black disabled:opacity-50 dark:text-white"
          :disabled="!(data && data.length > 0)"
          @click="json2Csv(data!)"
        >
          Eksport
        </UButton>
      </div>
      <div v-if="data && data.length > 0" class="grid grid-cols-4 gap-2">
        <div
          v-for="(item, index) in data"
          :key="index"
          class="flex cursor-pointer flex-col gap-4 rounded-lg border p-4"
          :class="{
            'shadow-lg': deleteArray.includes(item.id),
          }"
          @click="
            () =>
              !deleteArray.includes(item.id)
                ? deleteArray.push(item.id)
                : (deleteArray = deleteArray.filter(
                    (arrItem) => arrItem !== item.id
                  ))
          "
        >
          <div class="flex items-center justify-between">
            <h1 class="text font-semibold">{{ item.bus.name }}</h1>
            <h2 class="flex items-center gap-2">
              <UIcon name="i-heroicons-calendar-days" size="16" />
              {{ item.date }}
            </h2>
          </div>
          <div class="flex justify-between gap-4">
            <div class="flex flex-col gap-2">
              <div class="flex items-center">
                <UIcon name="i-heroicons-ellipsis-vertical" />
                <UBadge
                  size="xs"
                  :label="item.bus.route[0]"
                  color="emerald"
                  variant="solid"
                  class="w-full justify-center rounded-full"
                />
              </div>
              <div class="flex items-center">
                <UIcon name="i-heroicons-ellipsis-vertical" />
                <UBadge
                  size="xs"
                  :label="item.bus.route[item.bus.route.length - 1]"
                  color="emerald"
                  variant="solid"
                  class="w-full justify-center rounded-full"
                />
              </div>
            </div>
            <div class="flex flex-col items-end">
              <p>{{ item.bus.seat }} Kursi</p>
              <p>{{ item.bus.type }}</p>
            </div>
          </div>
          <div
            class="text-primary-500 dark:text-primary-400 flex items-center justify-between font-semibold"
          >
            <p>
              {{
                "Rp." +
                Math.min(...item.price).toLocaleString("id-ID") +
                " - " +
                "Rp." +
                Math.max(...item.price).toLocaleString("id-ID")
              }}
            </p>
            <UButton
              size="md"
              variant="soft"
              @click.stop="() => clickUpdate(item.id)"
            >
              Pilih
            </UButton>
          </div>
        </div>
      </div>
      <div v-else class="flex w-full flex-col items-center py-12">
        <UIcon
          name="i-heroicons-circle-stack-20-solid"
          class="mx-auto mb-4 h-6 w-6 text-gray-400 dark:text-gray-500"
        />
        <p class="text-center text-sm text-gray-900 dark:text-white">
          No Items.
        </p>
      </div>
    </UCard>
  </main>
</template>
