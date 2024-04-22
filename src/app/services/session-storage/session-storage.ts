export const STORAGE_KEY = 'stardustmeg3uZrhDr5g5E8YIX36m9cffJq7r6VF0Pd';

export function saveCurrentStateToSessionStorage<S>(state: S): void {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function clearSessionStorage(): void {
  sessionStorage.removeItem(STORAGE_KEY);
}
