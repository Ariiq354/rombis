import { z } from "zod";

const userSchema = z
  .object({
    id: z.string(),
    password: z.string().min(8),
  })
  .strict();

export default defineEventHandler(async (event) => {
  const formData = readBody(event);

  const parseRes = userSchema.parse(formData);

  await updateUser(parseRes.id, {
    password: parseRes.password,
  });

  return;
});