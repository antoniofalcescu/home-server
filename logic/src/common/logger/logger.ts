import { LOG_LEVEL } from './constants';

export class Logger {
  public info(message: string, metadata: object) {
    const log = {
      level: LOG_LEVEL.INFO,
      timestamp: Date.now(),
      message,
      metadata,
    };
    console.dir(log, { colors: true, depth: null });
  }

  public warn(message: string, metadata: object) {
    const log = {
      level: LOG_LEVEL.WARN,
      timestamp: Date.now(),
      message,
      metadata,
    };
    console.dir(log, { colors: true, depth: null });
  }

  public error(message: string, metadata: object) {
    const log = {
      level: LOG_LEVEL.ERROR,
      timestamp: Date.now(),
      message,
      metadata,
    };
    console.dir(log, { colors: true, depth: null });
  }
}
