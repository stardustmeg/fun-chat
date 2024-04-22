import type { MessagePayload } from '../../types/types.ts';

import { EMPTY_STRING, ENTER_KEY, EVENT_NAME, REQUEST_TYPE, TAG_NAME } from '../../constants/constants.ts';
import getStore from '../../lib/store/store.ts';
import { sendClientRequest } from '../../services/api/client-api.ts';
import customCreateElement from '../../utils/base-element.ts';
import { createSvgElement } from '../../utils/utils.ts';
import styles from './send-message-form.module.scss';

export default function createInputArea(): HTMLDivElement {
  const inputArea = customCreateElement(TAG_NAME.DIV, [styles.inputArea]);

  const form = createForm();

  inputArea.append(form);

  return inputArea;
}

function createForm(): HTMLFormElement {
  const form = customCreateElement(TAG_NAME.FORM, [styles.form]);

  const inputAttributes = {
    autofocus: 'true',
    minlength: '1',
    placeholder: 'Write a message',
  };
  const textArea = customCreateElement(TAG_NAME.TEXTAREA, [styles.textArea], inputAttributes);
  const sendButton = customCreateElement(TAG_NAME.BUTTON, [styles.sendButton]);
  const svgAttributes = {
    alt: 'Send button',
    height: '20',
    viewBox: '0 0 24 24',
    width: '20',
  };
  const svgLogo = createSvgElement(svgAttributes);
  sendButton.append(svgLogo);

  sendButton.addEventListener(EVENT_NAME.CLICK, (event) => {
    event.preventDefault();
    sendButtonHandler(textArea.value);
    textArea.value = EMPTY_STRING;
  });

  textArea.addEventListener(EVENT_NAME.KEYDOWN, (event) => {
    if (event.key === ENTER_KEY && event.shiftKey) {
      event.preventDefault();
      textArea.value += `\n`;
    } else if (event.key === ENTER_KEY && !event.shiftKey) {
      event.preventDefault();
      const textToSend = textArea.value.replaceAll(`\n`, `<br>`);
      sendButtonHandler(textToSend);
      textArea.value = EMPTY_STRING;
    }
  });

  form.append(textArea, sendButton);

  return form;
}

function sendButtonHandler(text: string): void {
  const store = getStore();
  const { currentUserDialogue } = store.getState();

  if (currentUserDialogue?.login) {
    const currentLogin = currentUserDialogue.login;
    const currentMessagePayload: MessagePayload = {
      message: {
        text,
        to: currentUserDialogue.login,
      },
    };
    sendClientRequest(currentMessagePayload, REQUEST_TYPE.MESSAGE_SEND, currentLogin);
    const currentHistoryPayload = { user: { login: currentLogin } };
    sendClientRequest(currentHistoryPayload, REQUEST_TYPE.FETCH_HISTORY, currentLogin);
  }
}
