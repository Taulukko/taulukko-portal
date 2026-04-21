#!/usr/bin/env node

/**
 * Script de validação do uso correto do logger
 *
 * Verifica se o projeto segue as regras de logging:
 * 1. Não usa console.log/console.error/console.warn
 * 2. Usa LogGenericImpl do taulukko-commons
 * 3. Configura logger corretamente
 *
 * Uso: npx ts-node scripts/validate-logger.ts
 */

import { readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECT_ROOT = join(__dirname, "..");

/**
 * Verifica se há uso de console.log no código fonte
 */
async function checkConsoleUsage() {
  console.log(
    "🔍 Verificando uso de console.log/console.error/console.warn...",
  );

  const srcDir = join(PROJECT_ROOT, "src");
  if (!existsSync(srcDir)) {
    console.log("❌ Diretório src/ não encontrado");
    return false;
  }

  // Buscar arquivos TypeScript
  const { execSync } = await import("child_process");

  try {
    // Verificar console.log (ignorando comentários)
    const consoleLogResult = execSync(
      `grep -r -n "console\\.log" ${srcDir} --include="*.ts" --include="*.js" || true`,
      { encoding: "utf-8" },
    ).trim();

    // Verificar console.error (ignorando comentários)
    const consoleErrorResult = execSync(
      `grep -r -n "console\\.error" ${srcDir} --include="*.ts" --include="*.js" || true`,
      { encoding: "utf-8" },
    ).trim();

    // Verificar console.warn (ignorando comentários)
    const consoleWarnResult = execSync(
      `grep -r -n "console\\.warn" ${srcDir} --include="*.ts" --include="*.js" || true`,
      { encoding: "utf-8" },
    ).trim();

    // Filtrar linhas que não são comentários
    const filterNonComments = (result) => {
      if (!result) return [];
      return result.split("\n").filter((line) => {
        // Extrair apenas o conteúdo após o primeiro :
        const parts = line.split(":");
        if (parts.length < 3) return true; // Se não tem caminho:linha:conteúdo, manter

        const content = parts.slice(2).join(":").trim();
        const trimmedContent = content.trim();

        // Ignorar linhas que são apenas comentários
        if (
          trimmedContent.startsWith("//") ||
          trimmedContent.startsWith("/*") ||
          trimmedContent.startsWith("*")
        ) {
          return false;
        }

        // Ignorar se "console." aparece apenas em comentários dentro da linha
        // Exemplo: "code // comment about console.log"
        if (content.includes("//") || content.includes("/*")) {
          const beforeComment = content.split("//")[0].split("/*")[0];
          if (!beforeComment.includes("console.")) {
            return false;
          }
        }

        return true;
      });
    };

    const consoleLogLines = filterNonComments(consoleLogResult);
    const consoleErrorLines = filterNonComments(consoleErrorResult);
    const consoleWarnLines = filterNonComments(consoleWarnResult);

    const hasConsoleLog = consoleLogLines.length > 0;
    const hasConsoleError = consoleErrorLines.length > 0;
    const hasConsoleWarn = consoleWarnLines.length > 0;

    if (hasConsoleLog || hasConsoleError || hasConsoleWarn) {
      console.log("❌ ENCONTRADO uso de console.* no código fonte:");
      if (hasConsoleLog) {
        console.log("   console.log encontrado:");
        console.log(consoleLogLines.map((line) => `     ${line}`).join("\n"));
      }
      if (hasConsoleError) {
        console.log("   console.error encontrado:");
        console.log(consoleErrorLines.map((line) => `     ${line}`).join("\n"));
      }
      if (hasConsoleWarn) {
        console.log("   console.warn encontrado:");
        console.log(consoleWarnLines.map((line) => `     ${line}`).join("\n"));
      }
      return false;
    }

    console.log("✅ Nenhum console.log/console.error/console.warn encontrado");
    return true;
  } catch (error) {
    console.log("⚠️  Erro ao verificar console usage:", error.message);
    return false;
  }
}

/**
 * Verifica se há uso correto do LogGenericImpl
 */
async function checkLoggerUsage() {
  console.log("🔍 Verificando uso correto do LogGenericImpl...");

  const srcDir = join(PROJECT_ROOT, "src");
  if (!existsSync(srcDir)) {
    console.log("❌ Diretório src/ não encontrado");
    return false;
  }

  const { execSync } = await import("child_process");

  try {
    // Verificar import de LogGenericImpl
    const importResult = execSync(
      `grep -r "import.*LogGenericImpl" ${srcDir} --include="*.ts" --include="*.js" || true`,
      { encoding: "utf-8" },
    ).trim();

    // Verificar criação de logger
    const creationResult = execSync(
      `grep -r "new LogGenericImpl" ${srcDir} --include="*.ts" --include="*.js" || true`,
      { encoding: "utf-8" },
    ).trim();

    // Verificar uso de métodos do logger
    const usageResult = execSync(
      `grep -r "logger\\.\\(info\\|warn\\|error\\|debug\\|critical\\)" ${srcDir} --include="*.ts" --include="*.js" || true`,
      { encoding: "utf-8" },
    ).trim();

    const hasImport = importResult.length > 0;
    const hasCreation = creationResult.length > 0;
    const hasUsage = usageResult.length > 0;

    if (!hasImport || !hasCreation || !hasUsage) {
      console.log("❌ Problemas com uso do LogGenericImpl:");
      if (!hasImport)
        console.log("   ❌ Nenhum import de LogGenericImpl encontrado");
      if (!hasCreation)
        console.log("   ❌ Nenhuma criação de logger encontrada");
      if (!hasUsage)
        console.log("   ❌ Nenhum uso de métodos do logger encontrado");
      return false;
    }

    console.log("✅ LogGenericImpl está sendo usado corretamente:");
    console.log(
      `   ✅ Import encontrado: ${importResult.split("\n").length} ocorrências`,
    );
    console.log(
      `   ✅ Criação encontrada: ${creationResult.split("\n").length} ocorrências`,
    );
    console.log(
      `   ✅ Uso encontrado: ${usageResult.split("\n").length} ocorrências`,
    );
    return true;
  } catch (error) {
    console.log("⚠️  Erro ao verificar logger usage:", error.message);
    return false;
  }
}

/**
 * Verifica configuração do logger
 */
function checkLoggerConfiguration() {
  console.log("🔍 Verificando configuração do logger...");

  // Verificar arquivos de exemplo
  const exampleFiles = [
    join(PROJECT_ROOT, "src", "index.ts"),
    join(PROJECT_ROOT, "src", "example-service.ts"),
    join(PROJECT_ROOT, "src", "example-module.ts"),
  ];

  let allCorrect = true;

  for (const file of exampleFiles) {
    if (existsSync(file)) {
      try {
        const content = readFileSync(file, "utf-8");

        // Verificar configuração básica
        const hasPrefix = content.includes("prefix:");
        const hasDate = content.includes("hasDate: true");
        const hasLevel = content.includes("hasLevel: true");
        const hasLevelConfig =
          content.includes("logger.level(") || content.includes(".level(");

        if (!hasPrefix || !hasDate || !hasLevel || !hasLevelConfig) {
          console.log(`❌ Configuração incompleta em ${file}:`);
          if (!hasPrefix) console.log("   ❌ Prefixo não configurado");
          if (!hasDate) console.log("   ❌ hasDate não definido como true");
          if (!hasLevel) console.log("   ❌ hasLevel não definido como true");
          if (!hasLevelConfig)
            console.log("   ❌ Nível do logger não configurado");
          allCorrect = false;
        } else {
          console.log(`✅ ${file} configurado corretamente`);
        }
      } catch (error) {
        console.log(`⚠️  Erro ao ler ${file}:`, error.message);
        allCorrect = false;
      }
    }
  }

  return allCorrect;
}

/**
 * Executa todas as verificações
 */
async function main() {
  console.log("🚀 Iniciando validação do logger...\n");

  const checks = [
    { name: "Uso de console.log", fn: checkConsoleUsage },
    { name: "Uso do LogGenericImpl", fn: checkLoggerUsage },
    { name: "Configuração do logger", fn: checkLoggerConfiguration },
  ];

  let passed = 0;
  let failed = 0;

  for (const check of checks) {
    console.log(`\n=== ${check.name} ===`);
    const result = await check.fn();
    if (result) {
      passed++;
    } else {
      failed++;
    }
  }

  console.log("\n" + "=".repeat(50));
  console.log("📊 RESULTADO DA VALIDAÇÃO:");
  console.log(`✅ Passou: ${passed} de ${checks.length}`);
  console.log(`❌ Falhou: ${failed} de ${checks.length}`);
  console.log("=".repeat(50));

  if (failed > 0) {
    console.log("\n⚠️  CORREÇÕES NECESSÁRIAS:");
    console.log(
      "1. Remova TODOS os console.log/console.error/console.warn do código",
    );
    console.log("2. Use LogGenericImpl do taulukko-commons para logging");
    console.log("3. Configure logger com: prefix, hasDate:true, hasLevel:true");
    console.log(
      "4. Defina nível com logger.level(Level.INFO) (ou outro nível apropriado)",
    );
    console.log("\n📚 Consulte src/*.test.ts para exemplos de testes");
    process.exit(1);
  } else {
    console.log("\n🎉 TODAS AS VALIDAÇÕES PASSARAM!");
    console.log("O projeto segue corretamente as regras de logging.");
    process.exit(0);
  }
}

// Executar validação
main().catch((error) => {
  console.error("❌ Erro durante validação:", error);
  process.exit(1);
});
