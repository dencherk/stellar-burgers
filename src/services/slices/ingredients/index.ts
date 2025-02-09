import { getIngredientsApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TIngredient } from '../../../utils/types';

type TIngredientState = {
  isLoading: boolean;
  ingredients: TIngredient[];
};

const initialState: TIngredientState = {
  isLoading: false,
  ingredients: []
};

export const getIngredients = createAsyncThunk(
  'ingredients/getIngredients',
  async () => await getIngredientsApi()
);

export const slice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  selectors: {
    getAllIngredients: (state) => state.ingredients,
    getIngredientsIsLoading: (state) => state.isLoading
  },
  extraReducers: (builder) => {
    builder
      .addCase(getIngredients.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getIngredients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ingredients = action.payload;
      })
      .addCase(getIngredients.rejected, (state) => {
        state.isLoading = false;
      });
  }
});

export const { getAllIngredients, getIngredientsIsLoading } = slice.selectors;
export default slice.reducer;
