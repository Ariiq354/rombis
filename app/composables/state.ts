export const useTopbarTitle = () => useState("topbar-title");

export function defineTopbarTitle(title: string) {
  useTopbarTitle().value = title;
}
