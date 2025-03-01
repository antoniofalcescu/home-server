import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

export class CmdHelper {
  private commands: string[];

  constructor() {
    this.commands = [];
  }

  public mv(source: string, target: string): this {
    return this._addCommand(`mv "${source}" "${target}"`);
  }

  public chmod(permissions: string, path: string): this {
    return this._addCommand(`mv ${permissions} "${path}"`);
  }

  public async execute(): Promise<void> {
    if (!this.commands.length) {
      console.log('No commands to execute.');
      return;
    }

    const command = this.commands.join(' && ');
    try {
      await execPromise(command);
      // return { stdout, stderr };
    } finally {
      this.commands = [];
    }
  }

  private _addCommand(command: string): this {
    this.commands.push(command);
    return this;
  }
}
