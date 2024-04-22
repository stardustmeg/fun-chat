import type { Message, User, UserPayload } from '../../types/types.ts';

import {
  DEFAULT_NUMBER_VALUE,
  EMPTY_ARRAY,
  EMPTY_STRING,
  EVENT_NAME,
  INPUT_TEXT_CONTENT,
  PAGE_DESCRIPTION,
  REQUEST_TYPE,
  TAG_NAME,
} from '../../constants/constants.ts';
import observeStore, {
  selectActiveAndInactiveUsers,
  selectDialogueHistory,
  selectMessagesHistory,
} from '../../lib/store/observer.ts';
import getStore from '../../lib/store/store.ts';
import { sendClientRequest } from '../../services/api/client-api.ts';
import { setCurrentUserDialogue } from '../../store/actions.ts';
import customCreateElement from '../../utils/base-element.ts';
import clearOutElement from '../../utils/utils.ts';
import createMessageHistoryArea from './message-history/message-history.ts';
import styles from './user-list.module.scss';

const userListWrapper = customCreateElement(TAG_NAME.DIV, [styles.userListWrapper]);
const messagesWrapper = customCreateElement(TAG_NAME.DIV, [styles.messagesWrapper]);
const dialogueAreaWrapper = customCreateElement(TAG_NAME.DIV, [styles.dialogueAreaWrapper]);
const listWrapper = customCreateElement(TAG_NAME.DIV, [styles.listWrapper]);

export function createDialogueArea(): HTMLDivElement {
  clearOutElement(messagesWrapper);
  const store = getStore();
  let userList = createUserList();

  const updateDialogueArea = (): void => {
    clearOutElement(listWrapper);
    userList = createUserList();
  };

  observeStore(store, selectActiveAndInactiveUsers, updateDialogueArea);
  observeStore(store, selectMessagesHistory, updateDialogueArea);
  subscribeToDialogueHistory();

  const userMessage = customCreateElement(TAG_NAME.P, [styles.userMessage], {}, PAGE_DESCRIPTION.CHOOSE_USER_INFO);
  messagesWrapper.append(userMessage);

  dialogueAreaWrapper.append(userList, messagesWrapper);

  return dialogueAreaWrapper;
}
const store = getStore();

function subscribeToDialogueHistory(): () => void {
  return observeStore(store, selectDialogueHistory, () => {
    const store = getStore();
    const { currentDialogueHistory, currentUserDialogue } = store.getState();
    if (currentDialogueHistory.length === DEFAULT_NUMBER_VALUE && currentUserDialogue) {
      clearOutElement(messagesWrapper);
      const messageHistory = createMessageHistoryArea(currentUserDialogue);
      messagesWrapper.append(messageHistory);
    }
  });
}

export function createUserList(searchQuery?: string): HTMLDivElement {
  clearOutElement(listWrapper);

  const store = getStore();
  const { currentAuthenticatedUsers, currentUnauthorizedUsers, currentUser } = store.getState();
  const allUsers = [...currentAuthenticatedUsers, ...currentUnauthorizedUsers];

  if (!currentUser) {
    return userListWrapper;
  }

  let filteredUsers = allUsers.filter((user) => user.login !== currentUser?.login);

  if (searchQuery) {
    filteredUsers = filteredUsers.filter((user) => user?.login?.toLowerCase()?.includes(searchQuery.toLowerCase()));
  }

  const searchField = createSearchField(filteredUsers);

  listWrapper.append(searchField, userListWrapper);

  createUserItems(filteredUsers, userListWrapper);

  return listWrapper;
}

function createUserElement(user: User, messagesIndicator: HTMLElement | null): HTMLElement {
  const userElement = customCreateElement(TAG_NAME.LI, [styles.user]);
  let userLogin = '';
  if (user.login) {
    userLogin = user.login;
  }
  const loginText = customCreateElement(TAG_NAME.SPAN, [styles.login], {}, userLogin);
  const statusIndicator = customCreateElement(TAG_NAME.DIV, [styles.statusIndicator]);

  statusIndicator.classList.add(user.isLogined ? styles.online : styles.offline);

  userElement.addEventListener(EVENT_NAME.CLICK, () => {
    handleUserClick(user);
  });

  if (messagesIndicator) {
    userElement.append(messagesIndicator);
  }

  userElement.append(loginText, statusIndicator);

  return userElement;
}

function createMessagesIndicator(notReadMessages: Message[]): HTMLElement | null {
  const { length } = notReadMessages;
  if (length > EMPTY_ARRAY) {
    return customCreateElement(TAG_NAME.DIV, [styles.messagesIndicator], {}, length.toString());
  }
  return null;
}

function filterNotReadMessages(messages: Message[], currentUserLogin: string | undefined): Message[] {
  return messages.filter((message) => message.to === currentUserLogin && !message.status.isReaded);
}

function createUserItems(list: User[], parent: HTMLDivElement): void {
  const store = getStore();
  clearOutElement(parent);
  const { currentUser, messagesHistory } = store.getState();
  list.forEach((user) => {
    if (!user.login) {
      return;
    }

    const userMessagesInHistory = messagesHistory.find((message) => message.user === user.login);

    if (
      currentUser &&
      currentUser.login &&
      userMessagesInHistory &&
      userMessagesInHistory.history.length > EMPTY_ARRAY
    ) {
      const currentUserLogin = currentUser?.login;
      const notReadMessages = filterNotReadMessages(userMessagesInHistory.history, currentUserLogin);
      const messagesIndicator = createMessagesIndicator(notReadMessages);
      const userElement = createUserElement(user, messagesIndicator);
      parent.append(userElement);
    } else {
      const userElement = createUserElement(user, null);
      parent.append(userElement);
    }
  });
}

export function handleUserClick(user: User): void {
  if (!user.login) {
    return;
  }

  setCurrentUserAndFetchHistory(user);
  redrawMessageHistory(user, messagesWrapper);
}

function setCurrentUserAndFetchHistory(user: User): void {
  const store = getStore();
  store.dispatch(setCurrentUserDialogue(user));

  sendClientRequestForHistory(user);
}

function sendClientRequestForHistory(user: User): void {
  if (!user.login) {
    return;
  }
  const currentPayload: UserPayload = {
    user: {
      login: user.login,
    },
  };

  sendClientRequest(currentPayload, REQUEST_TYPE.FETCH_HISTORY, user.login);
}

function redrawMessageHistory(user: User, messagesWrapper: HTMLDivElement): void {
  clearOutElement(messagesWrapper);
  const messageHistory = createMessageHistoryArea(user);
  messagesWrapper.append(messageHistory);
}

let searchQuery = EMPTY_STRING;

function createSearchField(users: User[]): HTMLInputElement {
  const searchFieldAttributes = {
    placeholder: INPUT_TEXT_CONTENT.SEARCH_INPUT,
    type: 'search',
    value: searchQuery,
  };
  const searchField = customCreateElement(TAG_NAME.INPUT, [styles.searchField], searchFieldAttributes);

  searchField.addEventListener(EVENT_NAME.INPUT, (event) => {
    if (event.target instanceof HTMLInputElement) {
      searchQuery = event.target.value.trim();
      clearOutElement(userListWrapper);
      const filteredUsers = filterUsers(users, searchQuery);
      createUserItems(filteredUsers, userListWrapper);
    }
  });

  return searchField;
}

function filterUsers(users: User[], query: string): User[] {
  return users.filter((user) => user?.login?.toLowerCase()?.includes(query.toLowerCase()));
}
