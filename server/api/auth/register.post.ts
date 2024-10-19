import { hash } from "@node-rs/argon2";
import { z } from "zod";
import { generateIdFromEntropySize } from "~~/server/utils/lucia";

const userSchema = z
  .object({
    username: z.string(),
    password: z.string().min(8),
  })
  .strict();

export default defineEventHandler(async (event) => {
  const formData = await readBody(event);

  const parseRes = userSchema.parse(formData);
  const res = {
    ...parseRes,
    password: await hash(parseRes.password),
  };

  const exist = await getUserByUsername(res.username);
  if (exist) {
    throw createError({
      statusCode: 400,
      statusMessage: "Username sudah ada",
    });
  }

  const newData = {
    ...res,
    id: generateIdFromEntropySize(10),
  };
  await createUser(newData);

  return;
});
