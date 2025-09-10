import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Dimensions, Alert, ActivityIndicator } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useSelector, useDispatch } from 'react-redux';
import { selectAllImages, imagesAdded } from '../store/slices/imagesSlice';
import ImageCard from './ImageCard';
import * as MediaLibrary from 'expo-media-library';

const NUM_COLUMNS = 3;
const TILE_DIMENSION = Dimensions.get('window').width / NUM_COLUMNS;
const PAGE_SIZE = 21;

const ImageGrid = () => {
  const images = useSelector(selectAllImages);
  const dispatch = useDispatch();

  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();
  const [hasNextPage, setHasNextPage] = useState(true);
  const [endCursor, setEndCursor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const loadMoreAssets = useCallback(async () => {
    if (loading || loadingMore || !hasNextPage) {
      return;
    }

    setLoadingMore(true);

    const assets = await MediaLibrary.getAssetsAsync({
      mediaType: 'photo',
      sortBy: 'creationTime',
      first: PAGE_SIZE,
      after: endCursor,
    });

    dispatch(imagesAdded(assets.assets));
    setEndCursor(assets.endCursor);
    setHasNextPage(assets.hasNextPage);
    setLoadingMore(false);
  }, [dispatch, endCursor, hasNextPage, loading, loadingMore]);

  useEffect(() => {
    const getInitialAssets = async () => {
      setLoading(true);
      const assets = await MediaLibrary.getAssetsAsync({
        mediaType: 'photo',
        sortBy: 'creationTime',
        first: PAGE_SIZE,
      });
      dispatch(imagesAdded(assets.assets));
      setEndCursor(assets.endCursor);
      setHasNextPage(assets.hasNextPage);
      setLoading(false);
    };

    const checkPermissionsAndLoad = async () => {
      if (!permissionResponse) return;

      if (permissionResponse.status === 'granted') {
        getInitialAssets();
      } else if (permissionResponse.canAskAgain) {
        const { status } = await requestPermission();
        if (status === 'granted') {
          getInitialAssets();
        }
      } else {
        Alert.alert(
          'Permission Required',
          'The app needs permission to access your photos. Please grant permission in your device settings.'
        );
      }
    };

    checkPermissionsAndLoad();
  }, [permissionResponse, requestPermission, dispatch]);

  const renderFooter = () => {
    if (!loadingMore) return null;
    return <ActivityIndicator style={{ marginVertical: 20 }} />;
  };

  if (loading && images.length === 0) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlashList
        data={images}
        renderItem={({ item, index }) => <ImageCard item={item} index={index} />}
        keyExtractor={(item) => item.id}
        numColumns={NUM_COLUMNS}
        estimatedItemSize={TILE_DIMENSION}
        onEndReached={loadMoreAssets}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ImageGrid;
