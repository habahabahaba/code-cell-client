// Store:
import { useAppSelector } from '../hooks';
// React:
import { useEffect, useRef } from 'react';

// Components:

// CSS:
import styles from './CodePreview.module.css';

// Types, interfaces and enumns:
import { FC } from 'react';

export interface CodePreviewProps {
  id: string;
  code: string;
  error?: string;
}

// Source-document for the iframe-element:
const srcDoc = (): string => `
<html>
  <head>
  </head>
  <body>
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
  </body>
</html>
`;

// Component:
const CodePreview: FC<CodePreviewProps> = ({ id, code, error = '' }) => {
  // Store:
  const index = useAppSelector((state) => state.cells.order.indexOf(id));

  // Serving code to the iframe:
  const iframe = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    // console.log('preview rerender');
    // Resetting the iframe:
    // TS-guards:
    // if (!iframe.current || !iframe.current.contentWindow)
    //   throw new Error(`The iframe element is missing.`);
    // iframe.current.srcdoc = srcDoc;

    // Sending to the iframe:
    // iframe.current.contentWindow.postMessage(code, '*');
    setTimeout(() => {
      // TS-guards:
      if (!iframe.current || !iframe.current.contentWindow)
        throw new Error(`The iframe element is missing.`);
      iframe.current.contentWindow.postMessage(code, '*');
    }, 50);

    // Clean-up:
    const iframeCurrent = iframe.current;
    return () => {
      // TS-guards:
      if (!iframeCurrent || !iframeCurrent.contentWindow) return;
      // Resetting the iframe:
      iframeCurrent.srcdoc = srcDoc();
    };
  }, [id, index, code]); // index is needed to rerender a preview after the cell was moved

  return (
    <div className={styles.iframe_container}>
      <iframe
        title='code preview'
        sandbox='allow-scripts'
        ref={iframe}
        srcDoc={srcDoc()}
      />
      {error ? <div className={styles.preview_error}>{error}</div> : null}
    </div>
  );
};

export default CodePreview;
