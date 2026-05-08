import { describe, expect, it } from 'vite-plus/test';

import { computeCanSubmit } from '#src/hooks/can-submit';

describe('computeCanSubmit', () => {
  describe('allowSubmitWhenInvalid: false (default behaviour)', () => {
    const options = { allowSubmitWhenInvalid: false };

    it('returns true when not submitting', () => {
      expect(computeCanSubmit(options, false, true)).toBe(true);
    });

    it('returns false when submitting', () => {
      expect(computeCanSubmit(options, true, true)).toBe(false);
    });

    it('returns true when not submitting regardless of canSubmit', () => {
      expect(computeCanSubmit(options, false, false)).toBe(true);
    });
  });

  describe('allowSubmitWhenInvalid: true', () => {
    const options = { allowSubmitWhenInvalid: true };

    it('returns true when not submitting and canSubmit is true', () => {
      expect(computeCanSubmit(options, false, true)).toBe(true);
    });

    it('returns false when not submitting and canSubmit is false', () => {
      expect(computeCanSubmit(options, false, false)).toBe(false);
    });

    it('returns false when submitting regardless of canSubmit', () => {
      expect(computeCanSubmit(options, true, true)).toBe(false);
      expect(computeCanSubmit(options, true, false)).toBe(false);
    });
  });
});
