import { z } from "zod";

const userSchema = z
  .object({
    username: z.string(),
  })
  .strict();

export default defineEventHandler(async (event) => {
  const res = await getValidatedQuery(event, (query) =>
    userSchema.parse(query)
  );

  const exist = await getUserByUsername(res.username);

  if (exist) {
    return {
      id: exist.id,
      username: exist.username,
    };
  } else {
    throw createError({
      statusCode: 400,
      statusMessage: "Username tidak ada",
    });
  }
});
