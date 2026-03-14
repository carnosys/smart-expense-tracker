export function getCurrentMonthNumber() {
  return new Date().getUTCMonth() + 1;
}

export function formatMonthName(month: number) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
  }).format(new Date(Date.UTC(2026, month - 1, 1)));
}
