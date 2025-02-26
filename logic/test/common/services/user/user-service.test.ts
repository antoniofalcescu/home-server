import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinon, { SinonStubbedInstance } from 'sinon';
import { UserService } from '../../../../src/common/services/user';
import { UserNotFoundError } from '../../../../src/common/services/user/errors';
import { UserDal } from '../../../../src/common/services/user/user-dal';
import { MOCKED_USER } from './fixtures';

chai.use(chaiAsPromised);

describe('UserService', () => {
  const sandbox = sinon.createSandbox();

  let userDal: SinonStubbedInstance<UserDal>;
  let userService: UserService;

  beforeEach(() => {
    userDal = sandbox.createStubInstance(UserDal);

    userService = new UserService();
    sandbox.stub(userService, <never>'userDal').value(userDal);
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('getUserById', () => {
    it('should return user when finding user in DB', async () => {
      userDal.getUserById.resolves(MOCKED_USER);

      const user = await userService.getUserById(MOCKED_USER.id);

      expect(userDal.getUserById.calledOnceWithExactly(MOCKED_USER.id)).to.be.true;
      expect(user).to.deep.equal(MOCKED_USER);
    });

    it('should throw UserNotFoundError when not finding user in DB', async () => {
      userDal.getUserById.resolves(undefined);

      await expect(userService.getUserById('missing_id')).to.eventually.be.rejectedWith(
        UserNotFoundError,
        'Failed to find user'
      );
      expect(userDal.getUserById.calledOnceWithExactly('missing_id')).to.be.true;
    });
  });

  describe('getUserByUsername', () => {
    it('should return user when finding user in DB', async () => {
      userDal.getUserByUsername.resolves(MOCKED_USER);

      const user = await userService.getUserByUsername(MOCKED_USER.username);

      expect(userDal.getUserByUsername.calledOnceWithExactly(MOCKED_USER.username)).to.be.true;
      expect(user).to.deep.equal(MOCKED_USER);
    });

    it('should throw UserNotFoundError when not finding user in DB', async () => {
      userDal.getUserByUsername.resolves(undefined);

      await expect(userService.getUserByUsername('missing_username')).to.eventually.be.rejectedWith(
        UserNotFoundError,
        'Failed to find user'
      );
      expect(userDal.getUserByUsername.calledOnceWithExactly('missing_username')).to.be.true;
    });
  });

  describe('getUserByEmail', () => {
    it('should return user when finding user in DB', async () => {
      userDal.getUserByEmail.resolves(MOCKED_USER);

      const user = await userService.getUserByEmail(MOCKED_USER.email);

      expect(userDal.getUserByEmail.calledOnceWithExactly(MOCKED_USER.email)).to.be.true;
      expect(user).to.deep.equal(MOCKED_USER);
    });

    it('should throw UserNotFoundError when not finding user in DB', async () => {
      userDal.getUserByEmail.resolves(undefined);

      await expect(userService.getUserByEmail('missing_email')).to.eventually.be.rejectedWith(
        UserNotFoundError,
        'Failed to find user'
      );
      expect(userDal.getUserByEmail.calledOnceWithExactly('missing_email')).to.be.true;
    });
  });
});
