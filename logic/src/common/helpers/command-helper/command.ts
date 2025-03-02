import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

export class Command {
  constructor(private readonly commandStringified: string) {}

  public async execute(): Promise<void> {
    // TODO: treat output
    await execPromise(this.commandStringified);
  }
}
