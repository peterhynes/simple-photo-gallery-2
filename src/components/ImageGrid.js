import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { View, StyleSheet, Dimensions, Alert, ActivityIndicator, Modal } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useSelector, useDispatch } from 'react-redux';
import { selectAllImages, imagesAdded } from '../store/slices/imagesSlice';
import ImageCard from './ImageCard';
import * as MediaLibrary from 'expo-media-library';
import GallerySwiper from 'react-native-gallery-swiper';
import FastImage from '@d11/react-native-fast-image';

const NUM_COLUMNS = 3;
const TILE_DIMENSION = Dimensions.get('window').width / NUM_COLUMNS;
const PAGE_SIZE = 21;

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

  const viewerImages = useMemo(() => images.map(img => ({ url: img.uri })), [images]);

  const loadMoreAssets = useCallback(async () => {
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

  const openViewer = useCallback((index) => {
    setCurrentImageIndex(index);
    setIsViewerVisible(true);
  }, []);

  const closeViewer = () => {
    setIsViewerVisible(false);
  };

  const renderFooter = () => {
    if (!loadingMore) return null;
    return <ActivityIndicator style={{ marginVertical: 20 }} />;
  };

  const renderItem = useCallback(({ item, index }) => (
    <ImageCard
      item={item}
      index={index}
      onPress={() => openViewer(index)}
    />
  ), [openViewer]);

  const renderImage = useCallback((imageProps) => {
    return (
      <FastImage
        {...imageProps}
        style={StyleSheet.absoluteFillObject}
        resizeMode={FastImage.resizeMode.contain}
      />
    );
  }, []);

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
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={NUM_COLUMNS}
        estimatedItemSize={TILE_DIMENSION}
        onEndReached={loadMoreAssets}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
      />
      <Modal visible={isViewerVisible} transparent={true} onRequestClose={closeViewer}>
        <GallerySwiper
          images={viewerImages}
          initialPage={currentImageIndex}
          onPageSelected={page => setCurrentImageIndex(page)}
          onEndReached={loadMoreAssets}
          imageComponent={renderImage}
          onSingleTapConfirmed={closeViewer}
          style={{ flex: 1, backgroundColor: 'black' }}
        />
      </Modal>
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
