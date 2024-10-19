import { hash } from "@node-rs/argon2";
import { z } from "zod";
import { generateIdFromEntropySize } from "~~/server/utils/lucia";

const userSchema = z.object({
  id: z.string().optional(),
  username: z.string(),
  password: z.string(),
  isActive: z.boolean(),
});

export default defineEventHandler(async (event) => {
  privateFunction(event);

  const formData = await readValidatedBody(event, (body) =>
    userSchema.parse(body)
  );

  const exist = await getUserByUsername(formData.username);
  if (formData.id) {
    if (exist && exist.id !== formData.id) {
      throw createError({
        statusCode: 400,
        statusMessage: "Username sudah ada",
      });
    }

    const itemData = {
      id: formData.id,
      username: formData.username,
      isActive: formData.isActive,
    };

    await updateUser(formData.id, itemData);
  } else {
    if (exist) {
      throw createError({
        statusCode: 400,
        statusMessage: "Username sudah ada",
      });
    }
    const newData = {
      ...formData,
      id: generateIdFromEntropySize(10),
      password: await hash(formData.password),
    };
    await createUser(newData);
  }

  return;
});
