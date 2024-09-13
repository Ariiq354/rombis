<script lang="ts" setup>
  const props = defineProps<{
    function: (...args: any[]) => Promise<void>;
  }>();

  const emit = defineEmits(['success']);

  const modal = useModal();
  const loading = ref(false);
  async function onClick() {
    loading.value = true;

    try {
      await props.function();
      loading.value = false;
      emit('success');
    } catch (error: any) {
      useToastError(error.statusCode, error.statusMessage);
      loading.value = false;
    }
  }
</script>

<template>
  <UModal prevent-close :ui="{ width: 'sm:max-w-sm' }">
    <div class="space-y-4 p-4">
      <div class="flex items-center justify-between">
        <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">Confirm</h3>
        <UButton
          color="gray"
          variant="ghost"
          icon="i-heroicons-x-mark-20-solid"
          class="-my-1 rounded-full"
          @click="modal.close()"
        />
      </div>
      <div class="flex items-center gap-4">
        <UIcon name="i-heroicons-exclamation-triangle" size="36" />
        Are you sure you want to delete the selected products?
      </div>
      <div class="flex w-full justify-end gap-2">
        <UButton
          @click="modal.close()"
          icon="i-heroicons-x-mark-16-solid"
          variant="ghost"
          :disabled="loading"
        >
          No
        </UButton>
        <UButton
          @click="onClick"
          icon="i-heroicons-check-16-solid"
          variant="ghost"
          :loading="loading"
        >
          Yes
        </UButton>
      </div>
    </div>
  </UModal>
</template>
