/** @module extension.js */
const vscode = require("vscode");
var fs = require("fs");

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
  templateFiles.forEach(file => {
    if (file.code) {
      fs.writeFile(`${destFolder}/${file.name}`, file.code, function(err) {
        if (err) throw err;
      });
    } else if (file.files) {
      fs.mkdirSync(`${destFolder}/${file.name}`);
      writeTemplate(`${destFolder}/${file.name}`, file.files);
    }
  });
};

/**
 * @function getUserInputFromTemplate
 * @description goes through all the parameters, setting values from user input
 * @param {Object} templateObj - params from template.json
 */
const getUserInputFromTemplate = templateObj => {
  const tasks = Object.keys(templateObj).map(key => (resolve, reject) => {
    if (templateObj[key].InputBoxOptions) {
      vscode.window
        .showInputBox(templateObj[key].InputBoxOptions)
        .then(answer => {
          if (!answer) {
            if (templateObj[key].defaultValue) {
              resolve({ [key]: templateObj[key].defaultValue });
            }
            reject("Input was cancelled");
          }
          resolve({ [key]: answer || templateObj[key].defaultValue });
        });
    } else if (templateObj[key].QuickPickValues) {
      vscode.window
        .showQuickPick(
          templateObj[key].QuickPickValues,
          templateObj[key].QuickPickOptions
        )
        .then(answer => {
          if (!answer) {
            if (templateObj[key].defaultValue) {
              resolve({ [key]: templateObj[key].defaultValue });
            }
            reject("Input was cancelled");
          }
          // @ts-ignore
          resolve({ [key]: answer.value || templateObj[key].defaultValue });
        });
    }
  });
  return tasks
    .reduce((promiseChain, currentTask) => {
      return promiseChain.then(chainResults =>
        new Promise(currentTask).then(currentResult => [
          ...chainResults,
          currentResult
        ])
      );
    }, Promise.resolve([]))
    .then(chainResults => Object.assign({}, ...chainResults));
};

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  let disposable = vscode.commands.registerCommand(
    "extension.createTemplate",
    event => {
      vscode.window
        .showOpenDialog({
          canSelectFolders: true,
          canSelectFiles: false,
          canSelectMany: false,
          openLabel: "Choose template"
        })
        .then(templateFolderURIs => {
          if (templateFolderURIs && templateFolderURIs.length > 0) {
            try {
              const templateConfig = JSON.parse(
                fs
                  .readFileSync(`${templateFolderURIs[0].fsPath}/template.json`)
                  .toString()
              );
              getUserInputFromTemplate(templateConfig.params).then(template => {
                const templateFiles = convertTemplateToCode(
                  templateFolderURIs[0].fsPath,
                  template
                );
                if (event && event.fsPath) {
                  writeTemplate(event.fsPath, templateFiles);
                } else {
                  vscode.window
                    .showOpenDialog({
                      canSelectFolders: true,
                      canSelectFiles: false,
                      canSelectMany: false,
                      openLabel: "Create here"
                    })
                    .then(destFolderURIs => {
                      if (destFolderURIs && destFolderURIs.length > 0) {
                        writeTemplate(destFolderURIs[0].fsPath, templateFiles);
                        vscode.window.showInformationMessage(
                          "Template creation successful!"
                        );
                      }
                    });
                }
              });
            } catch (e) {
              vscode.window.showInformationMessage(
                "The folder selected does not have a valid template.json file"
              );
            }
          }
        });
    }
  );

  context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate
};
