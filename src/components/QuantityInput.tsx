import { useEffect, useState } from 'react';
import type { ChangeEvent, KeyboardEvent } from 'react';

interface QuantityInputProps {
  value: number;
  max: number;
  onCommit: (value: number) => void;
  className?: string;
}

export function QuantityInput({ value, max, onCommit, className }: QuantityInputProps) {
  const [raw, setRaw] = useState(String(value));

  useEffect(() => {
    setRaw(String(value));
  }, [value]);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const next = e.target.value;
    if (next === '' || /^\d+$/.test(next)) {
      setRaw(next);
    }
  }

  function commit() {
    const num = Number(raw);
    const clamped = Math.max(1, Math.min(max, Number.isNaN(num) || num < 1 ? 1 : num));
    setRaw(String(clamped));
    if (clamped !== value) {
      onCommit(clamped);
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.currentTarget.blur();
    }
  }

  return (
    <input
      type="text"
      inputMode="numeric"
      value={raw}
      onChange={handleChange}
      onBlur={commit}
      onKeyDown={handleKeyDown}
      className={className}
    />
  );
}
