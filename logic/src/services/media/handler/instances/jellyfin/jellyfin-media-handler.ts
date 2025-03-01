import { CmdHelper } from '../../../../../common/helpers/cmd-helper';
import { MediaHandler } from '../../interfaces';

export class JellyfinMediaHandler implements MediaHandler {
  private readonly cmdHelper: CmdHelper;

  constructor() {
    this.cmdHelper = new CmdHelper();
  }

  // TODO: here I can use instantiated cmdHelper to create request
  public async transferMedia(): Promise<void> {}
}
