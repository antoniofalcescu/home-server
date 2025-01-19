import { expect } from 'chai';
import { Storage } from '../../../src/common/storage';

describe('Storage', () => {
  describe('getInstance', () => {
    it('should return storage instance', () => {
      expect(Storage.getInstance()).to.not.be.null;
    });
  });

  describe('getRedis', () => {
    it('should return redis', () => {
      expect(Storage.getInstance().getRedis()).to.not.be.null;
    });
  });
});
