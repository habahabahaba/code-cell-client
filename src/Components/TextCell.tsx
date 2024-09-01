// Dependencies:
import { textInstructions } from '../dependencies/textInstructions';
// 3rd party:
// Hooks:
import { useAppDispatch } from '../hooks';
// RTK:
// Store:
import { updateCell } from '../store/';
// React:
// import { useEffect, useRef, useState } from 'react';
// Context:
// Components:
import TextEditor from './TextEditor';
import ReResizable from './UI/ReResizable';
// CSS:

// Types, interfaces and enumns:
import type { FC } from 'React';
import type { Cell } from '../store/';
interface TextCellProps {
  cell: Cell;
}

// const initialValue = `
// # Something Like That:

// | Header | Header |
// |--------|--------|
// | Cell | Cell |
// | Cell | Cell |
// | Cell | Cell |

// ![image](https://user-images.githubusercontent.com/1680273/146292033-0e5e57fc-6f3e-4032-9fa6-0de05f239e36.png)

// Something, something ...please ***WORK*!!!!!!**
// \`\`\`
// const num = 1
// \`\`\`
// #### Title4
// ## title2

// # That's All, Folks ...
// `;

// Component:
const TextCell: FC<TextCellProps> = ({ cell }) => {
  // Store:
  const dispatch = useAppDispatch();

  // Handlers:
  function reportEditorChange(value: string | undefined): void {
    const content = value || '';
    dispatch(updateCell({ id: cell.id, content }));
  }

  // JSX:
  return (
    <ReResizable direction='vertical'>
      <TextEditor
        value={cell.content || textInstructions()}
        reportChange={reportEditorChange}
      />
    </ReResizable>
  );
};

export default TextCell;
