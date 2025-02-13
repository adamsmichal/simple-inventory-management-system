export interface Command<T> {
  type: string;
  payload: T;
}

export interface CommandHandler<TCommand extends Command<unknown>, TResult> {
  commandType: string;
  execute(command: TCommand): Promise<TResult>;
}
