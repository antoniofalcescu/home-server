import { TransmissionRemoteUtils } from '../../../utils';

export class BufferExtractor {
  /**
   * Extracts the relevant size out of a detailed size field of ParsedBuffer
   *
   * @param {string} detailedSize - A string like '15.95 GB ...'
   * @returns {string} - The extracted substring like '15.95 GB'
   *
   * @example
   * const size = this.extractSize('15.95 GB (15.95 GB wanted');
   * console.log(size); // 15.95 GB
   */
  public extractSize(detailedSize: string): string {
    const [size, unitOfMeasurement] = detailedSize.split(' ');
    return `${size} ${unitOfMeasurement}`;
  }

  /**
   * Extracts the percentDone numeric value out of a detailed percentage field of ParsedBuffer
   *
   * @param {string} percentDone - A string like '12.0%'
   * @returns {number} - The extracted number like 12.0
   *
   * @example
   * const percent = this.extractPercentage('12.0%');
   * console.log(percent); // 12.0
   */
  public extractPercentage(percentDone: string): number {
    const PERCENTAGE_SIGN_INDEX = -1;
    return Number(percentDone.slice(0, PERCENTAGE_SIGN_INDEX));
  }

  /**
   * Extracts seconds out of a detailed seconds field of ParsedBuffer
   *
   * @param {string} detailedSeconds - A string like '1 minute, 10 seconds (70 seconds)'
   * @returns {number} - The extracted number like 70
   *
   * @example
   * const seconds = this.extractSeconds('1 minute, 10 seconds (70 seconds)');
   * console.log(seconds); // 70
   */
  public extractSeconds(detailedSeconds: string): number {
    const [_, secondsInParentheses] = detailedSeconds.split('(');
    const [secondsValue] = secondsInParentheses.split(' ');
    return Number(secondsValue);
  }

  /**
   * Extracts peers out of a detailed peers field of ParsedBuffer
   *
   * @param {string} detailedPeers - A string like 'connected to 0'
   * @returns {Record<string, number>} - An object that maps the key to the numeric value like { connectedTo: 0 }
   *
   * @example
   *
   * const peers = this.extractPeers('connected to 0, uploading to 0, downloading from 0');
   * console.log(peers); // { connectedTo: 0, uploadingTo: 0, downloadingFrom: 0 }
   */
  public extractPeers(detailedPeers: string): Record<string, number> {
    const peers: Record<string, number> = {};

    const splitDetailedPeers = detailedPeers.trim().split(', ');
    for (const detailedPeer of splitDetailedPeers) {
      const [action, relation, value] = detailedPeer.trim().split(' ');
      const key = TransmissionRemoteUtils.toCamelCase([action, relation].join(' '));
      peers[key] = Number(value);
    }
    return peers;
  }

  /**
   * Extracts timestamp out of a string date field of ParsedBuffer
   *
   * @param {string} date - A string like 'Wed Jan 08 07:08:17 2025'
   * @returns {number} - The timestamp of that date like 1736312897000
   *
   * @example
   *
   * const timestamp = this.extractTimestamp('Wed Jan 08 07:08:17 2025');
   * console.log(timestamp); // 1736312897000
   */
  public extractTimestamp(date: string): number {
    return new Date(date).getTime();
  }
}
