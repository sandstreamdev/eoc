import * as moment from 'moment';
/**
 *
 * @param {*} criteria - Criteria argument has to match databse object property. eg. const user = { name: 'Fred'} -> criteria = 'name'
 */
const dateFormat = 'YYYY-MM-DDTHH:mm:ss.SSSSZ';

export const sortList = (listName, criteria, order) =>
  order
    ? [...listName].sort((a, b) => {
        // sort by date
        if (moment(a[criteria], dateFormat)._isValid) {
          return moment(a[criteria], dateFormat).isBefore(
            moment(b[criteria], dateFormat)
          )
            ? 1
            : -1;
        }
        // sort by string
        if (typeof a[criteria] === 'string') {
          a[criteria].toLowerCase() > b[criteria].toLowerCase() ? 1 : -1;
        }
        // sort by number
        if (typeof a[criteria] === 'number') {
          return a[criteria] < b[criteria] ? -1 : 1;
        }
        return 0;
      })
    : [...listName].sort((a, b) => {
        // sort by date
        if (moment(a[criteria], dateFormat)._isValid) {
          return moment(a[criteria], dateFormat).isAfter(
            moment(b[criteria], dateFormat)
          )
            ? 1
            : -1;
        }
        // sort by string
        if (typeof a[criteria] === 'string') {
          a[criteria].toLowerCase() < b[criteria].toLowerCase() ? 1 : -1;
        }
        // sort by number
        if (typeof a[criteria] === 'number') {
          return a[criteria] > b[criteria] ? -1 : 1;
        }
        return 0;
      });
