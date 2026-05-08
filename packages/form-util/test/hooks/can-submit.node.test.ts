import { describe, expect, test } from 'vite-plus/test';

import { computeCanSubmit } from '#src/hooks/can-submit';

describe('computeCanSubmit', () => {
  describe('allowSubmitWhenInvalid: false (default behaviour)', () => {
    const options = { allowSubmitWhenInvalid: false };

    test('returns true when not submitting', () => {
      expect(computeCanSubmit(options, false, true)).toBeTruthy();
    });

    test('returns false when submitting', () => {
      expect(computeCanSubmit(options, true, true)).toBeFalsy();
    });

    test('returns true when not submitting regardless of canSubmit', () => {
      expect(computeCanSubmit(options, false, false)).toBeTruthy();
    });
  });

  describe('allowSubmitWhenInvalid: true', () => {
    const options = { allowSubmitWhenInvalid: true };

    test('returns true when not submitting and canSubmit is true', () => {
      expect(computeCanSubmit(options, false, true)).toBeTruthy();
    });

    test('returns false when not submitting and canSubmit is false', () => {
      expect(computeCanSubmit(options, false, false)).toBeFalsy();
    });

    test('returns false when submitting regardless of canSubmit', () => {
      expect(computeCanSubmit(options, true, true)).toBeFalsy();
      expect(computeCanSubmit(options, true, false)).toBeFalsy();
    });
  });
});
