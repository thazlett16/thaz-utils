const {
    calendar: defaultCalendar,
    timeZone: defaultTimeZone,
    locale: defaultLocale,
} = new Intl.DateTimeFormat().resolvedOptions();

export function getDefaultCalendar() {
    return defaultCalendar;
}

export function getDefaultTimeZone() {
    return defaultTimeZone;
}

export function getDefaultLocale() {
    return defaultLocale;
}
