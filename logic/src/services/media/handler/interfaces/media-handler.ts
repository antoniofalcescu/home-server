export interface MediaHandler {
  afterDownload(): Promise<void>;
}
