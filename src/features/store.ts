import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { PersistConfig, persistReducer, persistStore } from 'redux-persist';
import localStorage from 'redux-persist/lib/storage';
import { useDispatch, UseSelector, useSelector } from 'react-redux';
import { api } from './api';
import authReducer from './auth';
import themeReducer from './theme';

const rootReducer = combineReducers({
  api: api.reducer,
  auth: authReducer,
  theme: themeReducer,
});

const persistConfig: PersistConfig<ReturnType<typeof rootReducer>> = {
  key: 'root',
  storage: localStorage,
  whitelist: ['auth', 'theme'],
};

const presistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: presistedReducer,
  middleware: getDefaultMiddleware => getDefaultMiddleware({ serializableCheck: false }).concat(api.middleware),
  devTools: true,
});

export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: UseSelector<RootState> = useSelector;
