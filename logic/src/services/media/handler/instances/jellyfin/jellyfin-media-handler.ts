import { EnvHelper } from '../../../../../common/helpers';
import { CommandHelper } from '../../../../../common/helpers/command-helper';
import { MediaHandler } from '../../interfaces';
import { Media, MediaHandlerDependencies } from '../../types';

export class JellyfinMediaHandler implements MediaHandler {
  private readonly dependencies: MediaHandlerDependencies;

  private readonly commandHelper: CommandHelper;

  constructor(dependencies: MediaHandlerDependencies) {
    this.dependencies = dependencies;
    this.commandHelper = new CommandHelper();
  }

  // TODO: test this and see how it works on a real folder
  public async onDownloadFinished(media: Media): Promise<void> {
    const { ABSOLUTE_PATH_DOWNLOADS, ABSOLUTE_PATH_JELLYFIN } = EnvHelper.get();
    const { name } = media;

    console.log(media);
    let parsedName = this._parseMediaName(name);
    if (!parsedName) {
      this.dependencies.loggerService.info('Could not parse media name', { media });
      parsedName = name;
    }

    console.log(parsedName);

    const sourcePath = `${ABSOLUTE_PATH_DOWNLOADS}/${name}`;
    const targetPath = `${ABSOLUTE_PATH_JELLYFIN}/${parsedName}`;
    this.commandHelper.mv(sourcePath, targetPath).chmod(targetPath, '755').chown(targetPath, 'antonio').execute();
  }

  /**
   * Parses the given media name to extract and format the title and year
   *
   * @param {string} name - The original media name, e.g., "Deadpool.&.Wolverine.2024.2160p..."
   * @returns {string} - The formatted media name, e.g., "Deadpool & Wolverine (2024)"
   */
  private _parseMediaName(name: string): string | null {
    const yearMatch = name.match(/\b(19|20)\d{2}\b/g);
    if (!yearMatch || yearMatch.length === 0) {
      return null;
    }

    const year = yearMatch[yearMatch.length - 1];
    const titlePart = name.split(year)[0];
    const title = titlePart.replace(/[.]/g, ' ').trim();

    return title === '' ? null : `${title} (${year})`;
  }
}
