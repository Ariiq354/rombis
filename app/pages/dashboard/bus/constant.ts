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
  {
    key: 'seat',
    label: 'Jumlah Kursi',
  },
  {
    key: 'type',
    label: 'Tipe Kursi',
  },
];

export const typeOptions = ['1x1', '1x2', '2x2', '2x3'];

export const schema = z.object({
  id: z.string().optional(),
  name: z.string(),
  description: z.string(),
  seat: z.number(),
  route: z.string().min(1, { message: 'Required' }).array(),
  type: z.string(),
});

export type Schema = z.output<typeof schema>;
