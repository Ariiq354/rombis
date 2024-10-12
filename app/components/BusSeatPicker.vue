<script setup lang="ts">
  const props = defineProps<{
    seat: number;
    type: '1x1' | '1x2' | '2x2' | '2x3';
    fill?: number[];
  }>();

  const numberRange = computed(() => {
    return Array.from({ length: props.seat }, (_, i) => i + 1);
  });

  function spanColumn(index: number) {
    switch (props.type) {
      case '1x1':
        return index % 2 === 1;
      case '1x2':
        return index % 3 === 1;
      case '2x2':
        return index % 4 === 2;
      case '2x3':
        return index % 5 === 2;
      default:
        return false;
    }
  }
</script>

<template>
  <div
    class="grid w-fit gap-2"
    :class="{
      'grid-cols-6': type === '2x3',
      'grid-cols-5': type === '2x2',
      'grid-cols-4': type === '1x2',
      'grid-cols-3': type === '1x1',
    }"
  >
    <template v-for="(_, index) in numberRange" :key="index">
      <div
        class="h-12 w-12 rounded-lg"
        :class="{
          'col-span-2': spanColumn(index + 1),
          'bg-green-200': fill?.includes(index + 1),
          'bg-gray-200': !fill?.includes(index + 1),
        }"
      />
    </template>
  </div>
</template>
