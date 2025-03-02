import { Command } from './command';

export class CommandBuilder {
  private commands: string[];

  constructor() {
    this.commands = [];
  }

  public build(): Command {
    if (!this.commands.length) {
      throw new Error('No commands to execute');
    }

    const commandStringified = this.commands.join(' && ');
    return new Command(commandStringified);
  }

  public mv(source: string, target: string): this {
    return this._addCommand(`mv "${source}" "${target}"`);
  }

  public chmod(permissions: string, path: string): this {
    return this._addCommand(`chmod ${permissions} "${path}"`);
  }

  private _addCommand(command: string): this {
    this.commands.push(command);
    return this;
  }
}
