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

export const schema = z.object({
  is_paid: z.boolean(),
});

export type Schema = z.output<typeof schema>;

export const initialFormData = {
  id: undefined,
  is_paid: false,
};
