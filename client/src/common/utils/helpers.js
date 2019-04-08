/**
 *  Function checks if string contains only spaces, line breaks,
 *  white spaces and returns true if so.
 */
export const whiteSpaceOnly = string => !string.replace(/\s/g, '').length;
