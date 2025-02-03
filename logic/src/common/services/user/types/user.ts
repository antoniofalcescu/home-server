import { USER_ROLE } from '../constants';

type UserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE];

export type User = {
  id: string;
  username: string;
  email: string;
  password: string;
  role: UserRole;
};

export type SerializedUser = Omit<User, 'password'>;
