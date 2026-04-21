/**
 * Taulukko - Portal do Taulukko
 *
 * REGRAS DE TIPAGEM (OBRIGATÓRIAS):
 * - Toda variavel DEVE ter tipo explicito
 * - Todo parametro de funcao DEVE ter tipo explicito
 * - Todo retorno de funcao DEVE ter tipo explicito
 */

import express, { type Express, type Request, type Response } from 'express';
import { type Server } from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

import { ExampleModule } from './example-module.js';
import { LogGenericImpl, Level } from 'taulukko-commons';

export * from './example-module.js';

const logger: LogGenericImpl = new LogGenericImpl({
  prefix: 'Taulukko',
  hasDate: true,
  hasLevel: true,
  format: ''
});
const currentFilePath: string = fileURLToPath(import.meta.url);
const currentDirectoryPath: string = dirname(currentFilePath);
const publicDirectoryPath: string = path.join(currentDirectoryPath, '..', 'public');
let hasInitialized: boolean = false;
const DEFAULT_PORT =7777;

logger.level(Level.INFO);

export function initialize(): void {
  if (hasInitialized) {
    return;
  }

  logger.info('Taulukko v1.0.0 initialized');
  logger.info('Project: Portal do Taulukko');
  logger.info('Author: Edson Vicente Carli Junior');
  logger.info('Architecture: TypeScript-first with SOLID pattern');

  const module: ExampleModule = new ExampleModule();
  logger.info(module.greet());
  hasInitialized = true;
}

export function updateProjectInfo(newName?: string, newDescription?: string): void {
  const updatedConfig: Partial<{ name: string; description: string }> = {};

  if (newName) {
    updatedConfig.name = newName;
  }

  if (newDescription) {
    updatedConfig.description = newDescription;
  }

  const updatedModule: ExampleModule = ExampleModule.create(updatedConfig);
  logger.info(`Project info updated: ${JSON.stringify(updatedModule.getInfo())}`);
}

export function createApp(): Express {
  const app: Express = express();

  app.use(express.static(publicDirectoryPath));
  app.get('/', (_request: Request, response: Response): void => {
    response.sendFile(path.join(publicDirectoryPath, 'index.html'));
  });
  app.use((_request: Request, response: Response): void => {
    response.redirect('/');
  });

  return app;
}

export function resolvePort(portFromArgument?: number): number {
  if (typeof portFromArgument === 'number' && !Number.isNaN(portFromArgument)) {
    return portFromArgument;
  }

  const parsedPort: number = Number.parseInt(process.env.PORT ?? `${DEFAULT_PORT}`, 10);
  if (Number.isNaN(parsedPort)) {
     logger.info(`Taulukko: using port default ${DEFAULT_PORT}`);
    return DEFAULT_PORT;
  }

  return parsedPort;
}

export function startServer(portFromArgument?: number): Server {
  initialize();

  const app: Express = createApp();
  const port: number = resolvePort(portFromArgument);

  return app.listen(port, (): void => {
    logger.info(`Taulukko: listening on port ${port}`);
  });
}

const executedFilePath: string | undefined = process.argv[1];
const isDirectExecution: boolean = typeof executedFilePath === 'string'
  && path.resolve(executedFilePath) === currentFilePath;

if (isDirectExecution) {
  startServer();
}
