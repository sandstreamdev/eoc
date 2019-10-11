import { enumerable } from 'common/utils/helpers';

export const storageKeys = enumerable()('account', 'settings');

export const loadData = key => {
  try {
    const serializedState = localStorage.getItem(key);

    return serializedState === null ? undefined : JSON.parse(serializedState);
  } catch {
    // Ignore write errors
  }
};

export const saveData = (key, value) => {
  try {
    const serializedState = JSON.stringify(value);

    localStorage.setItem(key, serializedState);
  } catch {
    // Ignore write errors
  }
};
