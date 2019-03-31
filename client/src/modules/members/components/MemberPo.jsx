import React from 'react';
import PropTypes from 'prop-types';
import { Popper } from 'react-popper';

const MemberPo = ({ children }) => (
  <Popper
    placement="top-start"
    disablePortal={false}
    modifiers={{
      inner: { enabled: true },
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
        style={{ ...style, zIndex: 10 }}
      >
        {children}
      </div>
    )}
  </Popper>
);

MemberPo.propTypes = { children: PropTypes.node };

export default MemberPo;
