import * as t from '@thazstack/temporal-valibot-util';
import * as v from 'valibot';

export const plainTime = v.union([t.plainTime(), v.pipe(v.string(), v.trim(), t.toPlainTime(), t.plainTime())]);

// type InputPlainTime = v.InferInput<typeof plainTime>;
// type OutputPlainTime = v.InferOutput<typeof plainTime>;
