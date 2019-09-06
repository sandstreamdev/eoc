export const loadSettings = () => {
  try {
    const serializedState = localStorage.getItem('settings');

    return serializedState === null ? undefined : JSON.parse(serializedState);
  } catch {
    // Ignore write errors
  }
};

export const saveSettings = state => {
  try {
    const serializedState = JSON.stringify(state);

    localStorage.setItem('settings', serializedState);
  } catch {
    // Ignore write errors
  }
};
