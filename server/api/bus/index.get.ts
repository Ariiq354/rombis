export default defineEventHandler(async (event) => {
  publicFunction(event);

  const res = await getAllBus();
  const data = res.map((item) => {
    return {
      id: item.id,
      name: item.name,
      description: item.description,
      route: item.route,
      tikum: item.tikum,
      type: item.type,
      seat: item.seat,
    };
  });

  return data;
});
