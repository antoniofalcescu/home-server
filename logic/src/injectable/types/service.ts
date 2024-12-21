import { SERVICE_NAME } from '../constants';

export type ServiceData = {
  name: string;
  path: string;
};

export type ServiceName = (typeof SERVICE_NAME)[keyof typeof SERVICE_NAME];
