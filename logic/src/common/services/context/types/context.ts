import { Session } from '../../../../services/session/types';
import { SerializedUser } from '../../user/types';

export type Context = {
  session: Session;
  user: SerializedUser;
};
