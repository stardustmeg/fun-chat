import type { ReduxStore } from '../lib/store/types';
import type { Router } from '../router/router';
import type { Action, State } from '../store/reducer';

import { APP_ROUTE } from '../constants/app-routes.ts';
import { REQUEST_TYPE } from '../constants/constants.ts';
import getStore from '../lib/store/store.ts';
import { sendClientRequest } from '../services/api/client-api.ts';
import setStateToInitialState from '../store/helper.ts';

export default function handleRouterTransfer(
  element: HTMLAnchorElement | HTMLButtonElement,
  router: Router,
  route: string,
): void {
  const currentElement = element;
  currentElement.onclick = (event): void => {
    event.preventDefault();
    router.navigateTo(route);
  };
}

export function logOutHandler(store: ReduxStore<State, Action>, router: Router): void {
  const { currentUser } = store.getState();
  if (currentUser?.login && currentUser?.password) {
    sendClientRequest({ user: { login: currentUser.login, password: currentUser.password } }, REQUEST_TYPE.USER_LOGOUT);
  }
  sessionStorage.clear();
  setStateToInitialState(store);
  router.navigateTo(APP_ROUTE.Authorization);
}

export function handleTransferToPreviousRoute(element: HTMLAnchorElement | HTMLButtonElement): void {
  const currentElement = element;
  currentElement.onclick = (event): void => {
    event.preventDefault();
    window.history.back();
  };
}

export function handleMessageEvent(): void {
  const store = getStore();
  const { currentDialogueHistory, currentUser } = store.getState();
  currentDialogueHistory.forEach((message) => {
    if (message.to === currentUser?.login && message.status.isReaded === false) {
      sendClientRequest({ message: { id: message.id } }, REQUEST_TYPE.MESSAGE_READ, currentUser.login);
    }
  });
}
