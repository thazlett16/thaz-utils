import * as t from '@thazstack/temporal-valibot-util';

import * as v from 'valibot';

export const plainTime = v.union([t.plainTime(), v.pipe(v.string(), t.toPlainTime(), t.plainTime())]);
