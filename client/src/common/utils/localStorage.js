export const loadSettings = () => {
  try {
    const serializedState = localStorage.getItem('settings');

    if (serializedState === null) {
      return undefined;
    }

    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

export const saveSettings = state => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('settings', serializedState);
  } catch (err) {
    // Ignore write errors
  }
};
