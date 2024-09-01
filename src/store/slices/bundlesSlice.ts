// Dependancies:
import Bundler from '../../dependencies/Bundler';
import serializeError from '../../dependencies/serializeError';

// RTK:
// import { createSlice } from '@reduxjs/toolkit';
import { buildCreateSlice, asyncThunkCreator } from '@reduxjs/toolkit';

// Types, interfaces and enumns:
import type { BundlerResult } from '../../dependencies/Bundler';
import type { appDispatch } from '..';
import type { CumulativeCode } from '../../dependencies/Bundler';
export interface Bundle {
  code: string;
  error: string;
  loading: boolean;
}
interface BundlesSlice {
  [key: string]: Bundle | undefined;
}
interface BundleThunkArg {
  id: string;
  rawCode: string;
}
// interface BundleRejectValue {
//   id: string;
//   error: string;
// }
interface BundlePayload {
  id: string;
  bundledCode: BundlerResult;
}
// Initial cells state:
const initialState: BundlesSlice = {};

// Setup for asyncThunk:
const createAppSlice = buildCreateSlice({
  creators: { asyncThunk: asyncThunkCreator },
});

// Slice:
const bundlesSlice = createAppSlice({
  name: 'Bundles',
  initialState,
  reducers: (create) => ({
    // CREATE_BUNDLE_START
    createBundleStart: create.reducer<{ id: string }>((slice, action) => {
      const { id } = action.payload;
      slice[id] = { code: '', error: '', loading: true };
    }),

    // CREATE_BUNDLE_COMPLETE
    createBundleComplete: create.reducer<{
      id: string;
      bundledCode: BundlerResult;
    }>((slice, action) => {
      const {
        id,
        bundledCode: { code, error },
      } = action.payload;
      const serializedError = serializeError(error);
      slice[id] = { code, error: serializedError, loading: false };
    }),

    // SET_BUNDLE_ERROR
    setBundleError: create.reducer<{
      id: string;
      error: unknown;
    }>((slice, action) => {
      const { id, error } = action.payload;
      const serializedError = serializeError(error);

      if (slice[id] !== undefined) {
        slice[id]!.error = serializedError;
        slice[id]!.loading = false;
      } else {
        slice[id] = { code: '', error: serializedError, loading: false };
      }
    }),

    // CREATE_BUNDLE
    createBundle: create.asyncThunk(async function (
      { id, rawCode }: BundleThunkArg,
      thunkApi
    ): Promise<BundlePayload> {
      // const state = thunkApi.getState() as rootState;
      const dispatch = thunkApi.dispatch as appDispatch;
      dispatch(createBundleStart({ id }));

      try {
        const bundledCode = await Bundler.build(rawCode);
        if (bundledCode.error) {
          throw bundledCode.error;
        }
        dispatch(createBundleComplete({ id, bundledCode }));

        return { id, bundledCode };
      } catch (error) {
        dispatch(setBundleError({ id, error }));
        throw thunkApi.rejectWithValue({
          id,
          error,
        });
      }
    }),
    // CREATE_CUMULATIVE_BUNDLE
    createCumulativeBundle: create.asyncThunk(async function (
      { inputFiles, entryId }: CumulativeCode,
      thunkApi
    ): Promise<BundlePayload> {
      // const state = thunkApi.getState() as rootState;
      const dispatch = thunkApi.dispatch as appDispatch;
      dispatch(createBundleStart({ id: entryId }));

      try {
        const bundledCode = await Bundler.buildMultiple({
          inputFiles,
          entryId,
        });
        if (bundledCode.error) {
          throw bundledCode.error;
        }
        dispatch(createBundleComplete({ id: entryId, bundledCode }));

        return { id: entryId, bundledCode };
      } catch (error) {
        dispatch(setBundleError({ id: entryId, error }));
        throw thunkApi.rejectWithValue({
          id: entryId,
          error,
        });
      }
    }),
  }),
});

export default bundlesSlice.reducer;
export const {
  createBundleStart,
  createBundleComplete,
  setBundleError,
  createBundle,
  createCumulativeBundle,
} = bundlesSlice.actions;
