import { z } from "zod";
import { checkUniquePrice } from "~~/server/utils/data-access/ticketSeat";

const ticketSchema = z.object({
  price: z.number(),
});

export default defineEventHandler(async (event) => {
  publicFunction(event);

  const formData = await readBody(event);

  const res = ticketSchema.parse(formData);

  async function generateUniquePrice(price: number) {
    const randomNumber = Math.floor(Math.random() * 999) + 1;
    const newPrice = price + randomNumber;
    const exist = await checkUniquePrice(newPrice);

    if (exist.length > 0) {
      return generateUniquePrice(price);
    } else {
      return newPrice;
    }
  }

  return generateUniquePrice(res.price);
});
