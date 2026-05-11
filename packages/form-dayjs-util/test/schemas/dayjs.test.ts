import { Temporal } from '@js-temporal/polyfill';
import * as v from 'valibot';
import { describe, expect, test } from 'vite-plus/test';

import { dayJS } from '#src/dayjs.config';
import { dayjs } from '#src/schemas/dayjs';

describe('dayjs', () => {
  const schema = dayjs();

  test('passes a valid DayJS instance', () => {
    const instance = dayJS('2024-06-15');
    expect(v.safeParse(schema, instance)).toMatchObject({ success: true, output: instance });
  });

  test('rejects strings', () => {
    expect(v.safeParse(schema, '2024-06-15').success).toBeFalsy();
  });

  test('rejects numbers', () => {
    expect(v.safeParse(schema, 42).success).toBeFalsy();
  });

  test('rejects null', () => {
    expect(v.safeParse(schema, null).success).toBeFalsy();
  });

  test('rejects undefined', () => {
    expect(v.safeParse(schema, undefined).success).toBeFalsy();
  });

  test('rejects Temporal.Instant', () => {
    expect(v.safeParse(schema, Temporal.Instant.from('2024-06-15T00:00:00Z')).success).toBeFalsy();
  });

  test('rejects plain objects', () => {
    expect(v.safeParse(schema, {}).success).toBeFalsy();
  });
});
