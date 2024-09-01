// 3rd party:
// Monaco Editor:
import MonacoEditor from '@monaco-editor/react';

// JSX Highlighter:
import Highlighter from '../dependencies/Highlighter';

// Prettier:
import prettier from 'prettier';
import babel from 'prettier/plugins/babel';
import estree from 'prettier/plugins/estree';

// React:
import { useRef, useCallback, useEffect } from 'react';

// CSS:
import styles from './CodeEditor.module.css';
// import './JSX-syntax.css';

// Types, interfaces and enumns:
import { FC } from 'react';
import type { editor } from 'monaco-editor';
import { Monaco } from '@monaco-editor/react';
interface CodeEditorProps {
  initialValue: string;
  reportChange(value: string | undefined): void;
  reportError(error: Error): void;
}

// Configs (options):
const editorOptions: editor.IStandaloneEditorConstructionOptions = {
  fontSize: 16,
  wordWrap: 'on',
  tabSize: 2,
  scrollBeyondLastLine: false,
  minimap: { enabled: false },
  // Don't highlight unused imports:
  showUnused: false,
  // Condense space on the left (around line numbers):
  folding: false,
  lineNumbersMinChars: 3,
  // Auto layout:
  automaticLayout: true,

  // Remove trailing auto inserted whitespace:
  // trimAutoWhitespace: true,
};

const prettierOptions: prettier.Options = {
  parser: 'babel',
  plugins: [babel, estree],
  useTabs: false,
  semi: true,
  singleQuote: true,
};

// Component:
const CodeEditor: FC<CodeEditorProps> = ({
  initialValue = ``,
  reportChange,
  reportError,
}) => {
  // Editor ref (for input value access):
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  // Disposing of MonacoJSXHighlighter so that it won't throw an error, when deleting a code cell:
  const highlighterRef = useRef<Highlighter | null>(null);
  useEffect(() => {
    return () => {
      if (highlighterRef.current) {
        highlighterRef.current.highlightDisposer();
        // highlighterRef.current.commentDisposer();
      }
    };
  }, []);

  // Handlers:
  const onEditorDidMount = useCallback(
    (editor: editor.IStandaloneCodeEditor, monaco: Monaco) => {
      // Setting Editor ref:
      editorRef.current = editor;

      // JSX highlighting and (commenting doesn't work with the "@babel/parser": "^7.24.6"):
      highlighterRef.current = new Highlighter(monaco, editor);
    },
    []
  );

  function handleInputChange(
    value: string | undefined
    // ev: editor.IModelContentChangedEvent
  ): void {
    // console.log(`Editor value:
    // ${value}
    // `);
    // console.log(`Editor event:
    // ${JSON.stringify(ev)}
    // `);

    if (value === undefined) return;

    // Report to parent
    reportChange(value);
  }

  async function handleFormat(): Promise<void> {
    if (!editorRef.current) return;
    try {
      // With Prettier formatter:
      const input = editorRef.current.getValue();
      const formatted = (await prettier.format(input, prettierOptions)).replace(
        /\n$/,
        ''
      );
      editorRef.current.setValue(formatted);

      // // With native formatter:
      // const formatAction = editorRef.current.getAction(
      //   'editor.action.formatDocument'
      // );
      // formatAction && formatAction.run();
    } catch (error) {
      if (error instanceof Error) {
        reportError(error);
      } else {
        console.log(error);
      }
    }
  }

  // JSX:
  return (
    <div className={styles.editor_container}>
      <button
        className={styles.button_format + ' button is-primary is-small'}
        onClick={handleFormat}
      >
        Format
      </button>
      <MonacoEditor
        className={styles.editor_dark}
        value={initialValue}
        language='javascript'
        // defaultLanguage='javascript'
        height='100%'
        width='100%'
        theme='vs-dark'
        options={editorOptions}
        onChange={handleInputChange}
        onMount={onEditorDidMount}
      />
    </div>
  );
};

export default CodeEditor;
