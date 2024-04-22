/* eslint-disable max-lines-per-function */
import type { Reducer } from '../lib/store/types.ts';
import type { Message, MessagesHistory, User } from '../types/types.ts';
import type * as actions from './actions.ts';

export interface State {
  allUsers: [] | User[];
  currentAuthenticatedUsers: User[];
  currentDialogueHistory: Message[];
  currentUnauthorizedUsers: User[];
  currentUser: User | null;
  currentUserDialogue: User | null;
  messagesHistory: MessagesHistory[];
  socketIsOpen: boolean;
}

type InferValueTypes<T> = T extends { [key: string]: infer U } ? U : never;

export type Action = ReturnType<InferValueTypes<typeof actions>>;
export const rootReducer: Reducer<State, Action> = (state: State, action: Action): State => {
  switch (action.type) {
    case 'updateAllUsers': {
      return {
        ...state,
        allUsers: [...state.allUsers, action.payload].filter((user) => user.login !== state.currentUser?.login),
      };
    }

    case 'clearAllUsers': {
      return {
        ...state,
        allUsers: action.payload,
      };
    }

    case 'setAuthenticatedUsers': {
      return {
        ...state,
        currentAuthenticatedUsers: action.payload,
      };
    }

    case 'setUnauthorizedUsers': {
      return {
        ...state,
        currentUnauthorizedUsers: action.payload,
      };
    }

    case 'updateStoreMessagesHistory': {
      const existingIndex = state.messagesHistory.findIndex((message) => message.user === action.payload.user);

      if (existingIndex !== -1) {
        const updatedMessagesHistory = [...state.messagesHistory];
        updatedMessagesHistory[existingIndex] = action.payload;

        return {
          ...state,
          messagesHistory: updatedMessagesHistory,
        };
      }
      return {
        ...state,
        messagesHistory: [...state.messagesHistory, action.payload],
      };
    }

    case 'setMessagesHistory': {
      return {
        ...state,
        messagesHistory: action.payload,
      };
    }

    case 'addMessageToCurrentDialogueHistory': {
      return {
        ...state,
        currentDialogueHistory: [...state.currentDialogueHistory, action.payload],
      };
    }

    case 'deleteMessageFromCurrentDialogueHistory': {
      return {
        ...state,
        currentDialogueHistory: state.currentDialogueHistory.filter((message) => message.id !== action.payload),
      };
    }

    case 'editMessageInCurrentDialogueHistory': {
      return {
        ...state,
        currentDialogueHistory: state.currentDialogueHistory.map((message) =>
          message.id === action.payload.id ? { ...message, ...action.payload } : message,
        ),
      };
    }

    case 'setCurrentDialogueHistory': {
      return {
        ...state,
        currentDialogueHistory: action.payload,
      };
    }

    case 'setCurrentUserDialogue': {
      return {
        ...state,
        currentUserDialogue: action.payload,
      };
    }

    case 'getAuthenticatedUsers': {
      return {
        ...state,
        currentAuthenticatedUsers: action.payload,
      };
    }

    case 'getUnauthorizedUsers': {
      return {
        ...state,
        currentUnauthorizedUsers: action.payload,
      };
    }

    case 'addUnauthorizedUser': {
      return {
        ...state,
        currentUnauthorizedUsers: [...state.currentUnauthorizedUsers, action.payload],
      };
    }

    case 'addAuthenticatedUser': {
      return {
        ...state,
        currentAuthenticatedUsers: [...state.currentAuthenticatedUsers, action.payload],
      };
    }

    case 'removeUnauthorizedUser': {
      return {
        ...state,
        currentUnauthorizedUsers: state.currentUnauthorizedUsers.filter((user) => user.login !== action.payload.login),
      };
    }

    case 'removeAuthenticatedUser': {
      return {
        ...state,
        currentAuthenticatedUsers: state.currentAuthenticatedUsers.filter(
          (user) => user.login !== action.payload.login,
        ),
      };
    }

    case 'setCurrentUser': {
      return {
        ...state,
        currentUser: action.payload,
      };
    }

    case 'setSocketState': {
      return {
        ...state,
        socketIsOpen: action.payload,
      };
    }

    default:
      return state;
  }
};
