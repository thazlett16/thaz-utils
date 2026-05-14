import * as t from '@thazstack/temporal-valibot-util';

import * as v from 'valibot';

export const instant = v.union([t.instant(), v.pipe(v.string(), t.toInstant(), t.instant())]);
