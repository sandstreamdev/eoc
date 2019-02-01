import { configure } from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import fetchMock from 'jest-fetch-mock';

global.fetch = fetchMock;

configure({ adapter: new EnzymeAdapter() });
