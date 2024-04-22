import type { State } from '../store/reducer';

export const initialState: State = {
  allUsers: [],
  currentAuthenticatedUsers: [],
  currentDialogueHistory: [],
  currentUnauthorizedUsers: [],
  currentUser: null,
  currentUserDialogue: null,
  messagesHistory: [],
  socketIsOpen: false,
};

export const REQUEST_TYPE = {
  ACTIVE_USERS: 'USER_ACTIVE',
  FETCH_HISTORY: 'MSG_FROM_USER',
  INACTIVE_USERS: 'USER_INACTIVE',
  MESSAGE_DELETE: 'MSG_DELETE',
  MESSAGE_EDIT: 'MSG_EDIT',
  MESSAGE_READ: 'MSG_READ',
  MESSAGE_SEND: 'MSG_SEND',
  USER_LOGIN: 'USER_LOGIN',
  USER_LOGOUT: 'USER_LOGOUT',
} as const;

export type RequestTypeType = (typeof REQUEST_TYPE)[keyof typeof REQUEST_TYPE];

export const RESPONSE_TYPE = {
  ACTIVE_USERS: 'USER_ACTIVE',
  ERROR: 'ERROR',
  FETCH_HISTORY: 'MSG_FROM_USER',
  INACTIVE_USERS: 'USER_INACTIVE',
  MESSAGE_DELETE: 'MSG_DELETE',
  MESSAGE_DELIVERED: 'MSG_DELIVER',
  MESSAGE_EDIT: 'MSG_EDIT',
  MESSAGE_READ: 'MSG_READ',
  MESSAGE_SEND: 'MSG_SEND',
  USER_EXTERNAL_LOGIN: 'USER_EXTERNAL_LOGIN',
  USER_EXTERNAL_LOGOUT: 'USER_EXTERNAL_LOGOUT',
  USER_LOGIN: 'USER_LOGIN',
  USER_LOGOUT: 'USER_LOGOUT',
} as const;

export type ResponseTypeType = (typeof RESPONSE_TYPE)[keyof typeof RESPONSE_TYPE];

export const PAYLOAD_FIELD = {
  MESSAGE: 'message',
  USER: 'user',
} as const;

export const MESSAGE_STATUS = {
  DELIVERED: '✓',
  EDITED: 'edited',
  READ: '✓✓',
} as const;

export const FORMAT_OPTION = {
  DATE: 'date',
  TIME: 'time',
} as const;

export type FormatOptionType = (typeof FORMAT_OPTION)[keyof typeof FORMAT_OPTION];

export const ERROR_MESSAGE = {
  EMPTY_ARRAY: 'The array is empty',
  GENERAL_ERROR_MESSAGE: 'Sorry, something went wrong',
  INVALID_MESSAGE_REQUEST: 'Invalid Message request',
  INVALID_USER_REQUEST: 'Invalid User request',
  WEBSOCKET_CLOSED: 'WebSocket connection closed',
  WEBSOCKET_ERROR: 'WebSocket error:',
  WRONG_FORMAT_TYPE: 'Invalid format specified',
} as const;

export const BUTTONS_TEXT_CONTENT = {
  ABOUT: 'About',
  CANCEL: 'Cancel',
  CONFIRM: 'Confirm',
  GO_BACK: 'Go Back',
  LEFT: '<',
  LOG_OUT: 'Log out',
  NO: 'No',
  RIGHT: '>',
  SUBMIT: 'Log In',
  WAKE_UP: 'Wake Up',
  YES: 'Yes',
} as const;

export const LINK_TEXT_CONTENT = {
  ABOUT: 'About this app',
} as const;

export const INPUT_TEXT_CONTENT = {
  SEARCH_INPUT: 'Search...',
};

export const PAGE_DESCRIPTION = {
  ABOUT_PAGE_DESCRIPTION:
    "This is my Fun Chat. I am glad you are here. Hope, you're enjoying it. Have a nice day. Thanks!",
  ABOUT_PAGE_HEADING: 'About this app',
  AUTHORIZATION_PAGE_HEADING: 'Authorization Page',
  CHOOSE_USER_INFO: 'Choose someone to start your legendary conversation',
  DELETE_MESSAGE: 'Are you sure you want to delete this message?',
  EDIT_MESSAGE: 'Edit Message',
  FOOTER_TEXT: '2024',
  HEADER_TEXT: 'Fun Chat',
  MAIN_PAGE_HEADING: 'Main Page',
  NOT_FOUND_PAGE_DESCRIPTION:
    'You should have never seen this page. Something must have gone horribly wrong. Please, go back! Thanks!',
  NOT_FOUND_PAGE_HEADING: 'Oops!',
} as const;

export const START_CONVERSATION = [
  'This is the very beginning of your legendary conversation',
  'This is going to be legen... wait for it... dary!',
  "Trust me, I'm the Doctor",
  'Embrace the inception of our dialogue!',
  'To infinity and beyond!',
  "Gear up for a chat that'll shake the foundations!",
  "I've got a bad feeling about this.",
  'Prepare to be whisked away on a verbal odyssey!',
  "We're all stories, in the end.",
  'It all started with a big bang!',
  'So it begins.',
  'Witness the genesis of an extraordinary exchange!',
  'Do, or do not. There is no try.',
  'Welcome to the dawn of our epic dialogue!',
  'Get ready for a conversation that will go down in history!',
  'Hold onto your hats, this conversation is about to blast off!',
  'Brace yourself for an adventure in conversation!',
  'Get ready to dive into the rabbit hole of discussion!',
  'Fasten your seatbelt, our conversation is about to take off!',
  'Prepare yourself for a conversation of mythical proportions!',
  "Get set for a conversation that'll make waves!",
];

export const TAG_NAME = {
  A: 'a',
  AUDIO: 'audio',
  BUTTON: 'button',
  DIV: 'div',
  FOOTER: 'footer',
  FORM: 'form',
  H1: 'h1',
  H2: 'h2',
  H3: 'h3',
  IMG: 'img',
  INPUT: 'input',
  LABEL: 'label',
  LI: 'li',
  OPTION: 'option',
  P: 'p',
  SELECT: 'select',
  SPAN: 'span',
  SVG: 'svg',
  TABLE: 'table',
  TEXTAREA: 'textarea',
  TH: 'th',
  UL: 'ul',
  USE: 'use',
} as const;

export const EVENT_NAME = {
  ANIMATIONEND: 'animationend',
  BEFOREUNLOAD: 'beforeunload',
  CHANGE: 'change',
  CLICK: 'click',
  CLOSE: 'close',
  CONTEXTMENU: 'contextmenu',
  DOM_CONTENT_LOADED: 'DOMContentLoaded',
  ERROR: 'error',
  FINISH: 'finish',
  INPUT: 'input',
  KEYDOWN: 'keydown',
  KEYUP: 'keyup',
  MESSAGE: 'message',
  OPEN: 'open',
  POPSTATE: 'popstate',
  SUBMIT: 'submit',
} as const;

export const GLOBAL_STYLE = {
  HIDDEN: 'hidden',
  PAGE_CONTAINER: 'pageContainer',
  PAGE_DESCRIPTION: 'pageDescription',
  PAGE_HEADING: 'pageHeading',
} as const;

export const EMPTY_STRING = '';
export const DEFAULT_NUMBER_VALUE = 0;
export const EMPTY_ARRAY = 0;
export const RETRY_INTERVAL = 3000;
export const ENTER_KEY = 'Enter';
