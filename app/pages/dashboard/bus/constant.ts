import { z } from 'zod';

export const columns = [
  {
    key: 'name',
    label: 'Nama Bus',
    sortable: true,
  },
  {
    key: 'description',
    label: 'Deskripsi Bus',
  },
  {
    key: 'route',
    label: 'Rute',
  },
];

export const schema = z.object({
  username: z.string(),
  password: z.string().min(8, 'Must be at least 8 characters'),
  status: z.boolean(),
});

export type Schema = z.output<typeof schema>;
