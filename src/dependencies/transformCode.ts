// 3rd party:
// Babel:

// Types, interfaces and enumns:
// import * as t from '@babel/types';

const _showFnDummy = `
import _React from 'react';
import _ReactDOM from 'react-dom/client';
function show(...args){
  return;
};\n`;

export default function transformCode(cellCode: string): string {
  const transformedCode = `
${_showFnDummy}
document.body.innerHTML = \`
    <div id="root"></div>
\`;

${cellCode}
  
document.body.innerHTML = \`
    <div id="root"></div>
    <script>
    const handleError=(error)=>{
      const root = document.getElementById('root');
      root.innerHTML =
        '<div style="color: #DD0000"><h4>Runtime Error:</h4>' +
        error +
        '</div>';
        console.error(error);
      }

      window.addEventListener('error', (event) => {
        event.preventDefault();
        handleError(event.error);
      });
      
      window.addEventListener(
        'message',
        (event) => {
          try {
            eval(event.data);
          } catch (error) {
            handleError(error);
          }
        },
        false
      );
    </script>
\`;`;

  // console.log(`transformed ${cellId}:
  //   ${transformedCode}
  //   `);

  return transformedCode;
}

// console.log(\`document ${cellId} body before:\`, document.body);

// console.log(\`document ${cellId} body after:\`, document.body);
