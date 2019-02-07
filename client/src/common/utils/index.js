/**
 * Convert any array that contains
 * object with _id property
 * to map with key as _id
 * eg. const arr = [ {_id: 1213, name: 'example'} ]  ==>  { 1213: {_id: 1213, name: 'example'} }
 *  */

export const convertArrayToMap = array =>
  array.reduce((map, obj) => {
    const newMap = map;
    newMap[obj._id] = obj;
    return newMap;
  }, {});
