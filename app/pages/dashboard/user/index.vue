<script setup lang="ts">
  import type { FormSubmitEvent } from "#ui/types";
  import { columns, initialFormData, schema, type Schema } from "./constant";
  import { jsonToCsv } from "~/utils";

  // Fetch data
  const { data, status, refresh } = await useLazyFetch("/api/users");

  // Table
  const table = useTemplateRef("tableRef");

  const state = ref({ ...initialFormData });

  const modalOpen = ref(false);
  const modalLoading = ref(false);
  async function onSubmit(event: FormSubmitEvent<Schema>) {
    try {
      modalLoading.value = true;

      await $fetch("/api/users", {
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
    Object.assign(state.value, initialFormData);
    modalOpen.value = true;
  }

  async function clickDelete() {
    async function onDelete() {
      const idArray = table.value?.selected.map((item: any) => item.id);
      await $fetch("/api/users", {
        method: "DELETE",
        body: {
          id: idArray,
        },
      });
      if (table.value) {
        table.value.selected = [];
      }
      await refresh();
    }

    openConfirmModal(onDelete);
  }

  async function clickUpdate(itemData: ExtractObjectType<typeof data.value>) {
    modalOpen.value = true;
    Object.assign(state.value, itemData);
    state.value.password = "" as any;
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
          <UFormGroup label="Username" name="username">
            <UInput v-model="state.username" :disabled="modalLoading" />
          </UFormGroup>

          <UFormGroup label="Password" name="password" v-if="!state.id">
            <UInput
              v-model="state.password"
              type="password"
              :disabled="modalLoading"
            />
          </UFormGroup>

          <UFormGroup label="Status" name="is_active">
            <UToggle v-model="state.is_active" :disabled="modalLoading" />
          </UFormGroup>

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
          <UButton icon="i-heroicons-plus" variant="soft" @click="clickAdd">
            Tambah
          </UButton>
          <UButton
            icon="i-heroicons-trash"
            variant="soft"
            class="disabled:opacity-50"
            @click="clickDelete"
            :disabled="table ? table?.selected.length === 0 : true"
          >
            Hapus
          </UButton>
        </div>
        <UButton
          icon="i-heroicons-arrow-up-tray"
          variant="soft"
          @click="jsonToCsv(data!)"
          :disabled="!(data && data.length > 0)"
        >
          Ekspor
        </UButton>
      </div>
      <AppTable
        :columns="columns"
        :data="data"
        label="Kelola User"
        ref="tableRef"
        :loading="status === 'pending'"
        @editClick="(e) => clickUpdate(e)"
      >
        <template #is_active-data="{ row }">
          <UBadge
            size="xs"
            :label="row.is_active ? 'Actif' : 'Tidak Aktif'"
            :color="row.is_active ? 'emerald' : 'orange'"
            variant="solid"
            class="rounded-full"
          />
        </template>
      </AppTable>
    </UCard>
  </main>
</template>
