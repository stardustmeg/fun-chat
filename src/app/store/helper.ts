import type { ReduxStore } from '../lib/store/types';
import type { Action, State } from './reducer';

import {
  clearAllUsers,
  setAuthenticatedUsers,
  setCurrentDialogueHistory,
  setCurrentUser,
  setCurrentUserDialogue,
  setMessagesHistory,
  setUnauthorizedUsers,
} from './actions.ts';

export default function setStateToInitialState(store: ReduxStore<State, Action>): void {
  store.dispatch(setCurrentUser(null));
  store.dispatch(setCurrentDialogueHistory([]));
  store.dispatch(setCurrentUserDialogue(null));
  store.dispatch(clearAllUsers([]));
  store.dispatch(setMessagesHistory([]));
  store.dispatch(setAuthenticatedUsers([]));
  store.dispatch(setUnauthorizedUsers([]));
}

export function keepCurrentUserInInitialState(store: ReduxStore<State, Action>): void {
  store.dispatch(setCurrentDialogueHistory([]));
  store.dispatch(setCurrentUserDialogue(null));
  store.dispatch(clearAllUsers([]));
  store.dispatch(setMessagesHistory([]));
  store.dispatch(setAuthenticatedUsers([]));
  store.dispatch(setUnauthorizedUsers([]));
}
