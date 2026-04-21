---
name: readme-sync-enforcer
description: Verifica se todos os scripts e variaveis do projeto estao documentados no [README.md](README.md) e se a documentacao reflete o comportamento atual
---

## O que esta skill faz

Garante que o `[README.md](README.md)` na raiz do projeto esta sincronizado com a realidade do codigo TypeScript. Isso inclui:
- Todo módulo e componente documentado
- Todo script npm/build documentado
- Todas as configuracoes (`config.json`, `module.json`) documentadas
- Descricoes de comportamento atualizadas
- Estrutura de arquivos atualizada

## Procedimento

### 1. Listar todos os arquivos fonte do projeto

Buscar todos os `.ts` e `.mjs` nas pastas do projeto (excluindo `.git/`, `node_modules/`, `dist/`):

**Locais esperados:**
- `src/`: codigo fonte
- `tests/`: testes
- Raiz: arquivos de configuracao (tsconfig.json, package.json, etc.)

### 2. Verificar presenca no [README.md](README.md)

Para cada módulo e arquivo relevante encontrado, verificar se ha uma entrada correspondente no `[README.md](README.md)`. O README deve conter:

- **Nome do módulo/arquivo** (nome descritivo)
- **Descricao** do que faz
- **Exports relevantes** (classes, funcoes, interfaces)
- **Dependencias internas** (se aplicavel)

### 3. Verificar scripts npm documentados

Cruzar os scripts definidos no `package.json` com os documentados no README:
- Scripts existentes mas nao documentados -> `[ERRO]`
- Scripts documentados mas nao existentes -> `[WARN]`

### 4. Verificar configuracoes documentadas

Comparar as configuracoes em `jest.config.js` e `tsconfig.json` com o que esta documentado:
- Configuracoes de testes vs documentadas
- Configuracoes TypeScript vs documentadas

### 5. Verificar comportamento documentado vs real

Para módulos já documentados, comparar:
- O comportamento descrito no README com o codigo real
- APIs expostas vs documentadas
- Dependencias externas (`taulukko-commons`, etc.) vs documentadas
- Configurações vs documentadas

### 6. Verificar testes

Todo arquivo em `src/__tests__/` deve estar documentado na secao de testes do [README.md](README.md) com:
- Nome do teste
- O que testa
- Comando de execucao (`npm test` ou `npx jest`)

### 7. Aplicar correções automaticamente

Para cada `[ERRO]` encontrado, aplicar as correções automaticamente no [README.md](README.md):
- Módulos não documentados: criar seção com nome, descrição, arquivo e exports
- Scripts não documentados: adicionar à tabela de comandos
- Configurações não documentadas: adicionar seção com detalhes

Para cada `[WARN]` encontrado, adicionar informações faltantes:
- Documentação incompleta: completar com informações existentes no código
- Estrutura desatualizada: atualizar para refletir o estado atual

**ATENÇÃO:** Esta skill DEVE aplicar as correções automaticamente. Não é apenas para sugerir!

### 7. Aplicar correções automaticamente

Para cada `[ERRO]` encontrado, aplicar as correções automaticamente no [README.md](README.md):
- Módulos não documentados: criar seção com nome, descrição, arquivo e exports
- Scripts não documentados: adicionar à tabela de comandos
- Configurações não documentadas: adicionar seção com detalhes

Para cada `[WARN]` encontrado, adicionar informações faltantes:
- Documentação incompleta: completar com informações existentes no código
- Estrutura desatualizada: atualizar para refletir o estado atual

**ATENÇÃO:** Esta skill DEVE aplicar as correções automaticamente. Não é apenas para sugerir!

## Formato de saida

```
=== SINCRONIZACAO [README.md](README.md) ===

--- Módulos ---
[OK]    generator/prompts                      | Documentado
[OK]    generator/template-manager             | Documentado
[ERRO]  generator/file-processor              | NAO documentado no README -> CORRIGIDO
[WARN]  cli/index                              | Documentacao incompleta (falta opcoes) -> CORRIGIDO

--- Scripts npm ---
[OK]    build                                  | Documentado
[OK]    test                                   | Documentado
[ERRO]  dev                                    | NAO documentado no README -> CORRIGIDO

--- Configuracoes ---
[OK]    jest.config.js                         | Documentado
[WARN]  tsconfig.json                          | Faltam opcoes documentadas -> CORRIGIDO

--- Comportamento ---
[OK]    Template System                        | Documentado corretamente
[WARN]  CLI Options                            | Lista de opcoes no README difere do codigo -> CORRIGIDO
```

A saida deve mostrar o que foi corrigido. As correções sao aplicadas automaticamente no arquivo [README.md](README.md).

## Quando usar esta skill

- Apos criar ou modificar qualquer modulo TypeScript
- Apos alterar `package.json`, `jest.config.js` ou `tsconfig.json`
- Antes de commits que alteram a estrutura do projeto
- Em revisoes de codigo (etapa CODE_REVIEWER do fluxo de agentes)
- Na etapa DOCUMENTATION_WRITER do fluxo de agentes
- Periodicamente para manter a documentacao saudavel
