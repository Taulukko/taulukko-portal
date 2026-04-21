/**
 * Testes para ExampleModule
 * Demonstra como testar módulos que usam injectController
 *
 * IMPORTANTE: Para testes de logging, veja também logger.test.ts
 *
 * REGRAS DE TIPAGEM (OBRIGATÓRIAS):
 * - Todo variável DEVE ter tipo explícito: `const nome: string = "valor"`
 * - Todo parâmetro de função DEVE ter tipo explícito
 * - Todo retorno de função DEVE ter tipo explícito
 * - catch blocks DEVEM usar union e tratamento explícito
 */

import { ExampleModule, ExampleService } from '../src/example-module';
import { injectController } from 'taulukko-commons';

describe('ExampleModule', () => {
  beforeEach((): void => {
    injectController.clearAll();
  });

  test('deve criar instância com configuração padrão', (): void => {
    const module: ExampleModule = new ExampleModule();

    expect(module.greet()).toBe('Hello from Taulukko!');

    const info = module.getInfo();
    expect(info.name).toBe('Taulukko');
    expect(info.version).toBe('1.0.0');
    expect(info.description).toBe('Portal do Taulukko');
  });

  test('deve criar instância com configuração customizada via create()', (): void => {
    const customConfig = {
      name: 'Custom Project',
      version: '2.0.0',
      description: 'Custom description'
    };

    const module: ExampleModule = ExampleModule.create(customConfig);

    expect(module.greet()).toBe('Hello from Custom Project!');

    const info = module.getInfo();
    expect(info.name).toBe('Custom Project');
    expect(info.version).toBe('2.0.0');
    expect(info.description).toBe('Custom description');
  });

  test('ExampleService deve funcionar independentemente', (): void => {
    const config = {
      name: 'Test Service',
      version: '1.0.0',
      description: 'Test description'
    };

    const service: ExampleService = new ExampleService(config);

    expect(service.greet()).toBe('Hello from Test Service!');
    expect(service.getInfo()).toEqual(config);
  });

  test('injectController deve gerenciar dependências corretamente', (): void => {
    const module1: ExampleModule = new ExampleModule();

    expect(injectController.has('example-service')).toBe(true);
    const service1: ExampleService | undefined = injectController.resolve<ExampleService>('example-service');
    expect(service1).toBeInstanceOf(ExampleService);
    expect(service1?.getInfo().name).toBe('Taulukko');

    service1?.updateConfig({
      name: 'Updated Name',
      version: '3.0.0',
      description: 'Updated description'
    });

    const module2: ExampleModule = new ExampleModule();
    expect(module2.greet()).toBe('Hello from Updated Name!');

    expect(module1.greet()).toBe('Hello from Updated Name!');
  });
});