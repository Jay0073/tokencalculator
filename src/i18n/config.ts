export const locales = ['en', 'es', 'ja', 'de', 'pt-BR'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

export const localeNames: Record<Locale, string> = {
  en: 'English',
  es: 'Español',
  ja: '日本語',
  de: 'Deutsch',
  'pt-BR': 'Português (Brasil)',
};

export function localeFromPath(pathname: string): Locale {
  const segment = pathname.split('/').filter(Boolean)[0];
  return locales.find((locale) => locale !== defaultLocale && locale.toLowerCase() === segment?.toLowerCase()) ?? defaultLocale;
}

export function stripLocale(pathname: string): string {
  const locale = localeFromPath(pathname);
  if (locale === defaultLocale) return pathname;
  const stripped = pathname.replace(new RegExp(`^/${locale}`, 'i'), '') || '/';
  return stripped.startsWith('/') ? stripped : `/${stripped}`;
}

export function localizedPath(pathname: string, locale: Locale): string {
  const base = stripLocale(pathname);
  if (locale === defaultLocale) return base;
  return `/${locale}${base === '/' ? '/' : base}`;
}

