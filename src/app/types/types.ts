import type { ResponseTypeType } from '../constants/constants';

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

interface Status {
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
