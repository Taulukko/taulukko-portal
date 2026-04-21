/**
 * Módulo de exemplo para Taulukko
 * Demonstra uso do injectController do taulukko-commons seguindo padrão SOLID
 *
 * REGRAS DE TIPAGEM (OBRIGATÓRIAS):
 * - Todo variável DEVE ter tipo explícito
 * - Todo parâmetro de função DEVE ter tipo explícito
 * - Todo retorno de função DEVE ter tipo explícito
 */
export interface ExampleConfig {
    name: string;
    version: string;
    description: string;
}
export declare class ExampleService {
    private config;
    constructor(config: ExampleConfig);
    greet(): string;
    getInfo(): ExampleConfig;
    updateConfig(config: ExampleConfig): void;
}
export declare class ExampleModule {
    private service;
    private logger;
    constructor();
    greet(): string;
    getInfo(): ExampleConfig;
    static create(config?: Partial<ExampleConfig>): ExampleModule;
}
//# sourceMappingURL=example-module.d.ts.map