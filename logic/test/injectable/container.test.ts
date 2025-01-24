import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import { InjectableError } from '../../src/injectable/errors';
import { SERVICES, TestService } from './fixtures';

chai.use(chaiAsPromised);

describe('Container', () => {
  const sandbox = sinon.createSandbox();

  let readFileSyncStub: sinon.SinonStub;
  let Container: typeof import('../../src/injectable/container').Container;

  beforeEach(() => {
    readFileSyncStub = sandbox.stub();
    readFileSyncStub.returns(JSON.stringify(SERVICES));

    const containerModule = proxyquire('../../src/injectable/container', {
      'node:fs': { readFileSync: readFileSyncStub },
    });

    Container = containerModule.Container;
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('init', () => {
    it('should initialize services based on services.json', async () => {
      await Container.init();

      const testService = Container.get<TestService>('TestService');

      expect(testService).to.exist;
    });

    it('should throw InjectableError if any error occurs', async () => {
      readFileSyncStub.throws(new Error('Error in fs.readFileSync'));

      expect(Container.init()).to.eventually.be.rejectedWith(InjectableError, 'Failed to initialize DI container');
    });
  });

  describe('get', () => {
    it('should get service', async () => {
      await Container.init();

      const testService = Container.get<TestService>('TestService');

      expect(testService).to.exist;
      expect(testService).to.be.instanceof(TestService);
    });

    it('should throw InjectableError if service is not initialized', () => {
      expect(Container.get.bind(Container, 'MissingService')).to.throw(InjectableError, 'Failed to get service');
    });
  });
});
