const vscode = require("vscode");

/**
 * @function openFolderDialog
 * @description opens a dialog box allowing folders to be selected
 * @returns {Thenable<string>} thenable that resolves to the path
 */
const openFolderDialog = openText => {
  return vscode.window
    .showOpenDialog({
      canSelectFolders: true,
      canSelectFiles: false,
      canSelectMany: false,
      openLabel: openText
    })
    .then(templateFolderURIs => {
      if (templateFolderURIs && templateFolderURIs.length > 0)
        return templateFolderURIs[0].fsPath;
      return null;
    });
};

/**
 * @function getUserInput
 * @description opens the appropriate input UI
 * @param {Object} prompt - an object specifying which user input
 * This can optionally have the following properties:
 *  - InputBoxOptions
 *  - QuickPickValues
 *  - QuickPickOptions
 *  - defaultValue
 * @returns {Thenable<Object>}
 */
const getUserInput = prompt => {
  let thenable;
  if (prompt.InputBoxOptions) {
    thenable = vscode.window
      .showInputBox(prompt.InputBoxOptions)
      .then(answer => {
        if (answer === undefined || answer) return answer;
        return prompt.defaultValue;
      });
  } else if (prompt.QuickPickValues) {
    thenable = vscode.window
      .showQuickPick(prompt.QuickPickValues, prompt.QuickPickOptions)
      .then(answer => {
        if (answer === undefined) return answer;
        else if (answer && answer["value"]) return answer["value"];
        return prompt.defaultValue;
      });
  } else thenable = new Promise(resolve => resolve(undefined));
  return thenable;
};

module.exports = {
  openFolderDialog,
  getUserInput
};
