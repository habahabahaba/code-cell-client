// RTK:
import { useDispatch, useSelector } from 'react-redux';
// Types:
import type { rootState, appDispatch } from '../store';

export const useAppDispatch = useDispatch.withTypes<appDispatch>();
export const useAppSelector = useSelector.withTypes<rootState>();
