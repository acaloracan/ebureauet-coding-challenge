import axios from 'axios';
import Config from 'react-native-config';
import {
  TopStoriesResponse,
  TopStoryItemRequest,
  TopStoryItemResponse,
  TopStoryUserRequest,
  TopStoryUserResponse,
} from '../../types/topStories';

const instance = axios.create({
  baseURL: Config.API_URL,
});

export const getTopStories = async (): Promise<TopStoriesResponse> => {
  try {
    const {data} = await instance.get('topstories.json');
    return data;
  } catch (error) {
    throw error;
  }
};

export const getTopStoryItem = async (
  payload: TopStoryItemRequest,
): Promise<TopStoryItemResponse> => {
  try {
    const {data} = await instance.get(`item/${payload}.json`);
    return data;
  } catch (error) {
    throw error;
  }
};

export const getTopStoryUser = async (
  payload: TopStoryUserRequest,
): Promise<TopStoryUserResponse> => {
  try {
    const {data} = await instance.get(`user/${payload}.json`);
    return data;
  } catch (error) {
    throw error;
  }
};
