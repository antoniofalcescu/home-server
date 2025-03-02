import { CommandBuilder } from '../../../../../common/helpers/command-helper';
import { MediaHandler } from '../../interfaces';
import { MediaHandlerType } from '../../types';

export class JellyfinMediaHandler implements MediaHandler {
  private readonly type: MediaHandlerType;

  private readonly commandBuilder: CommandBuilder;

  constructor(type: MediaHandlerType) {
    this.type = type;
    this.commandBuilder = new CommandBuilder();
  }

  public async afterDownload(): Promise<void> {
    // const command = this.commandBuilder.mv();
  }
}
