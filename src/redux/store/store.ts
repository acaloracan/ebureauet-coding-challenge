import {configureStore} from '@reduxjs/toolkit';

import topStoriesSlice from '../reducers/topStoriesSlice';
import {useDispatch} from 'react-redux';

export const store = configureStore({
  reducer: {
    topStoryReducer: topStoriesSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = useDispatch.withTypes<AppDispatch>(); // Export a hook that can be reused to resolve types
