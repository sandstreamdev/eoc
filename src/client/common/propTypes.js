import PropTypes from 'prop-types';
import _values from 'lodash/values';

import { StatusType } from './enums';

export const StatusPropType = PropTypes.oneOf(_values(StatusType));
