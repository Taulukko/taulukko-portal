# taulukko-portal

Portal/landing page do Taulukko servida por um servidor Express simples. O entrypoint oficial fica em `src/index.ts`, o build gera `dist/index.js` e o repositorio tambem contem modulos TypeScript de exemplo com uso de `taulukko-commons`, testes Jest e scripts auxiliares.

## Visao geral

- Runtime principal: `src/index.ts` compilado para `dist/index.js`
- Assets estaticos: `public/`
- Codigo TypeScript auxiliar/exemplo: `src/`, `tests/` e `scripts/`
- Documentacao de processo: `docs/CONSTITUTION.md` e `docs/TASKS.md`

## Requisitos

- Node.js `>=16.0.0`
- npm

## Como executar

1. Instale as dependencias com `npm install`
2. Gere os artefatos com `npm run build`
3. Inicie o servidor com `npm start`
4. Acesse `http://localhost:8080` ou a porta definida em `PORT`

## Scripts disponiveis

| Comando | Descricao |
| --- | --- |
| `npm run build` | Compila `src/**/*.ts` para `dist/` usando `tsconfig.build.json` |
| `npm start` | Sobe o servidor a partir do artefato gerado em `dist/index.js` |
| `npm test` | Executa a suite Jest em TypeScript |

## Variaveis de ambiente

| Variavel | Padrao | Uso |
| --- | --- | --- |
| `PORT` | `8080` | Porta HTTP usada pelo servidor Express |

## Estrutura do projeto

- `src/index.ts`: entrypoint TypeScript do servidor Express, com `createApp()`, `startServer()`, `resolvePort()`, logs via `LogGenericImpl` e reexport de `example-module`
- `public/index.html`: landing page estatica com historico do Taulukko, links externos e chamada para apoio ao projeto
- `public/logo.svg`: logo exibido na landing page
- `src/example-module.ts`: exemplo de modulo orientado a DI com `injectController`, contendo `ExampleConfig`, `ExampleService` e `ExampleModule`
- `src/example-service.ts`: servico alternativo de exemplo para `injectController`, com helpers `getExampleService`, `updateExampleServiceConfig` e `clearExampleService`
- `tests/example-module.test.ts`: cobre `ExampleModule`, a criacao do servico e o comportamento do `injectController`
- `scripts/validate-logger.ts`: script de validacao do padrao de logging e da ausencia de `console.*` no codigo-fonte
- `tsconfig.json`: configuracao TypeScript base compartilhada por testes e ferramentas
- `tsconfig.build.json`: configuracao de build focada em `src/`, com saida em `dist/`
- `jest.config.cjs`: configuracao de testes com `ts-jest`, ambiente Node e cobertura em `coverage/`
- `docs/CONSTITUTION.md`: regras de arquitetura, tipagem e fluxo de agentes do projeto
- `docs/TASKS.md`: backlog e tarefas abertas de longo prazo

## Comportamento da aplicacao web

- Serve todo o conteudo estatico da pasta `public/`
- Responde `/` com `public/index.html`
- Redireciona rotas desconhecidas para a pagina inicial
- Faz log de inicializacao no stdout com `LogGenericImpl`

## Modulos TypeScript

### API exportada por `src/index.ts`

- `initialize()`: cria `ExampleModule` e registra logs de inicializacao
- `updateProjectInfo(newName?, newDescription?)`: atualiza dados do modulo usando `ExampleModule.create(...)`
- `createApp()`: monta a aplicacao Express
- `resolvePort(port?)`: resolve a porta efetiva usando argumento ou `PORT`
- `startServer(port?)`: inicia o servidor HTTP
- `export * from './example-module.js'`: expoe `ExampleConfig`, `ExampleService` e `ExampleModule` definidos em `src/example-module.ts`

### `src/example-module.ts`

- `ExampleConfig`: contrato com `name`, `version` e `description`
- `ExampleService`: encapsula `greet()`, `getInfo()` e `updateConfig()`
- `ExampleModule`: resolve `example-service` do `injectController` quando disponivel e cria fallback local quando nao existe
- `ExampleModule.create(config?)`: reaproveita a instancia registrada e mescla configuracao parcial

### `src/example-service.ts`

- Define outro `ExampleConfig`, desta vez com `enabled`
- `ExampleService`: implementa inicializacao lazy e retorna status com timestamp
- `getExampleService(config?)`: resolve ou registra `example-service` no container
- `updateExampleServiceConfig(newConfig)`: atualiza configuracao parcial
- `clearExampleService()`: remove o registro do container

## Testes e ferramentas

O `package.json` ja expoe scripts para build, execucao e testes.

Se a toolchain de desenvolvimento estiver instalada, os comandos naturais para essa estrutura sao:

- `npm test`
- `npm run build`
- `scripts/validate-logger.ts` como helper opcional, executavel com um runner TypeScript quando necessario

## Configuracoes relevantes

- `tsconfig.json`: alvo `ES2022`, modulos `ESNext`, `moduleResolution: bundler`, `strict: true`, geracao de `.d.ts` e sourcemaps
- `tsconfig.build.json`: restringe o build aos arquivos de `src/` e publica artefatos em `dist/`
- `jest.config.cjs`: usa `ts-jest/presets/default-esm`, procura `*.test.ts` e `*.spec.ts`, ignora `dist/` e grava cobertura em `coverage/`

## Dependencias principais

- `express`: servidor HTTP da landing page
- `taulukko-commons`: logger estruturado e container `injectController` usados pelos modulos TypeScript
