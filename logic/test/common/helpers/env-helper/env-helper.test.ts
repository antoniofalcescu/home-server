import { expect } from 'chai';
import { EnvHelper } from '../../../../src/common/helpers';
import { EnvError } from '../../../../src/common/helpers/env-helper/errors';

describe('EnvHelper', () => {
  const ORIGINAL_PROCESS_ENV = { ...process.env };

  afterEach(() => {
    process.env = { ...ORIGINAL_PROCESS_ENV };
  });

  describe('verify', () => {
    it('should not throw error if env is valid', () => {
      expect(EnvHelper.verify).to.not.throw;
    });

    it('should throw error if env has missing values', () => {
      delete process.env.TORRENT_PROVIDER_BASE_URL;

      expect(EnvHelper.verify).to.throw(EnvError, 'Missing key TORRENT_PROVIDER_BASE_URL in .env');
    });
  });

  describe('get', () => {
    it('should get env', () => {
      expect(EnvHelper.get()).to.deep.equal(ORIGINAL_PROCESS_ENV);
    });
  });
});
