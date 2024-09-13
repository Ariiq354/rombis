<script setup lang="ts">
  type Columns = {
    key: string;
    sortable?: boolean;
    sort?: (a: any, b: any, direction: 'asc' | 'desc') => number;
    direction?: 'asc' | 'desc';
    class?: string;
    rowClass?: string;
  };

  const { data: propData, columns } = defineProps<{
    data: any[] | undefined;
    columns: Columns[];
    loading?: boolean;
    label: string;
  }>();

  const data = toRef(() => propData);

  const columnsWithRowNumbers = computed(() => {
    return [
      {
        key: 'rowNumber',
        label: 'No.',
        sortable: true,
      },
      ...columns,
      {
        key: 'actions',
        label: 'Actions',
      },
    ];
  });

  const dataWithRowNumber = computed(() => {
    if (data) {
      return data.value?.map((item, index) => ({
        rowNumber: index + 1,
        ...item,
      }));
    }

    return [];
  });

  const searchQuery = ref('');
  const filteredRows = computed(() => {
    if (!searchQuery.value) {
      return dataWithRowNumber.value;
    }

    return dataWithRowNumber.value?.filter((item: any) => {
      return Object.values(item).some((value) => {
        return String(value).toLowerCase().includes(searchQuery.value.toLowerCase());
      });
    });
  });

  const page = ref(1);
  const pageCount = 10;
  const pagedRows = computed(() => {
    return filteredRows.value?.slice((page.value - 1) * pageCount, page.value * pageCount);
  });

  const selected = ref<any[]>([]);
  defineExpose({
    selected,
  });
  function select(row: any) {
    const index = selected.value.findIndex((item) => item.rowNumber === row.rowNumber);
    if (index === -1) {
      selected.value.push(row);
    } else {
      selected.value.splice(index, 1);
    }
  }
</script>

<template>
  <div>
    <div
      class="flex w-full items-center justify-between border-b border-gray-200 pb-4 dark:border-gray-700"
    >
      <h1 class="text-sm">{{ label }}</h1>
      <UInput icon="i-heroicons-magnifying-glass" v-model="searchQuery" placeholder="Search..." />
    </div>
    <UTable
      :rows="pagedRows"
      :columns="columnsWithRowNumbers"
      class="border-gray-200"
      :loading="loading"
      v-model="selected"
      @select="select"
    >
      <template v-for="(_, name) in $slots" #[name]="slotData">
        <slot :name="name" v-bind="slotData" />
      </template>

      <template #actions-data="{ row }">
        <UButton
          icon="i-heroicons-pencil-16-solid"
          size="2xs"
          variant="outline"
          :ui="{ rounded: 'rounded-full' }"
          square
          @click.stop="$emit('editClick', row)"
        />
      </template>
    </UTable>
    <div class="flex justify-end border-t border-gray-200 pt-4 dark:border-gray-700">
      <UPagination
        v-model="page"
        :page-count="pageCount"
        :total="data!.length"
        show-last
        show-first
        v-if="data && data.length > 0"
      />
    </div>
  </div>
</template>
