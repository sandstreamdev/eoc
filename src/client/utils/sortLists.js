import * as moment from 'moment';

const dateFormat = 'YYYY-MM-DDTHH:mm:ss.SSSSZ';

export const sortList = (products, key, order) =>
  [...products].sort((a, b) => {
    const graterThan = order ? 1 : -1;
    const lessThan = graterThan * -1;

    // sort by date
    if (moment(a[key], dateFormat)._isValid) {
      return moment(a[key], dateFormat).isBefore(moment(b[key], dateFormat))
        ? graterThan
        : lessThan;
    }
    // sort by string
    if (typeof a[key] === 'string') {
      a[key].toLowerCase() > b[key].toLowerCase() ? graterThan : lessThan;
    }
    // sort by number
    if (typeof a[key] === 'number') {
      return a[key] > b[key] ? graterThan : lessThan;
    }
    return 0;
  });
