/* eslint-disable import/no-cycle */
import { EMPTY_STRING, TAG_NAME } from '../../constants/constants.ts';
import { loginCurrentUser } from '../../services/api/client-api.ts'; // TBD Chech dependency
import customCreateElement from '../../utils/base-element.ts';
import styles from './modal.module.scss';

let modalBackground: HTMLDivElement | null = null;
let modalContent: HTMLDivElement | null = null;

export function createModal(errorText: string): HTMLDivElement {
  if (!modalBackground) {
    modalBackground = customCreateElement(TAG_NAME.DIV, [styles.modalBackground]);
    const MODAL_TEXT = errorText;
    modalContent = customCreateElement(TAG_NAME.DIV, [styles.modalContent], {}, MODAL_TEXT);

    modalBackground.append(modalContent);

    const OVERFLOW_STYLE = 'hidden';
    document.body.style.overflow = OVERFLOW_STYLE;
  }

  return modalBackground;
}

export function loginCurrentUserOnReconnection(): void {
  if (modalBackground) {
    modalBackground.classList.add(styles.hidden);
    if (modalContent) {
      modalContent.remove();
    }
    modalBackground.remove();
    modalBackground = null;
    modalContent = null;
    loginCurrentUser();
  }

  document.body.style.overflow = EMPTY_STRING;
}

export default function openErrorModal(currentErrorText: string): void {
  const modal = createModal(currentErrorText);
  document.body.append(modal);
}
