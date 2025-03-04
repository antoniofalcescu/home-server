import { EnvHelper } from '../../../../../common/helpers';
import { CommandBuilder } from '../../../../../common/helpers/command-helper';
import { MediaHandler } from '../../interfaces';
import { Media } from '../../types';

export class JellyfinMediaHandler implements MediaHandler {
  private readonly commandBuilder: CommandBuilder;

  constructor() {
    this.commandBuilder = new CommandBuilder();
  }

  public async onDownloadFinished(media: Media): Promise<void> {
    const { ABSOLUTE_PATH_DOWNLOADS, ABSOLUTE_PATH_JELLYFIN } = EnvHelper.get();
    const { name, newName } = media;

    const sourcePath = `${ABSOLUTE_PATH_DOWNLOADS}/${name}`;
    const targetPath = `${ABSOLUTE_PATH_JELLYFIN}/${newName ?? name}`;
    const command = this.commandBuilder.mv(sourcePath, targetPath).build();
    await command.execute();
  }
}
