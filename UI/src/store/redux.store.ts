import { configureStore } from '@reduxjs/toolkit'
import userReducer from '../slices/user.slice'
import { useDispatch, useSelector } from 'react-redux'
import storageSession from 'redux-persist/lib/storage/session';
import { 
  persistReducer, 
  persistStore,
 } from 'redux-persist';

import { combineReducers } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';



export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()

const rootPersistConfig = {
  key: 'root',
  storage,
}

const persistConfig = {
  key: 'root',
  storage: storageSession,
}

const rootReducer = combineReducers({ 
  user: persistReducer(persistConfig, userReducer),
})

const persistedReducer = persistReducer(rootPersistConfig, rootReducer)


 export const store = configureStore({
  reducer: persistedReducer,
  devTools: false,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck : {
      ignoreActions : true,
    }
  }),
})


export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

export const persister = persistStore(store)