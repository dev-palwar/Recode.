export function getCurrentDate(): string {
  const today = new Date();

  const day = today.getDate(); // 1
  const month = today.toLocaleString("default", { month: "short" }); // "Oct"
  const year = today.getFullYear(); // 2025

  const formatted = `${day} ${month}, ${year}`;

  return formatted;
}
