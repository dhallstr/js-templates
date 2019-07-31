/**
 * @function template
 * @description generates a template file
 * @param {Object} config - configuration values for the template file
 * @returns {Object} - an object specifying the filename and the contents of the generated file
 */
const template = config => {
  const { componentName: name, hookContainerToState: redux } = config;
  let contents = "";
  contents += `/** @module ${name}Container */

import React from "react";
import PropTypes from "prop-types";
import ${name}Component from "./${name}Component";
`;
  if (redux)
    contents += `import { connect } from "react-redux";
// import actions from "../../redux/Actions";

/**
 * @constant mapStateToProps
 * defines which objects from the redux store are used in
 * this component.
 */
const mapStateToProps = state => {};

/**
 * @constant mapDispatchToProps
 * defines which actions from the redux store are used in
 * this component.
 */
const mapDispatchToProps = {};

`;
  contents += `/**
 * @function ${name}Container
 * @description functional container react component for ${name}
 * @returns {JSX} - Rendered Component
 */
// eslint-disable-next-line no-unused-vars
const ${name}Container = props => {
  // const {} = props;

  return <${name}Component data-test="container-${name}" />;
}

${name}Container.propTypes = {};

${name}Container.defaultProps = {};

`;
  if (redux) {
    contents += `export const ${name}ContainerTest = ${name}Container;
export default connect(
  mapStateToProps,
  mapDispatchToProps)(${name}Container});
`;
  } else {
    contents += `export default ${name}Container;
`;
  }
  return {
    filename: `${config.componentName}Container.js`,
    contents
  };
};

module.exports = {
  template
};
