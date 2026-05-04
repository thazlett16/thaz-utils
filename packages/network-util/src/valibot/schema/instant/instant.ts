import * as t from '@thazstack/temporal-valibot-util';

import * as v from 'valibot';

export const instant = v.union([t.instant(), v.pipe(v.string(), v.trim(), t.toInstant(), t.instant())]);

// type InputInstant = v.InferInput<typeof instant>;
// type OutputInstant = v.InferOutput<typeof instant>;
