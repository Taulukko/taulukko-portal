/**
 * Taulukko - Portal do Taulukko
 *
 * REGRAS DE TIPAGEM (OBRIGATÓRIAS):
 * - Todo variável DEVE ter tipo explícito
 * - Todo parâmetro de função DEVE ter tipo explícito
 * - Todo retorno de função DEVE ter tipo explícito
 */

import { ExampleModule } from './example-module';
import { LogGenericImpl, Level } from 'taulukko-commons';

export * from './example-module';

const logger: LogGenericImpl = new LogGenericImpl({
  prefix: 'Taulukko',
  hasDate: true,
  hasLevel: true,
  format: ''
});
logger.level(Level.INFO);

export function initialize(): void {
  logger.info(`Taulukko v1.0.0 initialized`);
  logger.info(`Project: Portal do Taulukko`);
  logger.info(`Author: Edson Vicente Carli Junior`);
  logger.info('Architecture: TypeScript-first with SOLID pattern');

  const module: ExampleModule = new ExampleModule();
  logger.info(module.greet());
}

export function updateProjectInfo(newName?: string, newDescription?: string): void {
  const updatedConfig: Partial<{ name: string; description: string }> = {};

  if (newName) updatedConfig.name = newName;
  if (newDescription) updatedConfig.description = newDescription;

  const updatedModule: ExampleModule = ExampleModule.create(updatedConfig);
  logger.info('Project info updated:', updatedModule.getInfo());
}