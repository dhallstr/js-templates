# js-templates README

JS Templates is an lightweight and easy-to-use extension for Visual Studio Code.

## Features

- Create your own templates for files using only JavaScript and a little bit of JSON

- Each template can take in any number of string or enum parameters that help you to create a powerful template

- Apply templates to create files by simply right clicking on a folder in your project and selecting "Create From Template"

## Installation

Clone this repository into your C:\Users\[you]\.vscode\extensions folder. The next time you open VS Code, JS Templates will install automatically.

## Extension Settings

This extension contributes the following settings:

- `js-templates.templateFilePaths`: array of locations JS Templates looks for file paths. By default, this is `js-templates/__templates__` and `[your project]/src/__templates__`

## Creating a Template

Template Creation consists of two steps:

- Writing the files to generate (`*.template.js`)

- Writing the configuration file (`template.json`)

### Writing Template Files

A template consists of a base template folder (the name of which will appear as an option when you try to use this template to create files). This base folder can have any number of template files and folders inside it, all of which will get created once this template is applied.

Each file must have a name matching `*.template.js` and have a single export: a function called `template`. This function takes an object as a parameter which is the configuration settings defined in template.json and selected when applying the template. It must return an object with two fields: filename and contents.

See `js-templates/__templates__` and `js-templates/__templates__/examples` for examples.

### Writing template.json

At the moment, this file only supports one field, `params`, which is a dictionary of configuration names to several settings:

- `defaultValue` (value when the user does not specify or leaves the field blank)

- `order` (the order in which JS Templates should prompt the user)

and several optional fields (one of which must be specified in order for your parameter to get populated):

- `InputBoxOptions` - standard string input. Can have the following fields:

  - `prompt` - The prompt to display to the user
  - `ignoreFocusOut` - doesn't allow the user to click out of the input box to cancel (instead, they must hit ESC)
  - `placeholder` - placeholder text
  - `value` - value to prepopulate in the input field

- `QuickPickValues` - enum. All of the fields below are required except those marked with (\*):

  - `label` - Label to show to the user
  - `value` - Value to pass to the template files through the config parameter
  - `picked` (\*) - If set to true, this element is selected initially

- `QuickPickOptions` - additional options for enums:

  - `placeholder` - placeholder text
  - `ignoreFocusOut` - doesn't allow the user to click out of the input box to cancel (instead, they must hit ESC)

## Known Issues

This extension will not check if files already exist before creating from the template. This can result in lost data.

**Enjoy!**
