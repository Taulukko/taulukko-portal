/**
 * Taulukko - Portal do Taulukko
 *
 * REGRAS DE TIPAGEM (OBRIGATÓRIAS):
 * - Toda variavel DEVE ter tipo explicito
 * - Todo parametro de funcao DEVE ter tipo explicito
 * - Todo retorno de funcao DEVE ter tipo explicito
 */
import { type Express } from 'express';
import { type Server } from 'node:http';
export * from './example-module.js';
export declare function initialize(): void;
export declare function updateProjectInfo(newName?: string, newDescription?: string): void;
export declare function createApp(): Express;
export declare function resolvePort(portFromArgument?: number): number;
export declare function startServer(portFromArgument?: number): Server;
//# sourceMappingURL=index.d.ts.map