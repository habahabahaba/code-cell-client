// 3rd party:
// RTK:
// Store:
import { fetchCells } from '../store';
// Hooks:
import { useAppSelector, useAppDispatch } from '../hooks';
// React:
import { Fragment } from 'react';
import { useEffect } from 'react';
// Context:
// Components:
import CellsListItem from './CellsListItem';
import CellItemMargin from './CellItemMargin';

// CSS:
// Types, interfaces and enumns:
import { FC } from 'react';

// Component:
const CellsList: FC = () => {
  // Store:
  const cellsOrder = useAppSelector((state) => state.cells.order);
  const dispatch = useAppDispatch();
  // Fetching saved cells from local-API:
  useEffect(() => {
    dispatch(fetchCells());
  }, []);

  useEffect(() => {
    //  Unfocusing pressed "add cell" button after cell insertion:
    document.activeElement &&
      document.activeElement instanceof HTMLButtonElement &&
      document.activeElement.blur();
  }, [cellsOrder]);

  // JSX:
  const items = cellsOrder.map((id) => {
    return (
      <Fragment key={id}>
        <CellItemMargin id={id} />
        <CellsListItem id={id} />
      </Fragment>
    );
  });

  return (
    <div className='cells-list'>
      {items}
      <CellItemMargin forceVisible={cellsOrder.length === 0} />
    </div>
  );
};

export default CellsList;
