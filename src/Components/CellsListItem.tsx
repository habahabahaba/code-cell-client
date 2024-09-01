// 3rd party:
// Redux RTK:
// Store:
import { useAppSelector } from '../hooks';
// React:
// import { useEffect, useRef } from 'react';
// Context:
// Components:
import CodeCell from './CodeCell';
import TextCell from './TextCell';
import CellItemBar from './CellItemBar';
// CSS:
// Types, interfaces and enumns:
interface CellsListItemProps {
  id: string;
}

import { FC } from 'react';

// Component:
const CellsListItem: FC<CellsListItemProps> = ({ id }) => {
  // Store:
  const cells = useAppSelector((state) => state.cells.data);

  // JSX:
  const cellComponent =
    cells[id].type === 'code' ? (
      <CodeCell cell={cells[id]} />
    ) : (
      <TextCell cell={cells[id]} />
    );

  return (
    <div
      className={` cell-item ${cells[id].type === 'text' ? 'text-item' : null}`}
    >
      <CellItemBar id={id} showId={cells[id].type === 'code'} />
      {cellComponent}
    </div>
  );
};

export default CellsListItem;
