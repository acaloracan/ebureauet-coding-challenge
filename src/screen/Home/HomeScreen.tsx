import {
  ActivityIndicator,
  FlatList,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect} from 'react';

import {
  getTopStoriesItemThunk,
  getTopStoriesThunk,
} from '../../redux/reducers/topStoriesSlice';
import {RootState, useAppDispatch} from '../../redux/store/store';
import {useSelector} from 'react-redux';
import _ from 'lodash';
import moment from 'moment';
import {FONTS} from '../../utils/fonts';
import Animated, {Easing, FadeIn} from 'react-native-reanimated';
import {COLORS} from '../../utils/colors';

export const HomeScreen = () => {
  const {
    topStoriesId,
    topStoriesItem,
    topStoriesLoading,
    topStoriesItemLoading,
  } = useSelector((state: RootState) => state.topStoryReducer);

  const dispatch = useAppDispatch();

  const isLoading =
    topStoriesLoading === 'loading' || topStoriesItemLoading === 'loading';

  useEffect(() => {
    dispatch(getTopStoriesThunk());
  }, [dispatch]);

  const getTopStoriesItem = useCallback(() => {
    _.map(topStoriesId, item => {
      dispatch(getTopStoriesItemThunk(item));
    });
  }, [topStoriesId, dispatch]);

  useEffect(() => {
    if (!_.isEmpty(topStoriesId) && topStoriesLoading === 'success') {
      getTopStoriesItem();
    }
  }, [getTopStoriesItem, topStoriesLoading, topStoriesId]);

  function getTimestamp(value: string) {
    const dayDiference = moment().diff(moment(value), 'days');
    const hourDifference = moment().diff(moment(value), 'hours');
    const minutesDifference = moment().diff(moment(value), 'minutes');

    if (dayDiference === 1) {
      return '(1 day ago)';
    } else if (dayDiference > 1) {
      return `${dayDiference} days ago`;
    } else if (dayDiference < 1) {
      if (hourDifference === 1) {
        return '(1 hour ago)';
      } else if (hourDifference > 1) {
        return `(${hourDifference} hours ago)`;
      } else if (hourDifference < 1) {
        if (minutesDifference <= 1) {
          return '(1 minute ago)';
        } else if (minutesDifference > 1) {
          return `(${minutesDifference} minutes ago)`;
        }
      }
    }
  }

  function getDomainName(value: string) {
    return value?.replace(/https?:\/\/(?:www\.)?([^/]+).*/, '$1');
  }

  async function onItemPress(url: string) {
    try {
      const canOpenURL = await Linking.canOpenURL(url);
      if (canOpenURL) {
        Linking.openURL(url);
      }
    } catch (error) {
      throw error;
    }
  }

  return (
    <View style={styles.container}>
      {isLoading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size={'large'} color={COLORS.orange} />
        </View>
      ) : (
        <FlatList
          data={topStoriesItem}
          contentContainerStyle={styles.contentContainerStyle}
          renderItem={({item}) => {
            return (
              <TouchableOpacity onPress={() => onItemPress(item.storyUrl)}>
                <Animated.View
                  entering={FadeIn.duration(500).easing(Easing.ease)}
                  style={styles.itemContainerStyle}>
                  <View>
                    <View>
                      <Text style={styles.titleText}>{item.storyTitle}</Text>

                      <Text style={styles.storyUrl}>{`${getDomainName(
                        item.storyUrl,
                      )}`}</Text>
                    </View>
                  </View>

                  <Text style={styles.timestamp}>{`${moment(
                    item.storyTimestamp,
                  ).format('llll')} ${getTimestamp(
                    item.storyTimestamp,
                  )}`}</Text>

                  <View style={styles.scoreAuthorContainer}>
                    <View style={styles.storyScoreContainer}>
                      <Text
                        style={styles.storyScore}>{`${item.storyScore}`}</Text>
                    </View>

                    <View style={styles.divider} />
                    <Text style={styles.author}>
                      {`${item.authorId}`}{' '}
                      <Text
                        style={
                          styles.authorKarma
                        }>{`(${item.authorKarmaScore} karmas)`}</Text>
                    </Text>
                  </View>
                </Animated.View>
              </TouchableOpacity>
            );
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  author: {
    color: COLORS.daveysGray,
    fontFamily: FONTS.semiBold,
    fontSize: 12,
  },
  authorKarma: {
    fontFamily: FONTS.regular,
    fontSize: 12,
  },
  container: {flex: 1},
  contentContainerStyle: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 40,
    gap: 16,
  },
  divider: {
    height: 4,
    width: 4,
    borderRadius: 4,
    backgroundColor: COLORS.daveysGray,
  },
  itemContainerStyle: {
    borderRadius: 8,
    borderColor: COLORS.lightGray,
    borderWidth: 1,
    padding: 12,
    gap: 8,
  },
  loaderContainer: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  scoreAuthorContainer: {flexDirection: 'row', gap: 8, alignItems: 'center'},
  storyScore: {
    color: COLORS.white,
    fontFamily: FONTS.regular,
    fontSize: 12,
  },
  storyScoreContainer: {
    alignItems: 'center',
    backgroundColor: COLORS.orange,
    borderRadius: 16,
    justifyContent: 'center',
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  storyUrl: {
    fontFamily: FONTS.bold,
    fontSize: 14,
    color: COLORS.lightGray2,
  },
  timestamp: {
    fontFamily: FONTS.regular,
    fontSize: 12,
    color: COLORS.daveysGray,
  },
  titleText: {
    fontSize: 16,
    fontFamily: FONTS.bold,
  },
});
