import { z } from 'zod';
import { deleteUser } from '~~/server/utils/data-access/user';

const deleteSchema = z.object({
  id: z.array(z.string()),
});

export default defineEventHandler(async (event) => {
  privateFunction(event);

  const formData = await readValidatedBody(event, (body) => deleteSchema.parse(body));

  await deleteUser(formData.id);

  return;
});
