// TODO; maybe have a decorator/builder to create file handling cmds (e.g builder.addX.addY.addZ.build())
import { MediaHandler } from '../../interfaces';

export class JellyfinMediaHandler implements MediaHandler {
  public async transferMedia(): Promise<void> {}
}
