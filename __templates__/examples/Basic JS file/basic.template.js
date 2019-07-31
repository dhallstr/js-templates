/**
 * @function template
 * @description generates a template file
 * @param {Object} config - configuration values for the template file
 * @returns {Object} - an object specifying the filename and the contents of the generated file
 */
const template = config => {
  const { filename } = config;
  let contents = "";

  contents += `/** @module ${filename} */

console.log("JS is fun!");

module.exports = {};
`;

  return {
    filename,
    contents
  };
};

module.exports = {
  template
};
