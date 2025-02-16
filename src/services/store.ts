import { configureStore, combineReducers } from '@reduxjs/toolkit';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

import { ingredientsReducer } from './slices/ingredients';
import { builderReducer } from './slices/builder';
import { ordersReducer } from './slices/orders';
import { feedReducer } from './slices/feeds';
import { userReducer } from './slices/user';

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  builder: builderReducer,
  orders: ordersReducer,
  feeds: feedReducer,
  user: userReducer
});

export const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
