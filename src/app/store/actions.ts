import type { Message, MessagesHistory, User } from '../types/types.ts';

const ACTION = {
  ADD_AUTHENTICATED_USER: 'addAuthenticatedUser',
  ADD_MESSAGE_TO_CURRENT_DIALOGUE_HISTORY: 'addMessageToCurrentDialogueHistory',
  ADD_UNAUTHORIZED_USER: 'addUnauthorizedUser',
  CLEAR_ALL_USERS: 'clearAllUsers',
  DELETE_MESSAGE_FROM_CURRENT_DIALOGUE_HISTORY: 'deleteMessageFromCurrentDialogueHistory',
  EDIT_MESSAGE_IN_CURRENT_DIALOGUE_HISTORY: 'editMessageInCurrentDialogueHistory',
  GET_AUTHENTICATED_USERS: 'getAuthenticatedUsers',
  GET_UNAUTHORIZED_USERS: 'getUnauthorizedUsers',
  REMOVE_AUTHENTICATED_USER: 'removeAuthenticatedUser',
  REMOVE_UNAUTHORIZED_USER: 'removeUnauthorizedUser',
  SET_AUTHENTICATED_USERS: 'setAuthenticatedUsers',
  SET_CURRENT_DIALOGUE_HISTORY: 'setCurrentDialogueHistory',
  SET_CURRENT_USER: 'setCurrentUser',
  SET_CURRENT_USER_DIALOGUE: 'setCurrentUserDialogue',
  SET_MESSAGES_HISTORY: 'setMessagesHistory',
  SET_SOCKET_STATE: 'setSocketState',
  SET_UNAUTHORIZED_USERS: 'setUnauthorizedUsers',
  UPDATE_ALL_USERS: 'updateAllUsers',
  UPDATE_STORE_MESSAGES_HISTORY: 'updateStoreMessagesHistory',
} as const;

type ActionType = (typeof ACTION)[keyof typeof ACTION];

interface ActionWithPayload<T, U extends ActionType> {
  payload: T;
  type: U;
}

export const setAuthenticatedUsers = (
  value: User[],
): ActionWithPayload<User[], typeof ACTION.SET_AUTHENTICATED_USERS> => ({
  payload: value,
  type: ACTION.SET_AUTHENTICATED_USERS,
});

export const setUnauthorizedUsers = (
  value: User[],
): ActionWithPayload<User[], typeof ACTION.SET_UNAUTHORIZED_USERS> => ({
  payload: value,
  type: ACTION.SET_UNAUTHORIZED_USERS,
});

export const getAuthenticatedUsers = (
  value: User[],
): ActionWithPayload<User[], typeof ACTION.GET_AUTHENTICATED_USERS> => ({
  payload: value,
  type: ACTION.GET_AUTHENTICATED_USERS,
});

export const getUnauthorizedUsers = (
  value: User[],
): ActionWithPayload<User[], typeof ACTION.GET_UNAUTHORIZED_USERS> => ({
  payload: value,
  type: ACTION.GET_UNAUTHORIZED_USERS,
});

export const setCurrentUser = (value: User | null): ActionWithPayload<User | null, typeof ACTION.SET_CURRENT_USER> => ({
  payload: value,
  type: ACTION.SET_CURRENT_USER,
});

export const setSocketState = (value: boolean): ActionWithPayload<boolean, typeof ACTION.SET_SOCKET_STATE> => ({
  payload: value,
  type: ACTION.SET_SOCKET_STATE,
});

export const addUnauthorizedUser = (value: User): ActionWithPayload<User, typeof ACTION.ADD_UNAUTHORIZED_USER> => ({
  payload: value,
  type: ACTION.ADD_UNAUTHORIZED_USER,
});

export const addAuthenticatedUser = (value: User): ActionWithPayload<User, typeof ACTION.ADD_AUTHENTICATED_USER> => ({
  payload: value,
  type: ACTION.ADD_AUTHENTICATED_USER,
});

export const removeUnauthorizedUser = (
  value: User,
): ActionWithPayload<User, typeof ACTION.REMOVE_UNAUTHORIZED_USER> => ({
  payload: value,
  type: ACTION.REMOVE_UNAUTHORIZED_USER,
});

export const removeAuthenticatedUser = (
  value: User,
): ActionWithPayload<User, typeof ACTION.REMOVE_AUTHENTICATED_USER> => ({
  payload: value,
  type: ACTION.REMOVE_AUTHENTICATED_USER,
});

export const setCurrentUserDialogue = (
  value: User | null,
): ActionWithPayload<User | null, typeof ACTION.SET_CURRENT_USER_DIALOGUE> => ({
  payload: value,
  type: ACTION.SET_CURRENT_USER_DIALOGUE,
});

export const setCurrentDialogueHistory = (
  value: Message[],
): ActionWithPayload<Message[], typeof ACTION.SET_CURRENT_DIALOGUE_HISTORY> => ({
  payload: value,
  type: ACTION.SET_CURRENT_DIALOGUE_HISTORY,
});

export const addMessageToCurrentDialogueHistory = (
  value: Message,
): ActionWithPayload<Message, typeof ACTION.ADD_MESSAGE_TO_CURRENT_DIALOGUE_HISTORY> => ({
  payload: value,
  type: ACTION.ADD_MESSAGE_TO_CURRENT_DIALOGUE_HISTORY,
});

export const deleteMessageFromCurrentDialogueHistory = (
  value: string,
): ActionWithPayload<string, typeof ACTION.DELETE_MESSAGE_FROM_CURRENT_DIALOGUE_HISTORY> => ({
  payload: value,
  type: ACTION.DELETE_MESSAGE_FROM_CURRENT_DIALOGUE_HISTORY,
});

export const editMessageInCurrentDialogueHistory = (
  value: Message,
): ActionWithPayload<Message, typeof ACTION.EDIT_MESSAGE_IN_CURRENT_DIALOGUE_HISTORY> => ({
  payload: value,
  type: ACTION.EDIT_MESSAGE_IN_CURRENT_DIALOGUE_HISTORY,
});

export const updateStoreMessagesHistory = (
  value: MessagesHistory,
): ActionWithPayload<MessagesHistory, typeof ACTION.UPDATE_STORE_MESSAGES_HISTORY> => ({
  payload: value,
  type: ACTION.UPDATE_STORE_MESSAGES_HISTORY,
});

export const updateAllUsers = (value: User): ActionWithPayload<User, typeof ACTION.UPDATE_ALL_USERS> => ({
  payload: value,
  type: ACTION.UPDATE_ALL_USERS,
});

export const clearAllUsers = (value: []): ActionWithPayload<[], typeof ACTION.CLEAR_ALL_USERS> => ({
  payload: value,
  type: ACTION.CLEAR_ALL_USERS,
});

export const setMessagesHistory = (value: []): ActionWithPayload<[], typeof ACTION.SET_MESSAGES_HISTORY> => ({
  payload: value,
  type: ACTION.SET_MESSAGES_HISTORY,
});
