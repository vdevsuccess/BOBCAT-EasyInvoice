import type { LineItem, MiscFee } from "./types";

export function fmt(n: number): string {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n || 0);
}

export function calcLineNet(l: LineItem): number {
  const p = parseFloat(l.price) || 0;
  const q = parseFloat(l.qty) || 1;
  const d = parseFloat(l.discount) || 0;
  const base = p * q - d;
  return l.type === "TR" ? -base : base;
}

/** Sub total = sum of non-MC line nets (TR already negative) */
export function getSubTotal(lines: LineItem[]): number {
  return lines.reduce((s, l) => s + l.net, 0);
}

/** Total tax from Y-taxed lines */
export function getTotalTax(lines: LineItem[]): number {
  return lines.reduce((s, l) => s + (parseFloat(l.taxAmt) || 0), 0);
}

/** Total misc fees */
export function getTotalMisc(fees: MiscFee[]): number {
  return fees.reduce((s, f) => s + (parseFloat(f.amount) || 0), 0);
}

/** Grand total = subtotal + tax + misc fees */
export function getGrandTotal(lines: LineItem[], fees: MiscFee[]): number {
  return getSubTotal(lines) + getTotalTax(lines) + getTotalMisc(fees);
}
