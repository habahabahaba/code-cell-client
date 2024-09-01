// 3rd party:
// Babel:
import { parse } from '@babel/parser';
import traverse from '@babel/traverse';

// Crashes during user input !!!!
export default function hasExports(code: string): boolean {
  if (!code.match(/^\s*export\s+.*$/gm)) return false;
  try {
    const ast = parse(code, {
      sourceType: 'module',
      plugins: ['jsx'],
    });

    let hasExport = false;

    traverse(ast, {
      ExportNamedDeclaration(path) {
        hasExport = true;
        path.stop(); // Stop traversal as soon as an export is found
      },
      ExportDefaultDeclaration(path) {
        hasExport = true;
        path.stop(); // Stop traversal as soon as an export is found
      },
    });

    return hasExport;
  } catch (error) {
    console.log('Error from hasExports:', JSON.stringify(error));
    return false;
  }
}
