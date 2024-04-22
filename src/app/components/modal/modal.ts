import type { Message } from '../../types/types.ts';

import {
  BUTTONS_TEXT_CONTENT,
  EMPTY_STRING,
  EVENT_NAME,
  PAGE_DESCRIPTION,
  TAG_NAME,
} from '../../constants/constants.ts';
import customCreateElement from '../../utils/base-element.ts';
import styles from './modal.module.scss';

let modalBackground: HTMLDivElement | null = null;
let modalContent: HTMLDivElement | null = null;

export function createModal(errorText: string, buttons?: HTMLDivElement): HTMLDivElement {
  if (!modalBackground) {
    modalBackground = customCreateElement(TAG_NAME.DIV, [styles.modalBackground]);
    const MODAL_TEXT = errorText;
    modalContent = customCreateElement(TAG_NAME.DIV, [styles.modalContent], {}, MODAL_TEXT);

    if (buttons) {
      modalContent.append(buttons);
    }

    modalBackground.append(modalContent);

    modalBackground.addEventListener(EVENT_NAME.CLICK, closeModalOnOutside);

    const OVERFLOW_STYLE = 'hidden';
    document.body.style.overflow = OVERFLOW_STYLE;
  }

  return modalBackground;
}

function closeModalOnOutside(event: MouseEvent): void {
  if (!(modalBackground instanceof HTMLDivElement) || !(modalContent instanceof HTMLDivElement)) {
    return;
  }

  if (event.target instanceof Node && event.target !== modalContent && !modalContent.contains(event.target)) {
    closeModal();
  }
}

export function closeModal(): void {
  if (modalBackground) {
    modalBackground.classList.add(styles.hidden);
    modalBackground.removeEventListener(EVENT_NAME.CLICK, closeModalOnOutside);
    if (modalContent) {
      modalContent.remove();
    }
    modalBackground.remove();
    modalBackground = null;
    modalContent = null;
  }

  document.body.style.overflow = EMPTY_STRING;
}

export default function openErrorModal(currentErrorText: string): void {
  closeModal();
  const modal = createModal(currentErrorText);
  document.body.append(modal);
}

export function openDeleteModal(messageId: string, callback: (messageId: string) => void): void {
  closeModal();
  const buttons = createDeleteModalButtons(messageId, callback);
  const modal = createModal(PAGE_DESCRIPTION.DELETE_MESSAGE, buttons);
  document.body.append(modal);
}

function createDeleteModalButtons(messageId: string, callback: (messageId: string) => void): HTMLDivElement {
  const buttonsWrapper = customCreateElement(TAG_NAME.DIV, [styles.buttonsWrapper]);
  const yesButton = customCreateElement(TAG_NAME.BUTTON, [styles.yesButton], {}, BUTTONS_TEXT_CONTENT.YES);
  const noButton = customCreateElement(TAG_NAME.BUTTON, [styles.noButton], {}, BUTTONS_TEXT_CONTENT.NO);

  yesButton.addEventListener(EVENT_NAME.CLICK, () => {
    closeModal();
    callback(messageId);
  });
  noButton.addEventListener(EVENT_NAME.CLICK, closeModal);

  buttonsWrapper.append(yesButton, noButton);
  return buttonsWrapper;
}

export function openEditModal(message: Message, callback: (message: Message, newText: string) => void): void {
  closeModal();
  const buttons = createEditModalButtons(message, callback);
  const modal = createModal(PAGE_DESCRIPTION.EDIT_MESSAGE, buttons);
  document.body.append(modal);
}

function createEditModalButtons(
  message: Message,
  callback: (message: Message, newText: string) => void,
): HTMLDivElement {
  const buttonsWrapper = customCreateElement(TAG_NAME.DIV, [styles.buttonsWrapper]);
  const yesButton = customCreateElement(TAG_NAME.BUTTON, [styles.yesButton], {}, BUTTONS_TEXT_CONTENT.CONFIRM);
  const noButton = customCreateElement(TAG_NAME.BUTTON, [styles.noButton], {}, BUTTONS_TEXT_CONTENT.CANCEL);

  const input = customCreateElement(TAG_NAME.INPUT, [styles.textArea], { value: message.text });
  input.addEventListener(EVENT_NAME.INPUT, () => {
    input.dataset.newText = input.value;
  });

  yesButton.addEventListener(EVENT_NAME.CLICK, () => {
    const newText = input.dataset.newText || message.text;
    closeModal();
    callback(message, newText);
  });
  noButton.addEventListener(EVENT_NAME.CLICK, closeModal);

  buttonsWrapper.append(input, yesButton, noButton);
  return buttonsWrapper;
}
