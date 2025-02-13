import { QueryHandler, Query } from './query-bus.types';
import { QueryNotSupportedError } from './query-bus.error';

export class QueryBus {
  private handlers: Map<string, QueryHandler<Query<unknown>, unknown>> = new Map();

  register<TQuery extends Query<unknown>, TResult>(handler: QueryHandler<TQuery, TResult>) {
    this.handlers.set(handler.queryType, handler);
  }

  async execute<TQuery extends Query<unknown>, TResult>(query: TQuery): Promise<TResult> {
    const handler = this.handlers.get(query.type) as QueryHandler<TQuery, TResult>;

    if (!handler) {
      throw new QueryNotSupportedError(query.type);
    }

    return handler.execute(query);
  }
}
