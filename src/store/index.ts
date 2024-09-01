// RTK:
import { configureStore } from '@reduxjs/toolkit';
// Slices:
import { cellsReducer, bundlesReducer } from './slices';
// Middleware:
import { persistCellsMiddleware } from './middleware';

// Setting up store:
const store = configureStore({
  reducer: {
    cells: cellsReducer,
    bundles: bundlesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(persistCellsMiddleware),
});

// Types, interfaces and enumns:
export type rootState = ReturnType<typeof store.getState>;
export type appDispatch = typeof store.dispatch;

export * from './slices';
export default store;

// TESTS:
// import testCellsActions from './testActions';
// testCellsActions();

// import testCumulativeActions from './testCumulativeActions';
// testCumulativeActions();
