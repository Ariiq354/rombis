import { generateIdFromEntropySize } from "lucia";
import { Argon2id } from "oslo/password";
import { z } from "zod";

const userSchema = z.object({
  id: z.string().optional(),
  username: z.string(),
  password: z.string(),
  is_active: z.boolean(),
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
      is_active: formData.is_active,
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
      password: await new Argon2id().hash(formData.password),
    };
    await createUser(newData);
  }

  return;
});
