import { BUTTONS_TEXT_CONTENT, GLOBAL_STYLE, PAGE_DESCRIPTION, TAG_NAME } from '../../constants/constants.ts';
import { handleTransferToPreviousRoute } from '../../utils/actions.ts';
import customCreateElement from '../../utils/base-element.ts';
import styles from './about.module.scss';

export default function createPage(): HTMLDivElement {
  const aboutPage = customCreateElement(TAG_NAME.DIV, [GLOBAL_STYLE.PAGE_CONTAINER]);
  const pageHeading = customCreateElement(
    TAG_NAME.DIV,
    [GLOBAL_STYLE.PAGE_HEADING],
    {},
    PAGE_DESCRIPTION.ABOUT_PAGE_HEADING,
  );

  const pageDescription = customCreateElement(
    TAG_NAME.DIV,
    [GLOBAL_STYLE.PAGE_DESCRIPTION],
    {},
    PAGE_DESCRIPTION.ABOUT_PAGE_DESCRIPTION,
  );

  const toPreviousButton = customCreateElement(
    TAG_NAME.BUTTON,
    [styles.toPreviousButton],
    {},
    BUTTONS_TEXT_CONTENT.GO_BACK,
  );
  handleTransferToPreviousRoute(toPreviousButton);

  aboutPage.append(pageHeading, pageDescription, toPreviousButton);

  return aboutPage;
}
