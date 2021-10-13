/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-underscore-dangle */
import { useMemo } from 'react';
import { createStore, Store } from 'redux';
import { composeWithDevTools } from 'remote-redux-devtools';

import reducer from './reducer';

import { RootActions } from './types';

export interface State extends ReturnType<typeof reducer> {}

let store: Store<State, RootActions> | undefined;

const composeEnhancers = composeWithDevTools({
  name: 'notes-app',
  hostname: 'localhost',
  port: 5000,
});

function initStore(preloadedState: State) {
  return createStore(reducer, preloadedState, composeEnhancers());
}

const initializeStore = (preloadedState: State) => {
  let _store = store ?? initStore(preloadedState);

  // After navigating to a page with an initial Redux state, merge that state
  // with the current state in the store, and create a new store
  if (preloadedState && store) {
    _store = initStore({
      ...store.getState(),
      ...preloadedState,
    });
    // Reset the current store
    store = undefined;
  }

  // For SSG and SSR always create a new store
  if (typeof window === 'undefined') return _store;
  // Create the store once in the client
  if (!store) store = _store;

  return _store;
};

export default function useStore(preloadedState: State) {
  const _store = useMemo(() => initializeStore(preloadedState), [preloadedState]);
  return _store;
}
