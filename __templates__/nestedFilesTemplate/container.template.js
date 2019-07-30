/**
 * @function template
 * @description generates a template file
 * @param {Object} config - configuration values for the template file
 * @returns {Object} - an object specifying the filename and the contents of the generated file
 */
const template = config => {
  let contents = "";
  contents += `/** @module ${config.componentName}Container */
  const connected = ${config.hookContainerToState};
  `;

  return {
    filename: `${config.componentName}Container.js`,
    contents
  };
};

module.exports = {
  template
};
