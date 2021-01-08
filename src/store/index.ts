import { Point3d } from "@bentley/geometry-core";
import { createSlice } from "@reduxjs/toolkit";

export const markerSlice = createSlice({
  name: "marker",
  initialState: [],
  reducers: {
    addMarker: (state: Point3d[], action) => {
      const { location } = action.payload;
      state.push(location);
    },
    removeMarker: (state: Point3d[], action) => {
      const { index } = action.payload;
      state.splice(index, 1);
    },
  },
});

export const { addMarker, removeMarker } = markerSlice.actions;