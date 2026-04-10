export function getDefaultCalendar() {
  return new Intl.DateTimeFormat().resolvedOptions().calendar;
}

export function getDefaultTimeZone() {
  return new Intl.DateTimeFormat().resolvedOptions().timeZone;
}

export function getDefaultLocale() {
  return new Intl.DateTimeFormat().resolvedOptions().locale;
}
