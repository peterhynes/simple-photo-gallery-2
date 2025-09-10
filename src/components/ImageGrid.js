import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { View, StyleSheet, Dimensions, Alert, ActivityIndicator } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useSelector, useDispatch } from 'react-redux';
import { selectAllImages, imagesAdded } from '../store/slices/imagesSlice';
import ImageCard from './ImageCard';
import * as MediaLibrary from 'expo-media-library';
import ImageViewing from 'react-native-image-viewing';
import FastImage from '@d11/react-native-fast-image';

const NUM_COLUMNS = 3;
const TILE_DIMENSION = Dimensions.get('window').width / NUM_COLUMNS;
const PAGE_SIZE = 21;
const PRELOAD_WINDOW = 2; // Preload 2 images before and 2 after the current one

const ImageGrid = () => {
  const images = useSelector(selectAllImages);
  const dispatch = useDispatch();

  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();
  const [initialLoading, setInitialLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isViewerVisible, setIsViewerVisible] = useState(false);

  const paginationInfo = useRef({
    endCursor: null,
    hasNextPage: true,
  });

  const viewerImages = useMemo(() => images.map(img => ({ uri: img.uri })), [images]);

  const loadMoreAssets = useCallback(async () => {
    // ... (rest of the function is unchanged)
    if (!paginationInfo.current.hasNextPage || loadingMore) {
      return;
    }
    setLoadingMore(true);
    const assets = await MediaLibrary.getAssetsAsync({
      mediaType: 'photo',
      sortBy: 'creationTime',
      first: PAGE_SIZE,
      after: paginationInfo.current.endCursor,
    });
    if (assets.assets.length > 0) {
      dispatch(imagesAdded(assets.assets));
      paginationInfo.current.endCursor = assets.endCursor;
      paginationInfo.current.hasNextPage = assets.hasNextPage;
    } else {
      paginationInfo.current.hasNextPage = false;
    }
    setLoadingMore(false);
  }, [dispatch, loadingMore]);

  useEffect(() => {
    // ... (rest of the hook is unchanged)
    const getInitialAssets = async () => {
      const assets = await MediaLibrary.getAssetsAsync({
        mediaType: 'photo',
        sortBy: 'creationTime',
        first: PAGE_SIZE,
      });
      dispatch(imagesAdded(assets.assets));
      paginationInfo.current.endCursor = assets.endCursor;
      paginationInfo.current.hasNextPage = assets.hasNextPage;
      setInitialLoading(false);
    };
    const checkPermissionsAndLoad = async () => {
      if (!permissionResponse) return;
      setInitialLoading(true);
      if (permissionResponse.status === 'granted') {
        await getInitialAssets();
      } else if (permissionResponse.canAskAgain) {
        const { status } = await requestPermission();
        if (status === 'granted') {
          await getInitialAssets();
        }
      } else {
        Alert.alert(
          'Permission Required',
          'The app needs permission to access your photos. Please grant permission in your device settings.'
        );
      }
      setInitialLoading(false);
    };
    checkPermissionsAndLoad();
  }, [permissionResponse, requestPermission, dispatch]);

  const openViewer = (index) => {
    // Preload surrounding images
    const urisToPreload = [];
    for (let i = -PRELOAD_WINDOW; i <= PRELOAD_WINDOW; i++) {
      if (i === 0) continue; // Don't preload the current image
      const preloadIndex = index + i;
      if (preloadIndex >= 0 && preloadIndex < viewerImages.length) {
        urisToPreload.push({ uri: viewerImages[preloadIndex].uri });
      }
    }
    if (urisToPreload.length > 0) {
      FastImage.preload(urisToPreload);
    }

    setCurrentImageIndex(index);
    setIsViewerVisible(true);
  };

  const closeViewer = () => {
    setIsViewerVisible(false);
  };

  const renderFooter = () => {
    if (!loadingMore) return null;
    return <ActivityIndicator style={{ marginVertical: 20 }} />;
  };

  if (initialLoading) {
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
        renderItem={({ item, index }) => (
          <ImageCard
            item={item}
            index={index}
            onPress={() => openViewer(index)}
          />
        )}
        keyExtractor={(item) => item.id}
        numColumns={NUM_COLUMNS}
        estimatedItemSize={TILE_DIMENSION}
        onEndReached={loadMoreAssets}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
      />
      <ImageViewing
        images={viewerImages}
        imageIndex={currentImageIndex}
        visible={isViewerVisible}
        onRequestClose={closeViewer}
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
