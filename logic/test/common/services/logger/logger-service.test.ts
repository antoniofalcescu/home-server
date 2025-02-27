import { expect } from 'chai';
import { createSandbox, SinonFakeTimers, SinonSpy, useFakeTimers } from 'sinon';
import { LoggerService } from '../../../../src/common/services/logger';
import { LOG_LEVEL } from '../../../../src/common/services/logger/constants';

const MOCKED_DATE_NOW_VALUE = new Date('2025-01-01T12:00:00Z').getTime();

describe('LoggerService', () => {
  const sandbox = createSandbox();

  let clock: SinonFakeTimers;
  let consoleDirSpy: SinonSpy;
  let loggerService: LoggerService;

  beforeEach(() => {
    clock = useFakeTimers(MOCKED_DATE_NOW_VALUE);
    consoleDirSpy = sandbox.spy(console, 'dir');

    loggerService = new LoggerService();
  });

  afterEach(() => {
    clock.restore();
    sandbox.restore();
  });

  describe('info', () => {
    it('should send log with metadata', () => {
      const EXPECTED_LOG = {
        level: LOG_LEVEL.INFO,
        timestamp: MOCKED_DATE_NOW_VALUE,
        message: 'info_message',
        metadata: { foo: 'bar' },
      };

      loggerService.info('info_message', { foo: 'bar' });
      expect(consoleDirSpy.calledOnceWith(EXPECTED_LOG)).to.be.true;
    });

    it('should send log without metadata', () => {
      const EXPECTED_LOG = {
        level: LOG_LEVEL.INFO,
        timestamp: MOCKED_DATE_NOW_VALUE,
        message: 'info_message',
        metadata: {},
      };

      loggerService.info('info_message');
      expect(consoleDirSpy.calledOnceWith(EXPECTED_LOG)).to.be.true;
    });
  });

  describe('warn', () => {
    it('should send log with metadata', () => {
      const EXPECTED_LOG = {
        level: LOG_LEVEL.WARN,
        timestamp: MOCKED_DATE_NOW_VALUE,
        message: 'warn_message',
        metadata: { foo: 'bar' },
      };

      loggerService.warn('warn_message', { foo: 'bar' });
      expect(consoleDirSpy.calledOnceWith(EXPECTED_LOG)).to.be.true;
    });

    it('should send log without metadata', () => {
      const EXPECTED_LOG = {
        level: LOG_LEVEL.WARN,
        timestamp: MOCKED_DATE_NOW_VALUE,
        message: 'warn_message',
        metadata: {},
      };

      loggerService.warn('warn_message');
      expect(consoleDirSpy.calledOnceWith(EXPECTED_LOG)).to.be.true;
    });
  });

  describe('error', () => {
    it('should send log with metadata', () => {
      const EXPECTED_LOG = {
        level: LOG_LEVEL.ERROR,
        timestamp: MOCKED_DATE_NOW_VALUE,
        message: 'error_message',
        metadata: { foo: 'bar' },
      };

      loggerService.error('error_message', { foo: 'bar' });
      expect(consoleDirSpy.calledOnceWith(EXPECTED_LOG)).to.be.true;
    });

    it('should send log without metadata', () => {
      const EXPECTED_LOG = {
        level: LOG_LEVEL.ERROR,
        timestamp: MOCKED_DATE_NOW_VALUE,
        message: 'error_message',
        metadata: {},
      };

      loggerService.error('error_message');
      expect(consoleDirSpy.calledOnceWith(EXPECTED_LOG)).to.be.true;
    });
  });
});
