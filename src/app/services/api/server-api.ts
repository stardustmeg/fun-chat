/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
// import type { ResponseMessage } from '../../types/types.ts';

import type { ReduxStore } from '../../lib/store/types.ts';
import type { Action, State } from '../../store/reducer.ts';

/* eslint-disable @typescript-eslint/no-explicit-any */
import { RESPONSE_TYPE } from '../../constants/constants.ts';
import getStore from '../../lib/store/store.ts';
import {
  addAuthenticatedUser,
  addMessageToCurrentDialogueHistory,
  addUnauthorizedUser,
  clearAllUsers,
  getAuthenticatedUsers,
  getUnauthorizedUsers,
  removeAuthenticatedUser,
  removeUnauthorizedUser,
  setCurrentDialogueHistory,
  updateAllUsers,
} from '../../store/actions.ts';

export default function updateUsersList(currentResponseData: any): void {
  const store = getStore();
  switch (currentResponseData.type) {
    case RESPONSE_TYPE.ACTIVE_USERS:
      store.dispatch(getAuthenticatedUsers(currentResponseData.payload.users));
      store.dispatch(clearAllUsers([]));
      store.dispatch(updateAllUsers(currentResponseData.payload.users));
      break;
    case RESPONSE_TYPE.USER_EXTERNAL_LOGIN:
      updateUserOnExternalLogin(store, currentResponseData);
      break;
    case RESPONSE_TYPE.USER_EXTERNAL_LOGOUT:
      updateUserOnExternalLogout(store, currentResponseData);
      break;
    case RESPONSE_TYPE.INACTIVE_USERS:
      store.dispatch(getUnauthorizedUsers(currentResponseData.payload.users));
      store.dispatch(updateAllUsers(currentResponseData.payload.users));
      break;
    default:
      break;
  }
}

export function updateMessageHistory(currentResponseData: any): void {
  const store = getStore();
  switch (currentResponseData.type) {
    case RESPONSE_TYPE.FETCH_HISTORY:
      store.dispatch(setCurrentDialogueHistory(currentResponseData.payload.messages));
      break;
    case RESPONSE_TYPE.MESSAGE_SEND:
      store.dispatch(addMessageToCurrentDialogueHistory(currentResponseData.payload.message));
      break;
    default:
      break;
  }
}

function updateUserOnExternalLogin(store: ReduxStore<State, Action>, currentResponseData: any): void {
  store.dispatch(addAuthenticatedUser(currentResponseData.payload.user));
  store.dispatch(removeUnauthorizedUser(currentResponseData.payload.user));
}

function updateUserOnExternalLogout(store: ReduxStore<State, Action>, currentResponseData: any): void {
  store.dispatch(addUnauthorizedUser(currentResponseData.payload.user));
  store.dispatch(removeAuthenticatedUser(currentResponseData.payload.user));
}
