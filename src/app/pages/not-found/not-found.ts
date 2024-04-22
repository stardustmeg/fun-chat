import { BUTTONS_TEXT_CONTENT, GLOBAL_STYLE, PAGE_DESCRIPTION, TAG_NAME } from '../../constants/constants.ts';
import { handleTransferToPreviousRoute } from '../../utils/actions.ts';
import customCreateElement from '../../utils/base-element.ts';
import styles from './not-found.module.scss';

export default function createPage(): HTMLDivElement {
  const notFoundPage = customCreateElement(TAG_NAME.DIV, [GLOBAL_STYLE.PAGE_CONTAINER]);

  const pageHeading = customCreateElement(
    TAG_NAME.DIV,
    [GLOBAL_STYLE.PAGE_HEADING],
    {},
    PAGE_DESCRIPTION.NOT_FOUND_PAGE_HEADING,
  );

  const pageDescription = customCreateElement(
    TAG_NAME.DIV,
    [GLOBAL_STYLE.PAGE_DESCRIPTION],
    {},
    PAGE_DESCRIPTION.NOT_FOUND_PAGE_DESCRIPTION,
  );

  const wakeUpButton = customCreateElement(TAG_NAME.BUTTON, [styles.wakeUpButton], {}, BUTTONS_TEXT_CONTENT.WAKE_UP);
  handleTransferToPreviousRoute(wakeUpButton);

  notFoundPage.append(pageHeading, pageDescription, wakeUpButton);

  return notFoundPage;
}
