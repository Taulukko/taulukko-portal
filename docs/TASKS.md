# TASKS - Taulukko

Este arquivo contém o roadmap e tarefas de longo prazo do projeto. O PRODUCT_OWNER e SCRUM_MASTER gerenciam as tarefas através deste arquivo.

## Formato das Tarefas

- [ ] - Tarefa pendente
- ✅ Tarefa concluída

## TAREFAS

✅ Alinhar a infraestrutura do taulukko-portal: transformar src/index.ts no entrypoint oficial do projeto, migrando para ele a lógica atual do servidor Express para que o processo de build gere `dist/index.js` sem alterar o comportamento da aplicação; manter npm test operacional com Jest usando ou completando a configuração já existente; declarar e instalar taulukko-commons em dependencies para uso futuro; e substituir os metadados genéricos atuais do package.json por informações reais do projeto, incluindo nome, descrição, entrypoint e scripts.
Critérios de aceite sugeridos:
1. npm test executa a suíte Jest sem configuração manual extra.
2. npm run build compila src/index.ts e gera `dist/index.js`.
3. npm start usa o artefato gerado e preserva o comportamento atual do servidor web.
4. taulukko-commons está declarado em dependencies e instalado.
5. Os metadados genéricos como helloworld e descrição placeholder deixam de existir no package.json.
6. Se scripts ou fluxo de execução mudarem, o README.md deve ser atualizado junto.
✅ Olhar o layout do taulukko, seguindo as boas práticas, modernizar o código da página inicial de modo que fique responsivo e mais elegante. Mantenha as cores laranja, verde e branco pois são as cores do logo, mas pode adicionar mais cores na paleta se precisar.
