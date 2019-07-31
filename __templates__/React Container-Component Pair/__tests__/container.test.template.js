/**
 * @function template
 * @description generates a template file
 * @param {Object} config - configuration values for the template file
 * @returns {Object} - an object specifying the filename and the contents of the generated file
 */
const template = config => {
  const { componentName: name, hookContainerToState: redux } = config;
  let testName = `${name}Container`;
  let importFile = `${name}Container`;
  if (redux) {
    testName += "Test";
    importFile = `{ ${testName} }`;
  }

  let contents = "";
  contents += `/** @module ${name}Container.test */

import React from 'react';
import { shallow } from 'enzyme';
import ${importFile} from '../${name}Container';

test("${name}Container renders without error", () => {
  const wrapper = shallow(<${testName} />);

  expect(wrapper.find("presentation-${name}")).to.have.lengthOf(1);
});
`;

  return {
    filename: `${config.componentName}Container.test.js`,
    contents
  };
};

module.exports = {
  template
};
