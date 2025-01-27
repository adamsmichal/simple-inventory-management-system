import * as fs from 'fs/promises';
import * as path from 'path';

import { CommandBus } from './command-bus';

export const registerHandlers = async (commandBus: CommandBus) => {
  const featuresPath = path.resolve(__dirname, '../../app/features/**/command-handlers');

  const getAllHandlerFiles = async (dir: string): Promise<string[]> => {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    const files: string[] = [];

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        files.push(...(await getAllHandlerFiles(fullPath)));
      } else if (entry.isFile() && entry.name.endsWith('.handler.ts')) {
        files.push(fullPath);
      }
    }

    return files;
  };

  const handlerFiles = await getAllHandlerFiles(featuresPath);

  handlerFiles.forEach(file => {
    const handlerModule = require(file);
    const HandlerClass = handlerModule[Object.keys(handlerModule)[0]];

    if (HandlerClass) {
      commandBus.register(new HandlerClass());
    }
  });

  return commandBus;
};
