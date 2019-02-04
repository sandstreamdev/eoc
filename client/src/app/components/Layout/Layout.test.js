import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { mount } from 'enzyme';

import { getWrapper } from 'testUtils';
import { Layout } from './Layout';
import Toolbar from '../Toolbar/Toolbar';
import Footer from '../Footer';
import AuthBox from 'modules/authorization/AuthBox';

const defaultProps = {
  currentUser: {
    name: 'John Smith',
    avatarUrl: 'http://www.example.com',
    id: '12345'
  },
  setCurrentUser: () => {}
};

describe('Layout Component', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = getWrapper(Layout, defaultProps);
  });

  it('renders Toolbar when currentUser exists', () => {
    expect(wrapper.find(Toolbar)).toHaveLength(1);
  });

  it('renders Footer when currentUser exists', () => {
    expect(wrapper.find(Footer)).toHaveLength(1);
  });

  it("should render Authbox Component when currentUser doesn't exist", () => {
    const wrapper = mount(
      <MemoryRouter initialEntries={['/']}>
        <Layout setCurrentUser={() => {}} />
      </MemoryRouter>
    );
    expect(wrapper.find(AuthBox)).toHaveLength(1);
  });
});
