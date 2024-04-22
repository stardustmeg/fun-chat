import type { Action, State } from '../../store/reducer';
import type { Message, MessagesHistory, User } from '../../types/types';
import type { ReduxStore } from './types';

function observeStore<T>(
  store: ReduxStore<State, Action>,
  select: (state: State) => T,
  onChange: (selectedState: T) => void,
): VoidFunction {
  let currentState = select(store.getState());

  function handleChange(): void {
    const nextState = select(store.getState());
    if (nextState !== currentState) {
      currentState = nextState;
      onChange(currentState);
    }
  }

  const unsubscribe = store.subscribe(handleChange);
  return unsubscribe;
}

export default observeStore;

export function selectActiveAndInactiveUsers(state: State): { activeUsers: User[]; inactiveUsers: User[] } {
  const { currentAuthenticatedUsers, currentUser } = state;
  const activeUsers = currentAuthenticatedUsers.filter((user) => user !== currentUser);
  const inactiveUsers = currentAuthenticatedUsers.filter((user) => user === currentUser);

  return { activeUsers, inactiveUsers };
}

export function selectDialogueHistory(state: State): Message[] | null {
  const { currentDialogueHistory } = state;
  return currentDialogueHistory;
}

export function selectMessagesHistory(state: State): MessagesHistory[] | null {
  const { messagesHistory } = state;
  return messagesHistory;
}
