<script setup lang="ts">
  type ColumnType = {
    key: string;
    label: string;
    sortable?: boolean;
  };

  type DataItem = { [key: string]: unknown };

  const {
    data,
    columns,
    label,
    loading,
    selectable = false,
  } = defineProps<{
    data: DataItem[] | undefined;
    columns: ColumnType[];
    label?: string;
    loading?: boolean;
    selectable?: boolean;
  }>();

  const emit = defineEmits(["editClick"]);

  const numberedColumn = computed(() => {
    return [
      {
        key: "rownumber",
        label: "No.",
        sortable: true,
      },
      ...columns,
      {
        key: "actions",
        label: "Aksi",
      },
    ];
  });

  const numberedData = computed(() => {
    if (data) {
      return data.map((item, index) => ({
        rownumber: index + 1,
        ...item,
      }));
    }

    return [];
  });

  const sortRef = ref<{
    column: string;
    direction: "asc" | "desc";
  }>();

  const sortedData = computed(() => {
    if (!sortRef.value) {
      return numberedData.value;
    }
    const sortColumn = sortRef.value.column;
    const sortDirection = sortRef.value.direction;

    return [...numberedData.value].sort((a, b) => {
      // @ts-expect-error sortcolumn
      const aValue = a[sortColumn];
      // @ts-expect-error sortcolumn
      const bValue = b[sortColumn];
      if (sortDirection === "desc") {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      } else {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
      }
    });
  });

  const query = ref("");

  const filteredRows = computed(() => {
    if (!query.value) {
      return sortedData.value;
    }

    return sortedData.value.filter((person) => {
      return Object.values(person).some((value) => {
        return String(value).toLowerCase().includes(query.value.toLowerCase());
      });
    });
  });

  const page = ref(1);
  const pageCount = 10;

  const pagedRows = computed(() => {
    return filteredRows.value?.slice(
      (page.value - 1) * pageCount,
      page.value * pageCount
    );
  });

  const selected = ref<DataItem[]>([]);

  defineExpose({ selected });

  function select(row: (typeof pagedRows.value)[number]) {
    if (selected.value) {
      const index = selected.value?.findIndex(
        (item) => item.rownumber === row.rownumber
      );
      if (index === -1) {
        selected.value?.push(row);
      } else {
        selected.value?.splice(index, 1);
      }
    }
  }
  function removeRowNumber(obj: (typeof numberedData.value)[number]) {
    const { rownumber, ...rest } = obj;
    return rest;
  }
</script>

<template>
  <div>
    <div
      class="flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-gray-700"
    >
      <h1>{{ label }}</h1>
      <UInput
        v-model="query"
        icon="i-heroicons-magnifying-glass"
        placeholder="Search..."
      />
    </div>
    <UTable
      v-if="selectable"
      v-model="selected"
      v-model:sort="sortRef"
      :rows="pagedRows"
      :columns="numberedColumn"
      :loading="loading"
      sort-mode="manual"
      @select="select"
    >
      <template v-for="(_, name) in $slots" :key="name" #[name]="slotData">
        <slot :name="name" v-bind="slotData ?? {}" />
      </template>
      <template #actions-data="{ row }">
        <UButton
          icon="i-heroicons-pencil-16-solid"
          size="2xs"
          variant="outline"
          :ui="{ rounded: 'rounded-full' }"
          square
          @click.stop="emit('editClick', removeRowNumber(row))"
        />
      </template>
    </UTable>
    <UTable
      v-else
      v-model:sort="sortRef"
      :rows="pagedRows"
      :columns="numberedColumn"
      :loading="loading"
      sort-mode="manual"
    >
      <template v-for="(_, name) in $slots" :key="name" #[name]="slotData">
        <slot :name="name" v-bind="slotData ?? {}" />
      </template>
      <template #actions-data="{ row }">
        <UButton
          icon="i-heroicons-pencil-16-solid"
          size="2xs"
          variant="outline"
          :ui="{ rounded: 'rounded-full' }"
          square
          @click.stop="emit('editClick', removeRowNumber(row))"
        />
      </template>
    </UTable>
    <div
      class="flex justify-end border-t border-gray-200 px-3 py-3.5 dark:border-gray-700"
    >
      <UPagination
        v-model="page"
        :page-count="pageCount"
        :total="data ? data.length : 0"
        :ui="{
          wrapper: 'flex items-center gap-1',
          base: 'w-8 h-8 justify-center',
          rounded: '!rounded-full',
          default: {
            activeButton: {
              variant: 'outline',
            },
          },
        }"
      />
    </div>
  </div>
</template>
