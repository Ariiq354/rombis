import { ModalConfirm } from '#components';
import type { z } from 'zod';

export function jsonToCsv(data: any[]) {
  const headers = Object.keys(data[0]).toString();

  const main = data.map((item) => {
    return Object.values(item).toString();
  });

  const csv = [headers, ...main].join('\n');

  const blob = new Blob([csv], { type: 'application/csv' });

  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.download = 'data.csv';
  a.href = url;
  a.style.display = 'none';

  document.body.appendChild(a);

  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function openConfirmModal(anyFunction: () => Promise<void>) {
  const modal = useModal();

  modal.open(ModalConfirm, {
    function: anyFunction,
    async onSuccess() {
      modal.close();
      reloadNuxtApp({
        force: true,
      });
    },
  });
}
