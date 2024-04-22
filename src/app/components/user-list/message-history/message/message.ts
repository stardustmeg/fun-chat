import type { Message, User } from '../../../../types/types.ts';

import { EVENT_NAME, FORMAT_OPTION, MESSAGE_STATUS, REQUEST_TYPE, TAG_NAME } from '../../../../constants/constants.ts';
import getStore from '../../../../lib/store/store.ts';
import { sendClientRequest } from '../../../../services/api/client-api.ts';
import {
  deleteMessageFromCurrentDialogueHistory,
  editMessageInCurrentDialogueHistory,
} from '../../../../store/actions.ts';
import customCreateElement from '../../../../utils/base-element.ts';
import formatTimestamp from '../../../../utils/time-converter.ts';
import { openDeleteModal, openEditModal } from '../../../modal/modal.ts';
import styles from './message.module.scss';

export default function createMessages(messages: Message[]): HTMLDivElement {
  const messagesWrapper = customCreateElement(TAG_NAME.DIV, [styles.messagesWrapper]);
  const { currentUserDialogue } = getStore().getState();

  messages.forEach((message) => {
    const messageElement = createMessageElement(message, currentUserDialogue);
    messagesWrapper.append(messageElement);
  });

  setTimeout(() => {
    messagesWrapper.scrollTop = messagesWrapper.scrollHeight;
  }, 0);

  return messagesWrapper;
}

function createMessageElement(message: Message, currentUserDialogue: User | null): HTMLDivElement {
  const senderName = createSenderNameElement(message, currentUserDialogue);

  const formattedDate = formatTimestamp(message.datetime, FORMAT_OPTION.DATE);
  const formattedTime = formatTimestamp(message.datetime, FORMAT_OPTION.TIME);

  const messageElement = customCreateElement(
    TAG_NAME.DIV,
    [styles.message, getMessageStyle(message, currentUserDialogue)],
    { title: formattedDate },
  );

  const deliveryStatus = createDeliveryStatusElement(message, currentUserDialogue);

  const messageText = customCreateElement(TAG_NAME.DIV, [styles.messageText], {}, message.text);
  const messageTime = customCreateElement(TAG_NAME.DIV, [styles.messageTime], {}, formattedTime);

  const messageDelete = createDeleteButton(message.id);

  const statusWrapper = customCreateElement(
    TAG_NAME.DIV,
    [styles.statusWrapper, getMessageStyle(message, currentUserDialogue)],
    {},
  );
  if (message.status.isEdited) {
    const editedStatus = createEditedIcon();
    statusWrapper.append(editedStatus);
  }
  statusWrapper.append(deliveryStatus, messageTime);

  const store = getStore();
  const { currentUser } = store.getState();

  if (currentUser && message.from === currentUser.login) {
    statusWrapper.append(messageDelete);
  } else if (message.from !== currentUserDialogue?.login || message.to !== currentUser?.login) {
    return messageElement;
  }

  messageElement.append(senderName, messageText, statusWrapper);

  messageElement.addEventListener(EVENT_NAME.CONTEXTMENU, (event) => {
    event?.preventDefault();
    if (message.from === currentUserDialogue?.login) {
      return;
    }
    openEditModal(message, editMessageHandler);
  });

  return messageElement;
}

function createDeleteButton(messageId: string): HTMLDivElement {
  const messageDelete = customCreateElement(TAG_NAME.DIV, [styles.messageDelete]);
  const deleteLogoAttributes = {
    alt: 'Delete message logo',
    height: '15',
    src: 'https://cdn-icons-png.flaticon.com/512/6536/6536169.png',
    width: '15',
  };
  const deleteLogo = customCreateElement(TAG_NAME.IMG, [styles.deleteLogo], deleteLogoAttributes);
  messageDelete.append(deleteLogo);

  messageDelete.addEventListener(EVENT_NAME.CLICK, (event) => {
    event?.preventDefault();
    openDeleteModal(messageId, deleteMessageHandler);
  });

  return messageDelete;
}

function createEditedIcon(): HTMLDivElement {
  const messageEdited = customCreateElement(TAG_NAME.DIV, [styles.editedStatus]);
  const editedLogoAttributes = {
    alt: 'Edited message logo',
    height: '15',
    src: 'https://cdn-icons-png.freepik.com/256/8256/8256321.png',
    width: '15',
  };
  const editedLogo = customCreateElement(TAG_NAME.IMG, [styles.editedLogo], editedLogoAttributes);
  messageEdited.append(editedLogo);

  return messageEdited;
}

function deleteMessageHandler(messageId: string): void {
  const store = getStore();
  const currentPayload = { message: { id: messageId } };
  sendClientRequest(currentPayload, REQUEST_TYPE.MESSAGE_DELETE, messageId);
  store.dispatch(deleteMessageFromCurrentDialogueHistory(currentPayload.message.id));
}

function getMessageStyle(message: Message, currentUserDialogue: User | null): string {
  return message.to === currentUserDialogue?.login ? styles.current : styles.partner;
}

function createDeliveryStatusElement(message: Message, currentUserDialogue: User | null): HTMLDivElement {
  if (message.to === currentUserDialogue?.login && message.status.isDelivered) {
    return customCreateElement(TAG_NAME.DIV, [styles.deliveryStatus, styles.current], {}, MESSAGE_STATUS.DELIVERED);
  }
  return customCreateElement(TAG_NAME.DIV, [styles.deliveryStatus, styles.partner]);
}

function createSenderNameElement(message: Message, currentUserDialogue: User | null): HTMLDivElement {
  if (message.from === currentUserDialogue?.login) {
    return customCreateElement(TAG_NAME.DIV, [styles.senderName, styles.partner], {}, message.from);
  }
  const CURRENT_SENDER = 'You';
  return customCreateElement(TAG_NAME.DIV, [styles.senderName, styles.current], {}, CURRENT_SENDER);
}

function editMessageHandler(message: Message, newText: string): void {
  const store = getStore();
  const currentPayload = { message: { id: message.id, text: newText } };
  sendClientRequest(currentPayload, REQUEST_TYPE.MESSAGE_EDIT, message.id);

  const newMessage: Message = {
    ...message,
    status: { ...message.status, isEdited: true },
    text: newText,
  };

  store.dispatch(editMessageInCurrentDialogueHistory(newMessage));
}
