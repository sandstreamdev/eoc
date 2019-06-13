import React from 'react';
import { shallow } from 'enzyme';

export const getWrapper = (Component, props = {}, state = null) => {
  const wrapper = shallow(<Component {...props} />);
  if (state) {
    wrapper.setState(state);
  }

  return wrapper;
};

export const findByTestAttr = (wrapper, val) =>
  wrapper.find(`[data-test-id="${val}"]`);
