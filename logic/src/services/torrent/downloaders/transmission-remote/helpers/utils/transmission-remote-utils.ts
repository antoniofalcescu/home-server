export class TransmissionRemoteUtils {
  public static toCamelCase(str: string): string {
    return str
      .trim()
      .toLowerCase()
      .replace(/^\w|[A-Z]|\b\w/g, (match, index) => (index === 0 ? match.toLowerCase() : match.toUpperCase()))
      .replace(/\s+/g, ''); // Remove spaces
  }
}
