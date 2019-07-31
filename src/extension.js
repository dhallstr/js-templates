/** @module extension.js */
const vscode = require("vscode");
var templateMaker = require("./templateMaker");
var input = require("./input");

/**
 * @function getUserInputFromTemplate
 * @description goes through all the parameters, setting values from user input
 * @param {Object} templateObj - params from template.json
 */
const getUserInputFromTemplate = templateObj => {
  const tasks = Object.keys(templateObj).map(key => (resolve, reject) => {
    input.getUserInput(templateObj[key]).then(answer => {
      if (answer) resolve({ [key]: answer });
      else reject("Input was cancelled");
    });
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
 * @function pickTemplate
 * @description Allows the user to select a template
 * @param {String} extensionPath - the location of this extension on disk
 * @returns a string path to the template directory or null
 */
const pickTemplate = extensionPath => {
  const templateLocs =
    vscode.workspace
      .getConfiguration("js-templates")
      .get("templateFilePaths") || [];
  const options = [].concat.apply(
    [],
    templateLocs.map(path => {
      console.log("Checking ", path);
      let adjPath = `${vscode.workspace.rootPath}/${path}`;
      if (/^js-templates[\/\\]/.test(path)) {
        adjPath = extensionPath + path.replace("js-templates", "");
        console.log("Fixed path to ", adjPath);
      }
      return templateMaker.getTemplatesIn(adjPath);
    })
  );
  options.push({ label: "Browse...", value: "Browse..." });
  return new Promise((resolve, reject) => {
    vscode.window.showQuickPick(options).then(answer => {
      if (!answer) reject();
      else if (answer["label"] === "Browse...") {
        input.openFolderDialog("Choose template").then(fsPath => {
          if (fsPath) {
            if (templateMaker.isTemplateFolder(fsPath)) resolve(fsPath);
            else
              reject("The selected folder is not a recognized template file");
          } else reject();
        });
      } else resolve(answer["value"]);
    });
  });
};

/**
 * @function handleError
 * @description action to take upon failure
 * @param {*} error
 */
const handleError = error => {
  if (error)
    vscode.window.showErrorMessage(`Uh oh, an error occurred!\n${error}`);
};

/**
 * @function onSuccess
 * @description action to take upon success
 */
const onSuccess = () => {
  vscode.window.showInformationMessage("Template creation successful!");
};

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  let disposable = vscode.commands.registerCommand(
    "extension.createTemplate",
    event => {
      pickTemplate(context.extensionPath)
        .then(tempFolder => {
          const templateConfig = templateMaker.getTemplateConfig(tempFolder);
          getUserInputFromTemplate(templateConfig.params).then(template => {
            const templateFiles = templateMaker.convertTemplateToCode(
              tempFolder,
              template
            );
            if (event && event.fsPath) {
              templateMaker
                .writeTemplate(event.fsPath, templateFiles)
                .then(onSuccess)
                .catch(handleError);
            } else {
              input.openFolderDialog("Select destination").then(fsPath => {
                if (fsPath)
                  templateMaker
                    .writeTemplate(fsPath, templateFiles)
                    .then(onSuccess)
                    .catch(handleError);
              });
            }
          });
        })
        .catch(handleError);
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
