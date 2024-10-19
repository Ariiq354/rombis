export function json2Csv(data: { [key: string]: unknown }[]) {
  const headers = Object.keys(data[0]!).toString();

  const main = data.map((item) => {
    return Object.values(item).toString();
  });

  const csv = [headers, ...main].join("\n");

  const blob = new Blob([csv], { type: "application/csv" });

  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.download = "data.csv";
  a.href = url;
  a.style.display = "none";

  document.body.appendChild(a);

  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function getCurrentDate() {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const day = String(currentDate.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export type ExtractObjectType<T> = T extends (infer U)[] ? U : never;
