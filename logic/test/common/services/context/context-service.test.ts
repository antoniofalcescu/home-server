import { expect } from 'chai';
import { createSandbox, SinonStub, SinonStubbedInstance } from 'sinon';
import { ContextService } from '../../../../src/common/services/context';
import { Context } from '../../../../src/common/services/context/types';
import { UserService } from '../../../../src/common/services/user';
import { USER_ROLE } from '../../../../src/common/services/user/constants';
import { Container } from '../../../../src/injectable';
import { SERVICE_NAME } from '../../../../src/injectable/constants';
import { SessionService } from '../../../../src/services/session';

describe('ContextService', () => {
  const sandbox = createSandbox();
  let sessionService: SinonStubbedInstance<SessionService>;
  let userService: SinonStubbedInstance<UserService>;
  let containerGetStub: SinonStub;
  let contextService: ContextService;

  let userId: string;
  let expectedContext: Context;

  beforeEach(() => {
    sessionService = sandbox.createStubInstance(SessionService);
    userService = sandbox.createStubInstance(UserService);

    containerGetStub = sandbox.stub(Container, 'get');
    containerGetStub.withArgs(SERVICE_NAME.SESSION).returns(sessionService);
    containerGetStub.withArgs(SERVICE_NAME.USER).returns(userService);

    contextService = new ContextService();

    userId = 'test-user-id';
    const mockSession = { torrent: { cookies: 'test-cookies' } };
    const mockUser = {
      id: userId,
      username: 'testuser',
      email: 'test@example.com',
      role: USER_ROLE.USER,
      password: 'hashed',
    };

    expectedContext = {
      session: { torrent: { cookies: 'test-cookies' } },
      user: {
        id: userId,
        username: 'testuser',
        email: 'test@example.com',
        role: USER_ROLE.USER,
      },
    };

    sessionService.getSession.resolves(mockSession);
    userService.getUserById.withArgs(userId).resolves(mockUser);
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('init', () => {
    it('should correctly construct Context object from session and user data', async () => {
      const result = await contextService.init(userId);

      expect(result).to.deep.equal(expectedContext);
      expect(sessionService.getSession.calledOnce).to.be.true;
      expect(userService.getUserById.calledOnceWithExactly(userId)).to.be.true;
    });
  });
});
