<script setup lang="ts">
  import type { FormSubmitEvent } from "#ui/types";
  import { columns, schema, typeOptions, type Schema } from "./constant";
  import { jsonToCsv } from "#imports";

  // Fetch data
  const { data, status, refresh } = await useLazyFetch("/api/bus");

  // Table
  const table = useTemplateRef("tableRef");

  const initialFormData = {
    id: undefined,
    name: undefined,
    description: undefined,
    seat: 0,
    route: ["", ""],
    tikum: ["", ""],
    type: undefined,
  };
  const state = reactive({ ...initialFormData });
  const addedRoute = computed(() => {
    if (state.route.length > 2) {
      return state.route.slice(1, -1);
    }
    return [];
  });
  const addedTikum = computed(() => {
    if (state.tikum.length > 2) {
      return state.tikum.slice(1, -1);
    }
    return [];
  });

  const modalOpen = ref(false);
  const modalLoading = ref(false);
  async function onSubmit(event: FormSubmitEvent<Schema>) {
    try {
      modalLoading.value = true;

      await $fetch("/api/bus", {
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
    state.route = ["", ""];
    modalOpen.value = true;
  }

  async function clickDelete() {
    async function onDelete() {
      const idArray = table.value?.selected.map((item: any) => item.id);
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
    Object.assign(state, itemData);
    state.route = [...itemData.route];
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
            {{ state.id ? "Edit" : "Add" }} Bus
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
            <UFormGroup label="Nama Bus" name="name" class="w-full">
              <UInput v-model="state.name" :disabled="modalLoading" />
            </UFormGroup>

            <UFormGroup label="Deskripsi" name="description" class="w-full">
              <UInput v-model="state.description" :disabled="modalLoading" />
            </UFormGroup>
          </div>

          <div class="flex gap-4">
            <div class="flex w-full flex-col gap-4">
              <div class="w-full">
                <h1 class="mb-2 text-sm font-bold">Rute</h1>
                <UFormGroup label="Start" name="route.0">
                  <UInput v-model="state.route[0]" :disabled="modalLoading" />
                </UFormGroup>

                <UIcon name="i-heroicons-ellipsis-vertical" class="mt-3" />
                <div class="flex flex-col gap-2">
                  <UFormGroup
                    v-for="(_, index) in addedRoute"
                    :name="`route.${index + 1}`"
                    :key="index"
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
                <UFormGroup label="Start" name="tikum.0">
                  <UInput v-model="state.tikum[0]" :disabled="modalLoading" />
                </UFormGroup>

                <UIcon name="i-heroicons-ellipsis-vertical" class="mt-3" />
                <div class="flex flex-col gap-2">
                  <UFormGroup
                    v-for="(_, index) in addedTikum"
                    :name="`tikum.${index + 1}`"
                    :key="index"
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
                    @click="
                      () => state.tikum.splice(state.tikum.length - 1, 0, '')
                    "
                  />
                </div>
                <UIcon name="i-heroicons-ellipsis-vertical" />

                <UFormGroup
                  label="Akhir"
                  :name="`tikum.${state.tikum.length - 1}`"
                >
                  <UInput
                    v-model="state.tikum[state.tikum.length - 1]"
                    :disabled="modalLoading"
                  />
                </UFormGroup>
              </div>
            </div>

            <div class="flex w-full flex-col gap-4">
              <div class="flex gap-4">
                <UFormGroup label="Jumlah kursi" name="seat" class="w-full">
                  <UInput
                    type="number"
                    v-model="state.seat"
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

          <div class="flex w-full justify-end gap-2">
            <UButton
              @click="modalOpen = false"
              icon="i-heroicons-x-mark-16-solid"
              variant="ghost"
              :disabled="modalLoading"
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
        label="Kelola Bus"
        ref="tableRef"
        :loading="status === 'pending'"
        @editClick="(e) => clickUpdate(e)"
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
