import { useStore } from '@tanstack/react-form';

import { useFieldContext, FormTypeError } from '@thazstack/form-util';
import type { TimeZoneOptions } from '@thazstack/temporal-util';

import { Temporal } from '@js-temporal/polyfill';
import type { Dayjs } from 'dayjs';

import { dayJS } from '#src/dayjs.config';

export type FieldValueZonedDateTime =
  | Temporal.ZonedDateTime
  | Temporal.Instant
  | Temporal.PlainDateTime
  | Temporal.PlainDate
  | Temporal.PlainTime
  | Dayjs
  | null
  | undefined;

/**
 * Reads the current field value from context and normalizes it to `Dayjs` | `null`.
 * Must be called within a field component via `form.AppField`.
 *
 * Accepts values of: `null` / `undefined` / `Temporal.ZonedDateTime` / `Temporal.Instant` /
 * `Temporal.PlainDateTime` / `Temporal.PlainDate` / `Temporal.PlainTime` / `Dayjs`
 *
 * Throws {@link FormTypeError} for any other unexpected type.
 *
 * @param options - {@link TimeZoneOptions} specifying the target timezone for Temporal conversions.
 *
 * @returns The normalized `Dayjs` | `null`.
 */
export function useNormalizeFieldValueDayJS(options: TimeZoneOptions) {
  const field = useFieldContext<FieldValueZonedDateTime>();

  //  Disabled till @tanstack/react-form exports useSelector instead
  // oxlint-disable-next-line typescript/no-deprecated
  const baseFieldValue = useStore(field.store, (state) => state.value);

  if (baseFieldValue instanceof Temporal.ZonedDateTime) {
    return dayJS.utc(baseFieldValue.toInstant().toString()).tz(options.timeZone);
  } else if (baseFieldValue instanceof Temporal.Instant) {
    return dayJS.utc(baseFieldValue.toString()).tz(options.timeZone);
  } else if (baseFieldValue instanceof Temporal.PlainDateTime) {
    return dayJS({
      years: baseFieldValue.year,
      months: baseFieldValue.month - 1,
      dates: baseFieldValue.day,
      hours: baseFieldValue.hour,
      minutes: baseFieldValue.minute,
      seconds: baseFieldValue.second,
      milliseconds: baseFieldValue.millisecond,
    }).tz(options.timeZone, true);
  } else if (baseFieldValue instanceof Temporal.PlainDate) {
    return dayJS({
      years: baseFieldValue.year,
      months: baseFieldValue.month - 1,
      dates: baseFieldValue.day,
    }).tz(options.timeZone, true);
  } else if (baseFieldValue instanceof Temporal.PlainTime) {
    return dayJS({
      hours: baseFieldValue.hour,
      minutes: baseFieldValue.minute,
      seconds: baseFieldValue.second,
      milliseconds: baseFieldValue.millisecond,
    }).tz(options.timeZone, true);
  } else if (dayJS.isDayjs(baseFieldValue)) {
    return baseFieldValue.tz(options.timeZone, true);
  }

  if (!(baseFieldValue === null || baseFieldValue === undefined)) {
    throw new FormTypeError({
      data: baseFieldValue,
      message: 'useNormalizeFieldValueDayJS - Invalid type in context',
    });
  }

  return null;
}
