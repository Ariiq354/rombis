import { z } from "zod";

export const schema = z.object({
  id_ticket: z.string(),
  current: z.string(),
  seatPosition: z
    .object({
      id_ticketSeat: z.string(),
      name: z.string(),
      seat: z.number(),
    })
    .array(),
});

export type Schema = z.output<typeof schema>;

export const initialFormData = {
  id_ticket: "",
  current: "",
  seatPosition: [
    {
      id_ticketSeat: "",
      name: "",
      seat: 0,
    },
  ],
};
