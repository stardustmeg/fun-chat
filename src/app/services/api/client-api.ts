/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable import/no-cycle */
import type { RequestTypeType } from '../../constants/constants.ts';
import type { PayloadType, RequestChat } from '../../types/types.ts';

import { authFormResponseHandler, getAllUsersHistory } from '../../components/form/form.ts';
import { ERROR_MESSAGE, PAYLOAD_FIELD, REQUEST_TYPE, RESPONSE_TYPE } from '../../constants/constants.ts';
import getStore from '../../lib/store/store.ts';
import { updateStoreMessagesHistory } from '../../store/actions.ts';
import updateUsersList, { updateMessageHistory } from './server-api.ts';
import { sendMessage, setResponseHandler } from './websocket.ts';

const sendMessageUserLogin = sendMessage(REQUEST_TYPE.USER_LOGIN);
const sendMessageUserLogout = sendMessage(REQUEST_TYPE.USER_LOGOUT);
const sendMessageFetchHistory = sendMessage(REQUEST_TYPE.FETCH_HISTORY);
const sendMessageActiveUsers = sendMessage(REQUEST_TYPE.ACTIVE_USERS);
const sendMessageInactiveUsers = sendMessage(REQUEST_TYPE.INACTIVE_USERS);

const fetchOnlineUsers = (): void => {
  sendMessageActiveUsers(null);
  sendMessageInactiveUsers(null);
};

const sendMessageSendMessage = sendMessage(REQUEST_TYPE.MESSAGE_SEND);
const sendMessageDeleteMessage = sendMessage(REQUEST_TYPE.MESSAGE_DELETE);
const sendMessageEditMessage = sendMessage(REQUEST_TYPE.MESSAGE_EDIT);
const sendMessageReadMessage = sendMessage(REQUEST_TYPE.MESSAGE_READ);

/**
 * @throws {Invalid User Payload}
 */
function userHandler(
  payload: PayloadType,
  nextHandler: (payload: PayloadType, id: null | string) => void,
  type?: RequestTypeType,
  id: null | string = null,
): void {
  switch (true) {
    case !!(payload && PAYLOAD_FIELD.USER in payload && payload.user.login && payload.user.password):
      switch (type) {
        case REQUEST_TYPE.USER_LOGIN:
          sendMessageUserLogin(payload, id);
          break;
        case REQUEST_TYPE.USER_LOGOUT:
          sendMessageUserLogout(payload, id);
          break;
        default:
          break;
      }
      break;
    case !!(payload && PAYLOAD_FIELD.USER in payload && payload.user.login):
      sendMessageFetchHistory(payload, id);
      break;
    case payload === null:
      fetchOnlineUsers();
      break;
    case nextHandler !== undefined:
      nextHandler(payload, id);
      break;
    default:
      throw new Error(ERROR_MESSAGE.INVALID_USER_REQUEST);
  }
}

/**
 * @throws {Invalid Message Payload}
 */
function messageHandler(
  payload: PayloadType,
  nextHandler: (payload: PayloadType) => void,
  type?: RequestTypeType,
  id: null | string = null,
): void {
  switch (true) {
    case !!(payload && PAYLOAD_FIELD.MESSAGE in payload && payload.message.text && payload.message.to):
      sendMessageSendMessage(payload, id);
      break;
    case !!(payload && PAYLOAD_FIELD.MESSAGE in payload && payload.message.text && payload.message.id):
      sendMessageEditMessage(payload, id);
      break;
    case !!(payload && PAYLOAD_FIELD.MESSAGE in payload && payload.message.id && type === REQUEST_TYPE.MESSAGE_READ):
      sendMessageReadMessage(payload, id);
      break;
    case !!(payload && PAYLOAD_FIELD.MESSAGE in payload && payload.message.id && type === REQUEST_TYPE.MESSAGE_DELETE):
      sendMessageDeleteMessage(payload, id);
      break;
    case nextHandler !== undefined:
      nextHandler(payload);
      break;
    default:
      throw new Error(ERROR_MESSAGE.INVALID_MESSAGE_REQUEST);
  }
}

function createChain() {
  return function handleRequest(payload: PayloadType, type?: RequestTypeType, id: null | string = null): void {
    userHandler(
      payload,
      (payload: PayloadType, id: null | string) => messageHandler(payload, () => {}, type, id),
      type,
      id,
    );
  };
}

export const sendClientRequest = (payload: PayloadType, type?: RequestTypeType, id: null | string = null): void => {
  const chain = createChain();
  chain(payload, type, id);
};

function incomingMessageHandler(response: RequestChat): void {
  // TBD Check types
  switch (response.type) {
    case RESPONSE_TYPE.USER_LOGIN:
    case RESPONSE_TYPE.ERROR: {
      authFormResponseHandler(response);
      break;
    }

    case RESPONSE_TYPE.USER_LOGOUT:
    case RESPONSE_TYPE.MESSAGE_DELETE:
    case RESPONSE_TYPE.MESSAGE_EDIT:
    case RESPONSE_TYPE.MESSAGE_READ: {
      break;
    }
    case RESPONSE_TYPE.MESSAGE_SEND:
    case RESPONSE_TYPE.MESSAGE_DELIVERED:
    case RESPONSE_TYPE.FETCH_HISTORY: {
      console.log(response);
      updateMessageHistory(response);
      setUserHistory(response);
      break;
    }

    case RESPONSE_TYPE.ACTIVE_USERS:
    case RESPONSE_TYPE.INACTIVE_USERS: {
      updateUsersList(response);
      getAllUsersHistory(response);
      break;
    }
    case RESPONSE_TYPE.USER_EXTERNAL_LOGIN:
    case RESPONSE_TYPE.USER_EXTERNAL_LOGOUT: {
      updateUsersList(response);
      break;
    }

    default: {
      console.log('Unknown server response', response);
      break;
    }
  }
}

setResponseHandler(incomingMessageHandler);

export function loginCurrentUser(): void {
  const store = getStore();
  const { currentUser } = store.getState();

  if (currentUser?.login && currentUser?.password) {
    const currentPayload = {
      user: {
        login: currentUser.login,
        password: currentUser.password,
      },
    };
    const currentId = crypto.randomUUID();
    sendClientRequest(currentPayload, REQUEST_TYPE.USER_LOGIN, currentId);
    sendClientRequest(null);
  }
}

function setUserHistory(response: RequestChat): void {
  const store = getStore();

  const user = response.id;
  const history = response.payload.messages;

  if (history && history.length !== 0 && user) {
    const currentHistory = {
      history,
      user,
    };
    store.dispatch(updateStoreMessagesHistory(currentHistory));
  }
}

export default sendClientRequest;
