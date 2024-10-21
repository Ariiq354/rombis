import { z } from "zod";

export const columns = [
  {
    key: "name",
    label: "Nama Bus",
    sortable: true,
  },
  {
    key: "description",
    label: "Deskripsi Bus",
  },
  {
    key: "route",
    label: "Rute",
  },
  {
    key: "seat",
    label: "Jumlah Kursi",
  },
  {
    key: "type",
    label: "Tipe Kursi",
  },
];

export const typeOptions = ["1x1", "1x2", "2x2", "2x3"];

export const schema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Required"),
  description: z.string().min(1, "Required"),
  seat: z.number().min(1, "Required"),
  route: z.string().min(1, { message: "Required" }).array(),
  type: z.string().min(1, "Required"),
});

export const getInitialFormData = () => ({
  id: "",
  name: "",
  description: "",
  seat: 0,
  route: ["", ""],
  tikum: [""],
  type: "1x1",
});

export type Schema = z.output<typeof schema>;
