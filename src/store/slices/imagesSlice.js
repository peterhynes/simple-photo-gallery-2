import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';

const imagesAdapter = createEntityAdapter({
  selectId: (image) => image.id,
});

const imagesSlice = createSlice({
  name: 'images',
  initialState: imagesAdapter.getInitialState(),
  reducers: {
    imageAdded: imagesAdapter.addOne,
    imagesAdded: imagesAdapter.addMany,
    imageUpdated: imagesAdapter.updateOne,
  },
});

export const { imageAdded, imagesAdded, imageUpdated } = imagesSlice.actions;

export const {
  selectAll: selectAllImages,
  selectById: selectImageById,
  selectIds: selectImageIds,
} = imagesAdapter.getSelectors((state) => state.images);

export default imagesSlice.reducer;
