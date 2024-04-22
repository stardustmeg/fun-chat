import type { Router } from '../../router/router.ts';

import createLoginForm from '../../components/form/form.ts';
import { APP_ROUTE } from '../../constants/app-routes.ts';
import { GLOBAL_STYLE, LINK_TEXT_CONTENT, PAGE_DESCRIPTION, TAG_NAME } from '../../constants/constants.ts';
import handleRouterTransfer from '../../utils/actions.ts';
import customCreateElement from '../../utils/base-element.ts';

export default function createPage(router: Router): HTMLDivElement {
  const authorizationPage = customCreateElement(TAG_NAME.DIV, [GLOBAL_STYLE.PAGE_CONTAINER]);
  const pageHeading = customCreateElement(
    TAG_NAME.DIV,
    [GLOBAL_STYLE.PAGE_HEADING],
    {},
    PAGE_DESCRIPTION.AUTHORIZATION_PAGE_HEADING,
  );
  const toAboutLink = customCreateElement(TAG_NAME.A, [], {}, LINK_TEXT_CONTENT.ABOUT);

  handleRouterTransfer(toAboutLink, router, APP_ROUTE.About);

  const loginForm = createLoginForm(router);
  authorizationPage.append(pageHeading, loginForm, toAboutLink);

  return authorizationPage;
}
