import { z } from "zod";

export const columns = [
  {
    key: "username",
    label: "Username",
    sortable: true,
  },
  {
    key: "is_active",
    label: "Status",
    sortable: true,
  },
];

export const schema = z
  .object({
    id: z.string(),
    username: z.string(),
    password: z.string(),
    is_active: z.boolean(),
  })
  .refine(
    (data) => {
      if (!data.id && data.password.length < 8) {
        return false;
      }
      return true;
    },
    {
      message: "Karakter harus 8 atau lebih",
      path: ["password"],
    }
  );

export type Schema = z.output<typeof schema>;

export const initialFormData = {
  id: "",
  username: undefined,
  password: undefined,
  is_active: false,
};
