var fs = require("fs");

/**
 * @function isTemplateFolder
 * @description checks if the folder is a template folder
 * @param {String} path - path to the folder to check
 * @returns true or false
 */
const isTemplateFolder = path => {
  try {
    return (
      fs
        .readdirSync(path, { withFileTypes: true })
        .filter(
          dirent => !dirent.isDirectory() && dirent.name === "template.json"
        ).length > 0
    );
  } catch (e) {
    return false;
  }
};

/**
 * @function getTemplateConfig
 * @description gets the template config for a template
 * @param {String} path - path to the template folder
 * @returns template config object
 */
const getTemplateConfig = path => {
  try {
    return JSON.parse(fs.readFileSync(`${path}/template.json`).toString());
  } catch (e) {
    return null;
  }
};

/**
 * @function getTemplatesIn
 * @description gets all template folders in the given directory
 * @param {String} path - path to a directory
 * @returns {Array} list of paths found
 */
const getTemplatesIn = path => {
  try {
    return fs
      .readdirSync(path, { withFileTypes: true })
      .filter(
        dirent =>
          dirent.isDirectory() && isTemplateFolder(`${path}/${dirent.name}`)
      )
      .map(dirent => ({
        label: dirent.name,
        value: `${path}/${dirent.name}`
      }));
  } catch (e) {
    // file does not exist
    return [];
  }
};

/**
 * @function convertTemplateToCode
 * @param {string} folder - the main template directory
 * @param {Object} config - configuration to pass to the template files
 */
const convertTemplateToCode = (folder, config) => {
  const files = fs.readdirSync(folder);
  return files
    .map(file => {
      // is not a template file
      if (!/.*\.template\..*/.test(file)) {
        // is a directory
        if (!/\./.test(file)) {
          return {
            name: file,
            files: convertTemplateToCode(`${folder}/${file}`, config)
          };
        }
        return {};
      }
      let code = "";
      let name = "";
      try {
        const template = require(`${folder}/${file}`).template(config);
        code = template.contents;
        name = template.filename;
      } catch (e) {
        return {};
      }
      return {
        name,
        code
      };
    })
    .filter(x => x.name && (x.code || x.files));
};

/**
 *
 * @param {string} destFolder - folder in which to create files from template
 * @param {Object} templateFiles - template file object returned from convertTemplateToCode
 */
const writeTemplate = (destFolder, templateFiles) => {
  let promises = [];
  templateFiles.forEach(file => {
    promises.push(
      new Promise((resolve, reject) => {
        if (file.code) {
          fs.writeFile(`${destFolder}/${file.name}`, file.code, function(err) {
            if (err) reject(err);
            resolve();
          });
        } else if (file.files) {
          try {
            fs.mkdirSync(`${destFolder}/${file.name}`);
          } catch (e) {}
          writeTemplate(`${destFolder}/${file.name}`, file.files)
            .then(resolve)
            .catch(reject);
        } else resolve();
      })
    );
  });
  return Promise.all(promises);
};

module.exports = {
  isTemplateFolder,
  getTemplateConfig,
  getTemplatesIn,
  convertTemplateToCode,
  writeTemplate
};
