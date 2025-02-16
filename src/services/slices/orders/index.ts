import { getOrderByNumberApi, getOrdersApi, orderBurgerApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

export type TOrdersState = {
  isLoading: boolean;
  orderModalData: TOrder | null;
  orderRequest: boolean;
  data: TOrder[];
};

export const initialState: TOrdersState = {
  isLoading: false,
  orderModalData: null,
  orderRequest: false,
  data: []
};

export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (ingredients: string[], { rejectWithValue }) => {
    try {
      const response = await orderBurgerApi(ingredients);
      return { order: response.order, name: response.name };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const getOrders = createAsyncThunk(
  'orders/getOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getOrdersApi();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const getOrder = createAsyncThunk(
  'orders/getOrder',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await getOrderByNumberApi(id);
      return response.orders[0];
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const slice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    resetOrderModalData(state) {
      state.orderModalData = null;
    }
  },
  selectors: {
    getOrderModalData: (state) => state.orderModalData,
    getOrderRequest: (state) => state.orderRequest,
    getAllOrders: (state) => state.data,
    getIsLoading: (state) => state.isLoading
  },
  extraReducers: (builder) => {
    builder
      .addCase(getOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(getOrders.rejected, (state) => {
        state.isLoading = false;
      });
    builder
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.isLoading = true;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderModalData = action.payload.order;
        state.data.push(action.payload.order);
        state.orderRequest = false;
      })
      .addCase(createOrder.rejected, (state) => {
        state.isLoading = false;
        state.orderRequest = false;
      });

    builder
      .addCase(getOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = [action.payload];
      })
      .addCase(getOrder.rejected, (state) => {
        state.isLoading = false;
      });
  }
});

export const {
  getOrderModalData,
  getOrderRequest,
  getAllOrders,
  getIsLoading
} = slice.selectors;

export const { resetOrderModalData } = slice.actions;
export const ordersReducer = slice.reducer;
