import { ENV_KEYS } from '../constants';

export type Env = Record<(typeof ENV_KEYS)[number], string>;
