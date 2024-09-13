<script setup lang="ts">
  import type { FormSubmitEvent } from '#ui/types';
  import { columns, schema, type Schema } from './constant';

  // Fetch data
  const { data, status, refresh } = await useLazyFetch('/api/user');

  // Table
  const tableRef = ref();

  const initialFormData = {
    id: '',
    username: '',
    password: '',
    status: false,
  };
  const state = ref({ ...initialFormData });

  const modalOpen = ref(false);
  const modalLoading = ref(false);
  async function onSubmit(event: FormSubmitEvent<Schema>) {
    try {
      modalLoading.value = true;

      await $fetch('/api/user', {
        method: 'POST',
        body: {
          ...event.data,
          status: event.data.status ? 1 : 0,
        },
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
    console.log(state.value, initialFormData);
    Object.assign(state.value, initialFormData);
    modalOpen.value = true;
  }

  async function clickDelete() {
    async function onDelete() {
      const idArray = tableRef.value.selected.map((item: any) => item.id);
      await $fetch('/api/user', {
        method: 'DELETE',
        body: {
          id: idArray,
        },
      });
    }

    openConfirmModal(onDelete);
  }

  async function clickUpdate(itemData: any) {
    modalOpen.value = true;
    state.value.username = itemData.username;
    state.value.status = itemData.status ? true : false;
    state.value.id = itemData.id;
  }
</script>

<template>
  <main>
    <UModal v-model="modalOpen" prevent-close>
      <div class="p-4">
        <div class="mb-4 flex items-center justify-between">
          <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">Add User</h3>
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-x-mark-20-solid"
            class="-my-1 rounded-full"
            @click="modalOpen = false"
            :disabled="status === 'pending'"
          />
        </div>
        <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
          <UFormGroup label="Username" name="username">
            <UInput v-model="state.username" :disabled="modalLoading" />
          </UFormGroup>

          <UFormGroup label="Password" name="password">
            <UInput v-model="state.password" type="password" :disabled="modalLoading" />
          </UFormGroup>

          <UFormGroup label="Status" name="status">
            <UToggle v-model="state.status" :disabled="modalLoading" />
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
            <UButton type="submit" icon="i-heroicons-check-16-solid" :loading="modalLoading">
              Save
            </UButton>
          </div>
        </UForm>
      </div>
    </UModal>
    <UCard>
      <div class="mb-6 flex items-center justify-between rounded-lg border p-4">
        <div class="flex gap-2">
          <UButton icon="i-heroicons-plus" variant="soft" @click="clickAdd">Add</UButton>
          <UButton
            icon="i-heroicons-trash"
            variant="soft"
            class="disabled:opacity-50"
            @click="clickDelete"
            :disabled="tableRef ? tableRef.selected.length === 0 : true"
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
      <AppTable
        :columns="columns"
        :data="data"
        label="Manage User"
        ref="tableRef"
        :loading="status === 'pending'"
        @editClick="(e) => clickUpdate(e)"
      >
        <template #status-data="{ row }">
          <UBadge
            size="xs"
            :label="row.status ? 'Active' : 'Inactive'"
            :color="row.status ? 'emerald' : 'orange'"
            variant="solid"
            class="rounded-full"
          />
        </template>
      </AppTable>
    </UCard>
  </main>
</template>
