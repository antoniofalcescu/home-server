import { execSync } from 'node:child_process';
import * as fs from 'node:fs';
import path from 'node:path';
import { DEFAULT_CHMOD_OPTIONS, DEFAULT_CHOWN_OPTIONS } from './constants';
import { ChmodOptions, ChownOptions } from './types';

export class CommandHelper {
  private readonly commands: (() => void)[];

  constructor() {
    this.commands = [];
  }

  public mv(source: string, target: string): this {
    this.commands.push(() => fs.renameSync(source, target));
    return this;
  }

  public chown(source: string, user: string, options: ChownOptions = DEFAULT_CHOWN_OPTIONS): this {
    const { isRecursive } = options;
    const { uid, gid } = this._getUserIds(user);

    this.commands.push(() => fs.chownSync(source, uid, gid));

    if (isRecursive) {
      const files = fs.readdirSync(source);

      for (const file of files) {
        const sourcePath = path.join(source, file);
        const stats = fs.statSync(sourcePath);

        if (stats.isDirectory()) {
          this.chown(sourcePath, user, options);
        } else {
          this.commands.push(() => fs.chownSync(sourcePath, uid, gid));
        }
      }
    }

    return this;
  }

  public chmod(source: string, mode: string, options: ChmodOptions = DEFAULT_CHMOD_OPTIONS): this {
    const { isRecursive } = options;

    this.commands.push(() => fs.chmodSync(source, mode));

    if (isRecursive) {
      const files = fs.readdirSync(source);

      for (const file of files) {
        const sourcePath = path.join(source, file);
        const stats = fs.statSync(sourcePath);

        if (stats.isDirectory()) {
          this.chmod(sourcePath, mode, options);
        } else {
          this.commands.push(() => fs.chmodSync(sourcePath, mode));
        }
      }
    }

    return this;
  }

  public execute(): void {
    this.commands.forEach((command) => command());
  }

  private _getUserIds(user: string): { uid: number; gid: number } {
    const result = execSync(`id ${user}`).toString().trim();

    const uidMatch = result.match(/uid=(\d+)/);
    const gidMatch = result.match(/gid=(\d+)/);

    if (!uidMatch || !gidMatch) {
      throw new Error('Failed to get uid and gid');
    }

    return { uid: parseInt(uidMatch[1], 10), gid: parseInt(gidMatch[1], 10) };
  }
}
