import * as moment from 'moment';
import 'moment/locale/pl';
/**
 * FIXME: Get rid of console warning related with moment.js
 */

/**
 *
 * @param {*} criteria - Criteria argument has to match databse object property. eg. const user = { name: 'Fred'} -> criteria = 'name'
 */
export const sortList = (listName, criteria, order) =>
  order
    ? [...listName].sort((a, b) => {
        // sort by date
        if (moment(a[criteria])._isValid) {
          return moment(new Date(a[criteria])).isBefore(
            moment(new Date(b[criteria]))
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
        if (moment(new Date(a[criteria]))._isValid) {
          return moment(new Date(a[criteria])).isAfter(
            moment(new Date(b[criteria]))
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
