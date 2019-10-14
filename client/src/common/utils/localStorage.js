import { enumerable } from 'common/utils/helpers';

export const storageKeys = enumerable()('ACCOUNT', 'SETTINGS');

export const loadSettingsData = () => {
  try {
    const serializedState = localStorage.getItem(storageKeys.SETTINGS);

    return serializedState === null ? undefined : JSON.parse(serializedState);
  } catch {
    // Ignore write errors
  }
};

export const saveSettingsData = value => {
  try {
    const serializedState = JSON.stringify(value);

    localStorage.setItem(storageKeys.SETTINGS, serializedState);
  } catch {
    // Ignore write errors
  }
};

export const loadAccountData = () => {
  try {
    const serializedState = localStorage.getItem(storageKeys.ACCOUNT);

    return serializedState === null ? undefined : JSON.parse(serializedState);
  } catch {
    // Ignore write errors
  }
};

export const saveAccountData = value => {
  try {
    const serializedState = JSON.stringify(value);

    localStorage.setItem(storageKeys.ACCOUNT, serializedState);
  } catch {
    // Ignore write errors
  }
};
