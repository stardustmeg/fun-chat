import sendLogo from '../../assets/send.svg';
import { EMPTY_ARRAY, EMPTY_STRING, ERROR_MESSAGE, TAG_NAME } from '../constants/constants.ts';

export default function clearOutElement(...args: HTMLElement[]): void {
  args.forEach((element) => {
    if (element instanceof HTMLElement) {
      const currentElement = element;
      currentElement.innerHTML = EMPTY_STRING;
    }
  });
}

export function createSvgElement(attributes?: { [key: string]: string }): SVGSVGElement {
  const SVG_URL = 'http://www.w3.org/2000/svg';

  const svgElement = document.createElementNS(SVG_URL, TAG_NAME.SVG);

  if (attributes) {
    Object.entries(attributes).forEach(([key, value]) => {
      svgElement.setAttribute(key, value);
    });
  }

  fetch(sendLogo)
    .then((response) => response.text())
    .then((svgContent) => {
      svgElement.innerHTML = svgContent;
    })
    .catch(() => false);

  return svgElement;
}

export function getRandomIndex<T>(array: T[]): number {
  if (array.length === EMPTY_ARRAY) {
    throw new Error(ERROR_MESSAGE.EMPTY_ARRAY);
  }
  return Math.floor(Math.random() * array.length);
}
