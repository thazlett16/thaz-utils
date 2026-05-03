import { Time } from '@internationalized/date';
import * as v from 'valibot';
import { describe, expectTypeOf, it } from 'vitest';

import type { InternationalizedTimeSchema } from '#src/schemas/intl-time';

import { internationalizedTime } from '#src/schemas/intl-time';

describe('internationalizedTime', () => {
  const schema = internationalizedTime();

  it('returns InternationalizedTimeSchema<undefined> when no message', () => {
    expectTypeOf(schema).toEqualTypeOf<InternationalizedTimeSchema<undefined>>();
  });

  it('inferInput is Time', () => {
    expectTypeOf<v.InferInput<typeof schema>>().toEqualTypeOf<Time>();
  });

  it('inferOutput is Time', () => {
    expectTypeOf<v.InferOutput<typeof schema>>().toEqualTypeOf<Time>();
  });
});
