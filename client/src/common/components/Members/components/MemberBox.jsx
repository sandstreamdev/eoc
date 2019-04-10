import React from 'react';
import PropTypes from 'prop-types';
import { Popper } from 'react-popper';

const MemberBox = ({ children }) => (
  <Popper
    modifiers={{
      flip: { enabled: true },
      preventOverflow: {
        boundariesElement: 'viewport',
        enabled: true,
        padding: 15,
        priority: ['left', 'right', 'bottom']
      }
    }}
    placement="bottom-start"
  >
    {({ ref, placement, style }) => (
      <div
        data-placement={placement}
        ref={ref}
        style={{ ...style, zIndex: 10, margin: 10 }}
      >
        {children}
      </div>
    )}
  </Popper>
);

MemberBox.propTypes = { children: PropTypes.node };

export default MemberBox;
