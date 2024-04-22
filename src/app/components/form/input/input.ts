import type { EventListenerFunction } from '../../../types/types.ts';

import { EVENT_NAME, TAG_NAME } from '../../../constants/constants.ts';
import customCreateElement from '../../../utils/base-element.ts';
import styles from './input.module.scss';
import { addEventListener, handleInputChange, showError, validate } from './input-helper.ts';

interface InputField {
  addEventListener: (eventName: string, listener: EventListenerFunction) => void;
  getInputValue: () => string;
  getValidationState: () => boolean;
  inputContainer: HTMLDivElement;
  isValid: () => boolean;
  validate: (value: string) => boolean;
}

interface InputAttributes extends Record<string, string> {
  maxlength: string;
  min: string;
  name: string;
  placeholder: string;
  required: string;
  type: string;
}

const InputField = (inputAttributes: InputAttributes): InputField => {
  const minValue = +inputAttributes.min;
  const errorElement = customCreateElement(TAG_NAME.DIV, [styles.errorElement]);
  const inputElement = customCreateElement(TAG_NAME.INPUT, [styles.inputField], inputAttributes);

  const inputContainer = customCreateElement(TAG_NAME.DIV, [styles.inputContainer]);
  inputContainer.append(inputElement, errorElement);

  let inputValue = inputElement.value;
  let isValid = false;

  const handleInput = handleInputChange(
    inputElement,
    minValue,
    (message) => showError(errorElement, message),
    errorElement,
    (value) => {
      inputValue = value;
      isValid = validate(value, minValue, (message) => showError(errorElement, message), errorElement);
    },
  );

  addEventListener(inputElement, EVENT_NAME.INPUT, handleInput);

  return {
    addEventListener: (eventName: string, listener: EventListenerFunction): void =>
      addEventListener(inputElement, eventName, listener),
    getInputValue: () => inputElement.value,
    getValidationState: (): boolean =>
      validate(inputValue, minValue, (message) => showError(errorElement, message), errorElement),
    inputContainer,
    isValid: () => isValid,
    validate: (value: string): boolean =>
      validate(value, minValue, (message) => showError(errorElement, message), errorElement),
  };
};

export default InputField;
