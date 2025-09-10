import React from 'react';
import { View, StyleSheet, Dimensions, Button, Alert } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useSelector, useDispatch } from 'react-redux';
import { selectAllImages, imageAdded } from '../store/slices/imagesSlice';
import ImageCard from './ImageCard';
import * as ImagePicker from 'expo-image-picker';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

const NUM_COLUMNS = 3;
const TILE_DIMENSION = Dimensions.get('window').width / NUM_COLUMNS;

const ImageGrid = () => {
  const images = useSelector(selectAllImages);
  const dispatch = useDispatch();

  const handleAddImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'You need to grant permission to access the photo library.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const newImage = { id: uuidv4(), uri: result.assets[0].uri };
      dispatch(imageAdded(newImage));
    }
  };

  const handleTakePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'You need to grant permission to use the camera.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const newImage = { id: uuidv4(), uri: result.assets[0].uri };
      dispatch(imageAdded(newImage));
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Button title="Add Image" onPress={handleAddImage} />
        <Button title="Take Photo" onPress={handleTakePhoto} />
      </View>
      <FlashList
        data={images}
        renderItem={({ item, index }) => <ImageCard item={item} index={index} />}
        keyExtractor={(item) => item.id}
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
});

export default ImageGrid;
