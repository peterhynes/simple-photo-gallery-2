import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { mockImages } from '../mockData';
import ImageThumbnail from './ImageThumbnail';

const NUM_COLUMNS = 3;
const TILE_DIMENSION = Dimensions.get('window').width / NUM_COLUMNS;

const ImageGrid = () => {
  return (
    <View style={styles.container}>
      <FlashList
        data={mockImages}
        renderItem={({ item }) => <ImageThumbnail item={item} />}
        keyExtractor={(item) => item.uri}
        numColumns={NUM_COLUMNS}
        estimatedItemSize={TILE_DIMENSION}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default ImageGrid;
