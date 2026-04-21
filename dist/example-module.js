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
export class ExampleService {
    config;
    constructor(config) {
        this.config = config;
    }
    greet() {
        return `Hello from ${this.config.name}!`;
    }
    getInfo() {
        return this.config;
    }
    updateConfig(config) {
        this.config = config;
    }
}
export class ExampleModule {
    service;
    logger;
    constructor() {
        this.logger = new LogGenericImpl({
            prefix: 'ExampleModule',
            hasDate: true,
            hasLevel: true,
            format: ''
        });
        this.logger.level(Level.INFO);
        const defaultConfig = {
            name: 'Taulukko',
            version: '1.0.0',
            description: 'Portal do Taulukko'
        };
        if (injectController.has('example-service')) {
            this.service = injectController.resolve('example-service');
        }
        else {
            this.service = new ExampleService(defaultConfig);
            injectController.registerByName('example-service', this.service);
        }
    }
    greet() {
        return this.service.greet();
    }
    getInfo() {
        return this.service.getInfo();
    }
    static create(config) {
        const module = new ExampleModule();
        if (config) {
            if (injectController.has('example-service')) {
                const currentService = injectController.resolve('example-service');
                if (currentService) {
                    const currentConfig = currentService.getInfo();
                    const updatedConfig = {
                        name: config.name || currentConfig.name,
                        version: config.version || currentConfig.version,
                        description: config.description || currentConfig.description
                    };
                    currentService.updateConfig(updatedConfig);
                    const updatedService = injectController.resolve('example-service');
                    if (updatedService) {
                        module.service = updatedService;
                    }
                }
            }
        }
        return module;
    }
}
//# sourceMappingURL=example-module.js.map