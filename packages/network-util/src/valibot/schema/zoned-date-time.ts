import * as t from '@thazstack/temporal-valibot-util';

import * as v from 'valibot';

export const zonedDateTime = v.union([t.zonedDateTime(), v.pipe(v.string(), t.toZonedDateTime(), t.zonedDateTime())]);
