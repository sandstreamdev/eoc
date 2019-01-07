/**
 * Criteria argument has to match object property.
 * eg. const user = { name: 'Fred'} -> criteria = 'name'
 */

export const sortList = (listName, criteria, order) =>
  order
    ? [...listName].sort((a, b) =>
        a[`${criteria}`] < b[`${criteria}`] ? -1 : 1
      )
    : [...listName].sort((a, b) =>
        a[`${criteria}`] > b[`${criteria}`] ? -1 : 1
      );
