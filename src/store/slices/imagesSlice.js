import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';

const imagesAdapter = createEntityAdapter({
  selectId: (image) => image.uri,
});

const imagesSlice = createSlice({
  name: 'images',
  initialState: imagesAdapter.getInitialState(),
  reducers: {
    imageAdded: imagesAdapter.addOne,
    imageUpdated: imagesAdapter.updateOne,
  },
});

export const { imageAdded, imageUpdated } = imagesSlice.actions;

export default imagesSlice.reducer;
