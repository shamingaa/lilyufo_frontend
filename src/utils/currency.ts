const currencyFormatter = new Intl.NumberFormat('en-NG', {
  style: 'currency',
  currency: 'NGN',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatCurrency(amount: number | string): string {
  const value = typeof amount === 'string' ? Number(amount) : amount;
  return currencyFormatter.format(Number.isFinite(value) ? value : 0);
}

export function formatWithCommas(raw: string): string {
  if (!raw) return '';
  const [intPart, decPart] = raw.split('.');
  const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return decPart !== undefined ? `${formattedInt}.${decPart}` : formattedInt;
}

export function sanitizeAmountInput(rawInput: string): string {
  const digitsAndDot = rawInput.replace(/[^0-9.]/g, '');
  const [firstPart, ...rest] = digitsAndDot.split('.');
  if (rest.length === 0) return firstPart;
  const decimals = rest.join('').slice(0, 2);
  return `${firstPart}.${decimals}`;
}
