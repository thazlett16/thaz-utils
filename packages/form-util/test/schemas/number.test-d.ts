import * as v from 'valibot';
import { describe, expectTypeOf, it } from 'vite-plus/test';

import type { _numberNullable, _numberRequired } from '#src/schemas/number';

import { number } from '#src/schemas/number';

const wrongTypeMessages = { wrongTypeMessage: 'Wrong type' };
const requiredMessages = { wrongTypeMessage: 'Wrong type', requiredMessage: 'Required' };

describe('number', () => {
  describe('nullable overload', () => {
    const schema = number(wrongTypeMessages);

    it('returns ReturnType<typeof _numberNullable>', () => {
      expectTypeOf(schema).toEqualTypeOf<ReturnType<typeof _numberNullable>>();
    });

    it('inferInput includes number, null, and undefined', () => {
      expectTypeOf<v.InferInput<typeof schema>>().toEqualTypeOf<number | null | undefined>();
    });

    it('inferOutput is number | null', () => {
      expectTypeOf<v.InferOutput<typeof schema>>().toEqualTypeOf<number | null>();
    });
  });

  describe('nullable overload - additional validation', () => {
    const schema = number(
      wrongTypeMessages,
      v.minValue(0),
      v.maxValue(100),
    );

    it('returns ReturnType<typeof _numberNullable>', () => {
      expectTypeOf(schema).toEqualTypeOf<ReturnType<typeof _numberNullable>>();
    });

    it('inferInput includes number, null, and undefined', () => {
      expectTypeOf<v.InferInput<typeof schema>>().toEqualTypeOf<number | null | undefined>();
    });

    it('inferOutput is number | null', () => {
      expectTypeOf<v.InferOutput<typeof schema>>().toEqualTypeOf<number | null>();
    });
  });

  describe('required overload', () => {
    const schema = number(requiredMessages);

    it('returns ReturnType<typeof _numberRequired>', () => {
      expectTypeOf(schema).toEqualTypeOf<ReturnType<typeof _numberRequired>>();
    });

    it('inferInput includes number, null, and undefined', () => {
      expectTypeOf<v.InferInput<typeof schema>>().toEqualTypeOf<number | null | undefined>();
    });

    it('inferOutput is number', () => {
      expectTypeOf<v.InferOutput<typeof schema>>().toEqualTypeOf<number>();
    });
  });

  describe('required overload - additional validation', () => {
    const schema = number(
      requiredMessages,
      v.minValue(0),
      v.maxValue(100),
    );

    it('returns ReturnType<typeof _numberRequired>', () => {
      expectTypeOf(schema).toEqualTypeOf<ReturnType<typeof _numberRequired>>();
    });

    it('inferInput includes number, null, and undefined', () => {
      expectTypeOf<v.InferInput<typeof schema>>().toEqualTypeOf<number | null | undefined>();
    });

    it('inferOutput is number', () => {
      expectTypeOf<v.InferOutput<typeof schema>>().toEqualTypeOf<number>();
    });
  });
});
