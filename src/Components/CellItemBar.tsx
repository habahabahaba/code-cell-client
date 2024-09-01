// 3rd party:
import { FaChevronUp, FaChevronDown, FaXmark } from 'react-icons/fa6';

// RTK:
// Store:
import { deleteCell, moveCell } from '../store/slices';
import { useAppDispatch } from '../hooks';
// React:
// Context:
// Components:
import Button from './UI/Button';
// CSS:
// Types, interfaces and enumns:
import { FC } from 'react';
import type { direction } from '../store';
interface CellItemBarProps {
  id: string;
  showId?: boolean;
}

// Component:
const CellItemBar: FC<CellItemBarProps> = ({ id, showId = false }) => {
  // Store:
  const dispatch = useAppDispatch();

  // Handlers:
  function handleDeleteCell() {
    dispatch(deleteCell({ id }));
  }
  function handleMoveCell(direction: direction) {
    dispatch(moveCell({ id, direction }));
  }
  // function handleIsertCell(cellType: cellType) {
  //   dispatch(insertCellBefore({ neighborId: id, cellType }));
  // }

  // JSX:
  return (
    <div className='cell-item-bar'>
      <span className='cell-item-bar-title'>{showId ? id : null}</span>
      <span className='cell-item-bar-group'>
        <Button
          onClick={handleDeleteCell}
          className=' item-bar-icon is-danger is-small'
          icon={<FaXmark />}
        />
        <Button
          onClick={() => {
            handleMoveCell('down');
          }}
          className=' item-bar-icon is-warning is-small'
          icon={<FaChevronDown />}
        />
        <Button
          onClick={() => {
            handleMoveCell('up');
          }}
          className=' item-bar-icon is-warning is-small'
          icon={<FaChevronUp />}
        />
      </span>
    </div>
  );
};

export default CellItemBar;
