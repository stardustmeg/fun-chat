import type { Router } from '../../router/router.ts';

import createHeader from '../../components/header/header.ts';
import { createDialogueArea } from '../../components/user-list/user-list.ts';
import { GLOBAL_STYLE, TAG_NAME } from '../../constants/constants.ts';
import customCreateElement from '../../utils/base-element.ts';
import styles from './main.module.scss';

export default function createPage(router: Router): HTMLDivElement {
  const mainPage = customCreateElement(TAG_NAME.DIV, [GLOBAL_STYLE.PAGE_CONTAINER, styles.mainPage]);
  const header = createHeader(router);

  const dialogueArea = createDialogueArea();
  mainPage.append(header, dialogueArea);

  return mainPage;
}
