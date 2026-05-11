import type { ZonedDateTime } from '@internationalized/date';
import type * as v from 'valibot';
import { describe, expectTypeOf, test } from 'vite-plus/test';

import type { InternationalizedZonedDateTimeSchema } from '#src/schemas/intl-zoned-date-time';
import { internationalizedZonedDateTime } from '#src/schemas/intl-zoned-date-time';

describe('internationalizedZonedDateTime', () => {
  const schema = internationalizedZonedDateTime();

  test('returns InternationalizedZonedDateTimeSchema<undefined> when no message', () => {
    expectTypeOf(schema).toEqualTypeOf<InternationalizedZonedDateTimeSchema<undefined>>();
  });

  test('inferInput is ZonedDateTime', () => {
    expectTypeOf<v.InferInput<typeof schema>>().toEqualTypeOf<ZonedDateTime>();
  });

  test('inferOutput is ZonedDateTime', () => {
    expectTypeOf<v.InferOutput<typeof schema>>().toEqualTypeOf<ZonedDateTime>();
  });
});
