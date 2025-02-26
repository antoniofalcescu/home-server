import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { Pool } from 'pg';
import sinon, { SinonSpy, SinonStub, SinonStubbedInstance } from 'sinon';
import { UserDalError } from '../../../../src/common/services/user/errors';
import { UserDal } from '../../../../src/common/services/user/user-dal';
import { Storage } from '../../../../src/common/storage';
import { MOCKED_USER } from './fixtures';

chai.use(chaiAsPromised);

// TODO: maybe replace stubs with pg-mem for testing on a real DB
describe('UserDal', () => {
  const sandbox = sinon.createSandbox();

  let pgPool: SinonStubbedInstance<Pool>;
  let pgClient: { query: SinonStub; release: SinonSpy };

  let userDal: UserDal;

  beforeEach(() => {
    pgClient = {
      query: sandbox.stub(),
      release: sandbox.spy(),
    };
    pgPool = sandbox.createStubInstance(Pool);
    pgPool.connect.resolves(pgClient);
    pgClient.query.resolves({ rows: [MOCKED_USER] });

    userDal = new UserDal();
    sandbox.stub(Storage, <never>'getInstance').returns({
      getPostgres: () => pgPool,
    } as unknown as Storage);
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('getUserById', () => {
    it('should get the user by id and release pgClient', async () => {
      const user = await userDal.getUserById(MOCKED_USER.id);

      expect(pgClient.query.calledOnce).to.be.true;
      expect(user).to.deep.equal(MOCKED_USER);
      expect(pgClient.release.calledOnce).to.be.true;
    });

    it('should throw UserDalError and release pgClient', async () => {
      pgClient.query.rejects(new Error('query error'));

      await expect(userDal.getUserById(MOCKED_USER.id)).to.eventually.be.rejectedWith(UserDalError, 'query error');
      expect(pgClient.release.calledOnce).to.be.true;
    });
  });

  describe('getUserByUsername', () => {
    it('should get the user by username and release pgClient', async () => {
      const user = await userDal.getUserByUsername(MOCKED_USER.username);

      expect(pgClient.query.calledOnce).to.be.true;
      expect(user).to.deep.equal(MOCKED_USER);
      expect(pgClient.release.calledOnce).to.be.true;
    });

    it('should throw UserDalError and release pgClient', async () => {
      pgClient.query.rejects(new Error('query error'));

      await expect(userDal.getUserByUsername(MOCKED_USER.username)).to.eventually.be.rejectedWith(
        UserDalError,
        'query error'
      );
      expect(pgClient.release.calledOnce).to.be.true;
    });
  });

  describe('getUserByEmail', () => {
    it('should get the user by email and release pgClient', async () => {
      const user = await userDal.getUserByEmail(MOCKED_USER.email);

      expect(pgClient.query.calledOnce).to.be.true;
      expect(user).to.deep.equal(MOCKED_USER);
      expect(pgClient.release.calledOnce).to.be.true;
    });

    it('should throw UserDalError and release pgClient', async () => {
      pgClient.query.rejects(new Error('query error'));

      await expect(userDal.getUserByEmail(MOCKED_USER.email)).to.eventually.be.rejectedWith(
        UserDalError,
        'query error'
      );
      expect(pgClient.release.calledOnce).to.be.true;
    });
  });
});
