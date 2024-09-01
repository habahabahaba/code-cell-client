// Dependencies:
import hasLocalImports from '../dependencies/hasLocalImports';
import hasExports from '../dependencies/hasExports';
import transformCode from '../dependencies/transformCode';
// Store:
import { useAppSelector } from '../hooks/rtkHooks';
// React:
import { useMemo } from 'react';
// Types, interfaces and enumns:
import type { VirtualFiles, CumulativeCode } from '../dependencies/Bundler';

// To be added at the start of the current-cell code:
const _showFn = () => `
import _React from 'react';
import _ReactDOM from 'react-dom/client';

function _show(...args) {
  if (!args.length) return;
  const root = document.getElementById('root');
  if(!root) return;
  if (args[1]) {
      root.innerText = 'Please use show function with one argument at a time.';
      return;
      }
    let value = args[0];
    if (typeof value === 'object') {
        if (value.$$typeof && value.props) {
            const reactRoot = _ReactDOM.createRoot(root);
            reactRoot.render(value);
            return;
    } else {
      value = JSON.stringify(value);
    }
  }
  root.innerHTML = value;
};\n`;

// Hook:
export function useCumulativeCode(id: string): [CumulativeCode, string] {
  //   Store:
  const { order: cellsOrder, data: cellsData } = useAppSelector(
    (state) => state.cells
  );
  // Index of current cell in cells order:
  const currIndex: number = cellsOrder.indexOf(id);
  // Transformed code of the current cell:
  const entryFile: string = _showFn() + cellsData[id].content;

  // Derived cumulative code:
  const cumulativeCode = useMemo<CumulativeCode>(() => {
    const inputFiles: VirtualFiles = { [id]: entryFile };
    // If current cell does have any imports from previous cells, add code from previous cells:
    if (
      hasLocalImports(cellsData[id].content, cellsOrder.slice(0, currIndex))
    ) {
      // Id's of code-cells previous to current cell with exports inside of them:
      const prevIds: string[] = cellsOrder.filter(
        (cellId, index) =>
          index < currIndex &&
          cellsData[cellId].type === 'code' &&
          // Removing previous cells without any exports in them:
          hasExports(cellsData[cellId].content)
        // cellsData[cellId].content.match(/^\s*export\s+.*$/gm)
      );

      // Adding transformed code from appropriate cells:
      prevIds.forEach((cellId) => {
        inputFiles[cellId] = transformCode(cellsData[cellId].content);
      });
    }

    return { inputFiles, entryId: id };
  }, [cellsOrder, currIndex, cellsData, entryFile, id]);

  // Stringified cumulativeCode, to be used inside CodeCell for preventing unnecessary rebundlings by referencing previous version:
  const cumulativeString = useMemo<string>(
    () => `${JSON.stringify(cumulativeCode)}`,
    [cumulativeCode]
  );

  return [cumulativeCode, cumulativeString];
}
