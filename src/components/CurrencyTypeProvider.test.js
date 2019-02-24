import React from 'react';
import { CurrencyTypeProvider } from './CurrencyTypeProvider';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

configure({ adapter: new Adapter() });

it('renders component', () => {
  const component = shallow(<CurrencyTypeProvider for={ ['column1', 'column2'] }/>);
  expect(toJson(component)).toMatchSnapshot();
});
