import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const readLandingPageHtml = (): string => {
  const filePath: string = resolve(process.cwd(), 'public/index.html');

  return readFileSync(filePath, 'utf8');
};

describe('public/index.html footer dynamic year', (): void => {
  test('keeps 2008 fixed and replaces only the final year with an explicit HTML target', (): void => {
    const html: string = readLandingPageHtml();
    const normalizedHtml: string = html.replace(/\s+/g, ' ');

    expect(normalizedHtml).not.toContain('Taulukko 2008-2026 pertence a Edson Vicente Carli Junior.');
    expect(normalizedHtml).toMatch(
      /Taulukko\s+2008-\s*<([a-z]+)(?:\s[^>]*)?>[\s\S]*?<\/\1>\s*pertence a Edson Vicente Carli Junior\./i
    );
  });

  test('contains an inline script that gets the current year and fills the footer target', (): void => {
    const html: string = readLandingPageHtml();
    const inlineScriptMatch: RegExpMatchArray | null = html.match(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/i);

    expect(inlineScriptMatch).not.toBeNull();

    const inlineScriptContent: string = inlineScriptMatch?.[1] ?? '';

    expect(inlineScriptContent).toMatch(/\bcurrentYear\b\s*=\s*new\s+Date\(\)\.getFullYear\(\)/);
    expect(inlineScriptContent).toMatch(/\bfooterCurrentYearElement\b\s*=\s*document\.(getElementById|querySelector)\(/);
    expect(inlineScriptContent).toMatch(/\bfooterCurrentYearElement\b[\s\S]*?\.(textContent|innerText|innerHTML)\s*=/);
  });
});
