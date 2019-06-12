import React from "react";
import { createStore, applyMiddleware, compose } from 'redux'
import rootReducer from './reducers'
import {loadState, saveState} from './localStorage'
import { persistStore, persistReducer } from 'redux-persist';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import storage from 'redux-persist/lib/storage';

const composeEnhancers =
  typeof window === 'object' &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?   
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
    }) : compose;

const enhancer = composeEnhancers(
  applyMiddleware(),
  // other store enhancers if any
);

const persistConfig = {
    key: 'root',
    storage: storage,
    blacklist: ['setWeb3', 'setActiveAccount', 'showLeftMenu'],
    stateReconciler: autoMergeLevel2
};

const pReducer = persistReducer(persistConfig, rootReducer);

const storeExport = createStore(
    pReducer, enhancer
);

export const store = storeExport;
export const persistor = persistStore(storeExport);