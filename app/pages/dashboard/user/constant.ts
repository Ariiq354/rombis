import { z } from "zod";

export const columns = [
  {
    key: "username",
    label: "User name",
    sortable: true,
  },
  {
    key: "is_active",
    label: "Status",
    sortable: true,
  },
];

export const schema = z.object({
  username: z.string(),
  password: z.string().min(8, "Must be at least 8 characters"),
  is_active: z.boolean(),
});

export type Schema = z.output<typeof schema>;

export const initialFormData = {
  id: undefined,
  username: undefined,
  password: undefined,
  is_active: false,
};
