<script setup lang="ts">
  import type { FormSubmitEvent } from "#ui/types";
  import { createSwapy } from "swapy";
  import { initialFormData, schema, type Schema } from "./constant";

  onMounted(() => {
    defineTopbarTitle("Perjalanan");
  });

  // Fetch data
  const { data, status, refresh } = await useLazyFetch("/api/perjalanan");
  const ticketData = computed(() => {
    return data.value?.find((item) => item.id_ticket === state.value.id_ticket);
  });

  const state = ref({ ...initialFormData });

  const modalOpen = ref(false);
  const modalLoading = ref(false);
  async function onSubmit(event: FormSubmitEvent<Schema>) {
    try {
      modalLoading.value = true;

      await $fetch("/api/perjalanan", {
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

  async function clickUpdate(id: string) {
    const ticketItem = data.value!.find((item) => item.id_ticket === id)!;
    state.value.id_ticket = ticketItem.id_ticket;
    state.value.current = ticketItem.current;
    state.value.seatPosition = ticketItem.filledSeat;
    modalOpen.value = true;
  }

  const getNameBySeat = (index: number) => {
    const person = ticketData.value?.filledSeat.find(
      (person) => person.seat === index
    );
    return person ? person : undefined;
  };

  function spanColumn(index: number) {
    switch (ticketData.value?.bus.type) {
      case "1x1":
        return index % 2 === 1;
      case "1x2":
        return index % 3 === 1;
      case "2x2":
        return index % 4 === 2;
      case "2x3":
        return index % 5 === 2;
      default:
        return false;
    }
  }

  const container = ref<Element>();

  watch(container, async () => {
    if (container.value) {
      const swapy = createSwapy(container.value);
      swapy.onSwap((event) => {
        const dataArray = event.data.array;
        dataArray.forEach((item) => {
          if (!item.itemId?.includes("none")) {
            state.value.seatPosition = state.value.seatPosition.map(
              (person) => {
                if (person.id_ticketSeat === item.itemId) {
                  return { ...person, seat: Number(item.slotId) };
                }
                return person;
              }
            );
          }
        });
      });
    }
  });
</script>

<template>
  <main>
    <UModal v-model="modalOpen" :ui="{ width: 'sm:max-w-4xl' }" prevent-close>
      <div class="px-4 py-5">
        <div class="mb-4 flex items-center justify-between">
          <h3
            class="text-base font-semibold leading-6 text-gray-900 dark:text-white"
          >
            Edit Perjalanan
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
            <UFormGroup label="Titik Kumpul" name="current" class="w-full">
              <USelect
                v-model="state.current"
                :options="ticketData?.bus.tikum"
              />
            </UFormGroup>
          </div>

          <div
            ref="container"
            class="grid w-fit gap-2"
            :class="{
              'grid-cols-6': ticketData?.bus.type === '2x3',
              'grid-cols-5': ticketData?.bus.type === '2x2',
              'grid-cols-4': ticketData?.bus.type === '1x2',
              'grid-cols-3': ticketData?.bus.type === '1x1',
            }"
          >
            <template
              v-for="(item, index) in ticketData?.bus.seat"
              :key="index"
            >
              <div
                class="h-full w-full rounded-lg"
                :data-swapy-slot="item"
                :class="{ 'col-span-2': spanColumn(index + 1) }"
              >
                <div
                  :data-swapy-item="
                    getNameBySeat(index + 1)
                      ? getNameBySeat(index + 1)?.id_ticketSeat
                      : `none${index}`
                  "
                  class="h-20 w-20 rounded-lg p-2"
                  :class="{
                    'bg-green-200':
                      getNameBySeat(index + 1)?.seat === index + 1,
                    'bg-gray-200': !(
                      getNameBySeat(index + 1)?.seat ===
                      index + 1
                    ),
                  }"
                >
                  {{ getNameBySeat(index + 1)?.name }}
                </div>
              </div>
            </template>
          </div>

          <div class="flex w-full justify-end gap-2">
            <UButton
              icon="i-heroicons-x-mark-16-solid"
              variant="ghost"
              :disabled="modalLoading"
              @click="modalOpen = false"
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
      <h1 class="mb-4 text-lg font-bold">Detail Perjalanan</h1>
      <div v-if="data && data.length > 0" class="grid grid-cols-4 gap-2">
        <div
          v-for="(item, index) in data"
          :key="index"
          class="flex cursor-pointer flex-col gap-4 rounded-lg border p-4"
        >
          <div class="flex items-center justify-between">
            <h1 class="font-bold">{{ item.bus.name }}</h1>
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
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-map-pin" size="16" />
              {{ item.current ? item.current : "Belum Berangkat" }}
            </div>
            <UButton
              variant="soft"
              @click.stop="() => clickUpdate(item.id_ticket)"
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
