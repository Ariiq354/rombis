<script setup lang="ts">
  import type { FormSubmitEvent } from "#ui/types";
  import {
    columns,
    getInitialFormData,
    schema,
    selectColumns,
    type Schema,
  } from "./constant";
  import { json2Csv } from "~/utils";

  onMounted(() => {
    defineTopbarTitle("Pemesanan");
  });

  const { data, status, refresh } = await useLazyFetch("/api/tickets/seats");

  const state = ref(getInitialFormData());

  const modalOpen = ref(false);
  const modalLoading = ref(false);
  async function onSubmit(event: FormSubmitEvent<Schema>) {
    modalLoading.value = true;
    try {
      await $fetch("/api/tickets/seats/edit", {
        method: "POST",
        body: {
          ...event.data,
          isPaid: Number(event.data.isPaid),
        },
      });

      modalOpen.value = false;
      await refresh();
    } catch (error: unknown) {
      if (isNuxtError(error)) {
        useToastError(String(error.statusCode), error.statusMessage);
        modalLoading.value = false;
      }
    } finally {
      modalLoading.value = false;
    }
  }

  async function clickUpdate(itemData: ExtractObjectType<typeof data.value>) {
    modalOpen.value = true;
    state.value = itemData;
  }
</script>

<template>
  <main>
    <Title>Pemesanan</Title>
    <UModal v-model="modalOpen" prevent-close>
      <div class="px-4 py-5">
        <div class="mb-4 flex items-center justify-between">
          <h3
            class="text-base font-semibold leading-6 text-gray-900 dark:text-white"
          >
            Edit Pemesanan
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
          <UFormGroup label="Status" name="isPaid">
            <USelect
              v-model="state.isPaid"
              :options="selectColumns"
              option-attribute="name"
              :disabled="modalLoading"
            />
          </UFormGroup>

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
    <UCard
      :ui="{
        body: {
          padding: 'sm:p-8',
        },
      }"
    >
      <div
        class="mb-6 flex items-center rounded-lg border border-gray-200 p-3 dark:border-gray-700"
      >
        <UButton
          icon="i-heroicons-arrow-up-tray"
          variant="soft"
          class="gap-2 text-base text-black disabled:opacity-50 dark:text-white"
          :disabled="!(data && data.length > 0)"
          @click="json2Csv(data!)"
        >
          Ekspor
        </UButton>
      </div>
      <AppTable
        label="Kelola Pemesanan"
        :columns="columns"
        :data="data"
        :loading="status === 'pending'"
        @edit-click="(e) => clickUpdate(e)"
      >
        <template #isPaid-data="{ row }">
          <UBadge
            size="xs"
            :label="
              row.isPaid === 0
                ? 'Belum bayar'
                : row.isPaid === 1
                  ? 'Belum disetujui'
                  : 'Diterima'
            "
            :color="
              row.isPaid === 0 ? 'red' : row.isPaid === 1 ? 'orange' : 'emerald'
            "
            variant="solid"
            class="rounded-full"
          />
        </template>
      </AppTable>
    </UCard>
  </main>
</template>
