export type TopStoriesResponse = number[];

export type TopStoryItemRequest = number;

export type TopStoryItemResponse = {
  by: string;
  descendants: number;
  id: number;
  kids: number[];
  score: number;
  time: number;
  title: string;
  type: string;
  url: string;
};

export type TopStoryUserRequest = string;

export type TopStoryUserResponse = {
  created: number;
  id: string;
  karma: number;
  submitted: number[];
};

export type TopStoriesItem = {
  authorId: string;
  authorKarmaScore: number;
  storyTitle: string;
  storyUrl: string;
  storyScore: number;
  storyTimestamp: string;
};
