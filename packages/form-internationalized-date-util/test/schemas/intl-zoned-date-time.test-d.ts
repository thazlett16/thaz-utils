import { ZonedDateTime } from '@internationalized/date';
import * as v from 'valibot';
import { describe, expectTypeOf, it } from 'vitest';

import type { InternationalizedZonedDateTimeSchema } from '#src/schemas/intl-zoned-date-time';

import { internationalizedZonedDateTime } from '#src/schemas/intl-zoned-date-time';

describe('internationalizedZonedDateTime', () => {
  const schema = internationalizedZonedDateTime();

  it('returns InternationalizedZonedDateTimeSchema<undefined> when no message', () => {
    expectTypeOf(schema).toEqualTypeOf<InternationalizedZonedDateTimeSchema<undefined>>();
  });

  it('inferInput is ZonedDateTime', () => {
    expectTypeOf<v.InferInput<typeof schema>>().toEqualTypeOf<ZonedDateTime>();
  });

  it('inferOutput is ZonedDateTime', () => {
    expectTypeOf<v.InferOutput<typeof schema>>().toEqualTypeOf<ZonedDateTime>();
  });
});
