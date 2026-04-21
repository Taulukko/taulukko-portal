/**
 * Exemplo de serviço usando injectController do taulukko-commons
 *
 * REGRAS DE TIPAGEM (OBRIGATÓRIAS):
 * - Todo variável DEVE ter tipo explícito
 * - Todo parâmetro de função DEVE ter tipo explícito
 * - Todo retorno de função DEVE ter tipo explícito
 */
import { injectController, LogGenericImpl, Level } from 'taulukko-commons';
export class ExampleService {
    config;
    initialized = false;
    logger;
    constructor(config) {
        this.config = config;
        this.logger = new LogGenericImpl({
            prefix: 'ExampleService',
            hasDate: true,
            hasLevel: true,
            format: ''
        });
        this.logger.level(Level.INFO);
    }
    initialize() {
        if (this.initialized) {
            return;
        }
        this.logger.info(`Inicializando ${this.config.name} v${this.config.version}`);
        this.initialized = true;
    }
    greet() {
        if (!this.initialized) {
            this.initialize();
        }
        return `Hello from ${this.config.name} v${this.config.version}!`;
    }
    getInfo() {
        return {
            ...this.config,
            initialized: this.initialized,
            timestamp: new Date().toISOString()
        };
    }
    updateConfig(newConfig) {
        Object.assign(this.config, newConfig);
        this.logger.info(`Configuração atualizada para ${this.config.name} v${this.config.version}`);
    }
}
export function getExampleService(config) {
    const defaultConfig = {
        name: 'Taulukko',
        version: '1.0.0',
        enabled: true
    };
    const finalConfig = config ? { ...defaultConfig, ...config } : defaultConfig;
    if (injectController.has('example-service')) {
        const existingService = injectController.resolve('example-service');
        if (config && existingService) {
            existingService.updateConfig(config);
        }
        return existingService;
    }
    const service = new ExampleService(finalConfig);
    injectController.registerByName('example-service', service);
    return service;
}
export function updateExampleServiceConfig(newConfig) {
    if (injectController.has('example-service')) {
        const service = injectController.resolve('example-service');
        if (service) {
            service.updateConfig(newConfig);
        }
    }
}
export function clearExampleService() {
    injectController.unregister('example-service');
}
//# sourceMappingURL=example-service.js.map