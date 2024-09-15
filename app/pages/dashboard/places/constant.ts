import { z } from 'zod';

export const columns = [
  {
    key: 'name',
    label: 'Nama tempat',
    sortable: true,
  },
  {
    key: 'is_active',
    label: 'Status',
    sortable: true,
  },
];

export const schema = z.object({
  id: z.string(),
  name: z.string(),
  is_active: z.boolean(),
});

export type Schema = z.output<typeof schema>;
