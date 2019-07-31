/**
 * @function template
 * @description generates a template file
 * @param {Object} config - configuration values for the template file
 * @returns {Object} - an object specifying the filename and the contents of the generated file
 */
const template = config => {
  const { componentName: name } = config;
  let contents = "";
  contents += `/** @module ${name}Component.test */

import React from 'react';
import { shallow } from 'enzyme';
import ${name}Component from '../${name}Component';

test("${name}Component renders without error", () => {
  const wrapper = shallow(<${name}Component />);

  expect(wrapper.find("presentation-${name}")).to.have.lengthOf(1);
});
`;

  return {
    filename: `${config.componentName}Component.test.js`,
    contents
  };
};

module.exports = {
  template
};
