import { ChmodOptions, ChownOptions } from '../types';

export const DEFAULT_CHMOD_OPTIONS: ChmodOptions = {
  isRecursive: false,
} as const;

export const DEFAULT_CHOWN_OPTIONS: ChownOptions = {
  isRecursive: false,
} as const;
