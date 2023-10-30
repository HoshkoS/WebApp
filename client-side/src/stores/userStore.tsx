import { configureStore, createStore } from '@reduxjs/toolkit'
import tokenReducer from './tokenReducer'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';

const persistConfig = {
    key: 'root', // The key for the storage
    storage,     // The storage engine (local storage)
  };

const persistedReducer = persistReducer(persistConfig, tokenReducer);

const store = configureStore({
    reducer: {
        tokens: persistedReducer
    }
})

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// export const useAppDispatch: () => AppDispatch = useDispatch;
// export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;