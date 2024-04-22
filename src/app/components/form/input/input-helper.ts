import type { EventListenerFunction } from '../../../types/types.ts';

import { DEFAULT_NUMBER_VALUE, EMPTY_STRING } from '../../../constants/constants.ts';

export const handleInputChange =
  (
    inputElement: HTMLInputElement,
    minValue: number,
    showError: (message: string) => void,
    errorElement: HTMLElement,
    updateInputValue: (value: string) => void,
  ): EventListenerFunction =>
  (): void => {
    const inputValue = inputElement.value;
    validate(inputValue, minValue, showError, errorElement);
    updateInputValue(inputValue);
  };

export const addEventListener = (
  inputElement: HTMLInputElement,
  eventName: string,
  listener: EventListenerFunction,
): void => {
  inputElement.addEventListener(eventName, listener);
};

export const validate = (
  value: string,
  minValue: number,
  showError: (message: string) => void,
  errorElement: HTMLElement,
): boolean => {
  const validCharRegex = /^[A-Za-z0-9\\-]+$/;

  const validationErrorMessage = {
    ENGLISH_LETTERS_AND_HYPHEN_ONLY: 'Use English letters, numbers, and/or a hyphen.',
    FIELD_REQUIRED: 'This field is required.',
    MIN_LENGTH_REQUIRED: `Minimum ${minValue} characters required.`,
  };

  switch (true) {
    case value.length === DEFAULT_NUMBER_VALUE:
      showError(validationErrorMessage.FIELD_REQUIRED);
      return false;

    case !validCharRegex.test(value):
      showError(validationErrorMessage.ENGLISH_LETTERS_AND_HYPHEN_ONLY);
      return false;

    case value.length < minValue:
      showError(validationErrorMessage.MIN_LENGTH_REQUIRED);
      return false;

    default:
      hideError(errorElement);
      return true;
  }
};

export const showError = (errorElement: HTMLElement, message: string): void => {
  const currentErrorElement = errorElement;
  currentErrorElement.textContent = message;
};

const hideError = (errorElement: HTMLElement): void => {
  const currentErrorElement = errorElement;
  currentErrorElement.textContent = EMPTY_STRING;
};
