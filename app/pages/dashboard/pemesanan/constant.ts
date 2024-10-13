import { z } from "zod";

export const columns = [
  {
    key: "username",
    label: "User name",
    sortable: true,
  },
  {
    key: "price",
    label: "Harga",
    sortable: true,
  },
  {
    key: "is_paid",
    label: "Status",
    sortable: true,
  },
];

export const selectColumns = [
  {
    name: "Menunggu pembayaran",
    value: 0,
  },
  {
    name: "Menunggu persetujuan admin",
    value: 1,
  },
  {
    name: "Pembayaran diterima",
    value: 2,
  },
];

export const schema = z.object({
  is_paid: z.coerce.number(),
});

export type Schema = z.output<typeof schema>;

export const initialFormData = {
  price: 0,
  created_at: "",
  is_paid: 0,
};
