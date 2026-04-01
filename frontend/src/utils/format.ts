export function formatDollarsFromCents(priceCents: number) {
  const dollars = priceCents / 100;
  return dollars.toLocaleString(undefined, {
    style: "currency",
    currency: "HKD",
    maximumFractionDigits: 0,
  });
}

export function titleCase(input: string) {
  const s = input.trim();
  if (!s) return s;
  return s
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

