<script setup lang="ts">
  import type { FormSubmitEvent } from "#ui/types";
  import { initialFormData, schema, type Schema } from "./constant";
  import { jsonToCsv } from "~/utils";

  // Fetch data
  const { data: busData, status: busStatus } = await useLazyFetch("/api/bus");
  const { data, status, refresh } = await useLazyFetch("/api/tickets");

  const state = reactive({ ...initialFormData });
  const selectedBus = computed(() => {
    return busData.value?.find((item) => item.id === state.id_bus);
  });
  watch(selectedBus, async () => {
    if (selectedBus.value) {
      const zerosCount = selectedBus.value.route.length - 2;
      if (zerosCount > 0 && !state.id) {
        const zeros = new Array(zerosCount).fill(0);
        const empty = new Array(zerosCount).fill("");
        state.price.splice(state.price.length - 1, 0, ...zeros);
        state.time.splice(state.time.length - 1, 0, ...empty);
      }
    }
  });

  const modalOpen = ref(false);
  const modalLoading = ref(false);
  async function onSubmit(event: FormSubmitEvent<Schema>) {
    try {
      modalLoading.value = true;

      await $fetch("/api/ticket", {
        method: "POST",
        body: event.data,
      });

      modalLoading.value = false;
      modalOpen.value = false;
      await refresh();
    } catch (error: any) {
      useToastError(error.statusCode, error.statusMessage);
      modalLoading.value = false;
    }
  }

  function clickAdd() {
    Object.assign(state, initialFormData);
    state.time = ["", ""];
    state.price = [0];
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
    const ticketItem = data.value?.find((item) => item.id === id)!;
    delete (ticketItem as any).bus;
    delete (ticketItem as any).filledSeat;
    Object.assign(state, ticketItem);
    modalOpen.value = true;
    state.price = [...ticketItem.price];
    state.time = [...ticketItem.time];
  }
</script>

<template>
  <main>
    <UModal v-model="modalOpen" :ui="{ width: 'sm:max-w-4xl' }" prevent-close>
      <div class="p-4">
        <div class="mb-4 flex items-center justify-between">
          <h3
            class="text-base font-semibold leading-6 text-gray-900 dark:text-white"
          >
            {{ state.id ? "Edit" : "Add" }} Ticket
          </h3>
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-x-mark-20-solid"
            class="-my-1 rounded-full"
            @click="modalOpen = false"
            :disabled="status === 'pending'"
          />
        </div>
        <UForm
          :schema="schema"
          :state="state"
          class="space-y-4"
          @submit="onSubmit"
        >
          <div class="flex w-full gap-4">
            <UFormGroup label="Nama Bus" name="id_bus" class="w-full">
              <USelectMenu
                v-model="state.id_bus"
                :options="busData"
                option-attribute="name"
                value-attribute="id"
                :disabled="busStatus === 'pending'"
              />
            </UFormGroup>

            <UFormGroup label="Tanggal tiket" name="date" class="w-full">
              <UInput
                type="date"
                v-model="state.date"
                :disabled="modalLoading"
              />
            </UFormGroup>
          </div>

          <div class="flex gap-4">
            <div class="w-full">
              <div class="flex gap-4">
                <UFormGroup label="Tempat" class="w-full">
                  <UInput :value="selectedBus?.route[0]" disabled />
                </UFormGroup>
                <UFormGroup label="Jam" :name="`time.0`" class="w-full">
                  <UInput
                    type="datetime-local"
                    v-model="state.time[0]"
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
                    <UInput :value="item" />
                    <UFormGroup :name="`price.${index}`">
                      <UInput
                        type="number"
                        v-model="state.price[index]"
                        :disabled="modalLoading"
                      />
                    </UFormGroup>
                    <UFormGroup :name="`time.${index + 1}`">
                      <UInput
                        type="datetime-local"
                        v-model="state.time[index + 1]"
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
                    :value="selectedBus?.route[selectedBus.route.length - 1]"
                    disabled
                  />
                </UFormGroup>
                <UFormGroup
                  label="Harga"
                  :name="`price.${state.price.length - 1}`"
                >
                  <UInput
                    type="number"
                    v-model="state.price[state.price.length - 1]"
                    :disabled="modalLoading"
                  />
                </UFormGroup>
                <UFormGroup label="Jam" :name="`time.${state.time.length - 1}`">
                  <UInput
                    type="datetime-local"
                    v-model="state.time[state.time.length - 1]"
                    :disabled="modalLoading"
                  />
                </UFormGroup>
              </div>
            </div>
            <div class="flex w-full flex-col gap-4">
              <div class="flex gap-4">
                <UFormGroup label="Jumlah Kursi" class="w-full">
                  <UInput :value="selectedBus?.seat" disabled />
                </UFormGroup>
                <UFormGroup label="Tipe Kursi" class="w-full">
                  <UInput :value="selectedBus?.type" disabled />
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
              @click="modalOpen = false"
              icon="i-heroicons-x-mark-16-solid"
              variant="ghost"
              :disabled="modalLoading"
            >
              Cancel
            </UButton>
            <UButton
              type="submit"
              icon="i-heroicons-check-16-solid"
              :loading="modalLoading"
            >
              Save
            </UButton>
          </div>
        </UForm>
      </div>
    </UModal>
    <UCard>
      <div class="mb-6 flex items-center justify-between rounded-lg border p-4">
        <div class="flex gap-2">
          <UButton icon="i-heroicons-plus" variant="soft" @click="clickAdd"
            >Add</UButton
          >
          <UButton
            icon="i-heroicons-trash"
            variant="soft"
            class="disabled:opacity-50"
            @click="clickDelete"
            :disabled="deleteArray.length === 0"
          >
            Delete
          </UButton>
        </div>
        <UButton
          icon="i-heroicons-arrow-up-tray"
          variant="soft"
          @click="jsonToCsv(data!)"
          :disabled="!(data && data.length > 0)"
        >
          Export
        </UButton>
      </div>
      <div class="grid grid-cols-4" v-if="data && data.length > 0">
        <div
          class="flex cursor-pointer flex-col gap-4 rounded-lg border p-4"
          v-for="(item, index) in data"
          :key="index"
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
            <h1 class="font-bold">{{ item.bus.name }}</h1>
            <h2>
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
              <p>{{ item.bus.seat }} kursi</p>
              <p>{{ item.bus.type }}</p>
            </div>
          </div>
          <div
            class="flex items-center justify-between font-semibold text-blue-600"
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
              class="rounded-full"
              @click.stop="() => clickUpdate(item.id)"
              >Pilih</UButton
            >
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
