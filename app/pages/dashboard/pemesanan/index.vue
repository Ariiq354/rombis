<script setup lang="ts">
  import type { FormSubmitEvent } from "#ui/types";
  import { columns, initialFormData, schema, type Schema } from "./constant";
  import { jsonToCsv } from "~/utils";

  // Fetch data
  const { data, status, refresh } = await useLazyFetch("/api/tickets/seats");

  const state = ref({ ...initialFormData });

  const modalOpen = ref(false);
  const modalLoading = ref(false);
  async function onSubmit(event: FormSubmitEvent<Schema>) {
    try {
      modalLoading.value = true;

      await $fetch("/api/tickets/seats/edit", {
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

  async function clickUpdate(itemData: ExtractObjectType<typeof data.value>) {
    modalOpen.value = true;
    Object.assign(state.value, itemData);
  }
</script>

<template>
  <main>
    <UModal v-model="modalOpen" prevent-close>
      <div class="p-4">
        <div class="mb-4 flex items-center justify-between">
          <h3
            class="text-base font-semibold leading-6 text-gray-900 dark:text-white"
          >
            {{ state.id ? "Edit" : "Add" }} User
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
          <UFormGroup label="Status" name="is_paid">
            <UToggle v-model="state.is_paid" :disabled="modalLoading" />
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
    <UCard>
      <div class="mb-6 flex items-center rounded-lg border p-4">
        <UButton
          icon="i-heroicons-arrow-up-tray"
          variant="soft"
          :disabled="!(data && data.length > 0)"
          @click="jsonToCsv(data!)"
        >
          Ekspor
        </UButton>
      </div>
      <AppTable
        :columns="columns"
        :data="data"
        label="Kelola Pemesanan"
        :loading="status === 'pending'"
        @edit-click="(e) => clickUpdate(e)"
      >
        <template #is_paid-data="{ row }">
          <UBadge
            size="xs"
            :label="row.is_paid ? 'Paid' : 'Unpaid'"
            :color="row.is_paid ? 'emerald' : 'orange'"
            variant="solid"
            class="rounded-full"
          />
        </template>
      </AppTable>
    </UCard>
  </main>
</template>
