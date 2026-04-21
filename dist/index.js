/**
 * Taulukko - Portal do Taulukko
 *
 * REGRAS DE TIPAGEM (OBRIGATÓRIAS):
 * - Toda variavel DEVE ter tipo explicito
 * - Todo parametro de funcao DEVE ter tipo explicito
 * - Todo retorno de funcao DEVE ter tipo explicito
 */
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import { ExampleModule } from './example-module.js';
import { LogGenericImpl, Level } from 'taulukko-commons';
export * from './example-module.js';
const logger = new LogGenericImpl({
    prefix: 'Taulukko',
    hasDate: true,
    hasLevel: true,
    format: ''
});
const currentFilePath = fileURLToPath(import.meta.url);
const currentDirectoryPath = dirname(currentFilePath);
const publicDirectoryPath = path.join(currentDirectoryPath, '..', 'public');
let hasInitialized = false;
const DEFAULT_PORT = 7777;
logger.level(Level.INFO);
export function initialize() {
    if (hasInitialized) {
        return;
    }
    logger.info('Taulukko v1.0.0 initialized');
    logger.info('Project: Portal do Taulukko');
    logger.info('Author: Edson Vicente Carli Junior');
    logger.info('Architecture: TypeScript-first with SOLID pattern');
    const module = new ExampleModule();
    logger.info(module.greet());
    hasInitialized = true;
}
export function updateProjectInfo(newName, newDescription) {
    const updatedConfig = {};
    if (newName) {
        updatedConfig.name = newName;
    }
    if (newDescription) {
        updatedConfig.description = newDescription;
    }
    const updatedModule = ExampleModule.create(updatedConfig);
    logger.info(`Project info updated: ${JSON.stringify(updatedModule.getInfo())}`);
}
export function createApp() {
    const app = express();
    app.use(express.static(publicDirectoryPath));
    app.get('/', (_request, response) => {
        response.sendFile(path.join(publicDirectoryPath, 'index.html'));
    });
    app.use((_request, response) => {
        response.redirect('/');
    });
    return app;
}
export function resolvePort(portFromArgument) {
    if (typeof portFromArgument === 'number' && !Number.isNaN(portFromArgument)) {
        return portFromArgument;
    }
    const parsedPort = Number.parseInt(process.env.PORT ?? `${DEFAULT_PORT}`, 10);
    if (Number.isNaN(parsedPort)) {
        logger.info(`Taulukko: using port default ${DEFAULT_PORT}`);
        return DEFAULT_PORT;
    }
    return parsedPort;
}
export function startServer(portFromArgument) {
    initialize();
    const app = createApp();
    const port = resolvePort(portFromArgument);
    return app.listen(port, () => {
        logger.info(`Taulukko: listening on port ${port}`);
    });
}
const executedFilePath = process.argv[1];
const isDirectExecution = typeof executedFilePath === 'string'
    && path.resolve(executedFilePath) === currentFilePath;
if (isDirectExecution) {
    startServer();
}
//# sourceMappingURL=index.js.map