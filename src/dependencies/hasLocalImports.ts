// 3rd party:
// Babel:
import { parse } from '@babel/parser';
import traverse from '@babel/traverse';

// Function to check if the code has local imports from specific sources
export default function hasLocalImports(
  code: string,
  sources: string[]
): boolean {
  if (!code.match(/^\s*import\s+.*$/gm)) {
    return false;
  }
  try {
    const ast = parse(code, {
      sourceType: 'module',
      plugins: ['jsx'],
    });

    let hasImport = false;

    traverse(ast, {
      ImportDeclaration(path) {
        const sourceValue = path.node.source.value;
        if (sources.includes(sourceValue)) {
          hasImport = true;
          path.stop(); // Stop traversal as soon as a matching import is found
        }
      },
    });

    return hasImport;
  } catch (error) {
    console.log('Error from hasLocalImports:', JSON.stringify(error));
    return false;
  }
}
