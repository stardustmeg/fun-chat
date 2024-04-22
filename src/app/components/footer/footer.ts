import logo from '../../../assets/logo-rsschool.svg';
import { PAGE_DESCRIPTION, TAG_NAME } from '../../constants/constants.ts';
import customCreateElement from '../../utils/base-element.ts';
import styles from './footer.module.scss';

function createFooter(): HTMLElement {
  const footer = customCreateElement(TAG_NAME.FOOTER, [styles.footer]);
  const footerText = customCreateElement(TAG_NAME.DIV, [styles.footerText], {}, PAGE_DESCRIPTION.FOOTER_TEXT);

  const logoLinkAttributes = {
    href: 'https://rollingscopes.com',
    target: '_blank',
  };
  const rsSchoolLink = customCreateElement(TAG_NAME.A, [styles.rsSchoolLink], logoLinkAttributes);

  const SCHOOL_LOGO_LINK = logo;
  const schoolLogoAttributes = {
    alt: 'RS School logo',
    height: '30',
    src: SCHOOL_LOGO_LINK,
    width: '80',
  };
  const schoolLogo = customCreateElement(TAG_NAME.IMG, [], schoolLogoAttributes);

  const GITHUB_NAME = '@stardustmeg';
  const gitHUbLinkAttributes = {
    href: 'https://github.com/stardustmeg',
    target: '_blank',
  };
  const gitHubLink = customCreateElement(TAG_NAME.A, [styles.gitHubLink], gitHUbLinkAttributes, GITHUB_NAME);

  rsSchoolLink.append(schoolLogo);
  footer.append(rsSchoolLink, footerText, gitHubLink);

  return footer;
}

export default createFooter;
