import { EnvHelper } from '../../../../../common/helpers';
import { CommandBuilder } from '../../../../../common/helpers/command-helper';
import { MediaHandler } from '../../interfaces';
import { Media } from '../../types';
import { ON_DOWNLOAD_FINISHED } from './constants';

export class JellyfinMediaHandler implements MediaHandler {
  private readonly commandBuilder: CommandBuilder;

  constructor() {
    this.commandBuilder = new CommandBuilder();
  }

  // TODO: test this and see how it works on a real folder
  public async onDownloadFinished(media: Media): Promise<void> {
    const { ABSOLUTE_PATH_DOWNLOADS, ABSOLUTE_PATH_JELLYFIN } = EnvHelper.get();
    const { name } = media;
    const parsedName = this._parseMediaName(name);

    const sourcePath = `${ABSOLUTE_PATH_DOWNLOADS}/${name}`;
    const targetPath = `${ABSOLUTE_PATH_JELLYFIN}/${parsedName}`;
    const command = this.commandBuilder
      .mv(sourcePath, targetPath)
      .chmod(ON_DOWNLOAD_FINISHED.FLAGS, ON_DOWNLOAD_FINISHED.ACL, targetPath)
      .build();
    console.log(command);
    await command.execute();
  }

  // TODO: treat input like this: 1917.2019.2160p.UHD.BluRay.TrueHD.7.1.HDR.x265-Chotab
  //  maybe take the first year from right to left and use that instead of the first one from left to right
  /**
   * Parses the given media name to extract and format the title and year
   *
   * @param {string} name - The original media name, e.g., "Deadpool.&.Wolverine.2024.2160p..."
   * @returns {string} - The formatted media name, e.g., "Deadpool & Wolverine (2024)"
   */
  private _parseMediaName(name: string): string {
    const yearMatch = name.match(/\b(19|20)\d{2}\b/);
    if (!yearMatch) {
      return name.trim();
    }

    const year = yearMatch[0];
    const titlePart = name.split(year)[0];
    const title = titlePart.replace(/[.]/g, ' ');

    return `${title.trim()} (${year})`;
  }
}
