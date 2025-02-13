export class QueryNotSupportedError extends Error {
  constructor(queryType: string) {
    super(`Query: ${queryType} is not supported.`);
    this.name = 'QueryNotSupportedError';
  }
}
