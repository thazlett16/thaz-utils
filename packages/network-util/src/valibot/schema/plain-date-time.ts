import * as t from '@thazstack/temporal-valibot-util';

import * as v from 'valibot';

export const plainDateTime = v.union([t.plainDateTime(), v.pipe(v.string(), t.toPlainDateTime(), t.plainDateTime())]);
