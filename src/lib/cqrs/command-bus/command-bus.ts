import { CommandNotSupportedError } from './command-bus.error';
import { Command, CommandHandler } from './command-bus.types';

export class CommandBus {
  private handlers: Map<string, CommandHandler<Command<unknown>, unknown>> = new Map();

  register<TCommand extends Command<unknown>, TResult>(handler: CommandHandler<TCommand, TResult>) {
    this.handlers.set(handler.commandType, handler);
  }

  async execute<TCommand extends Command<unknown>, TResult>(command: TCommand): Promise<TResult> {
    const handler = this.handlers.get(command.type) as CommandHandler<TCommand, TResult>;

    if (!handler) {
      throw new CommandNotSupportedError(command.type);
    }

    return handler.execute(command);
  }
}
