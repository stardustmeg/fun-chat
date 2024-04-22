import type { User } from '../../../types/types.ts';

import { EMPTY_ARRAY, START_CONVERSATION, TAG_NAME } from '../../../constants/constants.ts';
import observeStore, { selectActiveAndInactiveUsers, selectDialogueHistory } from '../../../lib/store/observer.ts';
import getStore from '../../../lib/store/store.ts';
import customCreateElement from '../../../utils/base-element.ts';
import clearOutElement, { getRandomIndex } from '../../../utils/utils.ts';
import createInputArea from '../../send-message-form/send-message-form.ts';
import createMessages from './message/message.ts';
import styles from './message-history.module.scss';

const messageHistoryWrapper = customCreateElement(TAG_NAME.DIV, [styles.messageHistoryWrapper]);
let userMessage = '';
const messagesHistoryMessage = customCreateElement(TAG_NAME.DIV, [styles.messagesHistoryMessage], {}, userMessage);
const userNameWrapper = customCreateElement(TAG_NAME.DIV, [styles.userNameWrapper]);
const messagesHistory = customCreateElement(TAG_NAME.DIV, [styles.messagesHistory]);

export default function createMessageHistoryArea(user: User): HTMLDivElement {
  clearOutElement(userNameWrapper, messageHistoryWrapper, messagesHistory);

  if (!user.login) {
    return userNameWrapper;
  }
  const userName = customCreateElement(TAG_NAME.DIV, [styles.userName], {}, user.login);
  const statusIndicator = customCreateElement(TAG_NAME.DIV, [styles.statusIndicator]);

  if (user.isLogined) {
    statusIndicator.classList.add(styles.online);
  } else {
    statusIndicator.classList.add(styles.offline);
  }

  const inputArea = createInputArea();
  userNameWrapper.append(userName, statusIndicator);
  messagesHistory.append(messagesHistoryMessage);
  messageHistoryWrapper.append(userNameWrapper, messagesHistory, inputArea);
  return messageHistoryWrapper;
}

const store = getStore();

subscribeToDialogueHistory();
subscribeToActiveUsers();

// const unsubscribeDialogueHistory = subscribeToDialogueHistory();  // TBD To check if I need to unsubscribe
// const unsubscribeActiveUsers = subscribeToActiveUsers();

function subscribeToDialogueHistory(): () => void {
  return observeStore(store, selectDialogueHistory, () => {
    checkMessageHistory();
    messagesHistoryMessage.textContent = userMessage;
  });
}

subscribeToUsersChange();

function subscribeToUsersChange(): () => void {
  return observeStore(store, selectActiveAndInactiveUsers, updateUserName);
}

function updateUserName(): void {
  const { currentAuthenticatedUsers, currentUnauthorizedUsers, currentUserDialogue } = store.getState();
  if (!currentUserDialogue || !currentUserDialogue.login) {
    return;
  }
  const isUserAuthenticated = currentAuthenticatedUsers.find((user) => user.login === currentUserDialogue.login);
  const isUserUnauthorized = currentUnauthorizedUsers.find((user) => user.login === currentUserDialogue.login);

  if (isUserAuthenticated || isUserUnauthorized) {
    clearOutElement(userNameWrapper);
    const userName = customCreateElement(TAG_NAME.DIV, [styles.userName], {}, currentUserDialogue.login);
    const statusIndicator = customCreateElement(TAG_NAME.DIV, [styles.statusIndicator]);

    if (currentUserDialogue?.isLogined) {
      statusIndicator.classList.add(styles.online);
    } else {
      statusIndicator.classList.add(styles.offline);
    }
    userNameWrapper.append(userName, statusIndicator);
  }
}

function subscribeToActiveUsers(): () => void {
  return observeStore(store, selectActiveAndInactiveUsers, () => {
    const { currentUserDialogue } = store.getState();
    const { activeUsers } = selectActiveAndInactiveUsers(store.getState());

    const isActiveUser = activeUsers.some((user) => user.login === currentUserDialogue?.login);

    if (isActiveUser) {
      checkMessageHistory();
      messagesHistoryMessage.textContent = userMessage;
    }
  });
}

function checkMessageHistory(): void {
  // TBD Check double calls
  const { currentDialogueHistory } = store.getState();
  if (currentDialogueHistory?.length !== EMPTY_ARRAY) {
    messagesHistoryMessage.remove();
    clearOutElement(messagesHistory);
    const currentDialogueView = createMessages(currentDialogueHistory);
    messagesHistory.append(currentDialogueView);
  } else {
    userMessage = START_CONVERSATION[getRandomIndex(START_CONVERSATION)];
  }
}
