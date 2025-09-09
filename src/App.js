import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Provider, useDispatch } from 'react-redux';
import { store } from './store/store';
import ImageGrid from './components/ImageGrid';
import { imagesAdded } from './store/slices/imagesSlice';
import { mockImages } from './mockData';

function AppContent() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(imagesAdded(mockImages));
  }, [dispatch]);

  return (
    <View style={styles.container}>
      <ImageGrid />
    </View>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
