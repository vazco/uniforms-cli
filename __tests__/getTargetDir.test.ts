import { describe, it, expect } from 'vitest';
import { getTargetDir } from '../src/lib/getTargetDir';

describe('getTargetDir', () => {
  it('should return the trimmed directory path without trailing slashes', () => {
    expect(getTargetDir('path/to/dir/')).toBe('path/to/dir');
    expect(getTargetDir('path/to/dir///')).toBe('path/to/dir');
  });

  it('should return the trimmed directory path without leading and trailing spaces', () => {
    expect(getTargetDir('  path/to/dir  ')).toBe('path/to/dir');
  });

  it('should return an empty string if the input is only spaces', () => {
    expect(getTargetDir('   ')).toBe('');
  });

  it('should return the same string if there are no trailing slashes or spaces', () => {
    expect(getTargetDir('path/to/dir')).toBe('path/to/dir');
  });
});
