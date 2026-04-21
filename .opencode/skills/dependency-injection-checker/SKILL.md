---
name: dependency-injection-checker
description: Verifica que todos os controllers usam injectController corretamente, que nao ha instanciacao direta e que o container DI esta consistente com taulukko-commons
---

## O que esta skill faz

Audita o uso de injecao de dependencia (DI) no projeto, garantindo que o pattern do `taulukko-commons` (`injectController`) esta sendo usado corretamente e de forma consistente.

## Container DI do projeto

O projeto usa `injectController` do pacote `taulukko-commons` com dois metodos principais:
- `injectController.registerByName(name, instance)` - registra por nome string
- `injectController.registerByClass(instance)` - registra pelo nome da classe
- `injectController.resolve(name)` - resolve uma dependencia por nome

### Registros conhecidos (em projetos TypeScript com taulukko-commons)

| Nome no container       | Tipo              | Onde registrado          |
|------------------------|-------------------|--------------------------|
| `"CommonLogguer"`      | `LogGenericImpl`  | Bootstrap do projeto     |
| Classes por nome       | Classe específica | `registerByClass()`      |

**Nota**: Em projetos gerados, os registros específicos dependem da estrutura do projeto.

## Procedimento

### 1. Mapear todos os registros

Buscar em todos os `.ts`:
- `injectController.registerByName("` -> extrair nome e valor
- `injectController.registerByClass(` -> extrair classe

Construir mapa completo: `{ nome -> tipo, arquivo, linha }`

### 2. Mapear todos os resolves

Buscar em todos os `.ts`:
- `injectController.resolve("` -> extrair nome

Construir mapa: `{ nome -> [arquivo:linha, arquivo:linha, ...] }`

### 3. Verificar consistencia registro/resolve

- Nome resolvido mas nunca registrado -> `[ERRO]` (vai dar erro em runtime)
- Nome registrado mas nunca resolvido -> `[WARN]` (registro desnecessario)
- Nome registrado mais de uma vez -> `[WARN]` (o segundo sobrescreve o primeiro)

### 4. Verificar ordem de registro vs resolve

O registro DEVE ocorrer antes do resolve na sequencia de execucao:
- Bootstrap do projeto registra primeiro
- Módulos principais registram na sequencia
- Componentes resolvem depois

Verificar se algum resolve pode executar antes do registro correspondente -> `[ERRO]`

### 5. Verificar instanciacao direta

Buscar padroes de instanciacao que deveriam usar DI:
- `new LogGenericImpl(` fora do bootstrap -> `[ERRO]` (deve usar `resolve("CommonLogguer")`)
- Instanciacao direta de classes registradas no container -> `[ERRO]`

**Excecoes permitidas:**
- Bootstrap do projeto (instanciacao inicial)
- Classes utilitarias sem dependencias
- Classes que nao sao registradas no container DI

### 6. Verificar tipagem nos resolves

O `injectController.resolve()` retorna `any` por padrao. Verificar:
- Se ha cast explicito para o tipo esperado (ex: `const logguer: Log = injectController.resolve(...)`)
- Resolve sem tipagem -> `[WARN]` (perde type safety)

### 7. Verificar que modulos usam DI para dependencias

Dentro de cada modulo do projeto:
- Dependencias devem ser obtidas via `injectController.resolve()`
- Import direto para instanciacao -> `[WARN]` (acoplamento)
- Preferir injecao de dependencia sobre import direto

## Formato de saida

```
=== AUDITORIA DE INJECAO DE DEPENDENCIA ===

--- Registros ---
Nome                 | Tipo            | Arquivo              | Linha
---------------------|-----------------|----------------------|------
CommonLogguer        | LogGenericImpl  | bootstrap.ts         | 15
ProjectGenerator     | ProjectGenerator| main.ts              | 22

--- Resolves ---
Nome                 | Arquivo                    | Linha
---------------------|----------------------------|------
CommonLogguer        | generator/prompts.ts       | 34
CommonLogguer        | generator/template-manager.ts | 62
ProjectGenerator     | cli/index.ts              | 35

--- Consistencia ---
[OK]    Todos os nomes resolvidos possuem registro correspondente
[WARN]  "ConfigManager" registrado mas nunca resolvido

--- Instanciacao Direta ---
[OK]    Nenhuma instanciacao direta indevida encontrada

--- Tipagem ---
[OK]    Todos os resolves possuem tipo explicito
```

## Quando usar esta skill

- Apos adicionar novo registro ou resolve no container DI
- Apos criar novo submodule
- Quando houver erros de runtime tipo "Cannot resolve ..."
- Em revisoes de codigo (etapa CODE_REVIEWER)
- Na etapa ARCHITECT ao validar a arquitetura
