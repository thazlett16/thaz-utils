import * as t from '@thazstack/temporal-valibot-util';
import * as v from 'valibot';

export const zonedDateTime = v.union([
  t.zonedDateTime(),
  v.pipe(v.string(), v.trim(), t.toZonedDateTime(), t.zonedDateTime()),
]);

// type InputZonedDateTime = v.InferInput<typeof zonedDateTime>;
// type OutputZonedDateTime = v.InferOutput<typeof zonedDateTime>;
