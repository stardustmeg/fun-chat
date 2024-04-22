import { EMPTY_STRING } from '../constants/constants.ts';

const customCreateElement = <T extends keyof HTMLElementTagNameMap>(
  tag: T,
  cssClasses: string[] = [],
  attributes: Record<string, string> = {},
  innerContent: string = EMPTY_STRING,
): HTMLElementTagNameMap[T] => {
  const element = document.createElement(tag);

  element.classList.add(...cssClasses);

  if (attributes) {
    Object.entries(attributes).forEach(([attrName, attrValue]) => {
      element.setAttribute(attrName, attrValue);
    });
  }

  if (innerContent) {
    element.innerHTML = innerContent;
  }

  return element;
};

export default customCreateElement;
