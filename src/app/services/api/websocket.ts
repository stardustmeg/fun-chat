/* eslint-disable import/no-cycle */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import type { RequestTypeType } from '../../constants/constants.ts';
import type { PayloadType, RequestChat } from '../../types/types.ts';

import { EVENT_NAME, RETRY_INTERVAL } from '../../constants/constants.ts';
import getStore from '../../lib/store/store.ts';
import { setSocketState } from '../../store/actions.ts';
import { loginCurrentUser } from './client-api.ts'; // TBD Check dependency cycle

const wsURL = 'ws://127.0.0.1:4000';
let webSocket = new WebSocket(wsURL); // TBD Remove code duplication for websocket listeners

webSocket.addEventListener(EVENT_NAME.OPEN, () => {
  const store = getStore();
  store.dispatch(setSocketState(true));
  loginCurrentUser();
  console.log('Connected to server');
});

let responseHandler: ((response: any) => void) | null = null;
export function setResponseHandler(callback: (response: RequestChat) => void): void {
  responseHandler = callback;
}

export const sendMessage =
  (request: RequestTypeType) =>
  (payload: PayloadType, id: null | string = null): void => {
    const store = getStore();
    const { socketIsOpen } = store.getState();

    if (socketIsOpen) {
      const requestMessage = {
        id,
        payload,
        type: request,
      };
      const message = JSON.stringify(requestMessage);
      webSocket.send(message);
    } else {
      console.log('Socket is not open');
    }
  };

webSocket.addEventListener(EVENT_NAME.MESSAGE, (event) => {
  if (responseHandler && webSocket.readyState === WebSocket.OPEN) {
    responseHandler(JSON.parse(event.data));
  }
});

webSocket.addEventListener(EVENT_NAME.CLOSE, () => {
  const store = getStore();
  store.dispatch(setSocketState(false));
});

webSocket.addEventListener(EVENT_NAME.ERROR, (event) => {
  console.log(event);
});

const openSocket = (): void => {
  const store = getStore();
  if (!store.getState().socketIsOpen) {
    webSocket = new WebSocket(wsURL);
    webSocket.addEventListener(EVENT_NAME.OPEN, () => {
      store.dispatch(setSocketState(true));
      console.log('Connected to server');
    });

    webSocket.addEventListener(EVENT_NAME.MESSAGE, (event) => {
      if (responseHandler && webSocket.readyState === WebSocket.OPEN) {
        responseHandler(JSON.parse(event.data));
      }
    });

    webSocket.addEventListener(EVENT_NAME.ERROR, (event) => {
      console.log(event);
    });

    webSocket.addEventListener(EVENT_NAME.CLOSE, () => {
      const store = getStore();
      store.dispatch(setSocketState(false));
    });
  }
};

export function retryOpenSocket(): void {
  const retrySocket = (): void => {
    setTimeout(() => {
      openSocket();
    }, RETRY_INTERVAL);
  };
  retrySocket();
}
