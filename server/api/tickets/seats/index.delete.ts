import { z } from 'zod';

const deleteSchema = z.object({
  id: z.array(z.string()),
});

export default defineEventHandler(async (event) => {
  privateFunction(event);

  const formData = await readBody(event);

  const res = deleteSchema.parse(formData);

  await deleteTicketSeat(res.id);

  return;
});
