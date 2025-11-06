import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
  useDispatch as useReduxDispatch,
  useSelector as useReduxSelector,
  TypedUseSelectorHook
} from 'react-redux';
import userReducer from './slices/user-slice';
import ingredientsReducer from './slices/ingredient-slice';
import constructorReducer from './slices/constructor-slice';
import orderReducer from './slices/order-slice';
import feedReducer from './slices/feed-slice';
import userOrdersReducer from './slices/userOrder-slice';

const rootReducer = combineReducers({
  user: userReducer,
  ingredients: ingredientsReducer,
  burgerConstructor: constructorReducer,
  order: orderReducer,
  feed: feedReducer,
  userOrders: userOrdersReducer
});

export { rootReducer };

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

(window as any).store = store;

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = useReduxDispatch;
export const useSelector: TypedUseSelectorHook<RootState> = useReduxSelector;

export default store;
