/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable import/no-cycle */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable no-console */
import type { Router } from '../../router/router.ts';
import type { User, UserPayload } from '../../types/types.ts';

import { APP_ROUTE } from '../../constants/app-routes.ts';
import { BUTTONS_TEXT_CONTENT, EVENT_NAME, REQUEST_TYPE, RESPONSE_TYPE, TAG_NAME } from '../../constants/constants.ts';
import getStore from '../../lib/store/store.ts';
import { sendClientRequest } from '../../services/api/client-api.ts';
import { setCurrentUser } from '../../store/actions.ts';
import customCreateElement from '../../utils/base-element.ts';
import openErrorModal from '../modal/modal.ts';
import styles from './form.module.scss';
import InputField from './input/input.ts';

interface FormSubmitHandler {
  currentId: string;
  formPayload: UserPayload;
}

let formPayload: UserPayload | null = null;
let currentId: null | string = null;

export default function createLoginForm(router: Router): HTMLFormElement {
  const form = customCreateElement(TAG_NAME.FORM, [styles.form]);
  const loginInputAttributes = {
    maxlength: '10',
    min: '5',
    name: 'loginInput',
    placeholder: 'login',
    required: 'true',
    type: 'text',
  };
  const loginInput = InputField(loginInputAttributes);

  const passwordInputAttributes = {
    maxlength: '256',
    min: '5',
    name: 'passwordInput',
    placeholder: 'password',
    required: 'true',
    type: 'password',
  };
  const passwordInput = InputField(passwordInputAttributes);

  const formButtonAttributes = { disabled: 'true' };
  const formButton = customCreateElement(TAG_NAME.BUTTON, [], formButtonAttributes, BUTTONS_TEXT_CONTENT.SUBMIT);

  const inputFields = [loginInput, passwordInput];

  const validateForm = (): void => {
    const allValid = inputFields.every((input) => input.isValid());
    formButton.disabled = !allValid;
  };

  inputFields.forEach((input) => {
    input.addEventListener(EVENT_NAME.INPUT, validateForm);
  });

  form.addEventListener(EVENT_NAME.SUBMIT, (event) => {
    event.preventDefault();
    if (formButton.disabled) {
      return;
    }
    formSubmitHandler(loginInput, passwordInput, router);
  });

  form.append(loginInput.inputContainer, passwordInput.inputContainer, formButton);

  return form;
}

let routerRef: Router | null = null;

function formSubmitHandler(loginInput: InputField, passwordInput: InputField, router: Router): FormSubmitHandler {
  routerRef = router;

  const loginValue = loginInput.getInputValue();
  const passwordValue = passwordInput.getInputValue();

  formPayload = {
    user: {
      login: loginValue,
      password: passwordValue,
    },
  };
  currentId = crypto.randomUUID();

  sendClientRequest(formPayload, REQUEST_TYPE.USER_LOGIN, currentId);
  sendClientRequest(null);

  return { currentId, formPayload };
}

export function authFormResponseHandler(currentResponseData: any): void {
  const store = getStore();
  if (currentResponseData.payload && currentResponseData.type === RESPONSE_TYPE.ERROR) {
    const currentErrorText: string = currentResponseData.payload.error;
    openErrorModal(currentErrorText);
  } else if (currentResponseData.id === currentId && currentResponseData.type === RESPONSE_TYPE.USER_LOGIN) {
    if (store && routerRef && formPayload) {
      store.dispatch(setCurrentUser(formPayload.user));
      routerRef.navigateTo(APP_ROUTE.Main);
    }
  }
}

export function getAllUsersHistory(currentResponseData: any): void {
  if (
    currentResponseData.type === RESPONSE_TYPE.INACTIVE_USERS ||
    currentResponseData.type === RESPONSE_TYPE.ACTIVE_USERS
  ) {
    const store = getStore();
    const { allUsers } = store.getState();
    allUsers.forEach((user: User) => {
      if (user && user.login) {
        const currentPayload = { user: { login: user.login } };
        sendClientRequest(currentPayload, REQUEST_TYPE.FETCH_HISTORY, user.login);
      }
    });
  }
}
