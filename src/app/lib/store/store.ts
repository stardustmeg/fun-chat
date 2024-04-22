/* eslint-disable @typescript-eslint/consistent-type-assertions */
import type { Action, State } from '../../store/reducer.ts';
import type { Reducer, ReduxStore } from './types';

import { EVENT_NAME, initialState } from '../../constants/constants.ts';
import { STORAGE_KEY, saveCurrentStateToSessionStorage } from '../../services/session-storage/session-storage.ts';
import { rootReducer } from '../../store/reducer.ts';
import { isValidState } from '../../types/types.ts';

class Store<S, A> implements ReduxStore<S, A> {
  private listeners: VoidFunction[] = [];

  private rootReducer: Reducer<S, A>;

  private state: S;

  constructor(initialData: S, rootReducer: Reducer<S, A>) {
    const storedData: null | string = sessionStorage.getItem(STORAGE_KEY);

    let stateToSet: S;

    if (storedData) {
      const isValid = isValidState(storedData);
      if (isValid) {
        stateToSet = structuredClone(JSON.parse(storedData) as S);
      } else {
        stateToSet = initialData;
      }
    } else {
      stateToSet = initialData;
    }

    this.state = structuredClone(stateToSet);
    this.rootReducer = rootReducer;

    window.addEventListener(EVENT_NAME.BEFOREUNLOAD, () => saveCurrentStateToSessionStorage(this.state));
  }

  public dispatch(action: A): A {
    this.state = this.rootReducer(this.state, action);
    this.listeners.forEach((listener) => {
      listener();
    });
    return action;
  }

  public getState(): S {
    return structuredClone(this.state);
  }

  public subscribe(listener: VoidFunction): VoidFunction {
    this.listeners.push(listener);

    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }
}

const createStore = <S, A>(reducer: Reducer<S, A>, initialState: S): Store<S, A> =>
  new Store<S, A>(initialState, reducer);

const store = createStore<State, Action>(rootReducer, initialState);

export default function getStore(): Store<State, Action> {
  return store;
}
