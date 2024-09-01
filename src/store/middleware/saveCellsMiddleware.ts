// RTK:
// Store:
import {
  deleteCell,
  insertCellBefore,
  moveCell,
  updateCell,
  saveCells,
} from '..';

// Types, interfaces and enumns:
import type { ListenerMiddleware } from '@reduxjs/toolkit';
const actions = [deleteCell, insertCellBefore, moveCell, updateCell];
export const persistCellsMiddleware: ListenerMiddleware = ({ dispatch }) => {
  let timer: number;
  return (next) => {
    return (action) => {
      next(action);

      if (actions.some((act) => act.match(action))) {
        console.log('saveCellsMiddleware detected: ', action);
        if (timer) {
          clearTimeout(timer);
        }
        timer = setTimeout(() => {
          dispatch(saveCells());
        }, 300);
      }
    };
  };
};
