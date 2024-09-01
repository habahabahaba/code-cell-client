// 3rd party:
import MDEditor from '@uiw/react-md-editor';
// Redux:
// Store:
// React:
import { useEffect, useRef, useState } from 'react';
// Context:
// Components:
// import ReResizable from './UI/ReResizable';
// CSS:
import styles from './TextEditor.module.css';
// Types, interfaces and enumns:
import type { FC } from 'React';
interface TextEditorProps {
  value: string;
  reportChange: (value: string | undefined) => void;
}

// Component:
const TextEditor: FC<TextEditorProps> = ({ value, reportChange }) => {
  const [editing, setEditing] = useState<boolean>(false);

  // For clicking outside of Text Editor:
  const editorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const finishEditing = (event: MouseEvent): void => {
      if (
        event.target &&
        event.target instanceof Node &&
        editorRef.current &&
        editorRef.current.contains(event.target)
      )
        return;

      setEditing(false);
    };
    document.addEventListener('click', finishEditing, { capture: true });
    return () => {
      document.removeEventListener('click', finishEditing);
    };
  }, []);

  // JSX:
  const textEditor = editing ? (
    <div className={styles.text_editor_container} ref={editorRef}>
      <MDEditor
        className={[styles.text_editor, styles.dark_theme, 'md-editor'].join(
          ' '
        )}
        height='100%'
        autoFocus={true}
        visibleDragbar={false}
        textareaProps={{
          className: styles.input,
          name: 'textInput', // A form field element should have an id or name attribute.
        }}
        data-color-mode='light'
        highlightEnable={false} // CSS goes to shit otherwise!
        value={value}
        onChange={reportChange}
      />
    </div>
  ) : (
    <div
      className={styles.text_view_container}
      onClick={() => {
        setEditing(true);
      }}
    >
      <MDEditor.Markdown
        source={value}
        className={styles.text_view}
        disableCopy
      />
    </div>
  );

  return textEditor;
};

export default TextEditor;
