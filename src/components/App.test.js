import React from 'react';
import App from './App';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

configure({ adapter: new Adapter() });

it('renders component', () => {
  const component = shallow(<App />);
  expect(toJson(component)).toMatchSnapshot();
});
