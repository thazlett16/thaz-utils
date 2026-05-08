import type { Time } from '@internationalized/date';
import type * as v from 'valibot';
import { describe, expectTypeOf, test } from 'vite-plus/test';

import type { InternationalizedTimeSchema } from '#src/schemas/intl-time';
import { internationalizedTime } from '#src/schemas/intl-time';

describe('internationalizedTime', () => {
  const schema = internationalizedTime();

  test('returns InternationalizedTimeSchema<undefined> when no message', () => {
    expectTypeOf(schema).toEqualTypeOf<InternationalizedTimeSchema<undefined>>();
  });

  test('inferInput is Time', () => {
    expectTypeOf<v.InferInput<typeof schema>>().toEqualTypeOf<Time>();
  });

  test('inferOutput is Time', () => {
    expectTypeOf<v.InferOutput<typeof schema>>().toEqualTypeOf<Time>();
  });
});
