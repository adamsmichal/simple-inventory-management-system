export class CommandNotSupportedError extends Error {
  constructor(commandType: string) {
    super(`Command: ${commandType} is not supported.`);
    this.name = 'CommandNotSupportedError';
  }
}
