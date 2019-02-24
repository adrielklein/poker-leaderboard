import React from 'react';
import { HighlightedCell, LookupEditCell, Cell, EditCell } from './Cell';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

configure({ adapter: new Adapter() });

it('HighlightedCell', () => {
  const component = shallow(<HighlightedCell tableColumn={ { align: 'center' } }/>);
  expect(toJson(component)).toMatchSnapshot();
});

it('LookupEditCell', () => {
  const component = shallow(<LookupEditCell />);
  expect(toJson(component)).toMatchSnapshot();
});

it('Cell', () => {
  const component = shallow(<Cell />);
  expect(toJson(component)).toMatchSnapshot();
});

it('EditCell', () => {
  const component = shallow(<EditCell />);
  expect(toJson(component)).toMatchSnapshot();
});
