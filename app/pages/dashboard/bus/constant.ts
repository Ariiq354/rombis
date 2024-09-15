import { z } from 'zod';

export const columns = [
  {
    key: 'username',
    label: 'User name',
    sortable: true,
  },
  {
    key: 'status',
    label: 'Status',
    sortable: true,
  },
];

export const schema = z.object({
  username: z.string(),
  password: z.string().min(8, 'Must be at least 8 characters'),
  status: z.boolean(),
});

export type Schema = z.output<typeof schema>;
