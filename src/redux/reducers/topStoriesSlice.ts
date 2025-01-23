import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {TopStoriesItem, TopStoryItemRequest} from '../../types/topStories';
import {
  getTopStories,
  getTopStoryItem,
  getTopStoryUser,
} from '../../api/service/topStoriesService';
import moment from 'moment';
import _ from 'lodash';

interface TopStoriesState {
  topStoriesId: number[];
  topStoriesItem: TopStoriesItem[];
  topStoriesLoading: 'idle' | 'loading' | 'success' | 'error';
  topStoriesItemLoading: 'idle' | 'loading' | 'success' | 'error';
}

const initialState = {
  topStoriesId: [],
  topStoriesItem: [],
  topStoriesLoading: 'idle',
  topStoriesItemLoading: 'idle',
} satisfies TopStoriesState as TopStoriesState;

export const getTopStoriesThunk = createAsyncThunk(
  'getTopStories',
  async () => {
    return getTopStories();
  },
);

export const getTopStoriesItemThunk = createAsyncThunk(
  'getTopStoriesItem',
  async (storyId: TopStoryItemRequest) => {
    const storyItemData = await getTopStoryItem(storyId);
    const authorData = await getTopStoryUser(storyItemData.by);

    const data: TopStoriesItem = {
      authorId: authorData.id,
      authorKarmaScore: authorData.karma,
      storyScore: storyItemData.score,
      storyTimestamp: moment.unix(storyItemData.time).format(),
      storyTitle: storyItemData.title,
      storyUrl: storyItemData.url,
    };

    return data;
  },
);

const topStoriesSlice = createSlice({
  name: 'topStories',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getTopStoriesThunk.pending, state => {
      state.topStoriesLoading = 'loading';
    });
    builder.addCase(getTopStoriesThunk.fulfilled, (state, action) => {
      state.topStoriesId = _.sampleSize(action.payload, 10);
      state.topStoriesLoading = 'success';
    });
    builder.addCase(getTopStoriesThunk.rejected, state => {
      state.topStoriesLoading = 'error';
    });
    builder.addCase(getTopStoriesItemThunk.pending, state => {
      state.topStoriesItemLoading = 'loading';
    });
    builder.addCase(getTopStoriesItemThunk.fulfilled, (state, action) => {
      const data = _.concat(state.topStoriesItem, action.payload);
      state.topStoriesItem = _.orderBy(data, ['storyScore'], ['desc']);
      state.topStoriesItemLoading = 'success';
    });
    builder.addCase(getTopStoriesItemThunk.rejected, state => {
      state.topStoriesItemLoading = 'error';
    });
  },
});

export default topStoriesSlice.reducer;
