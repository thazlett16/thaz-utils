import * as v from 'valibot';
import { describe, expectTypeOf, test } from 'vite-plus/test';

import type { _stringNullable, _stringRequired } from '#src/schemas/string';
import { string } from '#src/schemas/string';

const wrongTypeMessages = { wrongTypeMessage: 'Wrong type' };
const requiredMessages = { wrongTypeMessage: 'Wrong type', requiredMessage: 'Required' };

describe('string', () => {
  describe('nullable overload', () => {
    const schema = string(wrongTypeMessages);

    test('returns ReturnType<typeof _stringNullable>', () => {
      expectTypeOf(schema).toEqualTypeOf<ReturnType<typeof _stringNullable>>();
    });

    test('inferInput includes string, null, and undefined', () => {
      expectTypeOf<v.InferInput<typeof schema>>().toEqualTypeOf<string | null | undefined>();
    });

    test('inferOutput is string | null', () => {
      expectTypeOf<v.InferOutput<typeof schema>>().toEqualTypeOf<string | null>();
    });
  });

  describe('nullable overload - additional validation', () => {
    const schema = string(
      wrongTypeMessages,
      v.minLength(2),
      v.maxLength(20),
      v.check((val) => val !== 'test'),
    );

    test('returns ReturnType<typeof _stringNullable>', () => {
      expectTypeOf(schema).toEqualTypeOf<ReturnType<typeof _stringNullable>>();
    });

    test('inferInput includes string, null, and undefined', () => {
      expectTypeOf<v.InferInput<typeof schema>>().toEqualTypeOf<string | null | undefined>();
    });

    test('inferOutput is string | null', () => {
      expectTypeOf<v.InferOutput<typeof schema>>().toEqualTypeOf<string | null>();
    });
  });

  describe('required overload', () => {
    const schema = string(requiredMessages);

    test('returns ReturnType<typeof _stringNullable>', () => {
      expectTypeOf(schema).toEqualTypeOf<ReturnType<typeof _stringRequired>>();
    });

    test('inferInput includes string, null, and undefined', () => {
      expectTypeOf<v.InferInput<typeof schema>>().toEqualTypeOf<string | null | undefined>();
    });

    test('inferOutput is string | null', () => {
      expectTypeOf<v.InferOutput<typeof schema>>().toEqualTypeOf<string>();
    });
  });

  describe('required overload - additional validation', () => {
    const schema = string(
      requiredMessages,
      v.minLength(2),
      v.maxLength(20),
      v.check((val) => val !== 'test'),
    );

    test('returns ReturnType<typeof _stringNullable>', () => {
      expectTypeOf(schema).toEqualTypeOf<ReturnType<typeof _stringRequired>>();
    });

    test('inferInput includes string, null, and undefined', () => {
      expectTypeOf<v.InferInput<typeof schema>>().toEqualTypeOf<string | null | undefined>();
    });

    test('inferOutput is string | null', () => {
      expectTypeOf<v.InferOutput<typeof schema>>().toEqualTypeOf<string>();
    });
  });
});

// const stringExample = v.object({
//   testRequired: string({
//     wrongTypeMessage: 'Not a String',
//     requiredMessage: 'Field is Required',
//   }),
//   testNullable: string({
//     wrongTypeMessage: 'Not a String',
//   }),
//   testRequiredWithActions: string(
//     {
//       wrongTypeMessage: 'Not a String',
//       requiredMessage: 'Field is Required',
//     },
//     v.minLength(2),
//     v.maxLength(20),
//     v.check((val) => val !== 'test'),
//   ),
//   testNullableWithActions: string(
//     {
//       wrongTypeMessage: 'Not a String',
//     },
//     v.minLength(2),
//     v.maxLength(20),
//     v.check((val) => val !== 'test'),
//   ),
// });
// type InputStringExample = v.InferInput<typeof stringExample>;
// type OutputStringExample = v.InferOutput<typeof stringExample>;
