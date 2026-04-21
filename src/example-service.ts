/**
 * Exemplo de serviço usando injectController do taulukko-commons
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
  enabled: boolean;
}

export class ExampleService {
  private initialized: boolean = false;
  private logger: LogGenericImpl;

  constructor(private config: ExampleConfig) {
    this.logger = new LogGenericImpl({
      prefix: 'ExampleService',
      hasDate: true,
      hasLevel: true,
      format: ''
    });
    this.logger.level(Level.INFO);
  }

  public initialize(): void {
    if (this.initialized) {
      return;
    }

    this.logger.info(`Inicializando ${this.config.name} v${this.config.version}`);
    this.initialized = true;
  }

  public greet(): string {
    if (!this.initialized) {
      this.initialize();
    }

    return `Hello from ${this.config.name} v${this.config.version}!`;
  }

  public getInfo(): ExampleConfig & { initialized: boolean; timestamp: string } {
    return {
      ...this.config,
      initialized: this.initialized,
      timestamp: new Date().toISOString()
    };
  }

  public updateConfig(newConfig: Partial<ExampleConfig>): void {
    Object.assign(this.config, newConfig);
    this.logger.info(`Configuração atualizada para ${this.config.name} v${this.config.version}`);
  }
}

export function getExampleService(config?: Partial<ExampleConfig>): ExampleService {
  const defaultConfig: ExampleConfig = {
    name: 'Taulukko',
    version: '1.0.0',
    enabled: true
  };

  const finalConfig: ExampleConfig = config ? { ...defaultConfig, ...config } : defaultConfig;

  if (injectController.has('example-service')) {
    const existingService: ExampleService | undefined = injectController.resolve<ExampleService>('example-service');

    if (config && existingService) {
      existingService.updateConfig(config);
    }
    return existingService as ExampleService;
  }

  const service: ExampleService = new ExampleService(finalConfig);
  injectController.registerByName('example-service', service);
  return service;
}

export function updateExampleServiceConfig(newConfig: Partial<ExampleConfig>): void {
  if (injectController.has('example-service')) {
    const service: ExampleService | undefined = injectController.resolve<ExampleService>('example-service');
    if (service) {
      service.updateConfig(newConfig);
    }
  }
}

export function clearExampleService(): void {
  injectController.unregister('example-service');
}