// Dependancies:
import serializeError from '../../dependencies/serializeError';
// RTK:
import {
  // createSlice,
  nanoid,
  buildCreateSlice,
  asyncThunkCreator,
} from '@reduxjs/toolkit';

// Types, interfaces and enumns:
// import type { PayloadAction } from '@reduxjs/toolkit';
import type { rootState } from '..';
import type { appDispatch } from '..';
export type cellType = 'code' | 'text';
export type direction = 'up' | 'down';
export interface Cell {
  id: string;
  content: string;
  type: cellType;
}
interface CellsSlice {
  data: { [key: string]: Cell };
  loading: boolean;
  error: string | null;
  order: string[];
}

// Initial cells state:
const initialState: CellsSlice = {
  data: {},
  loading: false,
  error: null,
  order: [],
};

// Setup for asyncThunk:
const createAppSlice = buildCreateSlice({
  creators: { asyncThunk: asyncThunkCreator },
});

// Slice:
const cellsSlice = createAppSlice({
  name: 'Cells',
  initialState,
  reducers: (create) => ({
    // DELETE CELL:
    deleteCell: create.reducer<{ id: string }>((slice, action) => {
      const { id } = action.payload;
      const { data, order } = slice;

      // Removing cell from data:
      const { [id]: removedCell, ...newData } = data;
      console.log('Removed cell: ', removedCell); //  TS bullshit
      slice.data = newData;

      // Removing cell from order:
      const newOrder = order.filter((el) => el !== id);
      slice.order = newOrder;
    }),

    // INSERT CELL BEFORE ANOTHER CELL:
    insertCellBefore: create.reducer<{
      neighborId: string | null;
      cellType: cellType;
    }>((slice, action) => {
      const { neighborId, cellType } = action.payload;
      const { order } = slice;

      // Creating a new cell:
      const newId: string = `_${cellType}_${nanoid(6)}`;
      const newCell: Cell = {
        id: newId,
        content: '',
        type: cellType,
      };

      // Adding new cell to data:
      slice.data[newId] = newCell;

      //  Adding new cell to order:
      const neighborIdx = neighborId ? order.indexOf(neighborId) : -1; // TS bullshit

      if (!neighborId || neighborIdx < 0) {
        slice.order.push(newId);
      } else {
        slice.order.splice(neighborIdx, 0, newId);
      }
    }),

    // MOVE CELL:
    moveCell: create.reducer<{ id: string; direction: direction }>(
      (slice, action) => {
        const { id, direction } = action.payload;
        const { order } = slice;
        const { length } = order;

        //   Checking if there's a place to move into:
        if (order[0] === id && direction === 'up') return slice;
        if (order[length - 1] === id && direction === 'down') return slice;

        //   Checking if there's a cell with a given id:
        const currentIdx = order.indexOf(id);
        if (currentIdx < 0) return slice;

        //   Swapping neighbors:
        const neighborIdx =
          direction === 'up' ? currentIdx - 1 : currentIdx + 1;
        [slice.order[currentIdx], slice.order[neighborIdx]] = [
          order[neighborIdx],
          order[currentIdx],
        ];
      }
    ),

    // UPDATE CELL:
    updateCell: create.reducer<{ id: string; content: string }>(
      (slice, action) => {
        const { id, content } = action.payload;

        if (!slice.data[id]) return slice;
        slice.data[id].content = content;
        return slice;
      }
    ),

    // FETCH CELLS START:
    fetchCellsStart: create.reducer((slice, _) => {
      slice.data = {};
      slice.order = [];
      slice.loading = true;
      slice.error = null;
    }),

    // FETCH CELLS COMPLETE:
    fetchCellsComplete: create.reducer<{ cellsArray: Cell[] }>(
      (slice, action) => {
        const { cellsArray } = action.payload;

        slice.order = cellsArray.map((cell) => cell.id);
        slice.data = cellsArray.reduce(
          (data: CellsSlice['data'], cell: Cell) => {
            data[cell.id] = cell;
            return data;
          },
          {}
        );

        slice.loading = false;
        slice.error = null;
      }
    ),

    // SET CELLS ERROR:
    setCellsError: create.reducer<{
      type: 'fetch' | 'save';
      error: unknown;
    }>((slice, action) => {
      const { error, type } = action.payload;
      const serializedError = serializeError(error);
      if (type === 'fetch') {
        slice.order = [];
        slice.data = {};
      }

      slice.error = serializedError;
      slice.loading = false;
    }),

    // FETCH CELLS:
    fetchCells: create.asyncThunk(async (_, thunkApi): Promise<Cell[]> => {
      const dispatch = thunkApi.dispatch as appDispatch;

      dispatch(fetchCellsStart());
      try {
        const response = await fetch('/cells');
        // console.log('Response to fetchCells: ', response);
        const cellsArray: Cell[] = await response.json();
        console.log('Fetched the array of cells: ', cellsArray);

        dispatch(fetchCellsComplete({ cellsArray }));
        return cellsArray;
      } catch (error) {
        dispatch(setCellsError({ error, type: 'fetch' }));
        throw thunkApi.rejectWithValue({
          error,
        });
      }
    }),

    // SAVE CELLS:
    saveCells: create.asyncThunk(async (_, thunkApi): Promise<string> => {
      const dispatch = thunkApi.dispatch as appDispatch;
      const state = thunkApi.getState() as rootState;
      const {
        cells: { data, order },
      } = state;
      const cells: Cell[] = order.map((id) => data[id]);
      const headers = new Headers();
      headers.append('Content-Type', 'application/json');
      const body = JSON.stringify({ cells });
      try {
        const response = await fetch('/cells', {
          method: 'POST',
          headers,
          body,
        });

        // console.log('response to POST: ', response);

        if (response.status !== 201) throw new Error('Failed to save cells.');

        const { serializedCells } = await response.json();
        return serializedCells;
      } catch (error) {
        dispatch(setCellsError({ error, type: 'save' }));
        throw thunkApi.rejectWithValue({
          error,
        });
      }
    }),
  }),
});

export default cellsSlice.reducer;
export const {
  deleteCell,
  insertCellBefore,
  moveCell,
  updateCell,
  fetchCellsStart,
  fetchCellsComplete,
  setCellsError,
  fetchCells,
  saveCells,
} = cellsSlice.actions;
