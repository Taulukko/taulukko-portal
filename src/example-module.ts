/**
 * Módulo de exemplo para Taulukko
 * Demonstra uso do injectController do taulukko-commons seguindo padrão SOLID
 *
 * REGRAS DE TIPAGEM (OBRIGATÓRIAS):
 * - Todo variável DEVE ter tipo explícito
 * - Todo parâmetro de função DEVE ter tipo explícito
 * - Todo retorno de função DEVE ter tipo explícito
 */

import { injectController, LogGenericImpl, Level } from 'taulukko-commons';

export interface ExampleConfig {
  name: string;
  version: string;
  description: string;
}

export class ExampleService {
  constructor(private config: ExampleConfig) {}

  public greet(): string {
    return `Hello from ${this.config.name}!`;
  }

  public getInfo(): ExampleConfig {
    return this.config;
  }

  public updateConfig(config: ExampleConfig): void {
    this.config = config;
  }
}

export class ExampleModule {
  private service: ExampleService;
  private logger: LogGenericImpl;

  constructor() {
    this.logger = new LogGenericImpl({
      prefix: 'ExampleModule',
      hasDate: true,
      hasLevel: true,
      format: ''
    });
    this.logger.level(Level.INFO);
    const defaultConfig: ExampleConfig = {
      name: 'Taulukko',
      version: '1.0.0',
      description: 'Portal do Taulukko'
    };

    if (injectController.has('example-service')) {
      this.service = injectController.resolve<ExampleService>('example-service') as ExampleService;
    } else {
      this.service = new ExampleService(defaultConfig);
      injectController.registerByName('example-service', this.service);
    }
  }

  public greet(): string {
    return this.service.greet();
  }

  public getInfo(): ExampleConfig {
    return this.service.getInfo();
  }

  public static create(config?: Partial<ExampleConfig>): ExampleModule {
    const module: ExampleModule = new ExampleModule();

    if (config) {
      if (injectController.has('example-service')) {
        const currentService: ExampleService | undefined = injectController.resolve<ExampleService>('example-service');
        if (currentService) {
          const currentConfig: ExampleConfig = currentService.getInfo();

          const updatedConfig: ExampleConfig = {
            name: config.name || currentConfig.name,
            version: config.version || currentConfig.version,
            description: config.description || currentConfig.description
          };

          currentService.updateConfig(updatedConfig);

          const updatedService: ExampleService | undefined = injectController.resolve<ExampleService>('example-service');
          if (updatedService) {
            module.service = updatedService;
          }
        }
      }
    }

    return module;
  }
}