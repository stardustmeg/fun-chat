/* eslint-disable @typescript-eslint/consistent-type-assertions */
import type { ResponseTypeType } from '../constants/constants';
import type { State } from '../store/reducer';

export type EventListenerFunction = (event: Event) => void;

// User types
export interface User {
  isLogined?: boolean;
  login: null | string;
  password?: null | string;
}

export interface Message {
  datetime: number;
  from: string;
  id: string;
  status: Status;
  text: string;
  to: string;
}

export interface Status {
  isDelivered: boolean;
  isEdited: boolean;
  isReaded: boolean;
}

// User Request

export interface UserPayload {
  user: {
    isLogined?: boolean;
    login: string;
    password?: string;
  };
}

export interface MessagePayload {
  message: {
    id?: string;
    text?: string;
    to?: string;
  };
}

export type PayloadType = MessagePayload | UserPayload | null;

// Server types

export interface RequestChat {
  id: null | string;
  payload: ResponseMessagePayload;
  type: ResponseTypeType;
}

export interface ResponseMessagePayload {
  messages: Message[];
}

export interface MessagesHistory {
  history: Message[];
  user: string;
}

// Validation

export function isValidState(storedData: string): boolean {
  try {
    const parsedData: unknown = JSON.parse(storedData);

    if (isValidStateData(parsedData)) {
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
}

function isValidStateData(data: unknown): data is State {
  if (typeof data !== 'object' || data === null) {
    return false;
  }

  const state = data as State;

  return (
    Array.isArray(state.allUsers) &&
    Array.isArray(state.currentAuthenticatedUsers) &&
    Array.isArray(state.currentDialogueHistory) &&
    Array.isArray(state.currentUnauthorizedUsers) &&
    (state.currentUser === null || isValidUser(state.currentUser)) &&
    (state.currentUserDialogue === null || isValidUser(state.currentUserDialogue)) &&
    typeof state.socketIsOpen === 'boolean' &&
    Array.isArray(state.messagesHistory) &&
    state.messagesHistory.every((message) => isValidMessagesHistory(message))
  );
}

function isValidMessage(message: Message): boolean {
  return (
    typeof message.datetime === 'number' &&
    typeof message.from === 'string' &&
    typeof message.id === 'string' &&
    isValidStatus(message.status) &&
    typeof message.text === 'string' &&
    typeof message.to === 'string'
  );
}

function isValidStatus(status: Status): boolean {
  return (
    typeof status.isDelivered === 'boolean' &&
    typeof status.isEdited === 'boolean' &&
    typeof status.isReaded === 'boolean'
  );
}

function isValidUser(user: User): boolean {
  return (
    (user.isLogined === undefined || typeof user.isLogined === 'boolean') &&
    (user.login === null || typeof user.login === 'string') &&
    (user.password === undefined || user.password === null || typeof user.password === 'string')
  );
}

function isValidMessagesHistory(messagesHistory: MessagesHistory): boolean {
  return (
    Array.isArray(messagesHistory.history) &&
    messagesHistory.history.every(isValidMessage) &&
    typeof messagesHistory.user === 'string'
  );
}
