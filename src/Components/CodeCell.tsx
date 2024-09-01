// Dependencies:
import { codeInstructions } from '../dependencies/codeInstructions';
// import Bundler from '../dependencies/Bundler';
// Store:
import { updateCell, setBundleError } from '../store/';
// import { createBundle } from '../store/';
import { createCumulativeBundle } from '../store/';
// Hooks:
import { useAppDispatch, useAppSelector, useCumulativeCode } from '../hooks';
// React:
import { useEffect } from 'react';
import { useRef } from 'react';
// import { useMemo } from 'react';
// import { useState } from 'react';
// import {  useCallback } from 'react';

// Components:
import CodeEditor from './CodeEditor';
import CodePreview from './CodePreview';
import ProgressBar from './UI/ProgressBar';
import ReResizable from './UI/ReResizable';

// CSS:

// Types, interfaces and enumns:
import type { FC } from 'react';
import type { Cell } from '../store/';
// import type { BundlerResult } from '../dependencies/Bundler';
interface CodeCellProps {
  cell: Cell;
}

// //   Initial input code value for the CodeEditor:
// const jsxValue = (): string => `
//   import ReactDOM from 'react-dom/client';
//   import React from 'react';
//   const App = () => {
//     return(
//       <div
//         style={{ color: 'blue' }}
//       >
//         <h1>Proof of Life ...</h1>
//         {/* <p>comment</p> */}

//       </div>
//     )
//   }

//   ReactDOM.createRoot(document.getElementById('root')).render(<App />);`;

// Component:
const CodeCell: FC<CodeCellProps> = ({ cell }) => {
  const { id, content } = cell;
  // Store:
  const dispatch = useAppDispatch();
  const bundle = useAppSelector((state) => state.bundles[id]);

  const [cumulativeCode, cumulativeString] = useCumulativeCode(id);
  // console.log(`cumulativeCode for ${id}:`, cumulativeCode);

  // For preventing unnecessary rebundlings:
  const prevCumulativeRef = useRef<string>('');

  // User code preview:

  // Sending raw code for bundling:
  // Initial eager bundling:
  useEffect(() => {
    // dispatch(createBundle({ id, rawCode: content }));
    if (!bundle && content) {
      prevCumulativeRef.current = cumulativeString;
      dispatch(createCumulativeBundle(cumulativeCode));
      return;
    }
  }, [content, cumulativeCode, cumulativeString, bundle, dispatch]);

  // Debounced bundling:
  useEffect(() => {
    const timer: number = setTimeout(async () => {
      // console.log('Before Bundler: ', input);

      // dispatch(createBundle({ id, rawCode: content }));

      // For preventing unnecessary rebundlings:
      if (cumulativeString !== prevCumulativeRef.current) {
        prevCumulativeRef.current = cumulativeString;
        dispatch(createCumulativeBundle(cumulativeCode));
      }
    }, 800);

    return () => {
      clearTimeout(timer);
    };
  }, [content, cumulativeCode, cumulativeString, dispatch]);

  // Handlers:
  function reportEditorChange(value: string | undefined): void {
    const content = value || '';
    dispatch(updateCell({ id, content }));
  }

  function reportError(error: Error): void {
    const formatterError = `Formatter error:\n\n${error.message}
    `;

    if (bundle && !bundle.code) {
      dispatch(setBundleError({ id, error: formatterError }));
    }
  }

  // JSX:
  return (
    <ReResizable direction='vertical'>
      <ReResizable direction='horizontal'>
        <CodeEditor
          initialValue={content || codeInstructions()}
          reportChange={reportEditorChange}
          reportError={reportError}
        />
      </ReResizable>
      {!bundle || bundle.loading ? (
        <ProgressBar
          className='code-cell-progress-bar-container'
          title='Processing...'
          color='is-warning'
        />
      ) : (
        <CodePreview
          id={id}
          code={bundle ? bundle.code : ''}
          error={bundle && bundle.error ? bundle.error : ''}
        />
      )}
    </ReResizable>
  );
};

export default CodeCell;
