import type { ChangeEvent } from 'react';
import { formatWithCommas, sanitizeAmountInput } from '../utils/currency';

interface CurrencyInputProps {
  value: string;
  onChange: (raw: string) => void;
  required?: boolean;
  id?: string;
}

export function CurrencyInput({ value, onChange, required, id }: CurrencyInputProps) {
  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    onChange(sanitizeAmountInput(e.target.value));
  }

  return (
    <div className="mt-1 flex items-center rounded-md border border-stone-300 bg-white shadow-sm focus-within:border-stone-900 focus-within:ring-1 focus-within:ring-stone-900">
      <span className="pl-3 text-base text-stone-500 sm:text-sm">₦</span>
      <input
        id={id}
        type="text"
        inputMode="decimal"
        required={required}
        value={formatWithCommas(value)}
        onChange={handleChange}
        className="w-full min-w-0 rounded-md bg-transparent px-2 py-2 text-base text-stone-800 placeholder:text-stone-400 focus:outline-none sm:text-sm"
      />
    </div>
  );
}
