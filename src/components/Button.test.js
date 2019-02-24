import React from 'react';
import { AddButton, EditButton, DeleteButton, CommitButton, CancelButton } from './Button';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

configure({ adapter: new Adapter() });

it('AddButton', () => {
  const component = shallow(<AddButton />);
  expect(toJson(component)).toMatchSnapshot();
});

it('EditButton', () => {
  const component = shallow(<EditButton />);
  expect(toJson(component)).toMatchSnapshot();
});

it('DeleteButton', () => {
  const component = shallow(<DeleteButton />);
  expect(toJson(component)).toMatchSnapshot();
});

it('CommitButton', () => {
  const component = shallow(<CommitButton />);
  expect(toJson(component)).toMatchSnapshot();
});

it('CancelButton', () => {
  const component = shallow(<CancelButton />);
  expect(toJson(component)).toMatchSnapshot();
});
