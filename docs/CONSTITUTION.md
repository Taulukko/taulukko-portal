# CONSTITUTION.md

## Contexto geral

Este projeto foi gerado automaticamente pelo Project Generator com OpenCode integrado.
O objetivo principal do OpenCode aqui é:
- Auxiliar no desenvolvimento do projeto Taulukko
- Automatizar tarefas repetitivas
- Garantir qualidade de código através dos agentes

Sempre leia este arquivo e o `README.md` na raiz antes de fazer qualquer alteração significativa.

---

## Regras de Ouro

1. **TypeScript everywhere** - Todo o código deve ser TypeScript, exceto entrypoint mínimo
2. **Entrypoint mínimo em JavaScript** - Apenas arquivos de entrada podem ser JavaScript para chamar orquestradores TypeScript
3. **ESM (ECMAScript Modules)** - Usar sistema de módulos moderno
4. **SOLID com injectController** - Seguir padrão SOLID: buscar dependências no `injectController` primeiro, criar apenas como fallback
5. **Logger do taulukko-commons obligatorio** - Usar `LogGenericImpl` em vez de `console.log`/`console.error` para logging estruturado
6. **Documentação obrigatória** - Documentar novas funcionalidades no README.md
7. **Testes primeiro** - Criar testes antes de implementar novas funcionalidades
8. **Revisão de código** - Todo código deve passar pelo CODE_REVIEWER
9. **taulukko-commons obrigatório** - Usar biblioteca taulukko-commons para utilitários
10. **Tipos explícitos OBRIGATÓRIOS** - Todas as regras abaixo são OBRIGATÓRIAS

### REGRAS OBRIGATÓRIAS de Tipagem:
- **PROIBIDO**: Variáveis sem tipo declarado (sem saber o tipo)
- **EXCEÇÃO**: Apenas quando o tipo for `unknown` ou `null`
- **PROIBIDO**: Usar `any` (usar tipos mais específicos)

1. **Todo variável DEVE ter tipo explícito**
2. **Todo parâmetro de função DEVE ter tipo explícito**
3. **Todo retorno de função DEVE ter tipo explícito**
4. **catch blocks DEVEM usar union e tratamento explícito**
5. **Usar TIPOS UNIONS para permitir autocompletar**

---

## Fluxo Obrigatório de Agentes

**NUNCA execute código ou faça alterações sem seguir este fluxo:**

1. **PRODUCT_OWNER** → Define as TASKs no arquivo `PRODUCT_OWNER.md`
2. **SCRUM_MASTER** → Entrega UMA TASK por vez (usuário deve pedir "Faça TASK X")
3. **ARCHITECT** → Planeja a TASK e envia para o TESTER
4. **TESTER** → Cria testes que validam a TASK
5. **DEVELOPER** → Codifica a solução (só passa quando testes passam)
6. **CODE_REVIEWER** → Revisa aderência a padrões
7. **DOCUMENTATION_WRITER** → Documenta no README.md e arquivos

**Como ativar:** Quando o usuário disser "Faça TASK X", leia `PRODUCT_OWNER.md` e siga as etapas na ordem acima.

---

## Checkpoints Obrigatórios

**Antes de codificar (etapa DEVELOPER):**
- [ ] Ter um plano do ARCHITECT
- [ ] Ter testes do TESTER
- [ ] Ter confirmado com o usuário se há dúvidas no plano

**Antes de finalizar (qualquer etapa):**
- [ ] Ter passado em todos os testes
- [ ] Ter documentação atualizada
- [ ] Ter código revisado