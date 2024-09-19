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
  id: z.string(),
  id_bus: z.string().min(1, { message: 'Required' }),
  date: z.string().min(1, { message: 'Required' }),
  price: z.number().gt(0, { message: 'Required' }).array(),
  time: z.string().min(1, { message: 'Required' }).array(),
});

export type Schema = z.output<typeof schema>;

export const initialFormData = {
  id: '',
  id_bus: '',
  date: '',
  price: [0],
  time: ['', ''],
};
