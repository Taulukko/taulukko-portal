/**
 * Exemplo de serviço usando injectController do taulukko-commons
 *
 * REGRAS DE TIPAGEM (OBRIGATÓRIAS):
 * - Todo variável DEVE ter tipo explícito
 * - Todo parâmetro de função DEVE ter tipo explícito
 * - Todo retorno de função DEVE ter tipo explícito
 */
export interface ExampleConfig {
    name: string;
    version: string;
    enabled: boolean;
}
export declare class ExampleService {
    private config;
    private initialized;
    private logger;
    constructor(config: ExampleConfig);
    initialize(): void;
    greet(): string;
    getInfo(): ExampleConfig & {
        initialized: boolean;
        timestamp: string;
    };
    updateConfig(newConfig: Partial<ExampleConfig>): void;
}
export declare function getExampleService(config?: Partial<ExampleConfig>): ExampleService;
export declare function updateExampleServiceConfig(newConfig: Partial<ExampleConfig>): void;
export declare function clearExampleService(): void;
//# sourceMappingURL=example-service.d.ts.map