---
name: changelog-generator
description: Gera changelog automatico baseado nos commits e nas TASKs do PRODUCT_OWNER para releases do projeto
---

## O que esta skill faz

Gera um changelog estruturado para releases, baseado em:
- Commits do git desde a ultima tag/release
- TASKs concluidas no PRODUCT_OWNER.md
- Alteracoes no package.json (versao)
- Alteracoes significativas no projeto
- Gera arquivo se não existir ou o modifica o arquivo CHANGELOG.md na raiz

## Contexto do projeto

- **Versao package.json:** campo `version` em `package.json`
- **TASKs:** listadas em [PRODUCT_OWNER.md](../../.opencode/agents/PRODUCT_OWNER.md)

  Ler [PRODUCT_OWNER.md](../../.opencode/agents/PRODUCT_OWNER.md) e identificar TASKs marcadas com checkmark que foram concluidas desde a ultima release.

Para cada TASK concluida, verificar se ha commit correspondente. TASKs sem commit associado -> `[INFO]` (pode ter sido feita em batch).

### 4. Verificar mudancas de compatibilidade

Verificar se houve alteracao em dependencias no `package.json`:
- `dependencies` - breaking change potencial
- `devDependencies` - mudancas no ambiente de desenvolvimento

Alteracao major de dependencias -> deve ser destaque no changelog como **Breaking Change**.

### 5. Gerar changelog

**Formato padrao:**

```markdown
# Changelog

## [1.0.0] - YYYY-MM-DD

### Novo
- Nova funcionalidade adicionada

### Alterado
- Funcionalidade existente modificada

### Corrigido
- Bug corrigido

### Removido
- Funcionalidade removida
```

### 6. Verificar consistencia de versao

Antes de finalizar, verificar:
- Versao no changelog corresponde a `package.json`
- Data do changelog e a data atual
- Se e major/minor/patch condiz com as mudancas (breaking = major, feature = minor, fix = patch)

### 7. Sugerir atualizacao de versao (se necessario)

Se as mudancas indicam que a versao deveria ser incrementada:
- Tem breaking changes mas versao e' patch -> `[WARN]` sugerir major bump
- Tem features novas mas versao e' patch -> `[WARN]` sugerir minor bump

## Formato de saida final

```
=== CHANGELOG GENERATOR ===

--- Escopo ---
Versao atual: 1.11.58
Ultima tag: v1.11.57
Commits desde tag: 15

--- Categorias ---
Novo: 3 itens
Alterado: 5 itens
Corrigido: 2 itens
Removido: 0 itens
Documentacao: 3 itens
Interno: 2 itens

--- TASKs ---
TASKs concluidas neste periodo: 4
TASKs com commit associado: 3
TASKs sem commit: 1

--- Versao ---
[OK]    Versao consistente em package.json
[OK]    Incremento de versao condiz com mudancas (minor)

--- Changelog gerado em CHANGELOG.md ---
```

## Regras de filtragem do conteudo

O changelog e voltado para o usuario final. Aplicar os seguintes filtros:

1. **Nunca mencionar IA, agentes ou ferramentas de desenvolvimento** - Nao incluir referencias a OpenCode, agentes (SCRUM_MASTER, ARCHITECT, etc.), skills, prompts ou qualquer ferramenta de IA. Isso e interno.

2. **Nunca mencionar TASKs** - TASKs sao controle interno. No changelog, descrever apenas o que foi feito. Se uma TASK e seu bugfix aconteceram na mesma versao, mencionar apenas a funcionalidade final entregue (nao o bug intermediario).

3. **Nao mencionar infraestrutura de desenvolvimento** - Excluir itens como: scripts de build, arquivos .sh, configuracoes de CI/CD, scripts de deploy, backup, geracao de chaves, etc.

4. **Nao mencionar mudancas tecnicas internas** - Excluir itens como: troca de linguagem de programacao (JS para TS), refatoracoes internas, mudancas de bundler, reorganizacao de pastas, etc. O usuario final nao precisa saber disso.

5. **Sempre verificar sincronizacao de versoes** - Antes de gerar o changelog, confirmar que a versao no changelog corresponde a `package.json`.

6. **Focar no que o usuario ve** - Incluir apenas funcionalidades visiveis: novos comandos, templates, correcoes de comportamento, mudancas de API, etc.

7. **Consolidar por funcionalidade dentro da mesma versao** - Quando uma funcionalidade nova, suas correcoes e seus ajustes acontecem todos na mesma versao (entre a tag anterior e a atual), consolidar tudo em um unico item na secao "Novo". Correcoes e alteracoes so devem aparecer em "Corrigido" ou "Alterado" se o item ja existia em uma versao anterior que o usuario final ja teve acesso. A pergunta-chave e: "o usuario final ja tinha acesso a essa funcionalidade antes desta release?" Se nao, tudo e "Novo".

## Quando usar esta skill

- Antes de cada release/deploy do modulo
- Quando o usuario pedir para gerar release notes
- Na etapa DOCUMENTATION_WRITER ao preparar release
- Periodicamente para manter historico de mudancas
- Apos sprint de desenvolvimento com multiplas TASKs concluidas
