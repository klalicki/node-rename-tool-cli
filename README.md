# node-rename-tool-cli

A node.js-based command line tool for batch renaming files, intended to be used as part of a data-merge workflow

### Background

This tool is designed to be used in conjunction with the data-merge workflow in Adobe InDesign for templated bulk production of graphic assets, such as banner ads, social media post series, etc. It takes a folder of images and renames them based on the provided data files.

### Requirements

This tool was built and tested with node.js v16.16.0, and npm v8.11.0

### Installation

To install node-rename-tool-cli, download or clone this repository to your local machine. Open a terminal in the repository directory, and run the following command to install the tool's dependencies:
`npm install`

### Usage

The package directory includes several folders:

- `/csv`: contains CSV files with lists of data (single column):
- - asset types: a list of file dimensions/asset types. This likely corresponds directly to the individual pages within the template used for the data-merge process.
- - batch names: a list of unique identifiers for each batch of assets. This likely corresponds directly to the rows in the data file initially used for the data-merge process.
- `/img`: working directory for images

To use this tool, type `node index.js` or `node .` in the repository directory.
The tool will prompt for the following parameters:

- current base file name: the current filename that the assets are using.
- prefix: a short identifier that is prepended to each file name.
- asset types CSV: a single-column list of file dimensions/asset types
- batch names CSV: a single-column list of unique identifiers for each batch of asset

### Feature Roadmap

- [x] MVP: provide a functioning command-line tool that can rename a batch of graphic assets.
- [x] show a list of available CSV files when prompting the user to select one (added in v1.1.0)
- [x] add option to omit prefix parameter (added in v1.2.0)
- [x] provide confirmation/preview of the tool's output (added in v1.3.0)
- [ ] provide an option to cancel/change parameters before renaming files
- [ ] allow the user to choose a different CSV file after seeing a preview of its contents
- [ ] implement more robust error handling and explanatory error messages
- [ ] improve clarity of interface prompts and readme.md documentation
- [ ] add separate src and output folders
- [ ] add option to move assets into individual folders by group
- [ ] implement a way to clean up the imported CSV files to remove empty lines
- [ ] allow tool to work with file types other than JPG
- [ ] auto suggest base filename from /img directory contents
- [ ] use consistent language and variable names for the different parameters, based on the language used in readme.md
