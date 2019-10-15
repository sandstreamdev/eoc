import { enumerable } from 'common/utils/helpers';

export const storageKeys = enumerable()('ACCOUNT', 'SETTINGS');

const load = storageKey => () => {
  try {
    const serializedState = localStorage.getItem(storageKey);

    return serializedState === null ? undefined : JSON.parse(serializedState);
  } catch {
    // Ignore write errors
  }
};

const save = storageKey => value => {
  try {
    const serializedState = JSON.stringify(value);

    localStorage.setItem(storageKey, serializedState);
  } catch {
    // Ignore save errors
  }
};

export const loadAccountData = load(storageKeys.ACCOUNT);
export const saveAccountData = save(storageKeys.ACCOUNT);
export const loadSettingsData = load(storageKeys.SETTINGS);
export const saveSettingsData = save(storageKeys.SETTINGS);
