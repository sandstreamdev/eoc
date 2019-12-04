const checkIfCookieSet = name => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);

  return parts.length === 2
    ? Boolean(
        parts
          .pop()
          .split(';')
          .shift()
      )
    : false;
};

export { checkIfCookieSet };
