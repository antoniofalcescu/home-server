import { TransmissionRemoteUtils } from '../../utils';
import { BufferExtractor } from './extractors';
import { TorrentData, TorrentHistory, TorrentPeers, TorrentStatus } from './types';
import { ParsedBuffer } from './types/buffer';

export class TorrentDataFromBufferBuilder {
  private readonly bufferExtractor: BufferExtractor;

  constructor() {
    this.bufferExtractor = new BufferExtractor();
  }

  public build(buffer: Buffer): TorrentData {
    const parsedBuffer = this._parseBuffer(buffer);

    return {
      id: Number(parsedBuffer.id),
      name: parsedBuffer.name,
      location: parsedBuffer.location,
      status: this._buildStatus(parsedBuffer),
      peers: this._buildPeers(parsedBuffer),
      history: this._buildHistory(parsedBuffer),
    };
  }

  private _parseBuffer(buffer: Buffer): ParsedBuffer {
    const splitBuffer = buffer.toString().split('\n');
    let parsedBuffer: Record<string, string> = {};

    for (let row of splitBuffer) {
      row = row.trimEnd();

      if (row.startsWith(' ')) {
        const [key, ...values] = row.split(':');
        const camelCaseKey = TransmissionRemoteUtils.toCamelCase(key);
        parsedBuffer[camelCaseKey] = values.join(':').trim();
      }
    }

    return parsedBuffer as ParsedBuffer;
  }

  private _buildStatus(parsedBuffer: ParsedBuffer): TorrentStatus {
    const totalSize = this.bufferExtractor.extractSize(parsedBuffer.totalSize);
    const percent = this.bufferExtractor.extractPercentage(parsedBuffer.percentDone);
    const eta = this.bufferExtractor.extractSeconds(parsedBuffer.eta);
    const downloadingTime = this.bufferExtractor.extractSeconds(parsedBuffer.downloadingTime);

    return {
      state: parsedBuffer.state,
      downloadSpeed: parsedBuffer.downloadSpeed,
      uploadSpeed: parsedBuffer.uploadSpeed,
      downloaded: parsedBuffer.downloaded,
      percent,
      totalSize,
      eta,
      downloadingTime,
    };
  }

  private _buildPeers(parsedBuffer: ParsedBuffer): TorrentPeers {
    const peers = this.bufferExtractor.extractPeers(parsedBuffer.peers);

    return {
      connectedTo: peers['connectedTo'] ?? 0,
      uploadingTo: peers['uploadingTo'] ?? 0,
      downloadingFrom: peers['downloadingFrom'] ?? 0,
    };
  }

  private _buildHistory(parsedBuffer: ParsedBuffer): TorrentHistory {
    const added = this.bufferExtractor.extractTimestamp(parsedBuffer.dateAdded);
    const started = this.bufferExtractor.extractTimestamp(parsedBuffer.dateStarted);
    const latestActivity = this.bufferExtractor.extractTimestamp(parsedBuffer.latestActivity);

    return {
      added,
      started,
      latestActivity,
    };
  }
}
