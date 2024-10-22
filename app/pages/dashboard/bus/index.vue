<script setup lang="ts">
  import type { FormSubmitEvent } from "#ui/types";
  import {
    columns,
    getInitialFormData,
    schema,
    typeOptions,
    type Schema,
  } from "./constants";
  import { json2Csv } from "#imports";

  onMounted(() => {
    defineTopbarTitle("Bus");
  });

  const { data, status, refresh } = await useLazyFetch("/api/bus");

  const table = useTemplateRef("tableRef");

  const state = ref(getInitialFormData());
  const addedRoute = computed(() => {
    if (state.value.route.length > 2) {
      return state.value.route.slice(1, -1);
    }
    return [];
  });
  const addedTikum = computed(() => {
    if (state.value.tikum.length > 1) {
      return state.value.tikum.slice(1);
    }
    return [];
  });

  const modalOpen = ref(false);
  const modalLoading = ref(false);
  async function onSubmit(event: FormSubmitEvent<Schema>) {
    modalLoading.value = true;
    try {
      await $fetch("/api/bus", {
        method: "POST",
        body: event.data,
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

  function clickAdd() {
    state.value = getInitialFormData();
    modalOpen.value = true;
  }

  async function clickDelete() {
    async function onDelete() {
      const idArray = table.value?.selected.map((item) => item.id);
      await $fetch("/api/user", {
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
    state.value = itemData;
  }
</script>

<template>
  <main>
    <Title>Bus</Title>
    <UModal v-model="modalOpen" :ui="{ width: 'sm:max-w-4xl' }" prevent-close>
      <div class="px-4 py-5">
        <div class="mb-4 flex items-center justify-between">
          <h3
            class="text-base font-semibold leading-6 text-gray-900 dark:text-white"
          >
            {{ state.id ? "Edit" : "Tambah" }} Bus
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
          <div class="flex gap-4">
            <div class="flex w-full flex-col gap-4">
              <UFormGroup label="Nama Bus" name="name" class="w-full">
                <UInput v-model="state.name" :disabled="modalLoading" />
              </UFormGroup>

              <UFormGroup label="Deskripsi" name="description" class="w-full">
                <UInput v-model="state.description" :disabled="modalLoading" />
              </UFormGroup>

              <div class="w-full">
                <h1 class="mb-2 text-sm font-bold">Rute</h1>
                <UFormGroup label="Start" name="route.0">
                  <UInput v-model="state.route[0]" :disabled="modalLoading" />
                </UFormGroup>

                <UIcon name="i-heroicons-ellipsis-vertical" class="mt-3" />
                <div class="flex flex-col gap-2">
                  <UFormGroup
                    v-for="(_, index) in addedRoute"
                    :key="index"
                    :name="`route.${index + 1}`"
                  >
                    <UInput
                      v-model="state.route[index + 1]"
                      :disabled="modalLoading"
                    >
                      <template #trailing>
                        <UIcon
                          name="i-heroicons-x-mark-16-solid"
                          class="pointer-events-auto cursor-pointer"
                          @click="state.route.splice(index + 1, 1)"
                        />
                      </template>
                    </UInput>
                  </UFormGroup>
                  <UButton
                    icon="i-heroicons-plus"
                    class="flex w-full justify-center"
                    variant="soft"
                    @click="
                      () => state.route.splice(state.route.length - 1, 0, '')
                    "
                  />
                </div>
                <UIcon name="i-heroicons-ellipsis-vertical" />

                <UFormGroup
                  label="Akhir"
                  :name="`route.${state.route.length - 1}`"
                >
                  <UInput
                    v-model="state.route[state.route.length - 1]"
                    :disabled="modalLoading"
                  />
                </UFormGroup>
              </div>
              <div class="w-full">
                <h1 class="mb-2 text-sm font-bold">Tikum</h1>
                <UFormGroup name="tikum.0">
                  <UInput v-model="state.tikum[0]" :disabled="modalLoading" />
                </UFormGroup>

                <div class="mt-2 flex flex-col gap-2">
                  <UFormGroup
                    v-for="(_, index) in addedTikum"
                    :key="index"
                    :name="`tikum.${index + 1}`"
                  >
                    <UInput
                      v-model="state.tikum[index + 1]"
                      :disabled="modalLoading"
                    >
                      <template #trailing>
                        <UIcon
                          name="i-heroicons-x-mark-16-solid"
                          class="pointer-events-auto cursor-pointer"
                          @click="state.tikum.splice(index + 1, 1)"
                        />
                      </template>
                    </UInput>
                  </UFormGroup>
                  <UButton
                    icon="i-heroicons-plus"
                    class="flex w-full justify-center"
                    variant="soft"
                    @click="() => state.tikum.push('')"
                  />
                </div>
              </div>
            </div>

            <div class="flex w-full flex-col gap-4">
              <div class="flex w-full flex-col gap-4">
                <div class="flex gap-4">
                  <UFormGroup label="Jumlah kursi" name="seat" class="w-full">
                    <UInput
                      v-model="state.seat"
                      type="number"
                      :disabled="modalLoading"
                    />
                  </UFormGroup>
                  <UFormGroup label="Tipe Kursi" name="type" class="w-full">
                    <USelect v-model="state.type" :options="typeOptions" />
                  </UFormGroup>
                </div>
                <div class="flex w-full justify-center">
                  <BusSeatPicker
                    v-if="state.type"
                    :seat="state.seat"
                    :type="state.type"
                  />
                </div>
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
            :disabled="table ? table?.selected.length === 0 : true"
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
          Ekspor
        </UButton>
      </div>
      <AppTable
        ref="tableRef"
        label="Kelola Bus"
        :columns="columns"
        :data="data"
        :loading="status === 'pending'"
        :selectable="true"
        @edit-click="(e) => clickUpdate(e)"
      >
        <template #route-data="{ row }">
          <div>
            {{ row.route[0] }} &nbsp; -> &nbsp;
            {{ row.route[row.route.length - 1] }}
          </div>
        </template>
      </AppTable>
    </UCard>
  </main>
</template>
