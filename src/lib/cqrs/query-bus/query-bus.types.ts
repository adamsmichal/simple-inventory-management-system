export interface Query<T> {
  type: string;
  params: T;
}

export interface QueryHandler<TQuery extends Query<unknown>, TResult> {
  queryType: string;
  execute(query: TQuery): Promise<TResult>;
}
