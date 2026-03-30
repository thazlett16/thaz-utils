import type { Temporal } from '@js-temporal/polyfill';

export type TemporalValueInput =
  | Temporal.Duration
  | Temporal.Instant
  | Temporal.PlainDate
  | Temporal.PlainTime
  | Temporal.ZonedDateTime;
