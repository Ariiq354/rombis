import { z } from "zod";

export const columns = [
  {
    key: "username",
    label: "Username",
    sortable: true,
  },
  {
    key: "isActive",
    label: "Status",
    sortable: true,
  },
];

export const schema = z
  .object({
    id: z.string().optional(),
    username: z.string().min(1, "Required"),
    password: z.string(),
    isActive: z.boolean(),
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

export const getInitialFormData = () => ({
  id: "",
  username: "",
  password: "",
  isActive: false,
});
