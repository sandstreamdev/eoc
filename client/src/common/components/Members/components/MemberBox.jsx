import React from 'react';
import PropTypes from 'prop-types';
import { Popper } from 'react-popper';

const MemberBox = ({ children }) => (
  <Popper
    placement="bottom-start"
    modifiers={{
      flip: { enabled: true },
      preventOverflow: {
        enabled: true,
        padding: 15,
        priority: ['left', 'right'],
        boundariesElement: 'viewport'
      }
    }}
  >
    {({ ref, placement, style }) => (
      <div
        ref={ref}
        data-placement={placement}
        style={{ ...style, zIndex: 10, margin: 10 }}
      >
        {children}
      </div>
    )}
  </Popper>
);

MemberBox.propTypes = { children: PropTypes.node };

export default MemberBox;
