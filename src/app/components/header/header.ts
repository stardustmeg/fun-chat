import type { Router } from '../../router/router.ts';

import { APP_ROUTE } from '../../constants/app-routes.ts';
import {
  BUTTONS_TEXT_CONTENT,
  EVENT_NAME,
  GLOBAL_STYLE,
  PAGE_DESCRIPTION,
  TAG_NAME,
} from '../../constants/constants.ts';
import getStore from '../../lib/store/store.ts';
import { logOutHandler } from '../../utils/actions.ts';
import customCreateElement from '../../utils/base-element.ts';
import clearOutElement from '../../utils/utils.ts';
import styles from './header.module.scss';

let nameWrapper = customCreateElement(TAG_NAME.DIV, [styles.nameWrapper]);

function createHeader(router: Router): HTMLDivElement {
  const store = getStore();
  const header = customCreateElement(TAG_NAME.DIV, [styles.header], {}, PAGE_DESCRIPTION.HEADER_TEXT);
  const logOutButton = customCreateElement(TAG_NAME.BUTTON, [styles.button], {}, BUTTONS_TEXT_CONTENT.LOG_OUT);
  const toAboutButton = customCreateElement(TAG_NAME.BUTTON, [styles.button], {}, BUTTONS_TEXT_CONTENT.ABOUT);
  nameWrapper = customCreateElement(TAG_NAME.DIV, [styles.nameWrapper]);

  drawUserName(nameWrapper, logOutButton);

  logOutButton.addEventListener(EVENT_NAME.CLICK, (event) => {
    event.preventDefault();
    logOutHandler(store, router);
  });

  toAboutButton.addEventListener(EVENT_NAME.CLICK, (event) => {
    event.preventDefault();
    router.navigateTo(APP_ROUTE.About);
  });

  header.append(nameWrapper, toAboutButton, logOutButton);
  return header;
}

function drawUserName(parent: HTMLDivElement, button: HTMLButtonElement): void {
  clearOutElement(nameWrapper);

  const store = getStore();
  const { currentUser } = store.getState();

  if (currentUser?.login) {
    const currentUserName = currentUser.login;
    const currentUserNamePlate = customCreateElement(TAG_NAME.DIV, [styles.currentUserName], {}, currentUserName);
    parent.append(currentUserNamePlate);
  } else {
    button.classList.add(GLOBAL_STYLE.HIDDEN);
  }
}

export default createHeader;
