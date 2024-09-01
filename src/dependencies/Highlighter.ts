// 3rd party:
// JSX Highlighter:
import MonacoJSXHighlighter, { makeBabelParse } from 'monaco-jsx-highlighter';
// Babel:
import { parse } from '@babel/parser';
import traverse from '@babel/traverse';

// Types, interfaces and enumns:
import { editor } from 'monaco-editor';
import { Monaco } from '@monaco-editor/react';

class Highlighter {
  constructor(
    monaco: Monaco,
    editor: editor.IStandaloneCodeEditor,
    config = Highlighter.defaultConfig,
    interval?: number
  ) {
    // Minimal Babel setup for React JSX parsing:
    const parseJSX = makeBabelParse(parse, false); // param0:Babel's parse, param1: default config for JSX syntax (false), TSX (true).

    // const babelParse = (code: string) =>
    //   parse(code, {
    //     sourceType: 'module',
    //     plugins: ['jsx'],
    //     strictMode: true,
    //   });

    // Instantiating Monaco JSX Highlighter:
    this.instance = new MonacoJSXHighlighter(
      monaco,
      parseJSX,
      traverse,
      editor,
      config
    );

    // Enabling debounced highlighting:
    this.highlightDisposer =
      this.instance.highlightOnDidChangeModelContent(interval);

    // Adding JSX commenting to your monaco editor:
    this.commentDisposer = this.instance.addJSXCommentCommand(); // doesn't work with the "@babel/parser": "^7.24.6"
  }
  private instance: typeof MonacoJSXHighlighter;

  public highlightDisposer: () => void;
  public commentDisposer: () => void;

  // public highlightOnce() {
  //   this.instance.highlightCode();
  // }

  static defaultConfig = {
    parser: 'babel', // for reference only, only babel is supported right now
    isHighlightGlyph: false, // if JSX elements should decorate the line number gutter
    iShowHover: false, // if JSX types should  tooltip with their type info
    isUseSeparateElementStyles: false, // if opening elements and closing elements have different styling
    isThrowJSXParseErrors: false, // Only JSX Syntax Errors are not thrown by default when parsing, true will throw like any other parsign error
  };
}

export default Highlighter;
