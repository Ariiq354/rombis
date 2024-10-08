import { ModalConfirm } from "#components";

export function jsonToCsv(data: any[]) {
  const headers = Object.keys(data[0]).toString();

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

export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function getCurrentDate() {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const day = String(currentDate.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function openConfirmModal(anyFunction: () => Promise<void>) {
  const modal = useModal();

  modal.open(ModalConfirm, {
    function: anyFunction,
    async onSuccess() {
      modal.close();
    },
  });
}

export type ExtractObjectType<T> = T extends (infer U)[] ? U : never;
