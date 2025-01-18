import { REQUEST_PARTS } from '../constants';

export type RequestPart = (typeof REQUEST_PARTS)[keyof typeof REQUEST_PARTS];
