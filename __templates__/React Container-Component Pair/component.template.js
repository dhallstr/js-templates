/**
 * @function template
 * @description generates a template file
 * @param {Object} config - configuration values for the template file
 * @returns {Object} - an object specifying the filename and the contents of the generated file
 */
const template = config => {
  const { name } = config;
  let contents = "";
  contents += `/** @module ${name}Component */

import React from "react";
import PropTypes from "prop-types";

/**
 * @function ${name}Component
 * @description functional presentational react component for ${name}
 * @returns {JSX} - Rendered Component
 */
// eslint-disable-next-line no-unused-vars
const ${name}Component = props => {
  // const {} = props;

  return (
    <div data-test="presentation-${name}">
      Generated Template Component for ${name}
    </div>
    );
}

${name}Component.propTypes = {};

${name}Component.defaultProps = {};

export default ${name}Component;
`;

  return {
    filename: `${config.componentName}Component.js`,
    contents
  };
};

module.exports = {
  template
};
