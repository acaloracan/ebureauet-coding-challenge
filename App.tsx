import React from 'react';
import {StyleSheet, SafeAreaView} from 'react-native';

import {store} from './src/redux/store/store';
import {Provider} from 'react-redux';
import {HomeScreen} from './src/screen/Home/HomeScreen';

const App = () => {
  return (
    <Provider store={store}>
      <SafeAreaView style={styles.container}>
        <HomeScreen />
      </SafeAreaView>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
