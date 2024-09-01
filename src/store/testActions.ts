import store from '.';
// Slices:
import { deleteCell, insertCellBefore, moveCell, updateCell } from './slices';

export default function testCellsActions() {
  store.dispatch(insertCellBefore({ neighborId: null, cellType: 'code' }));
  store.dispatch(insertCellBefore({ neighborId: null, cellType: 'text' }));
  store.dispatch(insertCellBefore({ neighborId: null, cellType: 'text' }));
  store.dispatch(insertCellBefore({ neighborId: null, cellType: 'text' }));
  console.log('initial slice: ', store.getState().cells);

  for (let i = 0; i < 4; i++) {
    const id = store.getState().cells.order[i];
    store.dispatch(updateCell({ id, content: '' + (i + 1) }));
  }
  console.log('added values to cells: ', store.getState().cells);

  const oldFirstId = store.getState().cells.order[0];
  store.dispatch(
    insertCellBefore({ neighborId: oldFirstId, cellType: 'text' })
  );
  const newFirstId = store.getState().cells.order[0];
  store.dispatch(updateCell({ id: newFirstId, content: 'new First Cell' }));
  console.log('added new cell at the top: ', store.getState().cells);

  store.dispatch(insertCellBefore({ neighborId: null, cellType: 'text' }));
  const newLastId =
    store.getState().cells.order[store.getState().cells.order.length - 1];
  store.dispatch(updateCell({ id: newLastId, content: 'new Last Cell' }));
  console.log('added new cell at the bottom: ', store.getState().cells);

  const oldThirdId = store.getState().cells.order[2];
  store.dispatch(updateCell({ id: oldThirdId, content: 'old Third Cell' }));
  store.dispatch(
    insertCellBefore({ neighborId: oldThirdId, cellType: 'text' })
  );
  const newThirdId = store.getState().cells.order[2];
  store.dispatch(updateCell({ id: newThirdId, content: 'NEW Third Cell' }));
  console.log(
    'added a new cell before the third cell: ',
    store.getState().cells
  );

  store.dispatch(
    moveCell({
      id: newFirstId,
      direction: 'up',
    })
  );
  console.log(
    'Trying to move the NEW first cell upwards: ',
    store.getState().cells
  );

  store.dispatch(
    moveCell({
      id: newLastId,
      direction: 'down',
    })
  );
  console.log(
    'Trying to move the NEW last cell downwards: ',
    store.getState().cells
  );

  const oldFithId = store.getState().cells.order[4];
  store.dispatch(updateCell({ id: oldFithId, content: 'went from 4 to 3' }));
  store.dispatch(
    moveCell({
      id: oldFithId,
      direction: 'up',
    })
  );
  console.log('moving the 5th cell upwards: ', store.getState().cells);

  store.dispatch(
    updateCell({ id: oldFithId, content: 'went from 4 to 3 and back to 4' })
  );
  store.dispatch(
    moveCell({
      id: oldFithId,
      direction: 'down',
    })
  );
  console.log('moving the 4th cell downwards: ', store.getState().cells);

  const newFithId = store.getState().cells.order[5];
  store.dispatch(
    deleteCell({
      id: newFithId,
    })
  );
  console.log(
    'deleting the second cell (with contents of 3): ',
    store.getState().cells
  );
}
