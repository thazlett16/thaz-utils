import * as t from '@thazstack/temporal-valibot-util';

import * as v from 'valibot';

export const plainDate = v.union([t.plainDate(), v.pipe(v.string(), v.trim(), t.toPlainDate(), t.plainDate())]);

// type InputPlainDate = v.InferInput<typeof plainDate>;
// type OutputPlainDate = v.InferOutput<typeof plainDate>;
