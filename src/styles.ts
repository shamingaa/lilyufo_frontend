export const pageHeading = 'font-serif text-xl font-semibold tracking-tight text-stone-900';

export const label = 'text-sm font-medium text-stone-600';

export const input =
  'mt-1 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-800 shadow-sm placeholder:text-stone-400 focus:border-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900';

export const primaryButton =
  'rounded-sm bg-stone-900 px-6 py-2.5 text-xs font-medium uppercase tracking-wider text-white transition hover:bg-brand-700 disabled:opacity-50';

export const secondaryButton =
  'rounded-sm border border-stone-300 bg-white px-4 py-2 text-xs font-medium uppercase tracking-wider text-stone-700 transition hover:border-stone-900 hover:text-stone-900';

export const dangerLink = 'text-xs font-medium text-red-600 hover:text-red-700 hover:underline';

export const subtleLink =
  'text-sm text-stone-600 underline decoration-stone-300 underline-offset-2 hover:text-stone-900';

export const card = 'rounded-md border border-stone-200 bg-white shadow-sm';

export const pill = (active: boolean) =>
  `rounded-full border px-3 py-1 text-xs font-medium transition ${
    active
      ? 'border-stone-900 bg-stone-900 text-white'
      : 'border-stone-300 bg-white text-stone-600 hover:border-stone-900 hover:text-stone-900'
  }`;

export const accentText = 'text-brand-700';
